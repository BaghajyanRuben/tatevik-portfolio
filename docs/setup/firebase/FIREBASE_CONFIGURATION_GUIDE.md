# Firebase Configuration Guide

## Overview

Your portfolio uses Firebase for:
- ✅ **Firestore** - Store project and feedback data
- ✅ **Authentication** - Admin login
- ❌ **Storage** - NOT used (files are stored locally)

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "portfolio-admin")
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### 2. Register Web App

1. In Firebase Console, click the **web icon** (`</>`)
2. Enter app nickname: "Portfolio Web App"
3. **Don't** check "Firebase Hosting" (unless you plan to use it)
4. Click **"Register app"**
5. **Copy the configuration** - you'll need it for `.env.local`

The config looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

### 3. Create Environment File

Create `.env.local` in your project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Replace the values with your actual Firebase config!

### 4. Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose location (select closest to your users)
5. Click **"Enable"**

### 5. Deploy Firestore Security Rules

**Option A: Via Firebase Console (Easiest)**

1. Go to **Firestore Database** → **Rules** tab
2. Copy the contents from `firestore.rules` file in your project
3. Paste into the editor
4. **Important:** Replace the admin email placeholder:
   ```javascript
   function isAdmin() {
     return isAuthenticated() && 
            request.auth.token.email in [
              'your-admin-email@example.com',  // ← Add your email here
            ];
   }
   ```
5. Click **"Publish"**

**Option B: Via Firebase CLI**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (only first time)
firebase init firestore
# Select your project
# Use default files (firestore.rules, firestore.indexes.json)

# Deploy rules
firebase deploy --only firestore:rules
```

### 6. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"**
6. Click **"Save"**

### 7. Create Admin User

**Option A: Via Firebase Console**

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter your admin email: `admin@example.com`
4. Enter a strong password
5. Click **"Add user"**

**Option B: Via Your App**

1. Start your dev server: `npm run dev`
2. Create a temporary registration page, or run in browser console:
   ```javascript
   import { createUserWithEmailAndPassword } from 'firebase/auth';
   import { auth } from './src/config/firebase';

   createUserWithEmailAndPassword(auth, 'admin@example.com', 'your-password')
     .then(user => console.log('Admin created:', user))
     .catch(error => console.error('Error:', error));
   ```

**Important:** Use the SAME email you added in Firestore rules!

### 8. Update Firestore Rules with Admin Email

Go back to **Firestore Database** → **Rules** and ensure your admin email is listed:

```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'admin@example.com',  // ← Your actual admin email
         ];
}
```

Click **"Publish"** to save.

### 9. Set Up Service Account (For Migration Script)

Only needed if you want to migrate data from `projects.json` to Firestore.

1. Go to **Project Settings** (⚙️ icon)
2. Go to **Service Accounts** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** (downloads a JSON file)
5. Save the file as `firebase-service-account.json` in your project root
6. **Never commit this file to git!** (it's in `.gitignore`)

## Verification Checklist

After setup, verify everything works:

### ✅ Environment Variables
```bash
# Check .env.local exists
cat .env.local

# Should see all VITE_FIREBASE_* variables
```

### ✅ Firestore Rules
1. Go to Firestore → Rules
2. Should see rules with `isAdmin()` function
3. Your admin email should be listed

### ✅ Authentication
1. Go to Authentication → Sign-in method
2. Email/Password should be "Enabled"
3. Go to Users tab - should see your admin user

### ✅ Test Login
1. Start dev server: `npm run dev`
2. Go to: `http://localhost:5173/admin/login`
3. Login with your admin email and password
4. Should redirect to admin dashboard

### ✅ Test Projects
1. After login, try adding a new project
2. Check Firestore Database → Data tab
3. Should see `projects` collection with your data

## Common Issues & Solutions

### Issue: "Permission denied" when accessing Firestore

**Solution:**
- Check Firestore rules are deployed
- Verify you're logged in as admin
- Ensure admin email in rules matches your login email
- Check browser console for specific error

### Issue: Can't login - "Invalid credentials"

**Solution:**
- Verify user exists in Authentication → Users
- Check email is exactly correct (no extra spaces)
- Try resetting password in Firebase Console
- Clear browser cache/cookies

### Issue: "Firebase not configured" error

**Solution:**
- Check `.env.local` file exists in project root
- Verify all `VITE_FIREBASE_*` variables are set
- Restart dev server after creating/editing `.env.local`
- No spaces around `=` in env file

### Issue: Rules deployment fails

**Solution:**
- Make sure you selected the correct project
- Check rules syntax is valid
- Try deploying via console instead of CLI

### Issue: "storage.rules not found" during deployment

**Solution:**
- This is normal - we removed Firebase Storage
- Only deploy Firestore rules:
  ```bash
  firebase deploy --only firestore:rules
  ```

## Firebase Pricing

**Your usage will likely stay in FREE tier:**

### Firestore (Free Tier Limits)
- **Stored data:** 1 GB
- **Reads:** 50,000/day
- **Writes:** 20,000/day
- **Deletes:** 20,000/day

### Authentication (Free Tier Limits)
- **Users:** Unlimited
- **Phone auth:** 10,000 verifications/month

### Your Estimated Usage
With ~50 projects and 100 feedbacks:
- **Storage:** ~5-10 MB (well under 1 GB)
- **Reads:** ~100-500/day (visitors viewing projects)
- **Writes:** ~5-10/day (admin updates)

You'll stay well within free limits! 🎉

## Security Best Practices

### 1. Protect Sensitive Files
Never commit these to git:
- `.env.local` (already in .gitignore)
- `firebase-service-account.json` (already in .gitignore)

### 2. Use Strong Passwords
- Admin password should be 16+ characters
- Use password manager

### 3. Restrict Admin Access
- Only add trusted emails to Firestore rules
- Don't share admin credentials

### 4. Monitor Usage
- Check Firebase Console → Usage tab regularly
- Set up budget alerts if needed

### 5. Enable 2FA (Optional)
- Go to Firebase Console → Authentication
- Enable 2FA for added security

## Local Development vs Production

### Development
```bash
npm run dev
# Uses .env.local
# File uploads work via Vite plugin
```

### Production Deployment
```bash
npm run build
# Environment variables from hosting provider
# Static files served from build
# ⚠️ File uploads won't work (no backend)
```

**For production file uploads**, you need:
1. Node.js backend to handle uploads
2. OR manage files during development only
3. OR use FTP/manual file management

## Next Steps

After Firebase is configured:

1. ✅ **Test login** - Verify admin access works
2. ✅ **Add a project** - Test Firestore integration
3. ✅ **Browse files** - Test local file browser
4. ✅ **Upload image** - Test file upload (dev only)
5. ✅ **View public site** - Test projects display

## Support Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **Firestore Rules:** https://firebase.google.com/docs/firestore/security/get-started
- **Your Project Files:**
  - `FIREBASE_SETUP.md` - Detailed Firebase info
  - `firestore.rules` - Security rules
  - `scripts/README.md` - Migration guide

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Run migration script
node scripts/migrateProjectsToFirebase.js

# Build for production
npm run build
```

---

Need help? Check the browser console for error messages and refer to the specific section above!

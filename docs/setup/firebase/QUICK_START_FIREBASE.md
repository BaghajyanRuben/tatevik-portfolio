# Firebase Quick Start - 5 Minutes Setup

## What You Need

Your app uses Firebase for:
- **Firestore Database** → Store projects and feedback
- **Authentication** → Admin login
- **Local Files** → Images stay in `public/images/` (no Firebase Storage needed!)

## Setup Steps

### 1. Create Firebase Project (2 min)

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Name it: `portfolio-admin`
4. Click through (disable Analytics if you want)
5. Click **"Create project"**

### 2. Add Web App (1 min)

1. Click the web icon **`</>`** in Firebase Console
2. App nickname: `Portfolio Web App`
3. Click **"Register app"**
4. **COPY THE CONFIG** - you'll need it next!

### 3. Create `.env.local` File (1 min)

Create this file in your project root and paste your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Enable Firestore (1 min)

1. In Firebase Console → **Firestore Database**
2. Click **"Create database"**
3. Select **"Production mode"**
4. Choose a location (closest to you)
5. Click **"Enable"**

### 5. Set Firestore Rules (2 min)

1. Go to **Firestore Database** → **Rules** tab
2. Replace everything with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in [
               'YOUR_EMAIL@example.com',  // ← CHANGE THIS TO YOUR EMAIL!
             ];
    }
    
    match /feedbacks/{feedbackId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    
    match /projects/{projectId} {
      allow read: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **IMPORTANT:** Change `YOUR_EMAIL@example.com` to your actual email!
4. Click **"Publish"**

### 6. Enable Authentication (1 min)

1. In Firebase Console → **Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"**
4. Toggle it to **"Enabled"**
5. Click **"Save"**

### 7. Create Admin User (1 min)

1. Go to **Authentication** → **Users** tab
2. Click **"Add user"**
3. Email: `your-email@example.com` (SAME as in rules!)
4. Password: Create a strong password
5. Click **"Add user"**

### 8. Test It! (1 min)

```bash
# Start your app
npm run dev

# Open browser
# Go to: http://localhost:5173/admin/login
# Login with your email and password
# You should see the admin dashboard!
```

## That's It! 🎉

You're ready to use the admin panel:
- ✅ Login works
- ✅ Can add/edit projects
- ✅ Can browse/upload images
- ✅ Can manage feedback

## Troubleshooting

**Can't login?**
- Make sure email in Firestore rules matches your user email exactly
- Check `.env.local` file exists and has correct values
- Restart dev server after creating `.env.local`

**"Permission denied" errors?**
- Your email in Firestore rules must match your login email
- Click "Publish" after updating rules

**Environment variables not working?**
- File must be named `.env.local` (not `.env`)
- Must be in project root (next to `package.json`)
- Restart dev server after creating/editing

## What's NOT Needed

❌ Firebase Storage - Files are stored locally  
❌ Service Account - Only needed for migration script  
❌ Firebase Hosting - Use Vercel/Netlify/etc  
❌ Cloud Functions - Not used  

## File Structure

Your images go here:
```
public/
  images/
    projects/
      my-project/
        thumbnail/
          image.jpg
        gallery/
          image1.jpg
          image2.jpg
```

The admin file browser lets you create folders and upload files here during development!

## Free Tier Limits

You'll stay in Firebase free tier:
- 1 GB storage (you'll use ~10 MB)
- 50,000 reads/day (you'll use ~100-500)
- 20,000 writes/day (you'll use ~5-10)

No credit card needed! 💳❌

## Need More Help?

See detailed guide: `FIREBASE_CONFIGURATION_GUIDE.md`

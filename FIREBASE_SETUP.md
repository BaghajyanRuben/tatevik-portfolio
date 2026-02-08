# Firebase Setup Instructions

## Prerequisites
You should have already completed:
- ✅ Created Firebase project
- ✅ Enabled Firestore Database
- ✅ Enabled Email/Password Authentication
- ✅ Created admin user

## Environment Configuration

1. **Create `.env.local` file** in the project root with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyBOhwFNty4yVQdcJvusIF2b2NgNu88TOCI
VITE_FIREBASE_AUTH_DOMAIN=tatevik-portfolio.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tatevik-portfolio
VITE_FIREBASE_STORAGE_BUCKET=tatevik-portfolio.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=575884338332
VITE_FIREBASE_APP_ID=1:575884338332:web:e8c65d23bf8ba3ee617959
VITE_FIREBASE_MEASUREMENT_ID=G-M9XNW77XEP
```

## Deploy Firestore Security Rules

### Option 1: Firebase Console (Recommended for first time)

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `tatevik-portfolio`
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Firebase CLI

1. **Install Firebase CLI** (if not already installed):
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase** (if not already done):
```bash
firebase init firestore
```
- Select your project: `tatevik-portfolio`
- Accept default filenames (firestore.rules, firestore.indexes.json)

4. **Deploy the rules**:
```bash
firebase deploy --only firestore:rules
```

## Security Rules Overview

The deployed rules provide:
- ✅ Public can read only **approved** feedbacks
- ✅ Public can submit new feedbacks (status: pending)
- ✅ Public submissions are validated (required fields, rating 1-5, min feedback length)
- ✅ Admin (authenticated users) can read all feedbacks
- ✅ Admin can approve/reject feedbacks
- ✅ Admin can delete any feedback
- ✅ Admin can create pre-approved feedbacks

## Testing the Application

1. **Start the development server**:
```bash
npm run dev
```

2. **Test Public Feedback Page**:
- Visit: http://localhost:5173/feedback
- Should see feedback form
- Submit a test feedback (will be status: pending)

3. **Test Admin Portal**:
- Visit: http://localhost:5173/admin/login
- Login with your admin email and password
- Access Dashboard, Manage Feedbacks, and Add Feedback features

## Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Overview and statistics
- `/admin/feedbacks` - Manage all feedbacks (approve/delete)
- `/admin/add` - Manually add pre-approved feedbacks

## Troubleshooting

### Issue: "Missing or insufficient permissions"
**Solution**: Deploy Firestore security rules (see above)

### Issue: Can't login to admin
**Solution**: Verify admin user exists in Firebase Console → Authentication → Users

### Issue: Environment variables not loading
**Solution**: 
- Ensure `.env.local` file exists in project root
- Restart development server
- Check variable names start with `VITE_`

### Issue: Firestore queries failing
**Solution**: Check Firebase Console → Firestore Database → Indexes for required indexes

## Production Deployment

Before deploying to production:

1. Update Firestore security rules if needed
2. Ensure `.env.local` is in `.gitignore` (already done)
3. Set environment variables in your hosting platform
4. Deploy Firebase rules: `firebase deploy --only firestore:rules`
5. Build and deploy your application

## Security Notes

- Firebase config values in `.env.local` are safe to expose in frontend code
- Security comes from Firestore security rules, not from hiding config
- Admin authentication is handled by Firebase Authentication
- All write operations require proper authentication and authorization

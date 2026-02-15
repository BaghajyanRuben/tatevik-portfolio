# Firebase Setup Instructions

This document provides step-by-step instructions for setting up Firebase for the project management system.

## Prerequisites

- Firebase project already created
- Firebase CLI installed: `npm install -g firebase-tools`

## Step 1: Configure Admin Email in Security Rules

### Firestore Rules

1. Open `firestore.rules`
2. Find the `isAdmin()` function
3. Add your admin email(s):

```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'your-admin-email@example.com',
           // Add more admin emails if needed
         ];
}
```

### Storage Rules

1. Open `storage.rules`
2. Find the `isAdmin()` function
3. Add the same admin email(s):

```javascript
function isAdmin() {
  return isAuthenticated() && 
         request.auth.token.email in [
           'your-admin-email@example.com',
           // Add more admin emails if needed
         ];
}
```

## Step 2: Deploy Security Rules to Firebase

### Option A: Deploy via Firebase Console (Manual)

**Firestore Rules:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules`
5. Paste into the editor
6. Click **Publish**

**Storage Rules:**
1. In the same Firebase Console
2. Navigate to **Storage** → **Rules**
3. Copy the contents of `storage.rules`
4. Paste into the editor
5. Click **Publish**

### Option B: Deploy via Firebase CLI (Recommended)

1. **Login to Firebase:**
   ```bash
   firebase login
   ```

2. **Initialize Firebase (if not already done):**
   ```bash
   firebase init
   ```
   - Select **Firestore** and **Storage**
   - Choose your existing project
   - Accept the default files (firestore.rules, storage.rules)

3. **Deploy the rules:**
   ```bash
   firebase deploy --only firestore:rules,storage:rules
   ```

## Step 3: Verify Rules are Active

### Test Firestore Rules:

1. Go to **Firestore Database** → **Rules** tab
2. Click the **Rules Playground** button
3. Test these scenarios:
   - ✅ Read published project (should succeed without auth)
   - ❌ Read draft project (should fail without admin auth)
   - ❌ Create project (should fail without admin auth)

### Test Storage Rules:

1. Go to **Storage** → **Rules** tab
2. Try uploading a file without authentication (should fail)
3. Try reading a file (should succeed)

## Step 4: Enable Firebase Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Add your admin user:
   - Click **Users** tab
   - Click **Add User**
   - Enter your admin email and password
   - This email should match the one in your security rules

## Step 5: Test the Setup

1. **Test Admin Login:**
   ```
   http://localhost:5173/admin/login
   ```
   - Login with your admin credentials
   - You should be redirected to the dashboard

2. **Test Project Management:**
   - Try adding a new project
   - Upload some images
   - Verify they appear in Firebase Storage
   - Check Firestore for the project document

3. **Test Public Access:**
   - Open the public site
   - Verify projects load correctly
   - Images should be visible

## Security Rules Explained

### Firestore Rules

```javascript
// Public can submit feedback
match /feedbacks/{feedbackId} {
  allow create: if true;  // Anyone can submit
  allow read, update, delete: if isAdmin();  // Only admins manage
}

// Projects are public (published) but managed by admins
match /projects/{projectId} {
  allow read: if resource.data.status == 'published' || isAdmin();
  allow create, update, delete: if isAdmin();
}
```

**Key Points:**
- Public users can read ONLY published projects
- Admins can read all projects (including drafts)
- Only admins can create, update, or delete projects

### Storage Rules

```javascript
match /projects/{projectId}/{allPaths=**} {
  allow read: if true;  // Anyone can view images
  allow write: if isAdmin() && isImage() && isValidSize();
  allow delete: if isAdmin();
}
```

**Key Points:**
- Anyone can view project images
- Only admins can upload (must be images, max 10MB)
- Only admins can delete files

## Monitoring and Maintenance

### Monitor Usage:
- Check **Firestore Database** → **Usage** tab
- Check **Storage** → **Usage** tab
- Monitor for unusual activity

### Update Admin List:
- To add/remove admins, update both `firestore.rules` and `storage.rules`
- Redeploy rules after changes
- Changes take effect immediately

### Backup Strategy:
- Firestore has automatic backups
- For additional safety, use the migration script to export to JSON periodically
- Keep `firebase-service-account.json` secure and backed up

## Troubleshooting

### "Permission Denied" Errors

**Problem:** Users see "Permission denied" when accessing projects

**Solutions:**
1. Verify your email is in the `isAdmin()` function
2. Check that you're logged in to the admin panel
3. Verify the rules are deployed: `firebase deploy --only firestore:rules`
4. Check Firebase Console → Rules to see active rules

### Images Not Uploading

**Problem:** Image uploads fail

**Solutions:**
1. Check file size (must be < 10MB)
2. Check file type (must be image/*)
3. Verify Storage rules are deployed
4. Check Firebase Console → Storage → Rules

### Projects Not Appearing on Public Site

**Problem:** Projects don't show on the public site

**Solutions:**
1. Check project `status` is set to "published"
2. Verify Firestore rules allow public read for published projects
3. Check browser console for errors
4. Verify fallback to JSON is working if Firebase is empty

## Migration

To migrate existing projects from JSON to Firebase:

```bash
# Install dependencies
npm install firebase-admin dotenv

# Download service account key from Firebase Console
# Save as firebase-service-account.json

# Run migration
node scripts/migrateProjectsToFirebase.js
```

See `scripts/README.md` for detailed migration instructions.

## Security Best Practices

1. **Never commit sensitive files:**
   - `firebase-service-account.json`
   - `.env.local`
   - Add to `.gitignore`

2. **Use environment variables:**
   - All Firebase config should use environment variables
   - Never hardcode credentials

3. **Review rules regularly:**
   - Audit access patterns
   - Update admin list as team changes
   - Test rules after updates

4. **Monitor costs:**
   - Set up billing alerts
   - Monitor storage usage
   - Review Firestore read/write operations

## Support

For issues or questions:
1. Check Firebase Console logs
2. Review browser console errors
3. Test rules in Firebase Rules Playground
4. Refer to [Firebase Documentation](https://firebase.google.com/docs)

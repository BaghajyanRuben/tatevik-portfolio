# Fixing "Missing or Insufficient Permissions" Error

## What This Error Means

The error `FirebaseError: Missing or insufficient permissions` means:
- ❌ Your Firestore security rules are blocking the request
- ❌ Either rules aren't deployed, or your admin email isn't configured correctly

## Quick Fix - 3 Steps

### Step 1: Check Your Admin Email

First, find out what email you're logged in with:

1. Open your app: `http://localhost:5173/admin/dashboard`
2. Look at the top-right corner or sidebar - you'll see your logged-in email
3. **Write down this email** - you'll need it for Step 2

### Step 2: Deploy Firestore Rules with YOUR Email

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Copy and paste this (replacing the email):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
             request.auth.token.email in [
               'YOUR_ACTUAL_EMAIL@example.com',  // ← REPLACE THIS!
             ];
    }
    
    // Feedbacks collection
    match /feedbacks/{feedbackId} {
      // Public can create feedbacks (form submissions)
      allow create: if true;
      
      // Only admins can read, update, or delete feedbacks
      allow read, update, delete: if isAdmin();
    }
    
    // Projects collection
    match /projects/{projectId} {
      // Anyone can read published projects
      allow read: if resource.data.status == 'published' || isAdmin();
      
      // Only admins can create, update, or delete projects
      allow create, update, delete: if isAdmin();
    }
    
    // Default deny all other collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. **IMPORTANT:** Change `'YOUR_ACTUAL_EMAIL@example.com'` to the email from Step 1
6. Click **"Publish"** button

### Step 3: Verify It Works

1. Refresh your browser: `http://localhost:5173/admin/dashboard`
2. Try editing a project again
3. The error should be gone! ✅

## Still Getting the Error?

### Check 1: Are you logged in?

```
Look at your admin panel:
- Can you see the logout button?
- Can you see your email displayed?

If NO → You're not logged in!
Go to: http://localhost:5173/admin/login
```

### Check 2: Does your user exist?

1. Go to Firebase Console → **Authentication** → **Users**
2. Check if your email is in the list
3. If NOT there, add it:
   - Click **"Add user"**
   - Enter your email
   - Enter a password
   - Click **"Add user"**

### Check 3: Email matches exactly?

The email in THREE places must match EXACTLY:
- ✅ Email in Firestore rules
- ✅ Email in Authentication → Users
- ✅ Email you login with

**Example:**
- `admin@example.com` ✅
- `Admin@example.com` ❌ (capital A)
- `admin@example.com ` ❌ (space at end)

### Check 4: Rules are published?

In Firebase Console → Firestore Database → Rules:
- Look for green text: "Your rules were published successfully"
- If you don't see this, click **"Publish"** again

## Testing Your Rules

After fixing, test in browser console:

```javascript
// Open browser DevTools (F12)
// Go to Console tab
// Run this:

import { auth } from './src/config/firebase';
console.log('Logged in as:', auth.currentUser?.email);

// Should show your email
// If it shows "null", you're not logged in
```

## Alternative: Temporarily Allow All (TESTING ONLY!)

**⚠️ ONLY for testing! NOT for production!**

If you want to test quickly, you can temporarily allow all access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ⚠️ INSECURE - Only for testing!
    }
  }
}
```

This allows ANYONE to read/write. Use ONLY to verify Firebase is working, then switch back to the secure rules!

## Correct Rules (Copy This)

Here's the complete correct rules file:

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
               'your-email@example.com',     // ← Your email here
               // 'another@example.com',     // ← Add more admins if needed
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

## What These Rules Do

### For Public Users:
- ✅ Can submit feedback forms
- ✅ Can view published projects
- ❌ Cannot view draft projects
- ❌ Cannot edit anything

### For Admin (your email):
- ✅ Can view all projects (published + drafts)
- ✅ Can create/edit/delete projects
- ✅ Can view/manage all feedback
- ✅ Full access to everything

## Verification Checklist

After deploying rules, verify:

```
□ Rules are published in Firebase Console
□ Your email is in the rules (line 14)
□ Your email exists in Authentication → Users
□ You're logged in (see email in admin panel)
□ All three emails match exactly
□ Browser console shows no permission errors
```

## If Everything Fails

Try this complete reset:

1. **Logout**: Click logout in admin panel
2. **Clear browser**: Press Ctrl+Shift+Delete, clear cookies
3. **Deploy rules**: Copy rules above, change email, publish
4. **Verify user**: Check Authentication → Users has your email
5. **Login again**: Go to `/admin/login`
6. **Test**: Try editing a project

## Need More Help?

If still not working, check:

1. **Browser Console** (F12 → Console tab)
   - Look for Firebase errors
   - Note the exact error message

2. **Firebase Console** → **Firestore Database** → **Rules** tab
   - Click "Rules Playground" to test rules
   - Try simulating a read with your auth token

3. **Network Tab** (F12 → Network tab)
   - Look for failed Firestore requests
   - Check if authentication token is being sent

## Common Mistakes

❌ **Forgot to click "Publish"** → Rules not deployed  
❌ **Wrong email in rules** → Doesn't match login  
❌ **Spaces in email** → Exact match fails  
❌ **Not logged in** → No auth token sent  
❌ **Old browser cache** → Clear and reload  

## Success Indicators

You'll know it works when:
- ✅ No "permission denied" errors in console
- ✅ Can view projects in admin panel
- ✅ Can edit projects
- ✅ Can add new projects
- ✅ Dashboard loads without fallback to JSON

---

**Quick Summary:**
1. Get your logged-in email
2. Add it to Firestore rules (line 14)
3. Click "Publish"
4. Refresh browser

That's it! 🎉

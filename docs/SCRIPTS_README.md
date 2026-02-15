# Migration Scripts

## Migrate Projects from JSON to Firebase

This script migrates your existing projects from `projects.json` to Firebase Firestore.

### What This Script Does

1. ✅ Reads all projects from `src/data/projects.json`
2. ✅ Creates a timestamped backup of your JSON file
3. ✅ Verifies that images exist in `public/images/projects/`
4. ✅ Saves projects to Firestore with local file paths
5. ✅ Prints migration summary

**Important:** Files stay in `public/images/` - no uploads to Firebase Storage!

---

## Prerequisites

### 1. Install Dependencies

```bash
npm install firebase-admin dotenv
```

### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click **⚙️ (Settings)** → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Click **"Generate Key"** (downloads a JSON file)
7. Save the file as `firebase-service-account.json` in your project root

**Important:** This file contains sensitive credentials!
- It's already in `.gitignore`
- Never commit it to git
- Keep it secure

### 3. Verify Firebase Setup

Make sure you've completed:
- ✅ Firebase project created
- ✅ Firestore Database enabled
- ✅ Firestore security rules deployed (with your admin email)
- ✅ `.env.local` file with Firebase config

---

## Running the Migration

### Step 1: Check Your Files

Before running, verify:
```bash
# Check projects.json exists
cat src/data/projects.json

# Check images exist
ls public/images/projects/
```

### Step 2: Run Migration Script

```bash
node scripts/migrateProjectsToFirebase.js
```

### Step 3: Monitor Output

You'll see progress for each project:
```
🚀 Starting project migration to Firebase...

Found 10 projects to migrate

✓ Backup created: src/data/projects.backup.1234567890.json

[1/10] Migrating: My Project (my-project-id)
  Verifying thumbnail...
  Verifying hero image...
  Verifying hero mockups...
  Verifying info section images...
  Verifying gallery images...
  Saving to Firestore...
  ✓ Successfully migrated: My Project

...

📊 Migration Summary
============================================================
✓ Successful: 10
✗ Failed: 0

✓ Migration completed!
```

---

## What Gets Migrated

### Project Data
- All text content (title, description, etc.)
- Categories and metadata
- Status (published/draft)
- Project structure

### File Paths (Not Files!)
- Thumbnail path: `/images/projects/my-project/thumbnail.jpg`
- Hero images paths
- Gallery image paths
- Info section image paths

**Files remain in:** `public/images/projects/`  
**Firestore stores:** Just the paths (not the files!)

---

## File Structure

Your files should be organized like this:

```
public/
  images/
    projects/
      my-project-id/
        thumbnail/
          image.jpg
        hero/
          hero.jpg
        heroMockups/
          mockup1.jpg
          mockup2.jpg
        gallery/
          gallery1.jpg
          gallery2.jpg
```

The script will verify these files exist and save their paths to Firestore.

---

## Troubleshooting

### Error: "firebase-service-account.json not found"

**Solution:**
1. Download service account key from Firebase Console
2. Save as `firebase-service-account.json` in project root (next to `package.json`)
3. Run script again

### Error: "Permission denied"

**Solution:**
- Check that your service account has Firestore permissions
- Verify Firebase Admin SDK is initialized correctly

### Warning: "File not found: /images/..."

**This is just a warning** - migration continues!

**What it means:**
- The image file doesn't exist in `public/images/`
- The path will still be saved to Firestore

**How to fix:**
1. Add the missing image to `public/images/projects/`
2. Or update the project in admin panel with a new image

### Error: "Failed to migrate {project-id}"

**Solution:**
1. Check the error message in the output
2. Fix the issue (missing data, invalid format, etc.)
3. Run the script again (it won't duplicate)

---

## After Migration

### 1. Verify in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Firestore Database**
3. Check `projects` collection
4. Should see all your migrated projects!

### 2. Test Your App

```bash
# Start your app
npm run dev

# Check:
```
- ✅ Home page shows projects
- ✅ Clicking project opens details page
- ✅ Admin panel can edit projects
- ✅ Images display correctly

### 3. Keep Your Backup

The script creates a backup:
```
src/data/projects.backup.{timestamp}.json
```

**Keep this file!** You can restore from it if needed.

---

## Running Multiple Times

**Safe to re-run!** But it will create duplicate entries in Firestore.

To avoid duplicates:
1. Delete all documents in Firestore `projects` collection first
2. Or use a different approach (check by ID before adding)

---

## Advanced: Check for Duplicate Prevention

If you want to prevent duplicates, you can modify the script to check if a project already exists before adding it. Let me know if you need this!

---

## Security Reminder

The `firebase-service-account.json` file contains admin credentials!

**DO NOT:**
- ❌ Commit it to git (already in `.gitignore`)
- ❌ Share it publicly
- ❌ Upload it anywhere

**DO:**
- ✅ Keep it local only
- ✅ Use it only for migration
- ✅ Delete it after migration (optional)

---

## Summary

```bash
# 1. Install dependencies
npm install firebase-admin dotenv

# 2. Download service account key
# (from Firebase Console → Project Settings → Service Accounts)

# 3. Save as firebase-service-account.json

# 4. Run migration
node scripts/migrateProjectsToFirebase.js

# 5. Check Firestore for migrated projects
```

**That's it!** Your projects are now in Firebase! 🎉

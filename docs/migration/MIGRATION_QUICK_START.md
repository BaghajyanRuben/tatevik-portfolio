# Quick Migration Guide - Projects to Firebase

## TL;DR - 3 Steps

```bash
# 1. Install dependencies
npm install firebase-admin dotenv

# 2. Download service account key from Firebase Console
# Save as: firebase-service-account.json (in project root)

# 3. Run migration
node scripts/migrateProjectsToFirebase.js
```

---

## Step 1: Install Dependencies (30 seconds)

```bash
npm install firebase-admin dotenv
```

This installs:
- `firebase-admin` - To write to Firestore from Node.js
- `dotenv` - To read your `.env.local` file

---

## Step 2: Get Service Account Key (2 minutes)

### Why do you need this?

The script needs admin access to write to Firestore. The service account key provides that access.

### How to get it:

1. **Open Firebase Console:** https://console.firebase.google.com/
2. **Select your project**
3. **Click ⚙️ (gear icon)** → **Project Settings**
4. **Go to "Service Accounts" tab**
5. **Click "Generate New Private Key"**
6. **Click "Generate Key"** → Downloads a JSON file
7. **Rename it to:** `firebase-service-account.json`
8. **Move it to your project root** (next to `package.json`)

### File structure should look like:

```
portfolio/
├── firebase-service-account.json  ← HERE!
├── package.json
├── src/
├── public/
└── scripts/
    └── migrateProjectsToFirebase.js
```

---

## Step 3: Run Migration (1-2 minutes)

```bash
node scripts/migrateProjectsToFirebase.js
```

### What you'll see:

```
🚀 Starting project migration to Firebase...

Found 10 projects to migrate

✓ Backup created: src/data/projects.backup.1234567890.json

[1/10] Migrating: My First Project
  Verifying thumbnail...
  Verifying hero image...
  Verifying gallery images...
  Saving to Firestore...
  ✓ Successfully migrated: My First Project

[2/10] Migrating: Second Project
  ...

📊 Migration Summary
============================================================
✓ Successful: 10
✗ Failed: 0

✓ Migration completed!
```

---

## Verify It Worked

### Check Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your project
3. Click **Firestore Database**
4. You should see `projects` collection with all your projects!

### Check Your App

```bash
npm run dev
```

1. Open http://localhost:5173
2. Projects should display on home page
3. Click a project → Detail page should load
4. Login to admin → Projects should appear

---

## What Happens During Migration

### Creates Backup

Your `projects.json` is backed up automatically:
```
src/data/projects.backup.{timestamp}.json
```

### Verifies Images

Checks that images exist in `public/images/projects/`
- ✅ If found → Saves path to Firestore
- ⚠️ If missing → Warns you but continues

### Saves to Firestore

Each project gets:
- All your existing data (title, description, etc.)
- Local file paths (not uploading files!)
- Status: 'published' (default)
- Metadata: timestamps, created by "migration-script"

### Files Stay Local

**Important:** Images remain in `public/images/projects/`  
Firestore only stores the paths!

---

## Troubleshooting

### "firebase-service-account.json not found"

**Fix:** Make sure the file is:
- Named exactly: `firebase-service-account.json`
- Located in project root (not in `scripts/` folder!)

### "Permission denied"

**Fix:** 
- Check that Firestore Database is enabled
- Verify service account has correct permissions

### "⚠ File not found: /images/..."

**This is OK!** The script warns you about missing images but continues.

**To fix later:**
- Add missing images to `public/images/projects/`
- Or upload new images via admin panel

### Script hangs or times out

**Fix:**
- Check your internet connection
- Verify Firebase project is accessible
- Try running again

---

## After Migration

### What to do:

1. ✅ **Test your app** - Make sure projects load
2. ✅ **Check admin panel** - Can you edit projects?
3. ✅ **Keep backup** - Don't delete the backup JSON file yet
4. ✅ **Remove service account key** (optional - for security):
   ```bash
   rm firebase-service-account.json
   ```

### What NOT to do:

- ❌ Don't delete `public/images/` folder
- ❌ Don't commit `firebase-service-account.json` to git (already in `.gitignore`)
- ❌ Don't run migration multiple times (creates duplicates)

---

## FAQ

### Can I run this multiple times?

Yes, but it will create duplicate entries in Firestore. If you need to re-run:
1. Delete all documents in Firestore `projects` collection first
2. Then run the script again

### Will this delete my projects.json?

No! The original file stays. A backup is also created.

### What if I have missing images?

The script will warn you but continue. You can:
- Add missing images to `public/images/projects/` later
- Or use admin panel to upload new images

### Do I need Firebase Storage?

No! Files stay local in `public/images/`. Firestore only stores paths.

### Is my data safe?

Yes! The script:
- Creates a backup before starting
- Doesn't delete anything
- Only adds data to Firestore

---

## Need Help?

If you get stuck:

1. Check the error message carefully
2. Read `scripts/README.md` for detailed troubleshooting
3. Check browser console for Firebase errors
4. Verify Firebase configuration in `.env.local`

---

## Success! 🎉

After migration:
- ✅ Projects are in Firestore
- ✅ Images still in `public/images/`
- ✅ Admin can edit projects
- ✅ Public site displays projects
- ✅ Everything works!

Now you can add/edit projects through the admin panel and they'll be stored in Firebase!

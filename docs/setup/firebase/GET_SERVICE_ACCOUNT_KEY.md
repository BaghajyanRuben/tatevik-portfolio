# How to Get Firebase Service Account Key

## Step-by-Step Guide

### Step 1: Open Firebase Console

Go to: https://console.firebase.google.com/

### Step 2: Select Your Project

Click on your portfolio project

### Step 3: Go to Project Settings

1. Click the **⚙️ gear icon** (top left, next to "Project Overview")
2. Click **"Project settings"**

### Step 4: Go to Service Accounts Tab

1. In the top menu, click **"Service accounts"** tab
2. You'll see a section about Firebase Admin SDK

### Step 5: Generate New Private Key

1. Scroll down to **"Firebase Admin SDK"** section
2. Click the **"Generate new private key"** button
3. A popup will appear warning you about the key

### Step 6: Confirm and Download

1. Click **"Generate key"** button in the popup
2. A JSON file will download automatically
3. It will have a name like: `your-project-name-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`

### Step 7: Rename and Move the File

1. **Rename** the downloaded file to: `firebase-service-account.json`
2. **Move** it to your project root folder (where `package.json` is)

**Your folder structure should look like:**
```
portfolio/
├── firebase-service-account.json  ← NEW FILE HERE!
├── package.json
├── src/
├── public/
├── scripts/
└── ...
```

### Step 8: Verify File Location

Check the file is in the right place:

```bash
ls firebase-service-account.json
```

Should show: `firebase-service-account.json`

If you get "No such file or directory", the file is not in the right place!

### Step 9: Run Migration Again

```bash
node scripts/migrateProjectsToFirebase.js
```

Should now work! 🎉

---

## Visual Guide

```
Firebase Console
    ↓
Select Your Project
    ↓
⚙️ Project Settings
    ↓
"Service accounts" tab
    ↓
"Generate new private key" button
    ↓
Click "Generate key" in popup
    ↓
File downloads
    ↓
Rename to: firebase-service-account.json
    ↓
Move to project root (next to package.json)
    ↓
Run: node scripts/migrateProjectsToFirebase.js
```

---

## Common Issues

### Can't find "Service accounts" tab?

Make sure you're in:
- **Project Settings** (⚙️ icon)
- NOT in "Authentication" or other sections

### Button is grayed out?

You might not have permission. Check:
- Are you the project owner?
- Try refreshing the page

### File has wrong name?

The downloaded file name will be long. You MUST rename it to:
```
firebase-service-account.json
```

Exactly this name, all lowercase, no spaces!

### File is in wrong location?

The file must be in the **project root**, NOT in:
- ❌ `scripts/` folder
- ❌ `src/` folder
- ❌ Downloads folder
- ✅ Root (where `package.json` is)

### Still getting error?

Check file location:
```bash
# You should be in the project root
pwd

# Check if file is there
ls -la firebase-service-account.json
```

---

## Security Warning! 🔒

This file contains **admin credentials** for your Firebase project!

**DO NOT:**
- ❌ Commit it to git (it's already in `.gitignore`)
- ❌ Share it with anyone
- ❌ Post it online
- ❌ Upload it anywhere

**DO:**
- ✅ Keep it local only
- ✅ Keep it secure
- ✅ Delete it after migration (optional)

---

## After Getting the Key

Once you have the file in place:

```bash
# Run migration
node scripts/migrateProjectsToFirebase.js

# You should see:
🚀 Starting project migration to Firebase...
Found X projects to migrate
...
```

That's it! Your projects will be migrated to Firebase! 🎉

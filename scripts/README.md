# Scripts Directory

This directory contains utility scripts for managing your portfolio project.

## Available Scripts

### 1. `migrateProjectsToFirebase.js`

Migrates projects from local JSON file to Firebase Firestore.

**Usage:**
```bash
node scripts/migrateProjectsToFirebase.js
```

**Prerequisites:**
- `firebase-service-account.json` in project root
- Projects data in `src/data/projects.json`

**What it does:**
- Reads projects from JSON file
- Uploads each project to Firestore
- Preserves all project data and structure
- Skips already migrated projects

**See:** `docs/GET_SERVICE_ACCOUNT_KEY.md` for setup

---

### 2. `migrateImagesToR2.js`

Uploads local images from `public/images/projects/` to Cloudflare R2 and updates Firestore URLs.

**Usage:**
```bash
node scripts/migrateImagesToR2.js
```

**Prerequisites:**
- `firebase-service-account.json` in project root
- R2 credentials in `.env.local`
- Local images in `public/images/projects/`

**What it does:**
- Scans local image directory
- Uploads images to R2 bucket
- Updates Firestore project documents with R2 URLs
- Preserves directory structure

**See:** `docs/R2_SETUP_INSTRUCTIONS.md` for R2 setup

---

### 3. `fixMissingOrderField.js`

Adds the `order` field to all projects in Firestore that don't have it.

**Usage:**
```bash
node scripts/fixMissingOrderField.js
```

**Prerequisites:**
- `firebase-service-account.json` in project root
- Projects already in Firestore

**What it does:**
- Fetches all projects from Firestore
- Adds `order` field (chronologically based on `createdAt`)
- Ensures all projects appear in admin lists

**When to use:**
- After manually adding projects in Firebase Console
- If projects are missing from admin/public lists
- After database restore

---

## General Prerequisites

All scripts require:

1. **Node.js** installed (v18 or higher)
2. **Firebase Admin SDK service account key**
   - Download from Firebase Console
   - Save as `firebase-service-account.json` in project root
   - See: `docs/GET_SERVICE_ACCOUNT_KEY.md`

3. **Environment variables** in `.env.local` (for R2 scripts)
   ```env
   VITE_R2_ACCOUNT_ID=...
   VITE_R2_ACCESS_KEY_ID=...
   VITE_R2_SECRET_ACCESS_KEY=...
   VITE_R2_BUCKET_NAME=...
   VITE_R2_PUBLIC_URL=...
   ```

---

## Running Scripts

### First Time Setup

```bash
# Install dependencies
npm install

# Get service account key from Firebase
# (See docs/GET_SERVICE_ACCOUNT_KEY.md)

# Place it in project root as:
# firebase-service-account.json
```

### Run a Script

```bash
# General format
node scripts/<script-name>.js

# Examples
node scripts/migrateProjectsToFirebase.js
node scripts/fixMissingOrderField.js
```

---

## Troubleshooting

### Error: "firebase-service-account.json not found"

**Solution:**
1. Download service account key from Firebase Console
2. Save as `firebase-service-account.json` in project root (not in scripts folder)
3. See: `docs/GET_SERVICE_ACCOUNT_KEY.md`

### Error: "require is not defined"

**Solution:**
Scripts use ES modules. Make sure `package.json` has:
```json
{
  "type": "module"
}
```

### Error: "R2 credentials missing"

**Solution:**
Add R2 credentials to `.env.local`:
```env
VITE_R2_ACCOUNT_ID=your_account_id
VITE_R2_ACCESS_KEY_ID=your_access_key
VITE_R2_SECRET_ACCESS_KEY=your_secret_key
VITE_R2_BUCKET_NAME=your_bucket_name
VITE_R2_PUBLIC_URL=your_public_url
```

See: `docs/R2_SETUP_INSTRUCTIONS.md`

---

## Documentation

Full documentation available in `docs/` directory:

- **Firebase Setup:** `docs/FIREBASE_SETUP.md`
- **R2 Setup:** `docs/R2_SETUP_INSTRUCTIONS.md`
- **Migration Guide:** `docs/MIGRATION_QUICK_START.md`
- **Production Deployment:** `docs/CLOUDFLARE_PRODUCTION_SETUP.md`

---

## Safety Notes

⚠️ **These scripts modify your database!**

- Always backup your data before running migration scripts
- Test scripts in development first
- Scripts are idempotent (safe to run multiple times)
- Scripts skip already migrated data

🔒 **Never commit sensitive files:**
- `firebase-service-account.json` - in `.gitignore`
- `.env.local` - in `.gitignore`

---

## Need Help?

Check the documentation in `docs/` or review script comments for detailed information.

# ⚡ Enable Production Uploads - Quick Guide

Follow these 3 simple steps to enable file uploads in production.

---

## ✅ Step 1: Verify AWS SDK (Already Done!)

Check that `@aws-sdk/client-s3` is in `package.json` dependencies:

```json
"dependencies": {
  "@aws-sdk/client-s3": "^3.986.0",  ✓ Already there!
  ...
}
```

If missing, run:
```bash
npm install @aws-sdk/client-s3 --save
```

---

## ✅ Step 2: Commit and Push

The Cloudflare Pages Functions are already created in `/functions/api/r2/`

Just commit and push:

```bash
git add functions/
git commit -m "Add Cloudflare Pages Functions for production uploads"
git push
```

---

## ✅ Step 3: Verify Environment Variables

Make sure these are set in **Cloudflare Pages → Settings → Environment variables**:

```
VITE_R2_ACCOUNT_ID = 45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID = 0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY = 8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME = portfolio-images
VITE_R2_PUBLIC_URL = https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

(You should have already done this in previous setup)

---

## 🎉 Done!

After Cloudflare Pages deploys:

1. Go to: `https://your-site.pages.dev/admin`
2. Login
3. Click **Add Project**
4. Click **Browse & Upload Files**
5. **Upload works!** ✅

---

## 🔍 How It Works

### Files Created

```
functions/
  └── api/
      └── r2/
          ├── list-files.js      - Lists files
          ├── upload-file.js     - Uploads files
          ├── create-folder.js   - Creates folders
          ├── delete-file.js     - Deletes files
          └── package.json       - ES module config
```

### Deployment

Cloudflare Pages automatically:
1. Detects `/functions` directory
2. Deploys them as serverless functions
3. Makes them available at `/api/r2/*`
4. Uses your environment variables

### API Endpoints

```
GET  /api/r2/list-files    - List files and folders
POST /api/r2/upload-file   - Upload a file
POST /api/r2/create-folder - Create a folder
POST /api/r2/delete-file   - Delete a file
```

---

## 🧪 Test After Deployment

1. **Login** to admin panel
2. **Add Project** → **Browse & Upload Files**
3. **Upload a test image** ✓
4. **Create a folder** ✓
5. **Check browser console** (F12) - no errors!

---

## 📚 Full Documentation

See **[docs/PRODUCTION_UPLOAD_SETUP.md](./docs/PRODUCTION_UPLOAD_SETUP.md)** for:
- Detailed explanation
- Troubleshooting
- Advanced configuration
- Monitoring

---

## ✨ What This Enables

### Before
❌ File uploads only work in development  
❌ Production requires manual R2 dashboard upload  

### After  
✅ File uploads work in development  
✅ **File uploads work in production**  
✅ Same admin interface everywhere  
✅ No manual steps needed  

---

**Ready? Just push to Git and Cloudflare Pages does the rest!** 🚀

```bash
git push
```

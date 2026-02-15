# Complete Cloudflare R2 Setup - Step by Step

## 🎯 What We're Setting Up

Cloudflare R2 will store all your portfolio images with these benefits:
- ✅ Upload from production (not just development)
- ✅ Global CDN (fast worldwide)
- ✅ FREE for your usage
- ✅ Instant image availability
- ✅ No git commits needed for images

---

## 📋 Setup Checklist

### Step 1: Fix NPM Permissions ✅

```bash
sudo chown -R $(whoami) ~/.npm
```

### Step 2: Install AWS SDK ✅

```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

### Step 3: Add R2 Credentials to .env.local ⚠️ **YOU NEED TO DO THIS**

**Open your `.env.local` file** and add these lines:

```env
# Cloudflare R2 Configuration
VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID=0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY=8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME=portfolio-images
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### Step 4: Get R2 Public URL ⚠️ **IMPORTANT**

1. Go to Cloudflare Dashboard → R2
2. Click your bucket: `portfolio-images`
3. Click **Settings** tab
4. Find **"Public access"** section
5. Click **"Allow Access"** if not enabled
6. Copy the URL (like: `https://pub-abc123.r2.dev`)
7. Replace `https://pub-xxxxx.r2.dev` in `.env.local` with YOUR actual URL

### Step 5: Restart Dev Server

```bash
# Press Ctrl+C to stop current server
npm run dev
```

---

## 🧪 Test It Works

After setup, test in your browser:

```
1. Login to admin panel
2. Go to Add Project
3. Click "Browse & Upload Files"
4. Click "Upload Files"
5. Select an image
6. Should upload to R2! ✓
```

You'll see:
- Upload progress
- Image appears in file browser
- Image URL starts with your R2 public URL

---

## 📤 Migrate Existing Images (Optional)

If you want to move your existing local images to R2:

```bash
node scripts/migrateImagesToR2.js
```

This will:
- Upload all images from `public/images/projects/` to R2
- Update Firestore with new R2 URLs
- Keep local files as backup

**Note:** You can skip this and just upload new images going forward!

---

## 🎨 How It Works Now

### Development & Production:

```
Admin Panel
    ↓
Click "Upload Files"
    ↓
Select Image
    ↓
Upload to Cloudflare R2
    ↓
Get Public URL
    ↓
Save URL to Firestore
    ↓
Image Available Instantly ✓
```

### Visitors See:

```
Visit Portfolio
    ↓
Fetch Project from Firestore
    ↓
Load Images from R2 CDN
    ↓
Fast, Global Delivery ✓
```

---

## ✅ What's Been Implemented

Files Created:
- ✅ `src/config/r2.js` - R2 client configuration
- ✅ `src/services/r2Service.js` - R2 operations (upload, list, delete)
- ✅ `vite-plugin-r2-management.js` - Development server API
- ✅ `scripts/migrateImagesToR2.js` - Migration script

Files Updated:
- ✅ `vite.config.js` - Added R2 plugin
- ✅ `src/api/fileManagement.js` - Auto-detects R2 vs local
- ✅ `src/components/admin/FileBrowserModal.jsx` - Shows R2 URLs
- ✅ `src/components/admin/FileSelectorWithUpload.jsx` - Handles R2 URLs

---

## 🎯 What Happens Next

### New Projects:
1. Add project via admin
2. Upload images → Go to R2
3. Save project → R2 URLs in Firestore
4. Deploy → Works immediately in production ✓

### Existing Projects:
- Option A: Keep local images (still work)
- Option B: Migrate to R2 (run migration script)

---

## 🔐 Security

Your R2 credentials are:
- ✅ In `.env.local` (not committed to git)
- ✅ Used only by your app
- ✅ Can be rotated anytime in Cloudflare

---

## 💰 Costs

For your usage (200MB, low traffic):
- **Monthly cost: $0.00** (free tier)
- Free tier includes:
  - 10 GB storage
  - 10M reads/month
  - Unlimited egress

You're using ~2% of free tier! 🎉

---

## 🚀 Complete These Steps Now:

1. ✅ Run: `sudo chown -R $(whoami) ~/.npm`
2. ✅ Run: `npm install @aws-sdk/client-s3 @aws-sdk/lib-storage`
3. ⚠️ Add R2 credentials to `.env.local`
4. ⚠️ Get and add R2 public URL to `.env.local`
5. ✅ Restart dev server: `npm run dev`
6. 🧪 Test upload in admin panel

**Let me know when steps 3-4 are done and I'll help you test!** 🎉

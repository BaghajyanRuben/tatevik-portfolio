# 🚀 Production Deployment Quick Guide

Quick reference for deploying your portfolio to Cloudflare Pages.

---

## ⚡ Quick Steps

### 1. Add Environment Variables in Cloudflare Pages

Go to: **Cloudflare Dashboard → Workers & Pages → Your Project → Settings → Environment variables**

Add these **11 variables** (check "Production" box for each):

#### Firebase (6 variables)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN  
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

#### Cloudflare R2 (5 variables)
```
VITE_R2_ACCOUNT_ID = 45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID = 0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY = 8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME = portfolio-images
VITE_R2_PUBLIC_URL = https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

### 2. Authorize Production Domain in Firebase

Go to: **Firebase Console → Authentication → Settings → Authorized domains**

Add your production domain:
```
your-site.pages.dev
```

### 3. Deploy

```bash
git add .
git commit -m "Deploy to production"
git push
```

Cloudflare Pages will auto-deploy!

---

## ✨ File Uploads in Production

**File uploads now work in production!** ✅

Cloudflare Pages Functions handle all file operations:
- Upload files
- Create folders
- Delete files
- Browse files

### Setup Required

Before first deployment, run:

```bash
git add functions/
git commit -m "Add Cloudflare Pages Functions for uploads"
git push
```

See: **[ENABLE_PRODUCTION_UPLOADS.md](./ENABLE_PRODUCTION_UPLOADS.md)** for details.

### What Works in Production

✅ Firebase authentication  
✅ Project CRUD (create, read, update, delete)  
✅ Image display from R2  
✅ **File uploads from admin panel** ⚡ NEW!  
✅ Admin panel (full functionality)  
✅ Public portfolio site  
✅ Project reordering  

**Everything works!** 🎉

---

## 📖 Full Documentation

See **[docs/CLOUDFLARE_PRODUCTION_SETUP.md](./docs/CLOUDFLARE_PRODUCTION_SETUP.md)** for:
- Detailed setup instructions
- Troubleshooting guide
- CORS configuration
- Advanced options

---

## ✅ Deployment Checklist

```
□ All 11 environment variables added to Cloudflare Pages
□ Production domain authorized in Firebase
□ R2 CORS configured
□ R2 public access enabled
□ Code pushed to Git
□ Deployment successful
□ Test login works
□ Test images load
□ Test admin panel
```

---

## 🆘 Troubleshooting

### Images Not Loading
→ Check R2 CORS configuration  
→ Verify R2 public URL in env vars  
→ See: [docs/troubleshooting/FIX_IMAGES_NOT_SHOWING.md](./docs/troubleshooting/FIX_IMAGES_NOT_SHOWING.md)

### Login Not Working
→ Check Firebase authorized domains  
→ Verify all Firebase env vars are set  
→ See: [docs/setup/FIREBASE_SETUP.md](./docs/setup/FIREBASE_SETUP.md)

### Projects Not Showing
→ Check Firestore rules  
→ Run migration script if needed  
→ See: [docs/troubleshooting/FIXING_PERMISSIONS_ERROR.md](./docs/troubleshooting/FIXING_PERMISSIONS_ERROR.md)

---

**Ready to deploy? Follow steps 1-3 above!** 🚀

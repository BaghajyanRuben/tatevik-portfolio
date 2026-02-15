# Cloudflare Pages Production Setup

## Environment Variables for Production

Your app uses R2 for image storage. These environment variables need to be configured in Cloudflare Pages.

---

## Step 1: Go to Cloudflare Pages Settings

1. Open **Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Go to **Workers & Pages** (in left sidebar)
3. Find your **portfolio** project and click on it
4. Click **Settings** tab
5. Scroll to **Environment variables** section

---

## Step 2: Add These Environment Variables

Click **Add variable** for each of these:

### Firebase Configuration (6 variables)

```
VITE_FIREBASE_API_KEY
Value: [Your Firebase API Key]

VITE_FIREBASE_AUTH_DOMAIN
Value: [Your Firebase Auth Domain]

VITE_FIREBASE_PROJECT_ID
Value: [Your Firebase Project ID]

VITE_FIREBASE_STORAGE_BUCKET
Value: [Your Firebase Storage Bucket]

VITE_FIREBASE_MESSAGING_SENDER_ID
Value: [Your Firebase Messaging Sender ID]

VITE_FIREBASE_APP_ID
Value: [Your Firebase App ID]
```

### R2 Configuration (5 variables)

```
VITE_R2_ACCOUNT_ID
Value: 45a041e24553a302e2ec31520fb2ab6d

VITE_R2_ACCESS_KEY_ID
Value: 0fb1ad79d6269017f14610f9458d4b9b

VITE_R2_SECRET_ACCESS_KEY
Value: 8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7

VITE_R2_BUCKET_NAME
Value: portfolio-images

VITE_R2_PUBLIC_URL
Value: https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

---

## Step 3: Set Environment for All Variables

For **each** environment variable, make sure to select:

- ✅ **Production** (check this box)
- ✅ **Preview** (optional, but recommended for testing)

This ensures the variables are available in both production and preview deployments.

---

## Step 4: Save and Redeploy

1. Click **Save** after adding all variables
2. Go to **Deployments** tab
3. Find your latest deployment
4. Click **⋯** (three dots) → **Retry deployment**

OR just push a new commit to trigger a new deployment.

---

## Important Notes

### 1. No Build-Time Access to R2 in Production

⚠️ **The R2 Vite plugin only works in development!**

In production (Cloudflare Pages), the Vite plugin doesn't run. Instead:

- **Development**: Vite plugin handles R2 operations
- **Production**: Direct R2 access from browser using public URLs

### 2. R2 CORS Must Be Configured

Make sure your R2 bucket has CORS configured (you already did this):

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

### 3. Public URLs Work Automatically

Images are loaded using public R2 URLs like:
```
https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev/images/projects/image.jpg
```

These work directly in the browser without API routes.

### 4. Admin Upload in Production

✅ **File uploads from admin panel now work in production!**

Cloudflare Pages Functions handle all file operations automatically.

**Setup:**
See **[PRODUCTION_UPLOAD_SETUP.md](./PRODUCTION_UPLOAD_SETUP.md)** for complete guide.

**Quick setup:**
```bash
git add functions/
git commit -m "Add Cloudflare Pages Functions for uploads"
git push
```

Cloudflare Pages will automatically deploy the functions!

---

## Step 5: Verify Production Deployment

After redeploying with environment variables:

### 1. Check Firebase Connection
- Visit your production site
- Try to login as admin
- Login should work ✓

### 2. Check R2 Image Loading
- Visit home page
- Check if project images load
- Open browser console (F12)
- Look for any CORS or 404 errors

### 3. Check Admin Panel
- Login to `/admin`
- View projects list
- Projects should load from Firebase ✓
- Images should display ✓

---

## Troubleshooting

### Images Not Loading in Production

**Check:**
1. ✅ R2 public URL is correct in env vars
2. ✅ CORS is configured on R2 bucket
3. ✅ Images actually exist in R2 bucket
4. ✅ Public access is enabled on R2 bucket

**Test:**
Open this URL in browser (replace with your actual image):
```
https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev/images/projects/test.jpg
```

Should load the image directly.

### Firebase Not Working in Production

**Check:**
1. ✅ All 6 Firebase env vars are set
2. ✅ Firebase domain is authorized in Firebase Console:
   - Go to Firebase Console → Authentication → Settings
   - **Authorized domains** should include your production domain
   - Add: `your-site.pages.dev`

### Environment Variables Not Applied

**Fix:**
1. Make sure you clicked **Save** after adding each variable
2. Make sure **Production** box is checked
3. Trigger new deployment:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

## Production vs Development Differences

| Feature | Development | Production |
|---------|------------|------------|
| R2 API Access | Via Vite plugin | Via Cloudflare Pages Functions |
| File Upload | ✅ Works via API | ✅ Works via Functions |
| Image Display | ✅ Via R2 | ✅ Via R2 |
| Firebase | ✅ Works | ✅ Works |
| Admin Panel | ✅ Full access | ✅ Full access |

**Everything works the same in both environments!** 🎉

---

## Summary Checklist

```
□ All Firebase env vars added to Cloudflare Pages
□ All R2 env vars added to Cloudflare Pages
□ Variables set for Production environment
□ Deployment triggered after adding variables
□ Production site loads correctly
□ Firebase login works
□ R2 images display
□ Admin panel shows projects from Firebase
```

---

## Next Steps (Optional Enhancements)

1. **Create Cloudflare Worker for uploads** - Allow admin uploads in production
2. **Add image optimization** - Use Cloudflare Image Resizing
3. **Setup CDN caching** - Cache R2 images for faster loading
4. **Add staging environment** - Test changes before production

---

Need help? Check your deployment logs in Cloudflare Pages dashboard.

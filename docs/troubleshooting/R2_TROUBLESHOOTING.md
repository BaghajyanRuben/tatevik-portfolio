# R2 Troubleshooting - Images Not Showing

## Issue: Upload works but images don't appear

This is usually caused by one of these issues:

### 1. CORS Not Configured on R2 Bucket

R2 needs CORS configuration to allow your website to load images.

#### Configure CORS in Cloudflare Dashboard:

1. Go to **Cloudflare Dashboard** → **R2**
2. Click on your **`portfolio-images`** bucket
3. Go to **Settings** tab
4. Scroll to **CORS Policy** section
5. Click **Add CORS Policy** or **Edit**
6. Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-production-domain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

**Important:** Replace `https://your-production-domain.com` with your actual domain (e.g., `https://yourname.pages.dev`)

7. Click **Save**

---

### 2. Check Browser Console for Errors

Open your browser's Developer Tools (F12) and check the **Console** tab for:

❌ **CORS errors** like:
```
Access to fetch at 'https://pub-xxx.r2.dev/...' has been blocked by CORS policy
```
→ **Fix:** Configure CORS (see step 1 above)

❌ **403 Forbidden** or **404 Not Found**:
```
GET https://pub-xxx.r2.dev/images/projects/image.jpg 404
```
→ **Fix:** File might not be uploaded correctly, or path is wrong

❌ **Mixed Content** (if using HTTPS):
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource
```
→ **Fix:** Make sure Public URL starts with `https://`

---

### 3. Verify Files Are Actually in R2

Let's check if files are really being uploaded:

#### Method A: Check Cloudflare Dashboard

1. Go to **Cloudflare Dashboard** → **R2**
2. Click **`portfolio-images`** bucket
3. Browse to `images/projects/`
4. Do you see your uploaded files?

#### Method B: Check Dev Server Console

After upload, look at your **terminal** where `npm run dev` is running.

You should see:
```
📂 R2 List for "images/projects": { folders: 2, files: 5 }
```

If you see `files: 0`, files aren't being uploaded.

---

### 4. Test R2 Public URL Manually

Try opening your R2 public URL directly in browser:

```
https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev/images/projects/test-image.jpg
```

Replace `test-image.jpg` with an actual file you uploaded.

**Expected Results:**

✅ **Image loads** → R2 is working, issue is in your app  
❌ **404 Not Found** → File wasn't uploaded or path is wrong  
❌ **403 Forbidden** → Public access not enabled  
❌ **CORS error** → CORS not configured

---

### 5. Check Public Access is Enabled

In Cloudflare Dashboard:

1. Go to **R2** → **`portfolio-images`** bucket
2. Click **Settings** tab
3. Look for **"R2.dev subdomain"** or **"Public access"**
4. Should show: **Allowed** and your public URL

If it says **"Not allowed"**:
1. Click **Allow Access**
2. Copy the public URL
3. Update `.env.local` with the new URL:
   ```env
   VITE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
   ```
4. Restart dev server

---

## Quick Debug Checklist

Run through this checklist:

```
□ CORS is configured in R2 bucket
□ Public access is enabled on R2 bucket
□ .env.local has correct VITE_R2_PUBLIC_URL
□ Dev server was restarted after .env.local changes
□ Browser console shows no CORS errors
□ Terminal shows files being listed (files: >0)
□ Can open R2 public URL directly in browser
```

---

## Still Not Working?

### Get Debug Info

1. **Open browser console** (F12)
2. **Go to Network tab**
3. **Try to browse files in admin panel**
4. Look for the request to `/api/r2/list-files`
5. Click on it and check:
   - **Status:** Should be 200
   - **Response:** Should show `{files: [...], folders: [...]}`

6. **Paste here:**
   - What status code do you see?
   - What's in the response?
   - Any errors in Console tab?

### Check Terminal Output

After uploading a file, check your terminal. You should see:

```
✅ File uploaded successfully
📂 R2 List for "images/projects": { folders: X, files: Y }
```

If you see errors, paste them here.

---

## Common Issues & Fixes

### Issue: "Files upload but don't appear in list"

**Cause:** Files are in root of bucket, not in `images/projects/`

**Fix:** Check Cloudflare Dashboard. Files should be at:
```
portfolio-images/
  └── images/
      └── projects/
          └── your-file.jpg
```

Not at:
```
portfolio-images/
  └── your-file.jpg  ❌ Wrong location
```

### Issue: "Can see folder but can't open it"

**Cause:** Empty folder or folder marker not created properly

**Fix:** Upload at least one file to the folder

### Issue: "Images show broken icon"

**Cause:** CORS not configured or wrong public URL

**Fix:** 
1. Configure CORS (see step 1)
2. Verify `VITE_R2_PUBLIC_URL` in `.env.local`
3. Restart dev server

---

## Need Help?

Provide this info:

1. **Browser Console errors** (F12 → Console tab)
2. **Network tab status** (F12 → Network tab → `/api/r2/list-files`)
3. **Terminal output** after upload
4. **Screenshot** of Cloudflare R2 bucket contents
5. **Your `.env.local`** R2 configuration (hide the secret key!)

```env
VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID=0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY=xxxxx [HIDDEN]
VITE_R2_BUCKET_NAME=portfolio-images
VITE_R2_PUBLIC_URL=https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

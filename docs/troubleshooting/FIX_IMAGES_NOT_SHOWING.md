# Quick Fix: Images Not Showing After Upload

## Most Likely Issue: CORS Not Configured

### Fix in 3 Steps:

#### Step 1: Configure CORS in Cloudflare

1. Open **Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Go to **R2** (in left sidebar)
3. Click your **`portfolio-images`** bucket
4. Click **Settings** tab
5. Scroll to **CORS Policy**
6. Click **Add CORS Policy** (or Edit if exists)
7. **Paste this:**

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

8. Click **Save**

---

#### Step 2: Check Your Browser Console

1. Open your admin panel
2. Press **F12** (or Cmd+Option+I on Mac)
3. Go to **Console** tab
4. Try uploading again
5. Look for any errors

**What to look for:**

✅ **Should see:**
```
📂 Loaded directory: /images/projects {files: [...], folders: [...]}
```

❌ **If you see CORS error:**
```
Access to fetch at '...' has been blocked by CORS policy
```
→ Go back to Step 1 and make sure CORS is saved

❌ **If you see 404:**
```
Failed to load resource: 404 Not Found
```
→ Files might not be in the right location

---

#### Step 3: Restart Dev Server

After configuring CORS:

1. Stop dev server: **Ctrl+C** (or Cmd+C)
2. Start again: `npm run dev`
3. Refresh browser (**F5** or Cmd+R)
4. Try browsing files again

---

## Still Not Working?

### Check Terminal Output

After clicking "Browse & Upload Files", check your **terminal** (where `npm run dev` is running).

You should see:
```
📂 R2 List for "images/projects": { folders: 2, files: 5 }
```

If you see `files: 0`, your files might be uploaded to the wrong location.

### Verify in Cloudflare Dashboard

1. Go to R2 → `portfolio-images` bucket
2. Browse the folders
3. Files should be at: `images/projects/your-file.jpg`
4. **Not at the root!**

### Test Public URL

Open this in your browser (replace with your actual file):
```
https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev/images/projects/test.jpg
```

- ✅ Image loads → CORS issue (go to Step 1)
- ❌ 404 → File not uploaded or wrong path
- ❌ 403 → Public access not enabled

---

## Quick Diagnostic

Run this in browser console (F12 → Console tab):

```javascript
fetch('https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev/images/projects/')
  .then(r => console.log('Status:', r.status))
  .catch(e => console.log('Error:', e.message))
```

- Status 200 or 403 → CORS not configured
- Status 404 → Wrong path or files not uploaded
- Error → Network issue or wrong URL

---

## After Configuring CORS

✅ **Refresh browser**  
✅ **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)  
✅ **Try uploading again**

Images should now appear immediately after upload!

---

## Need More Help?

See the detailed guide: **`R2_TROUBLESHOOTING.md`**

Or paste here:
1. Any **console errors** (F12 → Console)
2. **Terminal output** when browsing files
3. **Screenshot** of R2 bucket contents in Cloudflare Dashboard

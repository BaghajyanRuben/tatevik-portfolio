# Production File Upload Setup

Complete guide to enable file uploads in production using Cloudflare Pages Functions.

---

## 🎯 Overview

Your app now has **Cloudflare Pages Functions** that handle R2 file operations in production:

- ✅ List files and folders
- ✅ Upload files
- ✅ Create folders
- ✅ Delete files

These functions run as serverless endpoints in production, just like the Vite plugin does in development!

---

## 📁 What Was Created

New directory: `/functions/api/r2/`

Files:
- `list-files.js` - Lists files and folders
- `upload-file.js` - Handles file uploads
- `create-folder.js` - Creates folders
- `delete-file.js` - Deletes files
- `package.json` - ES module configuration

---

## ⚡ Quick Setup (3 Steps)

### Step 1: Install AWS SDK as Production Dependency

```bash
npm install @aws-sdk/client-s3 --save
```

**Important:** Make sure `@aws-sdk/client-s3` is in `dependencies`, NOT `devDependencies` in `package.json`.

### Step 2: Environment Variables Already Set?

You should have already added these to Cloudflare Pages in previous setup:

```
VITE_R2_ACCOUNT_ID
VITE_R2_ACCESS_KEY_ID
VITE_R2_SECRET_ACCESS_KEY
VITE_R2_BUCKET_NAME
VITE_R2_PUBLIC_URL
```

If not, see: [CLOUDFLARE_PRODUCTION_SETUP.md](./CLOUDFLARE_PRODUCTION_SETUP.md)

### Step 3: Deploy

```bash
git add functions/
git commit -m "Add Cloudflare Pages Functions for R2 uploads"
git push
```

**That's it!** Cloudflare Pages will automatically deploy the functions and file uploads will work in production! 🎉

---

## 🔍 How It Works

### Development
```
Admin Panel → Vite Plugin Middleware → R2
```

### Production
```
Admin Panel → Cloudflare Pages Functions → R2
```

Same API endpoints (`/api/r2/*`), different backend!

---

## 🧪 Testing in Production

After deployment:

### 1. Login to Admin Panel
Go to: `https://your-site.pages.dev/admin`

### 2. Try Adding a Project
1. Click **Add Project**
2. Fill in basic info
3. Click **Browse & Upload Files**
4. **Upload a test image** ✓
5. **Create a new folder** ✓
6. **Browse folders** ✓

Everything should work exactly like in development!

### 3. Check Browser Console
Press **F12** → **Console** tab

You should see:
```
📤 Client uploading: { file: "...", targetPath: "/images/projects", API_PREFIX: "/api/r2" }
✅ File uploaded successfully
```

No errors!

---

## 📦 Package.json Check

Make sure `@aws-sdk/client-s3` is in production dependencies:

```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.x.x",
    ...other dependencies...
  },
  "devDependencies": {
    ...dev dependencies...
  }
}
```

If it's in `devDependencies`, move it to `dependencies`:

```bash
npm uninstall @aws-sdk/client-s3
npm install @aws-sdk/client-s3 --save
```

---

## 🔧 Cloudflare Pages Functions Details

### How They Work

Cloudflare Pages automatically turns files in `/functions` into API endpoints:

```
/functions/api/r2/list-files.js   → /api/r2/list-files
/functions/api/r2/upload-file.js  → /api/r2/upload-file
/functions/api/r2/create-folder.js → /api/r2/create-folder
/functions/api/r2/delete-file.js  → /api/r2/delete-file
```

### Function Format

Each function exports handlers:
- `onRequestGet` - for GET requests
- `onRequestPost` - for POST requests

Example:
```javascript
export async function onRequestPost(context) {
  const { request, env } = context;
  // env contains your environment variables
  // request is the incoming HTTP request
  
  // Your code here
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Environment Access

Functions access environment variables via `context.env`:
```javascript
const accountId = env.VITE_R2_ACCOUNT_ID;
const accessKeyId = env.VITE_R2_ACCESS_KEY_ID;
// etc...
```

---

## 🚀 Deployment Process

### Automatic Deployment

1. Push code to Git
2. Cloudflare Pages detects `/functions` directory
3. Builds your app
4. Deploys functions as serverless endpoints
5. Routes `/api/r2/*` requests to functions

### Build Settings

No special configuration needed! Cloudflare Pages automatically:
- Detects your Vite app
- Builds the frontend
- Deploys the functions
- Sets up routing

---

## ✅ Verification Checklist

After deployment, verify:

```
□ Functions deployed (check Cloudflare Pages dashboard)
□ Can login to admin panel
□ Browse & Upload Files button works
□ Can upload images
□ Can create folders
□ Can delete files
□ Images display correctly
□ No console errors
```

---

## 🐛 Troubleshooting

### Issue: "R2 credentials not configured"

**Check:**
1. Environment variables are set in Cloudflare Pages
2. Variable names are correct (VITE_R2_*)
3. **Production** box is checked for each variable
4. Redeploy after adding variables

**Fix:**
```bash
# Trigger new deployment
git commit --allow-empty -m "Redeploy"
git push
```

### Issue: Functions not found (404)

**Check:**
1. `/functions` directory is in project root (not in `/src`)
2. Files are `.js` (not `.ts`)
3. Functions are committed to Git
4. Deployment succeeded

**Fix:**
```bash
# Verify functions are in repo
ls functions/api/r2/

# Should show:
# create-folder.js
# delete-file.js
# list-files.js
# upload-file.js
# package.json
```

### Issue: "Module not found: @aws-sdk/client-s3"

**Check:**
1. `@aws-sdk/client-s3` is in `dependencies` (not `devDependencies`)
2. `package.json` includes the SDK

**Fix:**
```bash
npm install @aws-sdk/client-s3 --save
git add package.json package-lock.json
git commit -m "Add AWS SDK to production dependencies"
git push
```

### Issue: Upload works but images don't show

**Check:**
1. R2 CORS is configured
2. R2 public access is enabled
3. Public URL is correct in env vars

**See:** [FIX_IMAGES_NOT_SHOWING.md](./troubleshooting/FIX_IMAGES_NOT_SHOWING.md)

---

## 📊 Monitoring

### Check Function Logs

1. Go to **Cloudflare Dashboard**
2. **Workers & Pages** → Your project
3. Click on a deployment
4. **Functions** tab
5. View logs for each function

Logs show:
- Function invocations
- Errors
- Console.log output

### Check Build Logs

In Cloudflare Pages → Deployments → Your deployment

Look for:
```
✅ Functions built successfully
✅ 4 function(s) deployed
```

---

## 🎯 What Works Now

### In Development
✅ File uploads via Vite plugin  
✅ Real-time file operations  
✅ Local debugging

### In Production
✅ File uploads via Cloudflare Functions  
✅ Same API endpoints  
✅ Same user experience  
✅ Serverless (no backend server needed)  
✅ Automatic scaling  
✅ Low latency (Cloudflare edge network)

---

## 💡 Advanced: Custom Function Configuration

### Increase Memory Limit

If you need more memory for large file uploads, add to `wrangler.toml`:

```toml
[functions]
max_upload_size = 100  # MB
```

### Add Function Middleware

Create `functions/_middleware.js` for shared logic:

```javascript
export async function onRequest(context) {
  // Add authentication, logging, etc.
  return await context.next();
}
```

### Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// In your function
const ip = request.headers.get('CF-Connecting-IP');
// Check rate limit for IP
// Return 429 if exceeded
```

---

## 📝 Summary

### Before (Development Only)
❌ Uploads only work locally via Vite plugin  
❌ Production uploads require manual R2 dashboard  

### After (Works Everywhere)
✅ Uploads work in development via Vite plugin  
✅ Uploads work in production via Cloudflare Functions  
✅ Same code, same API, seamless experience  

---

## 🔗 Related Documentation

- **Production Setup:** [CLOUDFLARE_PRODUCTION_SETUP.md](./CLOUDFLARE_PRODUCTION_SETUP.md)
- **R2 Setup:** [R2_SETUP_INSTRUCTIONS.md](./R2_SETUP_INSTRUCTIONS.md)
- **Troubleshooting:** [R2_TROUBLESHOOTING.md](./R2_TROUBLESHOOTING.md)

---

**Ready to deploy? Run the 3 steps above!** 🚀

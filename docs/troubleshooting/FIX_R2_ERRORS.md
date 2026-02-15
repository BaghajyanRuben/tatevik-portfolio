# Fix R2 Errors - Quick Guide

## The Errors You're Seeing

```
List files error: Unexpected token '<', "<!doctype "... is not valid JSON
Failed to load resource: the server responded with a status of 404
```

**This means:** The R2 API endpoints aren't active yet.

---

## ✅ Complete These Steps in Order

### Step 1: Check if .env.local exists

In your project root (same folder as `package.json`), check if `.env.local` file exists.

**If it doesn't exist, create it:**
```bash
touch .env.local
```

### Step 2: Add Credentials to .env.local

**Open `.env.local`** and add these exact lines:

```env
VITE_FIREBASE_API_KEY=your_existing_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_existing_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_existing_firebase_project
VITE_FIREBASE_STORAGE_BUCKET=your_existing_firebase_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_existing_firebase_sender
VITE_FIREBASE_APP_ID=your_existing_firebase_app

VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID=0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY=8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME=portfolio-images
VITE_R2_PUBLIC_URL=https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

**Important:** 
- Keep your existing Firebase credentials (the first 6 lines)
- Add the R2 credentials below them
- No quotes around values
- No spaces around `=`

**Save the file!**

### Step 3: Install Packages

```bash
# Fix npm permissions first (if needed)
sudo chown -R $(whoami) ~/.npm

# Install packages
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

If packages are already installed, you'll see "up to date" - that's fine!

### Step 4: Stop Dev Server

In the terminal where `npm run dev` is running:
- Press **Ctrl+C** (or **Cmd+C** on Mac)
- Wait for it to stop completely

**This is CRITICAL!** Vite only loads `.env.local` on startup.

### Step 5: Start Dev Server Again

```bash
npm run dev
```

### Step 6: Check Console Output

You should see:

```
🔍 Checking R2 Configuration...
Account ID: ✓ Found
Access Key: ✓ Found
Secret Key: ✓ Found
Bucket Name: ✓ Found
Public URL: ✓ Found

✅ R2 client initialized successfully!
   Bucket: portfolio-images
   Public URL: https://pub-dca6a092df5e4de793a46e9c2a487a9a.r2.dev
```

If you see this ✅, R2 is working!

If you see ✗ Missing for any, go back to Step 1.

---

## 🧪 Test Again

1. **Refresh your browser** (F5 or Cmd+R)
2. **Login to admin panel**
3. **Go to Add Project**
4. **Click "Browse & Upload Files"**
5. **Should work now!** ✓

---

## 🔍 Verification Checklist

```
□ .env.local has R2 credentials
□ All 5 credentials are present
□ Public URL is correct (starts with https://pub-)
□ Packages are installed (@aws-sdk/client-s3)
□ Dev server was STOPPED and RESTARTED
□ Console shows "✅ R2 client initialized"
```

---

## 💡 Common Issues

### Still getting errors after restart?

**Check `.env.local` format:**
```env
# ✅ CORRECT
VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d

# ❌ WRONG - no quotes
VITE_R2_ACCOUNT_ID="45a041e24553a302e2ec31520fb2ab6d"

# ❌ WRONG - no spaces
VITE_R2_ACCOUNT_ID = 45a041e24553a302e2ec31520fb2ab6d
```

### Console shows "✗ Missing" for credentials?

**.env.local might not be loaded.** 

Try:
1. Make sure file is named exactly `.env.local` (not `.env`)
2. Make sure it's in project root (next to `package.json`)
3. Check there are no syntax errors in the file

### Packages won't install?

```bash
# Nuclear option - clear npm cache
npm cache clean --force
sudo chown -R $(whoami) ~/.npm
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

---

## 📋 Quick Commands

Copy and paste these one by one:

```bash
# 1. Fix permissions
sudo chown -R $(whoami) ~/.npm

# 2. Install packages
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage

# 3. Check .env.local exists
cat .env.local | grep R2

# Should show your R2 credentials
# If nothing shows, add them to .env.local

# 4. Restart dev server
npm run dev
```

---

## ✅ Success Indicators

After completing steps, you should see:

**In Terminal:**
```
✅ R2 client initialized successfully!
```

**In Browser:**
- No errors in console
- File browser loads
- Upload button works

---

**Complete the steps above and let me know what you see in the console!** 🚀

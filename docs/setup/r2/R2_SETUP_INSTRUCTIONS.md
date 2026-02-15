# Cloudflare R2 Setup - Complete Instructions

## Step 1: Fix NPM Permissions (1 minute)

Run this command to fix npm:
```bash
sudo chown -R $(whoami) ~/.npm
```

## Step 2: Install Required Packages (1 minute)

```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

This installs AWS SDK which works with Cloudflare R2 (R2 is S3-compatible).

## Step 3: Add Credentials to .env.local (2 minutes)

**Open your `.env.local` file** and add these lines at the bottom:

```env
# Cloudflare R2 Configuration
VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID=0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY=8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME=portfolio-images
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

## Step 4: Get Your R2 Public URL (2 minutes)

**This is important for displaying images!**

1. Go to Cloudflare Dashboard → R2
2. Click on your bucket: `portfolio-images`
3. Go to **Settings** tab
4. Scroll to **"Public access"** section
5. Click **"Allow Access"** button
6. Copy the public URL that appears (looks like: `https://pub-abc123.r2.dev`)
7. Replace `https://pub-xxxxx.r2.dev` in your `.env.local` with the actual URL

**Example:**
```env
VITE_R2_PUBLIC_URL=https://pub-abc123def456.r2.dev
```

## Step 5: Restart Dev Server (30 seconds)

```bash
# Stop current server (Ctrl+C or Cmd+C)
npm run dev
```

---

## ✅ Verification Checklist

After setup, verify:

```
□ npm permissions fixed
□ @aws-sdk packages installed
□ .env.local has R2 credentials
□ R2 public access enabled
□ Public URL added to .env.local
□ Dev server restarted
```

---

## 🔐 Security

Your credentials are safe because:
- ✅ `.env.local` is in `.gitignore`
- ✅ Won't be committed to git
- ✅ Only on your local machine

---

## What's Next?

After you complete these steps:
1. I'll implement the R2 file management
2. Update the admin panel to use R2
3. Migrate existing images (optional)
4. Test everything works!

---

**Complete the steps above and let me know when done!** 🚀

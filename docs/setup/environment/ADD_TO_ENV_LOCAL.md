# 🔐 Add R2 Credentials to .env.local

## Step 1: Open Your .env.local File

Open the file: `.env.local` in the project root

## Step 2: Add These Lines at the Bottom

```env
# Cloudflare R2 Configuration
VITE_R2_ACCOUNT_ID=45a041e24553a302e2ec31520fb2ab6d
VITE_R2_ACCESS_KEY_ID=0fb1ad79d6269017f14610f9458d4b9b
VITE_R2_SECRET_ACCESS_KEY=8bb40b24830f18e0a7d5a0b2759f6b7e74772e2cb7696b693c53efaeb83b24a7
VITE_R2_BUCKET_NAME=portfolio-images
VITE_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

## Step 3: Get Your R2 Public URL

1. Go to Cloudflare R2 Dashboard
2. Click on your bucket (`portfolio-images`)
3. Go to **Settings** tab
4. Find **"Public access"** section
5. Click **"Allow Access"** (if not already enabled)
6. Copy the public URL (looks like: `https://pub-xxxxx.r2.dev`)
7. Replace `https://pub-xxxxx.r2.dev` in the `.env.local` with your actual URL

## Step 4: Save the File

Save `.env.local` and restart your dev server:
```bash
# Stop dev server (Ctrl+C)
# Start again
npm run dev
```

## ⚠️ Security Note

The `.env.local` file is already in `.gitignore` - it won't be committed to git. This keeps your credentials safe!

---

**After adding these, let me know and I'll continue with the code implementation!**

# Debug R2 Bucket Structure

## Quick Diagnostic

### Step 1: Check Cloudflare Dashboard

1. Open **Cloudflare Dashboard**: https://dash.cloudflare.com/
2. Go to **R2** → Click **`portfolio-images`** bucket
3. What do you see?

Take a screenshot or write down the exact structure.

**Example of what you might see:**

```
portfolio-images/
  └── images/
      └── projects/
          └── .folder         ← Empty marker file
          
OR

portfolio-images/
  └── images/
      └── projects/
          └── projects/       ← Nested folder (wrong!)
              └── yourfile.jpg
              
OR

portfolio-images/
  └── images/
      └── projects/
          └── yourfile.jpg    ← Correct!
```

---

### Step 2: Check New Logs

1. **Stop dev server** (Ctrl+C or Cmd+C)
2. **Restart:** `npm run dev`
3. **Refresh browser** (F5 or Cmd+R)
4. **Open browser console** (F12 → Console tab)
5. **Go to admin → Add Project → Browse & Upload Files**

---

### Step 3: Check Terminal Output

You should now see detailed logs like:

```
📂 R2 List for "images/projects": { 
  folders: 1, 
  files: 0,
  prefixes: [ 'images/projects/projects/' ]  ← The actual prefix returned
}
  Folder: { 
    prefix: 'images/projects/projects/', 
    folderPath: 'images/projects/projects',
    folderName: 'projects'
  }
```

**Paste the full output here.**

---

### Step 4: Try Uploading Again

1. **Upload a test image**
2. Check **browser console** for:
   ```
   📤 Starting upload from path: /images/projects
   📤 Client uploading: { file: "...", targetPath: "...", API_PREFIX: "..." }
   ```

3. Check **terminal** for:
   ```
   📤 Uploading to R2: { targetPath: "...", cleanPath: "...", fullKey: "...", filename: "..." }
   ```

**Paste both outputs here.**

---

## Expected vs Actual

### What Should Happen:

When you browse to `/images/projects`, you should see:
- **Files directly in that folder** (if any uploaded)
- **Subfolders** like `project-name-1/`, `project-name-2/`, etc.

When you upload to `/images/projects`, file should be stored at:
```
images/projects/yourfile.jpg
```

---

## Possible Issues:

### Issue 1: Empty Folder Marker

If you just created the folder without uploading files, R2 might only have a `.folder` marker file.

**Fix:** Just upload a file - it will work.

### Issue 2: Nested Folder

If files are at `images/projects/projects/`, the folder structure got duplicated.

**Fix:** I'll update the default path to start at `images/projects/projects/` instead.

### Issue 3: Wrong Delimiter

The R2 list command might not be parsing folders correctly.

**Fix:** I'll adjust the folder parsing logic.

---

## Quick Fix While Debugging

If you need to upload files right now:

1. In **Cloudflare Dashboard** → R2 → `portfolio-images`
2. Navigate to the correct folder
3. Click **Upload**
4. Upload your images there manually
5. Note the exact path where they are
6. Tell me the path so I can update the app

---

## Commands to Run:

```bash
# Stop dev server
Ctrl+C or Cmd+C

# Restart with new logging
npm run dev

# In browser, refresh
F5 or Cmd+R
```

Then paste here:
1. **Cloudflare R2 bucket structure** (what folders/files you see)
2. **Terminal logs** (after browsing files)
3. **Browser console logs** (F12 → Console, after clicking browse)

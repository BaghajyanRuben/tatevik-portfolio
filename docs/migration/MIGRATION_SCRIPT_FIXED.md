# Migration Script Fixed - ES Modules

## What Was The Error?

```
ReferenceError: require is not defined in ES module scope
```

### Why It Happened

Your project uses ES modules (`"type": "module"` in package.json), but the migration script was using CommonJS syntax:

```javascript
// ❌ CommonJS (old)
const admin = require('firebase-admin');
```

### What I Fixed

Converted the script to ES modules:

```javascript
// ✅ ES Modules (new)
import admin from 'firebase-admin';
```

## Changes Made

### 1. Import Statements
```javascript
// Before
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// After
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
```

### 2. __dirname Equivalent
```javascript
// ES modules don't have __dirname, so we create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### 3. Read Service Account
```javascript
// Before (CommonJS require)
serviceAccount = require('../firebase-service-account.json');

// After (ES module fs.readFileSync)
const serviceAccountPath = path.join(__dirname, '..', 'firebase-service-account.json');
const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
serviceAccount = JSON.parse(serviceAccountData);
```

## Now Run It

```bash
node scripts/migrateProjectsToFirebase.js
```

Should work now! ✅

## If You Still Get Errors

### Error: "Cannot find module 'firebase-admin'"

**Solution:**
```bash
npm install firebase-admin dotenv
```

### Error: "firebase-service-account.json not found"

**Solution:**
1. Download from Firebase Console
2. Save as `firebase-service-account.json` in project root
3. Make sure it's next to `package.json`

### Error: "ENOENT: no such file or directory"

**Solution:**
Check that your `src/data/projects.json` exists:
```bash
ls src/data/projects.json
```

## What's Next?

After the script runs successfully:

1. ✅ Check Firebase Console → Firestore Database
2. ✅ You should see `projects` collection
3. ✅ Test your app to see projects load
4. ✅ Check admin panel can edit projects

## Summary

- ✅ Script converted to ES modules
- ✅ Compatible with your project setup
- ✅ Ready to run!

Run the migration:
```bash
node scripts/migrateProjectsToFirebase.js
```

🎉 It should work now!

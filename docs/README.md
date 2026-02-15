# Portfolio Documentation

Complete documentation for your portfolio project with Firebase and Cloudflare R2 integration.

---

## 🚀 Quick Start Guides

Start here if you're setting up the project:

### Firebase Setup
- **[QUICK_START_FIREBASE.md](./QUICK_START_FIREBASE.md)** - Quick Firebase configuration (5 min)
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Complete Firebase setup guide
- **[FIREBASE_CONFIGURATION_GUIDE.md](./FIREBASE_CONFIGURATION_GUIDE.md)** - Detailed Firebase configuration

### R2 Storage Setup
- **[R2_SETUP_INSTRUCTIONS.md](./R2_SETUP_INSTRUCTIONS.md)** - Step-by-step R2 setup
- **[COMPLETE_R2_SETUP.md](./COMPLETE_R2_SETUP.md)** - Comprehensive R2 guide
- **[ADD_TO_ENV_LOCAL.md](./ADD_TO_ENV_LOCAL.md)** - Environment variables setup

### Production Deployment
- **[CLOUDFLARE_PRODUCTION_SETUP.md](./CLOUDFLARE_PRODUCTION_SETUP.md)** - Deploy to Cloudflare Pages

---

## 📚 Feature Guides

Learn about specific features:

### Project Management
- **[MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md)** - Migrate projects to Firebase
- **[PROJECT_REORDERING_FEATURE.md](./PROJECT_REORDERING_FEATURE.md)** - Drag-and-drop reordering
- **[INSTALL_DRAG_DROP.md](./INSTALL_DRAG_DROP.md)** - Install @dnd-kit library

### File Management
- **[LOCAL_FILE_MANAGEMENT_COMPLETE.md](./LOCAL_FILE_MANAGEMENT_COMPLETE.md)** - Local file system
- **[FILE_UPLOAD_IMPROVEMENTS.md](./FILE_UPLOAD_IMPROVEMENTS.md)** - File upload enhancements

### Admin Interface
- **[ADMIN_SIDEBAR_LAYOUT.md](./ADMIN_SIDEBAR_LAYOUT.md)** - Admin sidebar navigation
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Complete implementation overview

---

## 🔧 Troubleshooting

Fix common issues:

### Firebase Issues
- **[FIXING_PERMISSIONS_ERROR.md](./FIXING_PERMISSIONS_ERROR.md)** - Fix Firebase permissions
- **[GET_SERVICE_ACCOUNT_KEY.md](./GET_SERVICE_ACCOUNT_KEY.md)** - Get Firebase service account
- **[UNDEFINED_VALUES_FIX.md](./UNDEFINED_VALUES_FIX.md)** - Fix undefined values in Firestore

### R2 Issues
- **[FIX_R2_ERRORS.md](./FIX_R2_ERRORS.md)** - Quick R2 error fixes
- **[FIX_IMAGES_NOT_SHOWING.md](./FIX_IMAGES_NOT_SHOWING.md)** - Images not displaying
- **[R2_TROUBLESHOOTING.md](./R2_TROUBLESHOOTING.md)** - Comprehensive R2 troubleshooting
- **[DEBUG_R2.md](./DEBUG_R2.md)** - Debug R2 bucket structure

### Other Issues
- **[PROJECT_DETAILS_FIX.md](./PROJECT_DETAILS_FIX.md)** - Fix project not found errors
- **[MIGRATION_SCRIPT_FIXED.md](./MIGRATION_SCRIPT_FIXED.md)** - Fix migration script errors

---

## 📖 Documentation Index

### Setup & Configuration

| Document | Description | When to Use |
|----------|-------------|-------------|
| [QUICK_START_FIREBASE.md](./QUICK_START_FIREBASE.md) | 5-minute Firebase setup | First time setup |
| [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) | Complete Firebase guide | Detailed setup |
| [R2_SETUP_INSTRUCTIONS.md](./R2_SETUP_INSTRUCTIONS.md) | R2 storage setup | Setting up image storage |
| [CLOUDFLARE_PRODUCTION_SETUP.md](./CLOUDFLARE_PRODUCTION_SETUP.md) | Production deployment | Going live |

### Features & Usage

| Document | Description | When to Use |
|----------|-------------|-------------|
| [MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md) | Migrate projects | Moving from JSON to Firebase |
| [PROJECT_REORDERING_FEATURE.md](./PROJECT_REORDERING_FEATURE.md) | Reorder projects | Custom project ordering |
| [ADMIN_SIDEBAR_LAYOUT.md](./ADMIN_SIDEBAR_LAYOUT.md) | Admin navigation | Understanding admin UI |

### Troubleshooting

| Document | Description | When to Use |
|----------|-------------|-------------|
| [FIXING_PERMISSIONS_ERROR.md](./FIXING_PERMISSIONS_ERROR.md) | Permission errors | "Missing or insufficient permissions" |
| [FIX_IMAGES_NOT_SHOWING.md](./FIX_IMAGES_NOT_SHOWING.md) | Image display issues | Images not loading |
| [FIX_R2_ERRORS.md](./FIX_R2_ERRORS.md) | R2 errors | R2 connection issues |
| [PROJECT_DETAILS_FIX.md](./PROJECT_DETAILS_FIX.md) | Project not found | Project detail page errors |

---

## 🛠️ Scripts

See **[../scripts/README.md](../scripts/README.md)** for:
- Migration scripts
- Database utilities
- Fix scripts

Available scripts:
- `migrateProjectsToFirebase.js` - Migrate projects to Firestore
- `migrateImagesToR2.js` - Upload images to R2
- `fixMissingOrderField.js` - Fix missing order field

---

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Database:** Firebase Firestore
- **Storage:** Cloudflare R2
- **Deployment:** Cloudflare Pages
- **Authentication:** Firebase Auth

### Data Flow

```
Admin Panel → Firebase Firestore ← Public Site
              ↓
          Cloudflare R2 (Images)
              ↓
          Public URLs
```

### Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Database | Firebase Firestore | Firebase Firestore |
| Storage | R2 (via Vite plugin) | R2 (direct public URLs) |
| File Upload | ✅ Admin panel | ⚠️ Manual (R2 dashboard) |
| Image Display | ✅ R2 public URLs | ✅ R2 public URLs |

---

## 📋 Common Tasks

### First Time Setup

1. **Setup Firebase:** [QUICK_START_FIREBASE.md](./QUICK_START_FIREBASE.md)
2. **Setup R2:** [R2_SETUP_INSTRUCTIONS.md](./R2_SETUP_INSTRUCTIONS.md)
3. **Migrate projects:** [MIGRATION_QUICK_START.md](./MIGRATION_QUICK_START.md)
4. **Test locally:** `npm run dev`

### Adding a New Project

1. Login to admin panel
2. Go to "Add Project"
3. Fill in project details
4. Upload images via file browser
5. Click "Add Project"

### Deploying to Production

1. Add environment variables in Cloudflare Pages
2. Push code to Git
3. Cloudflare Pages auto-deploys
4. See: [CLOUDFLARE_PRODUCTION_SETUP.md](./CLOUDFLARE_PRODUCTION_SETUP.md)

### Troubleshooting Issues

1. Check [Troubleshooting](#-troubleshooting) section above
2. Check browser console (F12)
3. Check Firebase Console
4. Check R2 bucket contents

---

## 🔑 Environment Variables

Required in `.env.local`:

```env
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Cloudflare R2
VITE_R2_ACCOUNT_ID=
VITE_R2_ACCESS_KEY_ID=
VITE_R2_SECRET_ACCESS_KEY=
VITE_R2_BUCKET_NAME=
VITE_R2_PUBLIC_URL=
```

See: [ADD_TO_ENV_LOCAL.md](./ADD_TO_ENV_LOCAL.md)

---

## 📞 Getting Help

1. **Check docs:** Start with relevant guide above
2. **Check console:** Browser DevTools (F12) → Console
3. **Check Firebase:** Firebase Console → Firestore/Auth
4. **Check R2:** Cloudflare Dashboard → R2

---

## 📝 Documentation Status

- ✅ Firebase setup complete
- ✅ R2 setup complete  
- ✅ Production deployment guide
- ✅ Migration scripts documented
- ✅ Troubleshooting guides
- ✅ Feature documentation

---

**Last Updated:** February 2026

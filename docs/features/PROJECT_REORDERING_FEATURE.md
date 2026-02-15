# Project Reordering Feature

## Overview

You can now control the order in which projects appear on your portfolio by using the drag-and-drop reordering feature in the admin panel!

## How to Use

### Step 1: Install Required Package

First, install the drag-and-drop library:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Step 2: Access Reorder Page

1. Login to admin panel
2. Go to **"Manage Projects"**
3. Click the **"Reorder"** button (next to "Add Project")

### Step 3: Reorder Projects

1. **Drag** projects using the grip handle (⋮⋮) on the left
2. **Drop** them in your desired position
3. Projects reorder instantly as you drag
4. **Click "Save Order"** to apply changes

### Step 4: View Changes

- Go to your public home page
- Projects now appear in the order you set!

---

## Features

### ✨ Visual Drag & Drop

- **Grip Handle** - Grab and move projects easily
- **Visual Feedback** - Projects fade when dragging
- **Smooth Animation** - Projects slide to new positions
- **Real-time Preview** - See order changes instantly

### 📊 Project Information Display

Each item shows:
- **Thumbnail** - Visual identifier
- **Title** - Project name
- **Subtitle** - Secondary info or ID
- **Status Badge** - Published (green) or Draft (yellow)

### 💾 Save Management

- **Unsaved Changes Banner** - Clear indication when changes aren't saved
- **Save Button** - One click to apply all changes
- **Cancel Button** - Discard changes and go back
- **Confirmation** - Warns before leaving with unsaved changes

---

## How It Works

### Backend (Firestore)

Each project has an `order` field:
- **Type:** Number (0, 1, 2, 3, ...)
- **Purpose:** Determines display order
- **Lower number** = Earlier in list

### Ordering Logic

```javascript
// Projects are fetched ordered by:
1. order field (ascending) - Custom order you set
2. createdAt (descending) - Fallback for projects without order
```

### Saving Order

When you click "Save Order":
1. Each project gets assigned a new order number (0, 1, 2, ...)
2. Updates are sent to Firestore
3. Order is saved permanently

### Public Display

Home page and project lists:
- Fetch projects from Firestore
- Automatically ordered by the `order` field
- Shows projects in the order you set!

---

## What Changed

### New Files

**`src/pages/admin/ReorderProjects.jsx`**
- Drag-and-drop reorder page
- Uses @dnd-kit library
- Saves order to Firestore

### Modified Files

**`src/services/projectService.js`**
- Added `updateProjectsOrder()` function
- Updated `getAllProjects()` to order by `order` field
- Fallback to `createdAt` if `order` doesn't exist

**`src/pages/admin/ManageProjects.jsx`**
- Added "Reorder" button
- Links to reorder page

**`src/App.jsx`**
- Added route: `/admin/projects/reorder`

---

## Technical Details

### Drag & Drop Library

Using **@dnd-kit** because:
- ✅ Modern and lightweight
- ✅ Accessible (keyboard support)
- ✅ Smooth animations
- ✅ Touch device support
- ✅ No jQuery dependency

### Order Assignment

Projects without `order` field:
- Automatically assigned order on first load
- Based on current position
- Must click "Save" to persist

Existing projects:
- Keep their order value
- Can be rearranged
- Updates saved to Firestore

### Sorting Strategy

```javascript
// Firestore query
orderBy('order', 'asc')  // Primary sort
orderBy('createdAt', 'desc')  // Fallback
```

If ordering fails (no index):
- Falls back to `createdAt` only
- Still works, just uses creation date

---

## Migration Considerations

### Existing Projects

Projects migrated before this feature:
- **No `order` field** initially
- Display in creation date order
- Go to "Reorder" page to assign order
- Click "Save" to persist

### New Projects

Projects created after this feature:
- Get highest order value + 1
- Added to end of list
- Can be reordered later

---

## Firestore Index

If you get an error about missing index:

1. Click the error link in console
2. Firebase opens index creation page
3. Click "Create Index"
4. Wait ~2 minutes for index to build
5. Try reordering again

**Index needed:**
- Collection: `projects`
- Fields: `order` (Ascending)
- Optional: `createdAt` (Descending)

---

## User Interface

### Reorder Page Layout

```
┌─────────────────────────────────────────┐
│ Reorder Projects                        │
│ Drag and drop to reorder...             │
├─────────────────────────────────────────┤
│ [You have unsaved changes]              │
│ Save your changes... [Save] [Cancel]    │
├─────────────────────────────────────────┤
│ ⋮⋮ [thumbnail] Project 1    [Published] │
│ ⋮⋮ [thumbnail] Project 2    [Draft]     │
│ ⋮⋮ [thumbnail] Project 3    [Published] │
│ ...                                      │
├─────────────────────────────────────────┤
│ 💡 Tips:                                │
│ • Drag projects using grip handle       │
│ • Order reflects on home page           │
│ • Don't forget to save                  │
└─────────────────────────────────────────┘
```

### States

**Loading:**
- Shows spinner
- "Loading projects..." message

**Reordering:**
- Drag handle is grabbable
- Project fades when dragging
- Other projects shift smoothly

**Unsaved Changes:**
- Blue banner appears
- "Save Order" button highlighted
- Cancel button available
- Warning on navigation

**Saving:**
- Button shows "Saving..."
- Disabled during save
- Success toast on completion

---

## Troubleshooting

### Can't install @dnd-kit?

**Try:**
```bash
sudo chown -R $(whoami) ~/.npm
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Projects not reordering?

1. Check browser console for errors
2. Make sure you clicked "Save Order"
3. Verify you're logged in as admin
4. Check Firestore permissions

### Order not saving?

1. Check internet connection
2. Verify Firestore rules allow updates
3. Check browser console for errors
4. Try refreshing and reordering again

### Firestore index error?

```
The query requires an index
```

**Solution:**
1. Click the error link
2. Create the index
3. Wait 2 minutes
4. Try again

### Projects still in wrong order on home page?

1. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check that projects have `order` field in Firestore

---

## Best Practices

### 1. Set Order Intentionally

- Feature your best projects first
- Group related projects
- Consider user journey

### 2. Save After Every Session

- Don't leave unsaved changes
- Test on home page after saving
- Keep backup of desired order

### 3. Periodic Review

- Review order regularly
- Update as you add projects
- Remove/archive old projects

### 4. Mobile Testing

- Check order on mobile
- Verify readability
- Test touch dragging

---

## Future Enhancements

Potential additions:
- Bulk actions (move to top/bottom)
- Group projects by category
- Visual preview of home page
- Undo/redo functionality
- Save order templates

---

## Summary

✅ **Installed** - @dnd-kit library  
✅ **Added** - Reorder page with drag-and-drop  
✅ **Updated** - Project service for ordering  
✅ **Modified** - Admin navigation  
✅ **Working** - Order reflects on public site  

**To use:**
1. Install packages: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
2. Go to Admin → Manage Projects → Reorder
3. Drag and drop to reorder
4. Click "Save Order"
5. Check home page! 🎉

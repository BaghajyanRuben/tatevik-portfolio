# Fixed: "Unsupported field value: undefined" Error

## What Was The Problem?

When updating a project, some fields (like `heroImage`) could be `undefined`, which Firestore doesn't accept.

**Error Message:**
```
FirebaseError: Function updateDoc() called with invalid data. 
Unsupported field value: undefined (found in field heroImage)
```

## Why It Happened

When a field wasn't set in the form:
```javascript
filePaths.heroImage = undefined  // Not set
projectData.heroImage = undefined  // Also not set
// Result: undefined || undefined = undefined ❌
```

Firestore requires:
- ✅ Empty string: `''`
- ✅ Null: `null`
- ❌ Undefined: `undefined` (NOT allowed!)

## What I Fixed

### 1. Added Default Empty Strings

```javascript
// Before
heroImage: filePaths.heroImage || projectData.heroImage

// After
heroImage: filePaths.heroImage || projectData.heroImage || ''
```

### 2. Added `removeUndefined()` Helper Function

This function recursively removes any undefined values from the object before sending to Firestore:

```javascript
const removeUndefined = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        cleaned[key] = removeUndefined(value);
      } else {
        cleaned[key] = value;
      }
    }
  });
  return cleaned;
};
```

### 3. Applied to Both Functions

- ✅ `addProject()` - When creating new projects
- ✅ `updateProject()` - When editing existing projects

## How It Works Now

```javascript
// When saving to Firestore:
const projectToUpdate = {
  heroImage: filePaths.heroImage || projectData.heroImage || '',
  // Other fields...
};

// Clean any remaining undefined values
const cleanedProject = removeUndefined(projectToUpdate);

// Now safe to save to Firestore ✅
await updateDoc(projectRef, cleanedProject);
```

## Test It

1. Save your changes and refresh the browser
2. Try editing a project
3. Leave some fields empty
4. Click "Save"
5. Should work without errors! ✅

## What Changed in Code

**File Modified:** `src/services/projectService.js`

**Changes:**
1. Added `removeUndefined()` helper function at top
2. Updated `addProject()` to use default empty strings and clean undefined
3. Updated `updateProject()` to use default empty strings and clean undefined

## Default Values Applied

All file path fields now default to empty strings:

```javascript
thumbnail: '' (instead of undefined)
heroImage: '' (instead of undefined)
heroMockups: [] (instead of undefined)
gallery.images: [] (instead of undefined)
infoSections[].topImage: '' (instead of undefined)
infoSections[].bottomImage: '' (instead of undefined)
```

## This Prevents

- ❌ "Unsupported field value: undefined" errors
- ❌ Firestore save failures
- ❌ Data corruption

## This Allows

- ✅ Save projects with optional fields empty
- ✅ Edit projects without re-entering all fields
- ✅ Partial updates work correctly

## Summary

The error is now fixed! You can:
- Edit projects without errors
- Leave optional fields empty
- Save successfully to Firestore

Refresh your browser and try editing a project again - it should work! 🎉

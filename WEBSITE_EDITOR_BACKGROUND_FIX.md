# Website Editor Background Fix

## Problem
In the website editor (after clicking "Edit Template"), the screen was showing a half white/half blue background. The template content appeared on a white background, but below the template content, the background turned blue/gray, creating an inconsistent appearance.

## Root Cause
The issue was in the WebsiteBuilder component's canvas styling:
- The main container had `bg-gray-50` (blue/gray background)
- The canvas container used `min-h-0` which didn't ensure full height coverage
- The inner content div used `min-h-full` but wasn't extending to full screen height
- This caused the blue/gray background to show through at the bottom

## Solution
**File**: `src/components/website/WebsiteBuilder.tsx`

### Before:
```tsx
{/* Canvas */}
<div className="flex-1 overflow-auto bg-white p-8 min-h-0">
  <div
    className={cn(
      "bg-white min-h-full shadow-lg transition-all",
      getViewportClass()
    )}
  >
```

### After:
```tsx
{/* Canvas */}
<div className="flex-1 overflow-auto bg-white p-8 min-h-screen">
  <div
    className={cn(
      "bg-white min-h-screen shadow-lg transition-all",
      getViewportClass()
    )}
  >
```

## Changes Made
1. **Canvas Container**: Changed from `min-h-0` to `min-h-screen`
2. **Content Container**: Changed from `min-h-full` to `min-h-screen`

## Result
- ✅ Consistent white background from top to bottom
- ✅ No more blue/gray background showing at the bottom
- ✅ Professional appearance throughout the entire editor
- ✅ Proper height coverage for all screen sizes

## User Experience Improvement
Users now see a clean, consistent white background throughout the entire website editor interface, providing a professional editing experience without the distracting color change at the bottom of the screen.
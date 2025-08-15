# Website Editor Rate Limiting Fix

## Problem
Users were experiencing "rate exceeded" errors when clicking the "Edit Template" button in website template previews. The website editor would hang and show a white screen with "rate exceeded" message.

## Root Cause
When users clicked "Edit Template", the website editor (WebsiteBuilder component) would load and immediately try to render all template components with their images simultaneously, causing multiple concurrent image requests that triggered rate limiting (429 errors).

## Solution Implemented

### 1. Enhanced WebsiteBuilder Component
- **File**: `src/components/website/WebsiteBuilder.tsx`
- **Changes**:
  - Added image preloading with rate limiting protection
  - Implemented sequential image loading (1 image at a time with 2-second delays)
  - Added loading indicators and progress tracking
  - Added rate limit detection and handling
  - Preload images when template data loads to prevent simultaneous requests

### 2. Improved Template Preview Navigation
- **File**: `src/components/templates/TemplatePreview.tsx`
- **Changes**:
  - Modified "Edit Template" button to clear existing rate limits before navigation
  - Changed from `<a>` tag to `onClick` handler for better control

### 3. Enhanced Error Handling
- **File**: `src/app/sites/[websiteId]/page.tsx`
- **Changes**:
  - Improved error handling for invalid website IDs
  - Better user feedback for loading states

## Key Features Added

### Image Preloading System
```typescript
const preloadWebsiteImages = useCallback(async (componentsToLoad: Component[]) => {
  await preloadTemplateImages(componentsToLoad, {
    batchSize: 1, // Load one image at a time
    delayBetweenBatches: 2000, // 2 second delay between images
    onProgress: (loaded, total) => {
      setImageLoadProgress({ loaded, total });
      // Check for rate limiting during preload
    }
  });
}, [isLoadingImages]);
```

### Loading Indicators
- Shows "Loading images (X/Y)" in the toolbar
- Displays rate limiting warnings when detected
- Prevents multiple simultaneous preload operations

### Rate Limit Protection
- Clears existing rate limits before navigation
- Sequential image loading to prevent 429 errors
- Automatic detection and handling of rate limiting

## User Experience Improvements

1. **Smooth Navigation**: "Edit Template" button now works reliably without hanging
2. **Visual Feedback**: Users see loading progress and rate limiting status
3. **Error Prevention**: Proactive rate limiting protection prevents white screen errors
4. **Graceful Degradation**: If rate limiting occurs, the editor still loads with placeholders

## Testing
- Template preview navigation now works without rate exceeded errors
- Website editor loads smoothly with sequential image loading
- Loading indicators provide clear feedback to users
- Rate limiting is detected and handled gracefully

## Files Modified
1. `src/components/website/WebsiteBuilder.tsx` - Main editor component with rate limiting protection
2. `src/components/templates/TemplatePreview.tsx` - Improved navigation handling
3. `src/app/sites/[websiteId]/page.tsx` - Enhanced error handling

The fix ensures that users can successfully navigate from template previews to the website editor without encountering rate limiting issues.
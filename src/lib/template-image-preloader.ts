/**
 * Template Image Preloader
 * Intelligently preloads template images to prevent rate limiting issues
 */

import { Component } from '@/lib/types';
import { loadImagesInBatch, loadImageSafely } from './rate-limit-prevention';

interface ImageSource {
  src: string;
  priority: number;
  component: string;
}

/**
 * Extract all image sources from template components
 */
export function extractImageSources(components: Component[]): ImageSource[] {
  const images: ImageSource[] = [];
  
  components.forEach((component, index) => {
    const priority = index < 3 ? 10 : 5; // Higher priority for above-the-fold content
    
    // Extract images based on component type and content
    switch (component.type) {
      case 'hero':
        if (component.content?.image) {
          images.push({
            src: component.content.image,
            priority: 10, // Hero images get highest priority
            component: `${component.type}-${component.id}`
          });
        }
        break;
        
      case 'testimonials':
        if (component.content?.testimonials) {
          component.content.testimonials.forEach((testimonial: any, i: number) => {
            if (testimonial.image) {
              images.push({
                src: testimonial.image,
                priority: priority - i, // Decrease priority for each testimonial
                component: `${component.type}-${component.id}-${i}`
              });
            }
          });
        }
        break;
        
      case 'about_coach':
      case 'about':
        if (component.content?.coach?.image) {
          images.push({
            src: component.content.coach.image,
            priority: 8,
            component: `${component.type}-${component.id}`
          });
        }
        if (component.content?.image) {
          images.push({
            src: component.content.image,
            priority: 8,
            component: `${component.type}-${component.id}`
          });
        }
        break;
        
      case 'image':
        if (component.content?.src) {
          images.push({
            src: component.content.src,
            priority: priority,
            component: `${component.type}-${component.id}`
          });
        }
        break;
        
      case 'case_studies':
        if (component.content?.caseStudies) {
          component.content.caseStudies.forEach((study: any, i: number) => {
            if (study.image) {
              images.push({
                src: study.image,
                priority: priority - i,
                component: `${component.type}-${component.id}-${i}`
              });
            }
          });
        }
        break;
        
      case 'before_after':
        if (component.content?.transformations) {
          component.content.transformations.forEach((transformation: any, i: number) => {
            if (transformation.beforeImage) {
              images.push({
                src: transformation.beforeImage,
                priority: priority - i,
                component: `${component.type}-${component.id}-before-${i}`
              });
            }
            if (transformation.afterImage) {
              images.push({
                src: transformation.afterImage,
                priority: priority - i,
                component: `${component.type}-${component.id}-after-${i}`
              });
            }
          });
        }
        break;
        
      case 'brands':
      case 'media':
        if (component.content?.brands) {
          component.content.brands.forEach((brand: any, i: number) => {
            if (brand.logo) {
              images.push({
                src: brand.logo,
                priority: Math.max(1, priority - i), // Ensure minimum priority of 1
                component: `${component.type}-${component.id}-${i}`
              });
            }
          });
        }
        if (component.content?.mediaFeatures) {
          component.content.mediaFeatures.forEach((media: any, i: number) => {
            if (media.logo) {
              images.push({
                src: media.logo,
                priority: Math.max(1, priority - i),
                component: `${component.type}-${component.id}-${i}`
              });
            }
          });
        }
        break;
        
      default:
        // Generic image extraction for any component with image content
        if (component.content?.image) {
          images.push({
            src: component.content.image,
            priority: priority,
            component: `${component.type}-${component.id}`
          });
        }
        break;
    }
  });
  
  // Filter out non-external images and duplicates
  const externalImages = images.filter(img => 
    img.src && (img.src.startsWith('http') || img.src.startsWith('https'))
  );
  
  // Remove duplicates based on src
  const uniqueImages = externalImages.reduce((acc, current) => {
    const existing = acc.find(img => img.src === current.src);
    if (!existing) {
      acc.push(current);
    } else if (current.priority > existing.priority) {
      // Keep the higher priority version
      existing.priority = current.priority;
    }
    return acc;
  }, [] as ImageSource[]);
  
  // Sort by priority (highest first)
  return uniqueImages.sort((a, b) => b.priority - a.priority);
}

/**
 * Preload template images with intelligent batching
 */
export async function preloadTemplateImages(
  components: Component[],
  options: {
    batchSize?: number;
    delayBetweenBatches?: number;
    onProgress?: (loaded: number, total: number) => void;
  } = {}
): Promise<void> {
  const {
    batchSize = 1, // Single image at a time to prevent rate limiting
    delayBetweenBatches = 800, // Conservative 800ms delay between images
    onProgress
  } = options;
  
  const imageSources = extractImageSources(components);
  
  if (imageSources.length === 0) {
    onProgress?.(0, 0);
    return;
  }
  
  // Limit to first 10 images to prevent overwhelming the system
  const limitedSources = imageSources.slice(0, 10);
  
  console.log(`Preloading ${limitedSources.length} template images (limited from ${imageSources.length})`);
  
  let loadedCount = 0;
  
  // Use batch loading with rate limiting protection
  const imageUrls = limitedSources.map(source => source.src);
  const result = await loadImagesInBatch(imageUrls, {
    batchSize,
    delayBetweenBatches,
    onProgress
  });
  
  loadedCount = result.loaded;
  
  console.log(`Template image preloading completed: ${loadedCount}/${limitedSources.length} images processed`);
}

/**
 * Preload critical images immediately (above-the-fold content)
 */
export async function preloadCriticalImages(components: Component[]): Promise<void> {
  const imageSources = extractImageSources(components);
  const criticalImages = imageSources.filter(img => img.priority >= 8);
  
  if (criticalImages.length === 0) return;
  
  console.log(`Preloading ${criticalImages.length} critical template images`);
  
  const imageUrls = criticalImages.map(source => source.src);
  await loadImagesInBatch(imageUrls, {
    batchSize: 2, // Allow 2 critical images at once
    delayBetweenBatches: 500 // Shorter delay for critical images
  });
}

/**
 * Get preloading statistics for debugging
 */
export function getPreloadingStats() {
  return {
    loadedCount: 0,
    failedCount: 0,
    queueLength: 0,
    isProcessing: false
  };
}
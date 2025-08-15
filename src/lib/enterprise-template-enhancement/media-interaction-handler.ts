/**
 * Media Interaction Handler
 * 
 * Handles interactive media features including video controls, image galleries,
 * zoom functionality, and dynamic media switching for enhanced user experiences.
 */

import type { Component } from '../types';
import type {
  MediaInteractionConfig,
  GalleryConfig
} from './interfaces';
import type {
  InteractiveMedia
} from './types';

/**
 * Media Interaction Handler Class
 * 
 * Provides comprehensive media interaction functionality including:
 * - Interactive video controls and playback
 * - Image galleries with navigation and zoom
 * - Dynamic media switching and lazy loading
 * - Responsive media optimization
 */
export class MediaInteractionHandler {
  private mediaId = 0;

  /**
   * Enhance media component with interactive features
   */
  async enhanceMedia(
    media: Component,
    config?: MediaInteractionConfig
  ): Promise<InteractiveMedia> {
    const interactiveMedia: InteractiveMedia = {
      ...media,
      id: media.id || ++this.mediaId,
      interactions: {
        zoom: config?.zoom !== false,
        gallery: config?.gallery !== false,
        controls: config?.controls !== false,
        autoplay: config?.autoplay === true
      }
    };

    // Add interactive media metadata
    interactiveMedia.metadata = {
      ...media.metadata,
      enhanced: true,
      mediaType: this.determineMediaType(media),
      interactionScript: this.generateInteractionScript(interactiveMedia),
      zoomScript: config?.zoom ? this.generateZoomScript(interactiveMedia) : '',
      galleryScript: config?.gallery ? this.generateGalleryScript(interactiveMedia) : '',
      controlsScript: config?.controls ? this.generateControlsScript(interactiveMedia) : ''
    };

    return interactiveMedia;
  }

  /**
   * Create interactive gallery from media elements
   */
  async createGallery(
    mediaElements: Component[],
    config?: GalleryConfig
  ): Promise<Component> {
    const gallery: Component = {
      id: ++this.mediaId,
      type: 'gallery',
      content: {
        layout: config?.layout || 'grid',
        navigation: config?.navigation !== false,
        thumbnails: config?.thumbnails !== false,
        fullscreen: config?.fullscreen !== false,
        items: mediaElements
      },
      metadata: {
        enhanced: true,
        galleryConfig: config,
        galleryScript: this.generateFullGalleryScript(mediaElements, config)
      }
    };

    return gallery;
  }

  /**
   * Add video interaction features
   */
  async enhanceVideo(
    video: Component,
    config?: MediaInteractionConfig
  ): Promise<InteractiveMedia> {
    const interactiveVideo: InteractiveMedia = {
      ...video,
      id: video.id || ++this.mediaId,
      interactions: {
        zoom: false, // Not applicable for video
        gallery: false,
        controls: config?.controls !== false,
        autoplay: config?.autoplay === true
      }
    };

    interactiveVideo.metadata = {
      ...video.metadata,
      enhanced: true,
      mediaType: 'video',
      videoScript: this.generateVideoScript(interactiveVideo, config)
    };

    return interactiveVideo;
  }

  /**
   * Add image interaction features
   */
  async enhanceImage(
    image: Component,
    config?: MediaInteractionConfig
  ): Promise<InteractiveMedia> {
    const interactiveImage: InteractiveMedia = {
      ...image,
      id: image.id || ++this.mediaId,
      interactions: {
        zoom: config?.zoom !== false,
        gallery: config?.gallery !== false,
        controls: false, // Not applicable for images
        autoplay: false
      }
    };

    interactiveImage.metadata = {
      ...image.metadata,
      enhanced: true,
      mediaType: 'image',
      imageScript: this.generateImageScript(interactiveImage, config)
    };

    return interactiveImage;
  }

  /**
   * Determine media type from component
   */
  private determineMediaType(media: Component): string {
    if (media.type === 'video') {
      return 'video';
    }
    
    if (media.type === 'image') {
      return 'image';
    }
    
    // Check content for media type hints
    if (media.content && typeof media.content === 'object') {
      const contentStr = JSON.stringify(media.content).toLowerCase();
      if (contentStr.includes('video') || contentStr.includes('.mp4') || contentStr.includes('.webm')) {
        return 'video';
      }
      if (contentStr.includes('image') || contentStr.includes('.jpg') || contentStr.includes('.png') || contentStr.includes('.webp')) {
        return 'image';
      }
      if (contentStr.includes('audio') || contentStr.includes('.mp3') || contentStr.includes('.wav')) {
        return 'audio';
      }
    }
    
    return 'mixed';
  }

  /**
   * Generate general interaction script
   */
  private generateInteractionScript(media: InteractiveMedia): string {
    return `
      // Media Interaction Controller
      class MediaInteractionController {
        constructor(mediaId) {
          this.media = document.getElementById(mediaId);
          this.interactions = ${JSON.stringify(media.interactions)};
          this.init();
        }

        init() {
          if (!this.media) return;

          if (this.interactions.zoom) {
            this.initZoom();
          }

          if (this.interactions.controls) {
            this.initCustomControls();
          }

          this.initLazyLoading();
          this.initResponsiveHandling();
        }

        initZoom() {
          if (this.media.tagName === 'IMG') {
            this.media.style.cursor = 'zoom-in';
            this.media.addEventListener('click', () => this.openZoom());
          }
        }

        openZoom() {
          const overlay = this.createZoomOverlay();
          const zoomedImage = this.media.cloneNode(true);
          
          zoomedImage.style.cssText = \`
            max-width: 90vw;
            max-height: 90vh;
            object-fit: contain;
            cursor: zoom-out;
          \`;

          zoomedImage.addEventListener('click', () => overlay.remove());
          overlay.appendChild(zoomedImage);
          document.body.appendChild(overlay);
        }

        createZoomOverlay() {
          const overlay = document.createElement('div');
          overlay.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: zoom-out;
          \`;

          overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
              overlay.remove();
            }
          });

          return overlay;
        }

        initCustomControls() {
          if (this.media.tagName === 'VIDEO') {
            this.createVideoControls();
          }
        }

        createVideoControls() {
          const controlsContainer = document.createElement('div');
          controlsContainer.className = 'custom-video-controls';
          controlsContainer.style.cssText = \`
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          \`;

          const playButton = this.createPlayButton();
          const progressBar = this.createProgressBar();
          const volumeControl = this.createVolumeControl();
          const fullscreenButton = this.createFullscreenButton();

          controlsContainer.appendChild(playButton);
          controlsContainer.appendChild(progressBar);
          controlsContainer.appendChild(volumeControl);
          controlsContainer.appendChild(fullscreenButton);

          this.media.parentNode.style.position = 'relative';
          this.media.parentNode.appendChild(controlsContainer);
        }

        createPlayButton() {
          const button = document.createElement('button');
          button.innerHTML = '▶️';
          button.style.cssText = 'background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;';
          
          button.addEventListener('click', () => {
            if (this.media.paused) {
              this.media.play();
              button.innerHTML = '⏸️';
            } else {
              this.media.pause();
              button.innerHTML = '▶️';
            }
          });

          return button;
        }

        createProgressBar() {
          const container = document.createElement('div');
          container.style.cssText = 'flex: 1; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; cursor: pointer;';

          const progress = document.createElement('div');
          progress.style.cssText = 'height: 100%; background: #4299e1; border-radius: 2px; width: 0%; transition: width 0.1s;';

          container.appendChild(progress);

          this.media.addEventListener('timeupdate', () => {
            const percentage = (this.media.currentTime / this.media.duration) * 100;
            progress.style.width = percentage + '%';
          });

          container.addEventListener('click', (e) => {
            const rect = container.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            this.media.currentTime = percentage * this.media.duration;
          });

          return container;
        }

        createVolumeControl() {
          const container = document.createElement('div');
          container.style.cssText = 'display: flex; align-items: center; gap: 0.5rem;';

          const volumeButton = document.createElement('button');
          volumeButton.innerHTML = '🔊';
          volumeButton.style.cssText = 'background: none; border: none; color: white; cursor: pointer;';

          const volumeSlider = document.createElement('input');
          volumeSlider.type = 'range';
          volumeSlider.min = '0';
          volumeSlider.max = '1';
          volumeSlider.step = '0.1';
          volumeSlider.value = '1';
          volumeSlider.style.cssText = 'width: 60px;';

          volumeSlider.addEventListener('input', () => {
            this.media.volume = volumeSlider.value;
            volumeButton.innerHTML = volumeSlider.value == 0 ? '🔇' : '🔊';
          });

          volumeButton.addEventListener('click', () => {
            if (this.media.volume > 0) {
              this.media.volume = 0;
              volumeSlider.value = '0';
              volumeButton.innerHTML = '🔇';
            } else {
              this.media.volume = 1;
              volumeSlider.value = '1';
              volumeButton.innerHTML = '🔊';
            }
          });

          container.appendChild(volumeButton);
          container.appendChild(volumeSlider);

          return container;
        }

        createFullscreenButton() {
          const button = document.createElement('button');
          button.innerHTML = '⛶';
          button.style.cssText = 'background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;';

          button.addEventListener('click', () => {
            if (this.media.requestFullscreen) {
              this.media.requestFullscreen();
            }
          });

          return button;
        }

        initLazyLoading() {
          if (this.media.tagName === 'IMG' && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                  }
                  observer.unobserve(img);
                }
              });
            });

            observer.observe(this.media);
          }
        }

        initResponsiveHandling() {
          const handleResize = () => {
            if (window.innerWidth <= 768) {
              this.applyMobileOptimizations();
            } else {
              this.applyDesktopOptimizations();
            }
          };

          window.addEventListener('resize', handleResize);
          handleResize(); // Initial call
        }

        applyMobileOptimizations() {
          if (this.media.tagName === 'VIDEO') {
            this.media.controls = true; // Use native controls on mobile
            
            // Hide custom controls on mobile
            const customControls = this.media.parentNode.querySelector('.custom-video-controls');
            if (customControls) {
              customControls.style.display = 'none';
            }
          }
        }

        applyDesktopOptimizations() {
          if (this.media.tagName === 'VIDEO') {
            this.media.controls = false; // Use custom controls on desktop
            
            // Show custom controls on desktop
            const customControls = this.media.parentNode.querySelector('.custom-video-controls');
            if (customControls) {
              customControls.style.display = 'flex';
            }
          }
        }
      }

      // Initialize media interaction controller
      document.addEventListener('DOMContentLoaded', () => {
        new MediaInteractionController('${media.id}');
      });
    `;
  }

  /**
   * Generate zoom-specific script
   */
  private generateZoomScript(media: InteractiveMedia): string {
    return `
      // Advanced Image Zoom Controller
      class ImageZoomController {
        constructor(imageId) {
          this.image = document.getElementById(imageId);
          this.zoomLevel = 1;
          this.maxZoom = 3;
          this.init();
        }

        init() {
          if (!this.image || this.image.tagName !== 'IMG') return;

          this.image.style.cursor = 'zoom-in';
          this.image.addEventListener('click', () => this.toggleZoom());
          this.image.addEventListener('wheel', (e) => this.handleWheel(e));
        }

        toggleZoom() {
          if (this.zoomLevel === 1) {
            this.zoomIn();
          } else {
            this.zoomOut();
          }
        }

        zoomIn() {
          this.zoomLevel = 2;
          this.image.style.transform = 'scale(2)';
          this.image.style.cursor = 'zoom-out';
          this.image.style.transition = 'transform 0.3s ease';
          
          // Add pan functionality
          this.addPanHandlers();
        }

        zoomOut() {
          this.zoomLevel = 1;
          this.image.style.transform = 'scale(1)';
          this.image.style.cursor = 'zoom-in';
          
          // Remove pan functionality
          this.removePanHandlers();
        }

        handleWheel(event) {
          event.preventDefault();
          
          const delta = event.deltaY > 0 ? -0.1 : 0.1;
          this.zoomLevel = Math.max(1, Math.min(this.maxZoom, this.zoomLevel + delta));
          
          this.image.style.transform = \`scale(\${this.zoomLevel})\`;
          this.image.style.cursor = this.zoomLevel > 1 ? 'zoom-out' : 'zoom-in';
        }

        addPanHandlers() {
          let isDragging = false;
          let startX, startY, translateX = 0, translateY = 0;

          const handleMouseDown = (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            this.image.style.cursor = 'grabbing';
          };

          const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            
            this.image.style.transform = \`scale(\${this.zoomLevel}) translate(\${translateX}px, \${translateY}px)\`;
          };

          const handleMouseUp = () => {
            isDragging = false;
            this.image.style.cursor = 'zoom-out';
          };

          this.image.addEventListener('mousedown', handleMouseDown);
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);

          // Store handlers for cleanup
          this.panHandlers = { handleMouseDown, handleMouseMove, handleMouseUp };
        }

        removePanHandlers() {
          if (this.panHandlers) {
            this.image.removeEventListener('mousedown', this.panHandlers.handleMouseDown);
            document.removeEventListener('mousemove', this.panHandlers.handleMouseMove);
            document.removeEventListener('mouseup', this.panHandlers.handleMouseUp);
          }
        }
      }

      // Initialize image zoom controller
      document.addEventListener('DOMContentLoaded', () => {
        new ImageZoomController('${media.id}');
      });
    `;
  }

  /**
   * Generate gallery-specific script
   */
  private generateGalleryScript(media: InteractiveMedia): string {
    return `
      // Gallery Integration Controller
      class GalleryIntegrationController {
        constructor(mediaId) {
          this.media = document.getElementById(mediaId);
          this.init();
        }

        init() {
          if (!this.media) return;

          // Add gallery integration if media is part of a gallery
          this.addToGallery();
        }

        addToGallery() {
          const galleryContainer = this.media.closest('.gallery-container');
          if (!galleryContainer) return;

          this.media.addEventListener('click', () => {
            this.openInGalleryModal();
          });
        }

        openInGalleryModal() {
          const modal = this.createGalleryModal();
          document.body.appendChild(modal);
        }

        createGalleryModal() {
          const modal = document.createElement('div');
          modal.className = 'gallery-modal';
          modal.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          \`;

          const content = document.createElement('div');
          content.style.cssText = \`
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
          \`;

          const image = this.media.cloneNode(true);
          image.style.cssText = \`
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          \`;

          const closeButton = document.createElement('button');
          closeButton.innerHTML = '×';
          closeButton.style.cssText = \`
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
          \`;

          closeButton.addEventListener('click', () => modal.remove());
          modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
          });

          content.appendChild(image);
          content.appendChild(closeButton);
          modal.appendChild(content);

          return modal;
        }
      }

      // Initialize gallery integration controller
      document.addEventListener('DOMContentLoaded', () => {
        new GalleryIntegrationController('${media.id}');
      });
    `;
  }

  /**
   * Generate controls-specific script
   */
  private generateControlsScript(media: InteractiveMedia): string {
    return `
      // Media Controls Controller
      class MediaControlsController {
        constructor(mediaId) {
          this.media = document.getElementById(mediaId);
          this.init();
        }

        init() {
          if (!this.media) return;

          if (this.media.tagName === 'VIDEO') {
            this.initVideoControls();
          } else if (this.media.tagName === 'AUDIO') {
            this.initAudioControls();
          }
        }

        initVideoControls() {
          // Hide default controls
          this.media.controls = false;
          
          // Create custom control overlay
          this.createControlOverlay();
        }

        initAudioControls() {
          // Create custom audio controls
          this.createAudioControls();
        }

        createControlOverlay() {
          const overlay = document.createElement('div');
          overlay.className = 'video-control-overlay';
          overlay.style.cssText = \`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            cursor: pointer;
          \`;

          const playButton = document.createElement('div');
          playButton.innerHTML = '▶️';
          playButton.style.cssText = \`
            font-size: 4rem;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          \`;

          overlay.appendChild(playButton);

          // Show overlay on hover
          this.media.parentNode.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
          });

          this.media.parentNode.addEventListener('mouseleave', () => {
            if (this.media.paused) {
              overlay.style.opacity = '1';
            } else {
              overlay.style.opacity = '0';
            }
          });

          // Play/pause on click
          overlay.addEventListener('click', () => {
            if (this.media.paused) {
              this.media.play();
              playButton.innerHTML = '⏸️';
            } else {
              this.media.pause();
              playButton.innerHTML = '▶️';
            }
          });

          this.media.parentNode.style.position = 'relative';
          this.media.parentNode.appendChild(overlay);
        }

        createAudioControls() {
          const controls = document.createElement('div');
          controls.className = 'custom-audio-controls';
          controls.style.cssText = \`
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: #f7fafc;
            border-radius: 0.5rem;
            margin-top: 0.5rem;
          \`;

          const playButton = document.createElement('button');
          playButton.innerHTML = '▶️';
          playButton.style.cssText = 'background: #4299e1; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer;';

          const progressContainer = document.createElement('div');
          progressContainer.style.cssText = 'flex: 1; height: 4px; background: #e2e8f0; border-radius: 2px; cursor: pointer;';

          const progress = document.createElement('div');
          progress.style.cssText = 'height: 100%; background: #4299e1; border-radius: 2px; width: 0%; transition: width 0.1s;';

          progressContainer.appendChild(progress);

          const timeDisplay = document.createElement('span');
          timeDisplay.style.cssText = 'font-size: 0.875rem; color: #4a5568; min-width: 80px;';
          timeDisplay.textContent = '0:00 / 0:00';

          playButton.addEventListener('click', () => {
            if (this.media.paused) {
              this.media.play();
              playButton.innerHTML = '⏸️';
            } else {
              this.media.pause();
              playButton.innerHTML = '▶️';
            }
          });

          this.media.addEventListener('timeupdate', () => {
            const percentage = (this.media.currentTime / this.media.duration) * 100;
            progress.style.width = percentage + '%';
            
            const current = this.formatTime(this.media.currentTime);
            const total = this.formatTime(this.media.duration);
            timeDisplay.textContent = \`\${current} / \${total}\`;
          });

          progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            this.media.currentTime = percentage * this.media.duration;
          });

          controls.appendChild(playButton);
          controls.appendChild(progressContainer);
          controls.appendChild(timeDisplay);

          this.media.parentNode.appendChild(controls);
        }

        formatTime(seconds) {
          const minutes = Math.floor(seconds / 60);
          const remainingSeconds = Math.floor(seconds % 60);
          return \`\${minutes}:\${remainingSeconds.toString().padStart(2, '0')}\`;
        }
      }

      // Initialize media controls controller
      document.addEventListener('DOMContentLoaded', () => {
        new MediaControlsController('${media.id}');
      });
    `;
  }

  /**
   * Generate video-specific script
   */
  private generateVideoScript(video: InteractiveMedia, config?: MediaInteractionConfig): string {
    return `
      // Video Enhancement Controller
      class VideoEnhancementController {
        constructor(videoId) {
          this.video = document.getElementById(videoId);
          this.config = ${JSON.stringify(config || {})};
          this.init();
        }

        init() {
          if (!this.video || this.video.tagName !== 'VIDEO') return;

          this.setupVideoFeatures();
          this.addVideoAnalytics();
        }

        setupVideoFeatures() {
          // Auto-play handling
          if (this.config.autoplay) {
            this.video.muted = true; // Required for autoplay
            this.video.autoplay = true;
          }

          // Add captions support
          if (this.config.captions) {
            this.addCaptionsSupport();
          }

          // Add quality selector
          this.addQualitySelector();
        }

        addCaptionsSupport() {
          // This would integrate with caption files
          const captionsButton = document.createElement('button');
          captionsButton.innerHTML = 'CC';
          captionsButton.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 0.5rem; border-radius: 0.25rem;';
          
          this.video.parentNode.appendChild(captionsButton);
        }

        addQualitySelector() {
          // This would integrate with multiple video sources
          const qualitySelector = document.createElement('select');
          qualitySelector.style.cssText = 'position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; border: none; padding: 0.25rem; border-radius: 0.25rem;';
          
          const qualities = ['Auto', '1080p', '720p', '480p'];
          qualities.forEach(quality => {
            const option = document.createElement('option');
            option.value = quality.toLowerCase();
            option.textContent = quality;
            qualitySelector.appendChild(option);
          });

          this.video.parentNode.appendChild(qualitySelector);
        }

        addVideoAnalytics() {
          let watchTime = 0;
          let lastTime = 0;

          this.video.addEventListener('timeupdate', () => {
            const currentTime = this.video.currentTime;
            if (currentTime > lastTime) {
              watchTime += currentTime - lastTime;
            }
            lastTime = currentTime;
          });

          this.video.addEventListener('ended', () => {
            // Track video completion
            this.trackVideoEvent('video_completed', {
              watchTime: watchTime,
              duration: this.video.duration,
              completionRate: (watchTime / this.video.duration) * 100
            });
          });

          // Track video milestones
          const milestones = [0.25, 0.5, 0.75];
          const trackedMilestones = new Set();

          this.video.addEventListener('timeupdate', () => {
            const progress = this.video.currentTime / this.video.duration;
            
            milestones.forEach(milestone => {
              if (progress >= milestone && !trackedMilestones.has(milestone)) {
                trackedMilestones.add(milestone);
                this.trackVideoEvent('video_milestone', {
                  milestone: milestone * 100 + '%',
                  currentTime: this.video.currentTime
                });
              }
            });
          });
        }

        trackVideoEvent(eventName, data) {
          // This would integrate with analytics system
          console.log('Video Event:', eventName, data);
          
          // Example: Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
          }
        }
      }

      // Initialize video enhancement controller
      document.addEventListener('DOMContentLoaded', () => {
        new VideoEnhancementController('${video.id}');
      });
    `;
  }

  /**
   * Generate image-specific script
   */
  private generateImageScript(image: InteractiveMedia, config?: MediaInteractionConfig): string {
    return `
      // Image Enhancement Controller
      class ImageEnhancementController {
        constructor(imageId) {
          this.image = document.getElementById(imageId);
          this.config = ${JSON.stringify(config || {})};
          this.init();
        }

        init() {
          if (!this.image || this.image.tagName !== 'IMG') return;

          this.setupImageFeatures();
          this.addImageAnalytics();
        }

        setupImageFeatures() {
          // Lazy loading
          this.setupLazyLoading();
          
          // Progressive loading
          this.setupProgressiveLoading();
          
          // Error handling
          this.setupErrorHandling();
        }

        setupLazyLoading() {
          if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  this.loadImage();
                  observer.unobserve(this.image);
                }
              });
            }, { threshold: 0.1 });

            observer.observe(this.image);
          } else {
            // Fallback for older browsers
            this.loadImage();
          }
        }

        setupProgressiveLoading() {
          // Load low-quality placeholder first
          if (this.image.dataset.placeholder) {
            this.image.src = this.image.dataset.placeholder;
            this.image.style.filter = 'blur(5px)';
            
            // Load high-quality image
            const highQualityImage = new Image();
            highQualityImage.onload = () => {
              this.image.src = highQualityImage.src;
              this.image.style.filter = 'none';
              this.image.style.transition = 'filter 0.3s ease';
            };
            highQualityImage.src = this.image.dataset.src || this.image.src;
          }
        }

        setupErrorHandling() {
          this.image.addEventListener('error', () => {
            // Show fallback image
            if (this.image.dataset.fallback) {
              this.image.src = this.image.dataset.fallback;
            } else {
              this.image.src = '/placeholder-image.jpg';
            }
            
            this.image.alt = 'Image could not be loaded';
          });
        }

        loadImage() {
          if (this.image.dataset.src) {
            this.image.src = this.image.dataset.src;
            this.image.removeAttribute('data-src');
          }
        }

        addImageAnalytics() {
          // Track image load time
          const startTime = performance.now();
          
          this.image.addEventListener('load', () => {
            const loadTime = performance.now() - startTime;
            this.trackImageEvent('image_loaded', {
              loadTime: loadTime,
              imageSize: this.getImageSize()
            });
          });

          // Track image interactions
          this.image.addEventListener('click', () => {
            this.trackImageEvent('image_clicked', {
              imageUrl: this.image.src,
              altText: this.image.alt
            });
          });
        }

        getImageSize() {
          return {
            naturalWidth: this.image.naturalWidth,
            naturalHeight: this.image.naturalHeight,
            displayWidth: this.image.width,
            displayHeight: this.image.height
          };
        }

        trackImageEvent(eventName, data) {
          // This would integrate with analytics system
          console.log('Image Event:', eventName, data);
          
          // Example: Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
          }
        }
      }

      // Initialize image enhancement controller
      document.addEventListener('DOMContentLoaded', () => {
        new ImageEnhancementController('${image.id}');
      });
    `;
  }

  /**
   * Generate full gallery script
   */
  private generateFullGalleryScript(mediaElements: Component[], config?: GalleryConfig): string {
    return `
      // Interactive Gallery Controller
      class InteractiveGalleryController {
        constructor(galleryId) {
          this.gallery = document.getElementById(galleryId);
          this.config = ${JSON.stringify(config || {})};
          this.mediaElements = ${JSON.stringify(mediaElements)};
          this.currentIndex = 0;
          this.init();
        }

        init() {
          if (!this.gallery) return;

          this.createGalleryStructure();
          this.setupNavigation();
          this.setupKeyboardControls();
          this.setupTouchControls();
        }

        createGalleryStructure() {
          this.gallery.className = 'interactive-gallery';
          this.gallery.style.cssText = \`
            position: relative;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            padding: 1rem;
          \`;

          if (this.config.layout === 'carousel') {
            this.createCarouselLayout();
          } else if (this.config.layout === 'masonry') {
            this.createMasonryLayout();
          } else {
            this.createGridLayout();
          }
        }

        createGridLayout() {
          this.mediaElements.forEach((media, index) => {
            const item = this.createGalleryItem(media, index);
            this.gallery.appendChild(item);
          });
        }

        createCarouselLayout() {
          this.gallery.style.cssText = \`
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 400px;
          \`;

          const track = document.createElement('div');
          track.className = 'carousel-track';
          track.style.cssText = \`
            display: flex;
            transition: transform 0.3s ease;
            height: 100%;
          \`;

          this.mediaElements.forEach((media, index) => {
            const item = this.createCarouselItem(media, index);
            track.appendChild(item);
          });

          this.gallery.appendChild(track);
          this.createCarouselControls();
        }

        createMasonryLayout() {
          // Implement masonry layout
          this.gallery.style.cssText = \`
            column-count: auto;
            column-width: 250px;
            column-gap: 1rem;
            padding: 1rem;
          \`;

          this.mediaElements.forEach((media, index) => {
            const item = this.createMasonryItem(media, index);
            this.gallery.appendChild(item);
          });
        }

        createGalleryItem(media, index) {
          const item = document.createElement('div');
          item.className = 'gallery-item';
          item.style.cssText = \`
            position: relative;
            cursor: pointer;
            border-radius: 0.5rem;
            overflow: hidden;
            transition: transform 0.2s ease;
          \`;

          item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
          });

          item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
          });

          const mediaElement = this.createMediaElement(media);
          const overlay = this.createItemOverlay(media, index);

          item.appendChild(mediaElement);
          item.appendChild(overlay);

          item.addEventListener('click', () => this.openLightbox(index));

          return item;
        }

        createCarouselItem(media, index) {
          const item = document.createElement('div');
          item.className = 'carousel-item';
          item.style.cssText = \`
            flex: 0 0 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          \`;

          const mediaElement = this.createMediaElement(media);
          mediaElement.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';
          
          item.appendChild(mediaElement);
          return item;
        }

        createMasonryItem(media, index) {
          const item = document.createElement('div');
          item.className = 'masonry-item';
          item.style.cssText = \`
            break-inside: avoid;
            margin-bottom: 1rem;
            cursor: pointer;
            border-radius: 0.5rem;
            overflow: hidden;
          \`;

          const mediaElement = this.createMediaElement(media);
          item.appendChild(mediaElement);

          item.addEventListener('click', () => this.openLightbox(index));

          return item;
        }

        createMediaElement(media) {
          if (media.type === 'image') {
            const img = document.createElement('img');
            img.src = media.src || media.content;
            img.alt = media.alt || '';
            img.style.cssText = 'width: 100%; height: auto; display: block;';
            return img;
          } else if (media.type === 'video') {
            const video = document.createElement('video');
            video.src = media.src || media.content;
            video.style.cssText = 'width: 100%; height: auto; display: block;';
            video.muted = true;
            return video;
          }
          
          return document.createElement('div');
        }

        createItemOverlay(media, index) {
          const overlay = document.createElement('div');
          overlay.className = 'gallery-overlay';
          overlay.style.cssText = \`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
            color: white;
            font-size: 1.5rem;
          \`;

          overlay.innerHTML = '🔍';

          return overlay;
        }

        createCarouselControls() {
          const prevButton = document.createElement('button');
          prevButton.innerHTML = '❮';
          prevButton.style.cssText = \`
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            border-radius: 50%;
          \`;

          const nextButton = document.createElement('button');
          nextButton.innerHTML = '❯';
          nextButton.style.cssText = \`
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.5);
            color: white;
            border: none;
            padding: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            border-radius: 50%;
          \`;

          prevButton.addEventListener('click', () => this.previousSlide());
          nextButton.addEventListener('click', () => this.nextSlide());

          this.gallery.appendChild(prevButton);
          this.gallery.appendChild(nextButton);

          // Create indicators
          if (this.config.thumbnails) {
            this.createThumbnailIndicators();
          }
        }

        createThumbnailIndicators() {
          const indicators = document.createElement('div');
          indicators.className = 'carousel-indicators';
          indicators.style.cssText = \`
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 0.5rem;
          \`;

          this.mediaElements.forEach((media, index) => {
            const indicator = document.createElement('button');
            indicator.style.cssText = \`
              width: 60px;
              height: 40px;
              border: 2px solid white;
              border-radius: 0.25rem;
              overflow: hidden;
              cursor: pointer;
              opacity: 0.7;
            \`;

            const thumbnail = this.createMediaElement(media);
            thumbnail.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
            
            indicator.appendChild(thumbnail);
            indicator.addEventListener('click', () => this.goToSlide(index));
            
            indicators.appendChild(indicator);
          });

          this.gallery.appendChild(indicators);
        }

        setupNavigation() {
          if (this.config.navigation === false) return;

          // Add hover effects to show overlays
          const items = this.gallery.querySelectorAll('.gallery-item');
          items.forEach(item => {
            const overlay = item.querySelector('.gallery-overlay');
            if (overlay) {
              item.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
              });
              
              item.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
              });
            }
          });
        }

        setupKeyboardControls() {
          document.addEventListener('keydown', (e) => {
            if (this.lightboxOpen) {
              switch (e.key) {
                case 'ArrowLeft':
                  this.previousImage();
                  break;
                case 'ArrowRight':
                  this.nextImage();
                  break;
                case 'Escape':
                  this.closeLightbox();
                  break;
              }
            }
          });
        }

        setupTouchControls() {
          let startX = 0;
          let startY = 0;

          this.gallery.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
          });

          this.gallery.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
              if (deltaX > 0) {
                this.previousSlide();
              } else {
                this.nextSlide();
              }
            }
          });
        }

        openLightbox(index) {
          this.currentIndex = index;
          this.lightboxOpen = true;

          const lightbox = this.createLightbox();
          document.body.appendChild(lightbox);
          this.showLightboxImage(index);
        }

        createLightbox() {
          const lightbox = document.createElement('div');
          lightbox.className = 'gallery-lightbox';
          lightbox.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
          \`;

          const content = document.createElement('div');
          content.className = 'lightbox-content';
          content.style.cssText = \`
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
          \`;

          const closeButton = document.createElement('button');
          closeButton.innerHTML = '×';
          closeButton.style.cssText = \`
            position: absolute;
            top: -50px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 3rem;
            cursor: pointer;
            z-index: 10001;
          \`;

          const prevButton = document.createElement('button');
          prevButton.innerHTML = '❮';
          prevButton.style.cssText = \`
            position: absolute;
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 1rem;
            font-size: 2rem;
            cursor: pointer;
            border-radius: 50%;
          \`;

          const nextButton = document.createElement('button');
          nextButton.innerHTML = '❯';
          nextButton.style.cssText = \`
            position: absolute;
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            padding: 1rem;
            font-size: 2rem;
            cursor: pointer;
            border-radius: 50%;
          \`;

          closeButton.addEventListener('click', () => this.closeLightbox());
          prevButton.addEventListener('click', () => this.previousImage());
          nextButton.addEventListener('click', () => this.nextImage());

          lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) this.closeLightbox();
          });

          content.appendChild(closeButton);
          content.appendChild(prevButton);
          content.appendChild(nextButton);
          lightbox.appendChild(content);

          return lightbox;
        }

        showLightboxImage(index) {
          const lightbox = document.querySelector('.gallery-lightbox');
          const content = lightbox.querySelector('.lightbox-content');
          
          // Remove existing media
          const existingMedia = content.querySelector('.lightbox-media');
          if (existingMedia) {
            existingMedia.remove();
          }

          const media = this.mediaElements[index];
          const mediaElement = this.createMediaElement(media);
          mediaElement.className = 'lightbox-media';
          mediaElement.style.cssText = 'max-width: 100%; max-height: 100%; object-fit: contain;';

          content.appendChild(mediaElement);
        }

        closeLightbox() {
          const lightbox = document.querySelector('.gallery-lightbox');
          if (lightbox) {
            lightbox.remove();
          }
          this.lightboxOpen = false;
        }

        previousImage() {
          this.currentIndex = (this.currentIndex - 1 + this.mediaElements.length) % this.mediaElements.length;
          this.showLightboxImage(this.currentIndex);
        }

        nextImage() {
          this.currentIndex = (this.currentIndex + 1) % this.mediaElements.length;
          this.showLightboxImage(this.currentIndex);
        }

        previousSlide() {
          if (this.config.layout !== 'carousel') return;
          
          this.currentIndex = (this.currentIndex - 1 + this.mediaElements.length) % this.mediaElements.length;
          this.updateCarousel();
        }

        nextSlide() {
          if (this.config.layout !== 'carousel') return;
          
          this.currentIndex = (this.currentIndex + 1) % this.mediaElements.length;
          this.updateCarousel();
        }

        goToSlide(index) {
          this.currentIndex = index;
          this.updateCarousel();
        }

        updateCarousel() {
          const track = this.gallery.querySelector('.carousel-track');
          if (track) {
            track.style.transform = \`translateX(-\${this.currentIndex * 100}%)\`;
          }

          // Update indicators
          const indicators = this.gallery.querySelectorAll('.carousel-indicators button');
          indicators.forEach((indicator, index) => {
            indicator.style.opacity = index === this.currentIndex ? '1' : '0.7';
          });
        }
      }

      // Initialize interactive gallery controller
      document.addEventListener('DOMContentLoaded', () => {
        const galleries = document.querySelectorAll('.interactive-gallery');
        galleries.forEach(gallery => {
          new InteractiveGalleryController(gallery.id);
        });
      });
    `;
  }
}
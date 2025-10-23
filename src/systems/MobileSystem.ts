export class MobileSystem {
  private isMobile: boolean = false;
  private isIOS: boolean = false;
  private isAndroid: boolean = false;
  private hasTouch: boolean = false;
  private hapticEnabled: boolean = false;

  constructor() {
    this.detectDevice();
    this.initializeTouch();
  }

  private detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    
    this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    this.isIOS = /iphone|ipad|ipod/i.test(userAgent);
    this.isAndroid = /android/i.test(userAgent);
    this.hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Enable haptic feedback if available
    this.hapticEnabled = 'vibrate' in navigator;
  }

  private initializeTouch(): void {
    if (this.hasTouch) {
      // Prevent default touch behaviors that might interfere with the game
      document.addEventListener('touchstart', (e) => {
        if (e.target === document.body) {
          e.preventDefault();
        }
      }, { passive: false });
      
      document.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
          e.preventDefault();
        }
      }, { passive: false });
      
      document.addEventListener('touchend', (e) => {
        if (e.target === document.body) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }

  isMobileDevice(): boolean {
    return this.isMobile;
  }

  isIOSDevice(): boolean {
    return this.isIOS;
  }

  isAndroidDevice(): boolean {
    return this.isAndroid;
  }

  hasTouchSupport(): boolean {
    return this.hasTouch;
  }

  isHapticEnabled(): boolean {
    return this.hapticEnabled;
  }

  // Haptic feedback methods
  vibrate(pattern: number | number[]): void {
    if (this.hapticEnabled && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  lightVibrate(): void {
    this.vibrate(50);
  }

  mediumVibrate(): void {
    this.vibrate(100);
  }

  heavyVibrate(): void {
    this.vibrate([100, 50, 100]);
  }

  // Touch event handling
  getTouchPosition(event: TouchEvent): { x: number; y: number } | null {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      return {
        x: touch.clientX,
        y: touch.clientY
      };
    }
    return null;
  }

  // iOS-specific optimizations
  optimizeForIOS(): void {
    if (this.isIOS) {
      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Prevent scroll bounce
      document.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });

      // Hide address bar
      window.addEventListener('load', () => {
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 0);
      });
    }
  }

  // Android-specific optimizations
  optimizeForAndroid(): void {
    if (this.isAndroid) {
      // Prevent context menu on long press
      document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      // Optimize for Android WebView
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    }
  }

  // Get optimal canvas size for mobile
  getOptimalCanvasSize(): { width: number; height: number } {
    if (this.isMobile) {
      return {
        width: Math.min(window.innerWidth, 400),
        height: Math.min(window.innerHeight, 600)
      };
    }
    
    return {
      width: 800,
      height: 600
    };
  }

  // Check if device supports fullscreen
  supportsFullscreen(): boolean {
    return !!(document.fullscreenEnabled || 
              (document as any).webkitFullscreenEnabled || 
              (document as any).mozFullScreenEnabled || 
              (document as any).msFullscreenEnabled);
  }

  // Enter fullscreen mode
  enterFullscreen(): void {
    if (this.supportsFullscreen()) {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        (element as any).msRequestFullscreen();
      }
    }
  }

  // Exit fullscreen mode
  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  // Get device orientation
  getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // Check if device is in landscape mode
  isLandscape(): boolean {
    return this.getOrientation() === 'landscape';
  }

  // Check if device is in portrait mode
  isPortrait(): boolean {
    return this.getOrientation() === 'portrait';
  }

  // Get device pixel ratio for high DPI displays
  getPixelRatio(): number {
    return window.devicePixelRatio || 1;
  }

  // Optimize canvas for high DPI displays
  optimizeCanvasForDPI(canvas: HTMLCanvasElement): void {
    const pixelRatio = this.getPixelRatio();
    
    if (pixelRatio > 1) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * pixelRatio;
      canvas.height = rect.height * pixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(pixelRatio, pixelRatio);
      }
    }
  }
}

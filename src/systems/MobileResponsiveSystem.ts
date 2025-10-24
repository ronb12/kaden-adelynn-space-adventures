// Mobile Responsive System - Auto-adjust to any mobile screen size
export interface ScreenInfo {
  width: number;
  height: number;
  aspectRatio: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
}

export interface ResponsiveConfig {
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
  fontSize: number;
  touchTargetSize: number;
  gameSpeed: number;
  particleCount: number;
  maxEnemies: number;
  maxBullets: number;
}

export class MobileResponsiveSystem {
  private screenInfo: ScreenInfo;
  private config: ResponsiveConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    this.screenInfo = this.detectScreenInfo();
    this.config = this.calculateResponsiveConfig();
  }

  private detectScreenInfo(): ScreenInfo {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    const pixelRatio = window.devicePixelRatio || 1;

    // Detect device type
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (width <= 768) {
      deviceType = 'mobile';
    } else if (width <= 1024) {
      deviceType = 'tablet';
    }

    // Detect orientation
    const orientation: 'portrait' | 'landscape' = width > height ? 'landscape' : 'portrait';

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Detect platform
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent);

    return {
      width,
      height,
      aspectRatio,
      deviceType,
      orientation,
      pixelRatio,
      isTouchDevice,
      isIOS,
      isAndroid,
      isSafari,
      isChrome
    };
  }

  private calculateResponsiveConfig(): ResponsiveConfig {
    const { width, height, deviceType, orientation, pixelRatio } = this.screenInfo;

    // Base canvas dimensions
    let canvasWidth = 800;
    let canvasHeight = 600;
    let scale = 1;
    let fontSize = 16;
    let touchTargetSize = 40;
    let gameSpeed = 1;
    let particleCount = 100;
    let maxEnemies = 10;
    let maxBullets = 50;

    // Mobile adjustments
    if (deviceType === 'mobile') {
      if (orientation === 'portrait') {
        canvasWidth = Math.min(width - 20, 400);
        canvasHeight = Math.min(height - 100, 600);
        scale = canvasWidth / 800;
        fontSize = 14;
        touchTargetSize = 50;
        gameSpeed = 0.8;
        particleCount = 50;
        maxEnemies = 8;
        maxBullets = 30;
      } else {
        canvasWidth = Math.min(width - 20, 600);
        canvasHeight = Math.min(height - 20, 400);
        scale = canvasWidth / 800;
        fontSize = 16;
        touchTargetSize = 45;
        gameSpeed = 0.9;
        particleCount = 75;
        maxEnemies = 9;
        maxBullets = 40;
      }
    }
    // Tablet adjustments
    else if (deviceType === 'tablet') {
      if (orientation === 'portrait') {
        canvasWidth = Math.min(width - 40, 500);
        canvasHeight = Math.min(height - 100, 700);
        scale = canvasWidth / 800;
        fontSize = 16;
        touchTargetSize = 45;
        gameSpeed = 0.9;
        particleCount = 75;
        maxEnemies = 9;
        maxBullets = 40;
      } else {
        canvasWidth = Math.min(width - 40, 700);
        canvasHeight = Math.min(height - 40, 500);
        scale = canvasWidth / 800;
        fontSize = 18;
        touchTargetSize = 40;
        gameSpeed = 1;
        particleCount = 90;
        maxEnemies = 10;
        maxBullets = 45;
      }
    }
    // Desktop adjustments
    else {
      canvasWidth = Math.min(width - 40, 800);
      canvasHeight = Math.min(height - 40, 600);
      scale = 1;
      fontSize = 16;
      touchTargetSize = 40;
      gameSpeed = 1;
      particleCount = 100;
      maxEnemies = 10;
      maxBullets = 50;
    }

    // High DPI adjustments
    if (pixelRatio > 1) {
      canvasWidth *= pixelRatio;
      canvasHeight *= pixelRatio;
      fontSize *= pixelRatio;
      touchTargetSize *= pixelRatio;
    }

    return {
      canvasWidth,
      canvasHeight,
      scale,
      fontSize,
      touchTargetSize,
      gameSpeed,
      particleCount,
      maxEnemies,
      maxBullets
    };
  }

  // Initialize responsive canvas
  initializeCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    if (!this.ctx) return;

    // Set canvas size
    canvas.width = this.config.canvasWidth;
    canvas.height = this.config.canvasHeight;

    // Set display size
    canvas.style.width = `${this.config.canvasWidth / (this.screenInfo.pixelRatio || 1)}px`;
    canvas.style.height = `${this.config.canvasHeight / (this.screenInfo.pixelRatio || 1)}px`;

    // Set high DPI scaling
    if (this.screenInfo.pixelRatio > 1) {
      this.ctx.scale(this.screenInfo.pixelRatio, this.screenInfo.pixelRatio);
    }

    // Set font size
    this.ctx.font = `${this.config.fontSize}px Arial`;
  }

  // Get responsive configuration
  getConfig(): ResponsiveConfig {
    return this.config;
  }

  // Get screen information
  getScreenInfo(): ScreenInfo {
    return this.screenInfo;
  }

  // Update responsive settings
  updateResponsiveSettings(): void {
    this.screenInfo = this.detectScreenInfo();
    this.config = this.calculateResponsiveConfig();
    
    if (this.canvas) {
      this.initializeCanvas(this.canvas);
    }
  }

  // Handle orientation change
  handleOrientationChange(): void {
    setTimeout(() => {
      this.updateResponsiveSettings();
    }, 100);
  }

  // Get touch control positions
  getTouchControlPositions() {
    const { width, height } = this.screenInfo;
    const { touchTargetSize } = this.config;

    return {
      joystick: {
        x: touchTargetSize,
        y: height - touchTargetSize * 2,
        size: touchTargetSize * 2
      },
      shootButton: {
        x: width - touchTargetSize * 2,
        y: height - touchTargetSize * 2,
        size: touchTargetSize * 1.5
      },
      pauseButton: {
        x: width - touchTargetSize,
        y: touchTargetSize,
        size: touchTargetSize
      }
    };
  }

  // Get responsive game settings
  getGameSettings() {
    return {
      speed: this.config.gameSpeed,
      particleCount: this.config.particleCount,
      maxEnemies: this.config.maxEnemies,
      maxBullets: this.config.maxBullets,
      scale: this.config.scale,
      fontSize: this.config.fontSize,
      touchTargetSize: this.config.touchTargetSize
    };
  }

  // Check if device needs special handling
  needsSpecialHandling(): boolean {
    return this.screenInfo.isIOS || this.screenInfo.isAndroid || this.screenInfo.deviceType === 'mobile';
  }

  // Get optimal canvas size for device
  getOptimalCanvasSize(): { width: number; height: number } {
    const { width, height, deviceType, orientation } = this.screenInfo;

    if (deviceType === 'mobile') {
      if (orientation === 'portrait') {
        return {
          width: Math.min(width - 20, 400),
          height: Math.min(height - 100, 600)
        };
      } else {
        return {
          width: Math.min(width - 20, 600),
          height: Math.min(height - 20, 400)
        };
      }
    } else if (deviceType === 'tablet') {
      if (orientation === 'portrait') {
        return {
          width: Math.min(width - 40, 500),
          height: Math.min(height - 100, 700)
        };
      } else {
        return {
          width: Math.min(width - 40, 700),
          height: Math.min(height - 40, 500)
        };
      }
    } else {
      return {
        width: Math.min(width - 40, 800),
        height: Math.min(height - 40, 600)
      };
    }
  }

  // Apply responsive styles to canvas
  applyResponsiveStyles(canvas: HTMLCanvasElement): void {
    const { deviceType, orientation } = this.screenInfo;

    // Base styles
    canvas.style.position = 'relative';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.border = '2px solid #333';
    canvas.style.borderRadius = '8px';
    canvas.style.background = '#000';

    // Mobile specific styles
    if (deviceType === 'mobile') {
      canvas.style.maxWidth = '100%';
      canvas.style.maxHeight = '100vh';
      
      if (orientation === 'portrait') {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
      } else {
        canvas.style.width = '100%';
        canvas.style.height = '100vh';
      }
    }
    // Tablet specific styles
    else if (deviceType === 'tablet') {
      canvas.style.maxWidth = '90%';
      canvas.style.maxHeight = '90vh';
    }
    // Desktop styles
    else {
      canvas.style.maxWidth = '800px';
      canvas.style.maxHeight = '600px';
    }
  }

  // Get device-specific optimizations
  getDeviceOptimizations() {
    const optimizations = {
      reduceParticles: false,
      reduceEffects: false,
      simplifyGraphics: false,
      lowerFramerate: false,
      reduceAudio: false
    };

    // Mobile optimizations
    if (this.screenInfo.deviceType === 'mobile') {
      optimizations.reduceParticles = true;
      optimizations.reduceEffects = true;
      optimizations.simplifyGraphics = true;
    }

    // Low-end device optimizations
    if (this.screenInfo.pixelRatio < 1.5) {
      optimizations.lowerFramerate = true;
      optimizations.reduceAudio = true;
    }

    // iOS specific optimizations
    if (this.screenInfo.isIOS) {
      optimizations.reduceEffects = true;
    }

    return optimizations;
  }
}

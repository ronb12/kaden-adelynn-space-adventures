// Device Optimization System - iOS, Android, and Game Controller Support
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  platform: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown';
  hasTouch: boolean;
  hasGamepad: boolean;
  hasVibration: boolean;
  hasOrientation: boolean;
  isRetina: boolean;
  screenSize: {
    width: number;
    height: number;
    ratio: number;
  };
  capabilities: {
    webgl: boolean;
    webgl2: boolean;
    webAudio: boolean;
    fullscreen: boolean;
    pointerLock: boolean;
    gamepad: boolean;
    vibration: boolean;
    orientation: boolean;
  };
}

export class DeviceOptimization {
  private deviceInfo: DeviceInfo;
  private gamepadIndex: number = -1;
  private orientationLocked: boolean = false;
  
  constructor() {
    this.deviceInfo = this.detectDevice();
    this.optimizeForDevice();
    this.initializeGamepadSupport();
    this.initializeOrientationSupport();
  }
  
  private detectDevice(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Device type detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isWindows = /Windows/.test(platform);
    const isMacOS = /Mac/.test(platform);
    const isLinux = /Linux/.test(platform);
    
    // Browser detection
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
    const isFirefox = /Firefox/.test(userAgent);
    const isEdge = /Edge/.test(userAgent);
    
    // Capabilities detection
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const hasGamepad = 'getGamepads' in navigator;
    const hasVibration = 'vibrate' in navigator;
    const hasOrientation = 'orientation' in window;
    const isRetina = window.devicePixelRatio > 1;
    
    // Screen size
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const screenRatio = screenWidth / screenHeight;
    
    // WebGL support
    const canvas = document.createElement('canvas');
    const webgl = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    const webgl2 = !!canvas.getContext('webgl2');
    
    // Other capabilities
    const webAudio = !!(window.AudioContext || (window as any).webkitAudioContext);
    const fullscreen = !!(document.fullscreenEnabled || (document as any).webkitFullscreenEnabled);
    const pointerLock = 'pointerLockElement' in document;
    
    return {
      type: isMobile && !isTablet ? 'mobile' : isTablet ? 'tablet' : 'desktop',
      platform: isIOS ? 'ios' : isAndroid ? 'android' : isWindows ? 'windows' : isMacOS ? 'macos' : isLinux ? 'linux' : 'unknown',
      browser: isSafari ? 'safari' : isChrome ? 'chrome' : isFirefox ? 'firefox' : isEdge ? 'edge' : 'unknown',
      hasTouch,
      hasGamepad,
      hasVibration,
      hasOrientation,
      isRetina,
      screenSize: {
        width: screenWidth,
        height: screenHeight,
        ratio: screenRatio
      },
      capabilities: {
        webgl,
        webgl2,
        webAudio,
        fullscreen,
        pointerLock,
        gamepad: hasGamepad,
        vibration: hasVibration,
        orientation: hasOrientation
      }
    };
  }
  
  private optimizeForDevice() {
    // iOS specific optimizations
    if (this.deviceInfo.platform === 'ios') {
      this.optimizeForIOS();
    }
    
    // Android specific optimizations
    if (this.deviceInfo.platform === 'android') {
      this.optimizeForAndroid();
    }
    
    // Mobile optimizations
    if (this.deviceInfo.type === 'mobile') {
      this.optimizeForMobile();
    }
    
    // Tablet optimizations
    if (this.deviceInfo.type === 'tablet') {
      this.optimizeForTablet();
    }
  }
  
  private optimizeForIOS() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Prevent pull-to-refresh
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Optimize for iOS Safari
    if (this.deviceInfo.browser === 'safari') {
      // Prevent bounce scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
    
    // Add iOS-specific meta tags
    this.addIOSMetaTags();
  }
  
  private optimizeForAndroid() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
    
    // Prevent context menu
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Optimize for Chrome on Android
    if (this.deviceInfo.browser === 'chrome') {
      // Enable hardware acceleration
      document.body.style.transform = 'translateZ(0)';
      document.body.style.backfaceVisibility = 'hidden';
    }
  }
  
  private optimizeForMobile() {
    // Prevent default touch behaviors
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
    
    // Set viewport for mobile
    this.setMobileViewport();
  }
  
  private optimizeForTablet() {
    // Tablet-specific optimizations
    if (this.deviceInfo.hasOrientation) {
      this.handleOrientationChange();
    }
  }
  
  private addIOSMetaTags() {
    // Add iOS-specific meta tags if not already present
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (!existingViewport) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewport);
    }
    
    // Add iOS status bar styling
    const existingStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!existingStatusBar) {
      const statusBar = document.createElement('meta');
      statusBar.name = 'apple-mobile-web-app-status-bar-style';
      statusBar.content = 'black-translucent';
      document.head.appendChild(statusBar);
    }
    
    // Add iOS web app capabilities
    const existingWebApp = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (!existingWebApp) {
      const webApp = document.createElement('meta');
      webApp.name = 'apple-mobile-web-app-capable';
      webApp.content = 'yes';
      document.head.appendChild(webApp);
    }
  }
  
  private setMobileViewport() {
    const existingViewport = document.querySelector('meta[name="viewport"]');
    if (existingViewport) {
      existingViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    } else {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewport);
    }
  }
  
  private initializeGamepadSupport() {
    if (!this.deviceInfo.hasGamepad) return;
    
    // Gamepad connected
    window.addEventListener('gamepadconnected', (e) => {
      console.log('🎮 Gamepad connected:', e.gamepad.id);
      this.gamepadIndex = e.gamepad.index;
    });
    
    // Gamepad disconnected
    window.addEventListener('gamepaddisconnected', (e) => {
      console.log('🎮 Gamepad disconnected:', e.gamepad.id);
      this.gamepadIndex = -1;
    });
  }
  
  private initializeOrientationSupport() {
    if (!this.deviceInfo.hasOrientation) return;
    
    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });
    
    // Handle resize events
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }
  
  private handleOrientationChange() {
    // Lock orientation to landscape for better gameplay
    if (this.deviceInfo.type === 'mobile' || this.deviceInfo.type === 'tablet') {
      this.lockOrientation('landscape');
    }
  }
  
  private handleResize() {
    // Update screen size info
    this.deviceInfo.screenSize = {
      width: window.screen.width,
      height: window.screen.height,
      ratio: window.screen.width / window.screen.height
    };
  }
  
  private lockOrientation(orientation: 'portrait' | 'landscape') {
    if (!this.deviceInfo.hasOrientation) return;
    
    try {
      if (window.screen.orientation && window.screen.orientation.lock) {
        window.screen.orientation.lock(orientation);
        this.orientationLocked = true;
      }
    } catch (error) {
      console.log('Orientation lock not supported or failed:', error);
    }
  }
  
  // Public methods
  getDeviceInfo(): DeviceInfo {
    return { ...this.deviceInfo };
  }
  
  isGamepadConnected(): boolean {
    if (!this.deviceInfo.hasGamepad || this.gamepadIndex === -1) return false;
    
    const gamepads = navigator.getGamepads();
    return gamepads[this.gamepadIndex] !== null;
  }
  
  getGamepadState(): Gamepad | null {
    if (!this.isGamepadConnected()) return null;
    
    const gamepads = navigator.getGamepads();
    return gamepads[this.gamepadIndex];
  }
  
  vibrate(pattern: number | number[]): void {
    if (!this.deviceInfo.hasVibration) return;
    
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log('Vibration not supported:', error);
    }
  }
  
  requestFullscreen(): Promise<void> {
    if (!this.deviceInfo.capabilities.fullscreen) {
      return Promise.reject('Fullscreen not supported');
    }
    
    return new Promise((resolve, reject) => {
      const element = document.documentElement;
      const requestFullscreen = element.requestFullscreen || 
                                (element as any).webkitRequestFullscreen || 
                                (element as any).mozRequestFullScreen || 
                                (element as any).msRequestFullscreen;
      
      if (requestFullscreen) {
        requestFullscreen.call(element).then(resolve).catch(reject);
      } else {
        reject('Fullscreen not supported');
      }
    });
  }
  
  exitFullscreen(): Promise<void> {
    if (!this.deviceInfo.capabilities.fullscreen) {
      return Promise.reject('Fullscreen not supported');
    }
    
    return new Promise((resolve, reject) => {
      const exitFullscreen = document.exitFullscreen || 
                            (document as any).webkitExitFullscreen || 
                            (document as any).mozCancelFullScreen || 
                            (document as any).msExitFullscreen;
      
      if (exitFullscreen) {
        exitFullscreen.call(document).then(resolve).catch(reject);
      } else {
        reject('Fullscreen not supported');
      }
    });
  }
  
  getOptimalCanvasSize(): { width: number; height: number; scale: number } {
    const { width, height } = this.deviceInfo.screenSize;
    
    // Base resolution
    const baseWidth = 1920;
    const baseHeight = 1080;
    
    // Calculate scale based on device
    let scale = 1;
    if (this.deviceInfo.type === 'mobile') {
      scale = Math.min(width / baseWidth, height / baseHeight) * 0.8;
    } else if (this.deviceInfo.type === 'tablet') {
      scale = Math.min(width / baseWidth, height / baseHeight) * 0.9;
    } else {
      scale = Math.min(width / baseWidth, height / baseHeight);
    }
    
    return {
      width: Math.floor(baseWidth * scale),
      height: Math.floor(baseHeight * scale),
      scale
    };
  }
  
  getOptimalControls() {
    const controls = {
      mobile: {
        touchEnabled: true,
        keyboardEnabled: false,
        gamepadEnabled: false,
        hapticFeedback: true,
        touchSize: 'large',
        buttonSize: 60,
        joystickSize: 80
      },
      tablet: {
        touchEnabled: true,
        keyboardEnabled: true,
        gamepadEnabled: true,
        hapticFeedback: true,
        touchSize: 'medium',
        buttonSize: 50,
        joystickSize: 70
      },
      desktop: {
        touchEnabled: false,
        keyboardEnabled: true,
        gamepadEnabled: true,
        hapticFeedback: false,
        touchSize: 'small',
        buttonSize: 40,
        joystickSize: 60
      }
    };
    
    return controls[this.deviceInfo.type];
  }
  
  // Cleanup
  destroy() {
    if (this.orientationLocked && window.screen.orientation && window.screen.orientation.unlock) {
      try {
        window.screen.orientation.unlock();
      } catch (error) {
        console.log('Orientation unlock failed:', error);
      }
    }
  }
}

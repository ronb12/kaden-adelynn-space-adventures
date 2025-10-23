// Responsive System - Make game work on any device and screen size

export class ResponsiveSystem {
  constructor() {
    this.deviceType = this.detectDevice();
    this.screenSize = this.getScreenSize();
    this.orientation = this.getOrientation();
    this.scale = this.calculateScale();
    this.canvasSize = this.calculateCanvasSize();
    this.controls = this.getOptimalControls();
  }

  // Detect device type
  detectDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }

  // Get screen size category
  getScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width < 480) return 'small';
    if (width < 768) return 'medium';
    if (width < 1024) return 'large';
    if (width < 1440) return 'xlarge';
    return 'xxlarge';
  }

  // Get orientation
  getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // Calculate optimal scale
  calculateScale() {
    const baseWidth = 800;
    const baseHeight = 600;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const scaleX = screenWidth / baseWidth;
    const scaleY = screenHeight / baseHeight;
    
    // Use the smaller scale to maintain aspect ratio
    return Math.min(scaleX, scaleY, 2); // Cap at 2x for performance
  }

  // Calculate canvas size
  calculateCanvasSize() {
    const baseWidth = 800;
    const baseHeight = 600;
    const scale = this.scale;
    
    return {
      width: Math.floor(baseWidth * scale),
      height: Math.floor(baseHeight * scale),
      scale: scale
    };
  }

  // Get optimal controls for device
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
    
    return controls[this.deviceType];
  }

  // Get responsive settings
  getResponsiveSettings() {
    return {
      deviceType: this.deviceType,
      screenSize: this.screenSize,
      orientation: this.orientation,
      scale: this.scale,
      canvasSize: this.canvasSize,
      controls: this.controls,
      
      // Performance settings based on device
      maxParticles: this.getMaxParticles(),
      maxEnemies: this.getMaxEnemies(),
      effectsQuality: this.getEffectsQuality(),
      frameRate: this.getTargetFrameRate()
    };
  }

  // Get max particles based on device capability
  getMaxParticles() {
    const limits = {
      mobile: 50,
      tablet: 100,
      desktop: 200
    };
    return limits[this.deviceType];
  }

  // Get max enemies based on device capability
  getMaxEnemies() {
    const limits = {
      mobile: 10,
      tablet: 15,
      desktop: 25
    };
    return limits[this.deviceType];
  }

  // Get effects quality
  getEffectsQuality() {
    const qualities = {
      mobile: 'low',
      tablet: 'medium',
      desktop: 'high'
    };
    return qualities[this.deviceType];
  }

  // Get target frame rate
  getTargetFrameRate() {
    const frameRates = {
      mobile: 30,
      tablet: 45,
      desktop: 60
    };
    return frameRates[this.deviceType];
  }

  // Update canvas for responsive design
  updateCanvas(canvas) {
    const settings = this.getResponsiveSettings();
    
    // Set canvas size
    canvas.width = settings.canvasSize.width;
    canvas.height = settings.canvasSize.height;
    
    // Set CSS size for display
    canvas.style.width = `${settings.canvasSize.width}px`;
    canvas.style.height = `${settings.canvasSize.height}px`;
    
    // Center canvas
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    
    return settings;
  }

  // Get responsive UI scaling
  getUIScaling() {
    const baseFontSize = 16;
    const scale = this.scale;
    
    return {
      fontSize: Math.max(12, Math.floor(baseFontSize * scale)),
      buttonSize: Math.max(40, Math.floor(60 * scale)),
      iconSize: Math.max(24, Math.floor(32 * scale)),
      padding: Math.max(8, Math.floor(16 * scale)),
      margin: Math.max(4, Math.floor(8 * scale))
    };
  }

  // Get responsive game settings
  getGameSettings() {
    return {
      // Enemy settings
      enemySpawnRate: this.getEnemySpawnRate(),
      enemySpeed: this.getEnemySpeed(),
      enemyHealth: this.getEnemyHealth(),
      
      // Player settings
      playerSpeed: this.getPlayerSpeed(),
      playerSize: this.getPlayerSize(),
      
      // Bullet settings
      bulletSpeed: this.getBulletSpeed(),
      bulletSize: this.getBulletSize(),
      
      // Power-up settings
      powerUpSpawnRate: this.getPowerUpSpawnRate(),
      powerUpSize: this.getPowerUpSize()
    };
  }

  // Get enemy spawn rate based on device
  getEnemySpawnRate() {
    const rates = {
      mobile: 2000, // 2 seconds
      tablet: 1500, // 1.5 seconds
      desktop: 1000 // 1 second
    };
    return rates[this.deviceType];
  }

  // Get enemy speed based on device
  getEnemySpeed() {
    const speeds = {
      mobile: 1.5,
      tablet: 2.0,
      desktop: 2.5
    };
    return speeds[this.deviceType];
  }

  // Get enemy health based on device
  getEnemyHealth() {
    const healths = {
      mobile: 1,
      tablet: 1.5,
      desktop: 2
    };
    return healths[this.deviceType];
  }

  // Get player speed based on device
  getPlayerSpeed() {
    const speeds = {
      mobile: 4,
      tablet: 5,
      desktop: 6
    };
    return speeds[this.deviceType];
  }

  // Get player size based on device
  getPlayerSize() {
    const sizes = {
      mobile: { width: 60, height: 70 },
      tablet: { width: 50, height: 60 },
      desktop: { width: 40, height: 50 }
    };
    return sizes[this.deviceType];
  }

  // Get bullet speed based on device
  getBulletSpeed() {
    const speeds = {
      mobile: 6,
      tablet: 7,
      desktop: 8
    };
    return speeds[this.deviceType];
  }

  // Get bullet size based on device
  getBulletSize() {
    const sizes = {
      mobile: { width: 6, height: 12 },
      tablet: { width: 5, height: 10 },
      desktop: { width: 4, height: 8 }
    };
    return sizes[this.deviceType];
  }

  // Get power-up spawn rate based on device
  getPowerUpSpawnRate() {
    const rates = {
      mobile: 8000, // 8 seconds
      tablet: 6000, // 6 seconds
      desktop: 5000 // 5 seconds
    };
    return rates[this.deviceType];
  }

  // Get power-up size based on device
  getPowerUpSize() {
    const sizes = {
      mobile: { width: 30, height: 30 },
      tablet: { width: 25, height: 25 },
      desktop: { width: 20, height: 20 }
    };
    return sizes[this.deviceType];
  }

  // Handle orientation change
  handleOrientationChange() {
    this.orientation = this.getOrientation();
    this.scale = this.calculateScale();
    this.canvasSize = this.calculateCanvasSize();
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  }

  // Get responsive CSS
  getResponsiveCSS() {
    return `
      @media (max-width: 480px) {
        .game-container { font-size: 12px; }
        .menu-button { padding: 8px 16px; font-size: 14px; }
        .game-title { font-size: 1.5rem; }
      }
      
      @media (min-width: 481px) and (max-width: 768px) {
        .game-container { font-size: 14px; }
        .menu-button { padding: 10px 20px; font-size: 16px; }
        .game-title { font-size: 2rem; }
      }
      
      @media (min-width: 769px) and (max-width: 1024px) {
        .game-container { font-size: 16px; }
        .menu-button { padding: 12px 24px; font-size: 18px; }
        .game-title { font-size: 2.5rem; }
      }
      
      @media (min-width: 1025px) {
        .game-container { font-size: 18px; }
        .menu-button { padding: 14px 28px; font-size: 20px; }
        .game-title { font-size: 3rem; }
      }
      
      @media (orientation: portrait) {
        .game-canvas { max-width: 100vw; max-height: 100vh; }
      }
      
      @media (orientation: landscape) {
        .game-canvas { max-width: 100vw; max-height: 100vh; }
      }
    `;
  }

  // Initialize responsive system
  initialize() {
    // Add orientation change listener
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });
    
    // Add resize listener
    window.addEventListener('resize', () => {
      this.scale = this.calculateScale();
      this.canvasSize = this.calculateCanvasSize();
    });
    
    return this.getResponsiveSettings();
  }
}

export default ResponsiveSystem;

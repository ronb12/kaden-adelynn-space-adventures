// Settings System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class SettingsSystem {
  constructor(scene) {
    this.scene = scene;
    this.settings = {
      audio: {
        masterVolume: 1.0,
        musicVolume: 0.6,
        sfxVolume: 0.8,
        musicEnabled: true,
        sfxEnabled: true
      },
      graphics: {
        particleEffects: true,
        screenShake: true,
        screenFlash: true,
        backgroundEffects: true,
        uiAnimations: true,
        quality: 'high' // low, medium, high
      },
      gameplay: {
        difficulty: 'normal', // easy, normal, hard, extreme
        autoFire: false,
        invincibility: false,
        powerUpFrequency: 'normal', // low, normal, high
        enemySpawnRate: 'normal', // low, normal, high
        bossHealth: 'normal' // low, normal, high
      },
      controls: {
        keyBindings: {
          moveUp: 'W',
          moveDown: 'S',
          moveLeft: 'A',
          moveRight: 'D',
          shoot: 'SPACE',
          pause: 'ESC',
          menu: 'M'
        },
        mouseControls: false,
        touchControls: true,
        hapticFeedback: true
      },
      display: {
        fullscreen: false,
        resolution: 'auto', // auto, 800x600, 1024x768, 1280x720, 1920x1080
        uiScale: 1.0,
        fps: 60,
        vsync: true
      },
      accessibility: {
        colorBlindMode: false,
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        subtitles: true,
        audioDescriptions: false
      },
      privacy: {
        analytics: true,
        crashReporting: true,
        dataCollection: true,
        personalizedAds: false
      }
    };
    
    this.loadSettings();
  }

  loadSettings() {
    const savedSettings = localStorage.getItem('kaden_adelynn_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        this.settings = { ...this.settings, ...parsed };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('kaden_adelynn_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  getSetting(category, key) {
    return this.settings[category]?.[key];
  }

  setSetting(category, key, value) {
    if (!this.settings[category]) {
      this.settings[category] = {};
    }
    this.settings[category][key] = value;
    this.saveSettings();
    this.applySetting(category, key, value);
  }

  applySetting(category, key, value) {
    switch (category) {
      case 'audio':
        this.applyAudioSetting(key, value);
        break;
      case 'graphics':
        this.applyGraphicsSetting(key, value);
        break;
      case 'gameplay':
        this.applyGameplaySetting(key, value);
        break;
      case 'controls':
        this.applyControlsSetting(key, value);
        break;
      case 'display':
        this.applyDisplaySetting(key, value);
        break;
      case 'accessibility':
        this.applyAccessibilitySetting(key, value);
        break;
    }
  }

  applyAudioSetting(key, value) {
    if (this.scene.soundSystem) {
      switch (key) {
        case 'masterVolume':
          this.scene.soundSystem.setMasterVolume(value);
          break;
        case 'musicVolume':
          this.scene.soundSystem.setMusicVolume(value);
          break;
        case 'sfxVolume':
          this.scene.soundSystem.setSFXVolume(value);
          break;
        case 'musicEnabled':
          this.scene.soundSystem.toggleMusic();
          break;
        case 'sfxEnabled':
          this.scene.soundSystem.toggleSound();
          break;
      }
    }
  }

  applyGraphicsSetting(key, value) {
    switch (key) {
      case 'particleEffects':
        // Toggle particle effects
        break;
      case 'screenShake':
        // Toggle screen shake
        break;
      case 'screenFlash':
        // Toggle screen flash
        break;
      case 'backgroundEffects':
        // Toggle background effects
        break;
      case 'uiAnimations':
        // Toggle UI animations
        break;
      case 'quality':
        this.setGraphicsQuality(value);
        break;
    }
  }

  applyGameplaySetting(key, value) {
    switch (key) {
      case 'difficulty':
        this.setDifficulty(value);
        break;
      case 'autoFire':
        // Toggle auto fire
        break;
      case 'invincibility':
        // Toggle invincibility
        break;
      case 'powerUpFrequency':
        this.setPowerUpFrequency(value);
        break;
      case 'enemySpawnRate':
        this.setEnemySpawnRate(value);
        break;
      case 'bossHealth':
        this.setBossHealth(value);
        break;
    }
  }

  applyControlsSetting(key, value) {
    switch (key) {
      case 'keyBindings':
        this.updateKeyBindings(value);
        break;
      case 'mouseControls':
        // Toggle mouse controls
        break;
      case 'touchControls':
        // Toggle touch controls
        break;
      case 'hapticFeedback':
        // Toggle haptic feedback
        break;
    }
  }

  applyDisplaySetting(key, value) {
    switch (key) {
      case 'fullscreen':
        this.toggleFullscreen(value);
        break;
      case 'resolution':
        this.setResolution(value);
        break;
      case 'uiScale':
        this.setUIScale(value);
        break;
      case 'fps':
        this.setFPS(value);
        break;
      case 'vsync':
        this.setVSync(value);
        break;
    }
  }

  applyAccessibilitySetting(key, value) {
    switch (key) {
      case 'colorBlindMode':
        this.setColorBlindMode(value);
        break;
      case 'highContrast':
        this.setHighContrast(value);
        break;
      case 'largeText':
        this.setLargeText(value);
        break;
      case 'reducedMotion':
        this.setReducedMotion(value);
        break;
      case 'subtitles':
        this.setSubtitles(value);
        break;
      case 'audioDescriptions':
        this.setAudioDescriptions(value);
        break;
    }
  }

  setGraphicsQuality(quality) {
    switch (quality) {
      case 'low':
        this.scene.renderer.setPixelArt(true);
        this.scene.renderer.setAntialias(false);
        break;
      case 'medium':
        this.scene.renderer.setPixelArt(false);
        this.scene.renderer.setAntialias(true);
        break;
      case 'high':
        this.scene.renderer.setPixelArt(false);
        this.scene.renderer.setAntialias(true);
        break;
    }
  }

  setDifficulty(difficulty) {
    const multipliers = {
      easy: 0.5,
      normal: 1.0,
      hard: 1.5,
      extreme: 2.0
    };
    
    const multiplier = multipliers[difficulty];
    // Apply difficulty multiplier to game mechanics
  }

  setPowerUpFrequency(frequency) {
    const rates = {
      low: 20000,
      normal: 15000,
      high: 10000
    };
    
    const rate = rates[frequency];
    // Update power-up spawn rate
  }

  setEnemySpawnRate(rate) {
    const rates = {
      low: 3000,
      normal: 2000,
      high: 1000
    };
    
    const spawnRate = rates[rate];
    // Update enemy spawn rate
  }

  setBossHealth(health) {
    const multipliers = {
      low: 0.5,
      normal: 1.0,
      high: 1.5
    };
    
    const multiplier = multipliers[health];
    // Apply boss health multiplier
  }

  updateKeyBindings(bindings) {
    // Update key bindings
  }

  toggleFullscreen(enabled) {
    if (enabled) {
      this.scene.scale.startFullscreen();
    } else {
      this.scene.scale.stopFullscreen();
    }
  }

  setResolution(resolution) {
    if (resolution === 'auto') {
      this.scene.scale.setGameSize(window.innerWidth, window.innerHeight);
    } else {
      const [width, height] = resolution.split('x').map(Number);
      this.scene.scale.setGameSize(width, height);
    }
  }

  setUIScale(scale) {
    this.scene.scale.setZoom(scale);
  }

  setFPS(fps) {
    this.scene.game.loop.targetFps = fps;
  }

  setVSync(enabled) {
    this.scene.game.renderer.setVSync(enabled);
  }

  setColorBlindMode(enabled) {
    // Apply color blind mode
  }

  setHighContrast(enabled) {
    // Apply high contrast mode
  }

  setLargeText(enabled) {
    // Apply large text mode
  }

  setReducedMotion(enabled) {
    // Apply reduced motion mode
  }

  setSubtitles(enabled) {
    // Apply subtitles
  }

  setAudioDescriptions(enabled) {
    // Apply audio descriptions
  }

  showSettingsMenu() {
    const settingsContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    settingsContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 800, 600, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00aaff);
    settingsContainer.add(background);
    
    // Title
    const title = this.scene.add.text(0, -250, 'SETTINGS', {
      fontSize: '36px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    title.setOrigin(0.5);
    settingsContainer.add(title);
    
    // Settings categories
    const categories = [
      { name: 'Audio', key: 'audio', emoji: '🔊' },
      { name: 'Graphics', key: 'graphics', emoji: '🎨' },
      { name: 'Gameplay', key: 'gameplay', emoji: '🎮' },
      { name: 'Controls', key: 'controls', emoji: '⌨️' },
      { name: 'Display', key: 'display', emoji: '🖥️' },
      { name: 'Accessibility', key: 'accessibility', emoji: '♿' }
    ];
    
    categories.forEach((category, index) => {
      const x = -300 + (index % 3) * 200;
      const y = -150 + Math.floor(index / 3) * 100;
      
      const categoryButton = this.scene.add.rectangle(x, y, 150, 80, 0x00aaff, 0.8);
      categoryButton.setStrokeStyle(2, 0xffffff);
      categoryButton.setInteractive();
      settingsContainer.add(categoryButton);
      
      const categoryEmoji = this.scene.add.text(x, y - 20, category.emoji, {
        fontSize: '24px'
      });
      categoryEmoji.setOrigin(0.5);
      settingsContainer.add(categoryEmoji);
      
      const categoryName = this.scene.add.text(x, y + 20, category.name, {
        fontSize: '16px',
        fill: '#ffffff',
        fontStyle: 'bold'
      });
      categoryName.setOrigin(0.5);
      settingsContainer.add(categoryName);
      
      categoryButton.on('pointerdown', () => {
        this.showCategorySettings(category.key);
        settingsContainer.destroy();
      });
    });
    
    // Close button
    const closeButton = this.scene.add.rectangle(0, 250, 100, 40, 0xff0000, 0.8);
    closeButton.setStrokeStyle(2, 0xffffff);
    closeButton.setInteractive();
    settingsContainer.add(closeButton);
    
    const closeText = this.scene.add.text(0, 250, 'CLOSE', {
      fontSize: '18px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    closeText.setOrigin(0.5);
    settingsContainer.add(closeText);
    
    closeButton.on('pointerdown', () => {
      settingsContainer.destroy();
    });
    
    // Animate settings menu
    settingsContainer.setAlpha(0);
    settingsContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: settingsContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
  }

  showCategorySettings(category) {
    const categoryContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    categoryContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 700, 500, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00aaff);
    categoryContainer.add(background);
    
    // Category title
    const categoryTitle = this.scene.add.text(0, -200, category.toUpperCase(), {
      fontSize: '28px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    categoryTitle.setOrigin(0.5);
    categoryContainer.add(categoryTitle);
    
    // Settings for this category
    const settings = this.settings[category];
    const settingKeys = Object.keys(settings);
    
    settingKeys.forEach((key, index) => {
      const y = -100 + (index * 60);
      
      // Setting name
      const settingName = this.scene.add.text(-200, y, key.replace(/([A-Z])/g, ' $1').toLowerCase(), {
        fontSize: '16px',
        fill: '#ffffff'
      });
      settingName.setOrigin(0, 0.5);
      categoryContainer.add(settingName);
      
      // Setting value
      const settingValue = this.scene.add.text(200, y, this.getSettingDisplayValue(category, key), {
        fontSize: '16px',
        fill: '#ffff00'
      });
      settingValue.setOrigin(0, 0.5);
      categoryContainer.add(settingValue);
      
      // Adjust buttons
      const decreaseButton = this.scene.add.rectangle(300, y, 30, 30, 0xff0000, 0.8);
      decreaseButton.setInteractive();
      categoryContainer.add(decreaseButton);
      
      const decreaseText = this.scene.add.text(300, y, '-', {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      });
      decreaseText.setOrigin(0.5);
      categoryContainer.add(decreaseText);
      
      const increaseButton = this.scene.add.rectangle(350, y, 30, 30, 0x00ff00, 0.8);
      increaseButton.setInteractive();
      categoryContainer.add(increaseButton);
      
      const increaseText = this.scene.add.text(350, y, '+', {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      });
      increaseText.setOrigin(0.5);
      categoryContainer.add(increaseText);
      
      // Button handlers
      decreaseButton.on('pointerdown', () => {
        this.adjustSetting(category, key, -1);
        settingValue.setText(this.getSettingDisplayValue(category, key));
      });
      
      increaseButton.on('pointerdown', () => {
        this.adjustSetting(category, key, 1);
        settingValue.setText(this.getSettingDisplayValue(category, key));
      });
    });
    
    // Back button
    const backButton = this.scene.add.rectangle(0, 200, 100, 40, 0x666666, 0.8);
    backButton.setStrokeStyle(2, 0xffffff);
    backButton.setInteractive();
    categoryContainer.add(backButton);
    
    const backText = this.scene.add.text(0, 200, 'BACK', {
      fontSize: '18px',
      fill: '#ffffff',
      fontStyle: 'bold'
    });
    backText.setOrigin(0.5);
    categoryContainer.add(backText);
    
    backButton.on('pointerdown', () => {
      categoryContainer.destroy();
      this.showSettingsMenu();
    });
    
    // Animate category settings
    categoryContainer.setAlpha(0);
    categoryContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: categoryContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
  }

  getSettingDisplayValue(category, key) {
    const value = this.getSetting(category, key);
    
    if (typeof value === 'boolean') {
      return value ? 'ON' : 'OFF';
    } else if (typeof value === 'number') {
      return value.toString();
    } else {
      return value.toString();
    }
  }

  adjustSetting(category, key, delta) {
    const currentValue = this.getSetting(category, key);
    
    if (typeof currentValue === 'boolean') {
      this.setSetting(category, key, !currentValue);
    } else if (typeof currentValue === 'number') {
      const newValue = Math.max(0, Math.min(1, currentValue + delta * 0.1));
      this.setSetting(category, key, newValue);
    } else if (typeof currentValue === 'string') {
      const options = this.getSettingOptions(category, key);
      const currentIndex = options.indexOf(currentValue);
      const newIndex = Math.max(0, Math.min(options.length - 1, currentIndex + delta));
      this.setSetting(category, key, options[newIndex]);
    }
  }

  getSettingOptions(category, key) {
    const options = {
      audio: {
        masterVolume: [0, 0.25, 0.5, 0.75, 1.0],
        musicVolume: [0, 0.25, 0.5, 0.75, 1.0],
        sfxVolume: [0, 0.25, 0.5, 0.75, 1.0]
      },
      graphics: {
        quality: ['low', 'medium', 'high']
      },
      gameplay: {
        difficulty: ['easy', 'normal', 'hard', 'extreme'],
        powerUpFrequency: ['low', 'normal', 'high'],
        enemySpawnRate: ['low', 'normal', 'high'],
        bossHealth: ['low', 'normal', 'high']
      },
      display: {
        resolution: ['auto', '800x600', '1024x768', '1280x720', '1920x1080'],
        fps: [30, 60, 120, 144]
      }
    };
    
    return options[category]?.[key] || [];
  }

  resetToDefaults() {
    this.settings = {
      audio: {
        masterVolume: 1.0,
        musicVolume: 0.6,
        sfxVolume: 0.8,
        musicEnabled: true,
        sfxEnabled: true
      },
      graphics: {
        particleEffects: true,
        screenShake: true,
        screenFlash: true,
        backgroundEffects: true,
        uiAnimations: true,
        quality: 'high'
      },
      gameplay: {
        difficulty: 'normal',
        autoFire: false,
        invincibility: false,
        powerUpFrequency: 'normal',
        enemySpawnRate: 'normal',
        bossHealth: 'normal'
      },
      controls: {
        keyBindings: {
          moveUp: 'W',
          moveDown: 'S',
          moveLeft: 'A',
          moveRight: 'D',
          shoot: 'SPACE',
          pause: 'ESC',
          menu: 'M'
        },
        mouseControls: false,
        touchControls: true,
        hapticFeedback: true
      },
      display: {
        fullscreen: false,
        resolution: 'auto',
        uiScale: 1.0,
        fps: 60,
        vsync: true
      },
      accessibility: {
        colorBlindMode: false,
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        subtitles: true,
        audioDescriptions: false
      },
      privacy: {
        analytics: true,
        crashReporting: true,
        dataCollection: true,
        personalizedAds: false
      }
    };
    
    this.saveSettings();
  }

  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }

  importSettings(data) {
    try {
      const imported = JSON.parse(data);
      this.settings = { ...this.settings, ...imported };
      this.saveSettings();
      return true;
    } catch (e) {
      console.error('Failed to import settings:', e);
      return false;
    }
  }
}

// Advanced UI System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedUISystem {
  constructor(scene) {
    this.scene = scene;
    this.uiElements = new Map();
    this.animations = new Map();
    
    this.uiComponents = {
      // 20 New UI Elements
      MINI_MAP: {
        name: 'Mini Map',
        type: 'minimap',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 150 },
        color: 0x000000,
        alpha: 0.7
      },
      RADAR: {
        name: 'Radar',
        type: 'radar',
        position: { x: 50, y: 220 },
        size: { width: 150, height: 150 },
        color: 0x00ff00,
        alpha: 0.8
      },
      HEALTH_BAR: {
        name: 'Health Bar',
        type: 'healthbar',
        position: { x: 50, y: 400 },
        size: { width: 200, height: 20 },
        color: 0xff0000,
        alpha: 0.9
      },
      SHIELD_BAR: {
        name: 'Shield Bar',
        type: 'shieldbar',
        position: { x: 50, y: 430 },
        size: { width: 200, height: 20 },
        color: 0x00aaff,
        alpha: 0.9
      },
      ENERGY_BAR: {
        name: 'Energy Bar',
        type: 'energybar',
        position: { x: 50, y: 460 },
        size: { width: 200, height: 20 },
        color: 0xffff00,
        alpha: 0.9
      },
      SCORE_DISPLAY: {
        name: 'Score Display',
        type: 'score',
        position: { x: 50, y: 500 },
        size: { width: 200, height: 30 },
        color: 0xffffff,
        alpha: 1.0
      },
      LEVEL_DISPLAY: {
        name: 'Level Display',
        type: 'level',
        position: { x: 50, y: 540 },
        size: { width: 200, height: 30 },
        color: 0xffffff,
        alpha: 1.0
      },
      WAVE_DISPLAY: {
        name: 'Wave Display',
        type: 'wave',
        position: { x: 50, y: 580 },
        size: { width: 200, height: 30 },
        color: 0xffffff,
        alpha: 1.0
      },
      TIME_DISPLAY: {
        name: 'Time Display',
        type: 'time',
        position: { x: 50, y: 620 },
        size: { width: 200, height: 30 },
        color: 0xffffff,
        alpha: 1.0
      },
      COMBO_DISPLAY: {
        name: 'Combo Display',
        type: 'combo',
        position: { x: 50, y: 660 },
        size: { width: 200, height: 30 },
        color: 0xff8800,
        alpha: 1.0
      },
      MULTIPLIER_DISPLAY: {
        name: 'Multiplier Display',
        type: 'multiplier',
        position: { x: 50, y: 700 },
        size: { width: 200, height: 30 },
        color: 0xff00ff,
        alpha: 1.0
      },
      WEAPON_DISPLAY: {
        name: 'Weapon Display',
        type: 'weapon',
        position: { x: 50, y: 740 },
        size: { width: 200, height: 30 },
        color: 0xffffff,
        alpha: 1.0
      },
      POWERUP_DISPLAY: {
        name: 'Power-up Display',
        type: 'powerup',
        position: { x: 50, y: 780 },
        size: { width: 200, height: 30 },
        color: 0x00ff00,
        alpha: 1.0
      },
      ACHIEVEMENT_DISPLAY: {
        name: 'Achievement Display',
        type: 'achievement',
        position: { x: 50, y: 820 },
        size: { width: 200, height: 30 },
        color: 0xffdd00,
        alpha: 1.0
      },
      NOTIFICATION_SYSTEM: {
        name: 'Notification System',
        type: 'notification',
        position: { x: 300, y: 50 },
        size: { width: 300, height: 100 },
        color: 0x000000,
        alpha: 0.8
      },
      CHAT_SYSTEM: {
        name: 'Chat System',
        type: 'chat',
        position: { x: 300, y: 170 },
        size: { width: 300, height: 150 },
        color: 0x000000,
        alpha: 0.7
      },
      SETTINGS_PANEL: {
        name: 'Settings Panel',
        type: 'settings',
        position: { x: 300, y: 340 },
        size: { width: 300, height: 200 },
        color: 0x000000,
        alpha: 0.9
      },
      INVENTORY_PANEL: {
        name: 'Inventory Panel',
        type: 'inventory',
        position: { x: 300, y: 560 },
        size: { width: 300, height: 200 },
        color: 0x000000,
        alpha: 0.9
      },
      STATS_PANEL: {
        name: 'Stats Panel',
        type: 'stats',
        position: { x: 300, y: 780 },
        size: { width: 300, height: 150 },
        color: 0x000000,
        alpha: 0.9
      }
    };
  }

  createUI() {
    Object.keys(this.uiComponents).forEach(componentKey => {
      const component = this.uiComponents[componentKey];
      this.createUIComponent(componentKey, component);
    });
  }

  createUIComponent(componentKey, component) {
    switch (component.type) {
      case 'minimap':
        this.createMiniMap(componentKey, component);
        break;
      case 'radar':
        this.createRadar(componentKey, component);
        break;
      case 'healthbar':
        this.createHealthBar(componentKey, component);
        break;
      case 'shieldbar':
        this.createShieldBar(componentKey, component);
        break;
      case 'energybar':
        this.createEnergyBar(componentKey, component);
        break;
      case 'score':
        this.createScoreDisplay(componentKey, component);
        break;
      case 'level':
        this.createLevelDisplay(componentKey, component);
        break;
      case 'wave':
        this.createWaveDisplay(componentKey, component);
        break;
      case 'time':
        this.createTimeDisplay(componentKey, component);
        break;
      case 'combo':
        this.createComboDisplay(componentKey, component);
        break;
      case 'multiplier':
        this.createMultiplierDisplay(componentKey, component);
        break;
      case 'weapon':
        this.createWeaponDisplay(componentKey, component);
        break;
      case 'powerup':
        this.createPowerUpDisplay(componentKey, component);
        break;
      case 'achievement':
        this.createAchievementDisplay(componentKey, component);
        break;
      case 'notification':
        this.createNotificationSystem(componentKey, component);
        break;
      case 'chat':
        this.createChatSystem(componentKey, component);
        break;
      case 'settings':
        this.createSettingsPanel(componentKey, component);
        break;
      case 'inventory':
        this.createInventoryPanel(componentKey, component);
        break;
      case 'stats':
        this.createStatsPanel(componentKey, component);
        break;
    }
  }

  createMiniMap(componentKey, component) {
    const minimap = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    minimap.setStrokeStyle(2, 0xffffff);
    
    // Add minimap content
    const minimapContent = this.scene.add.graphics();
    minimapContent.setPosition(component.position.x, component.position.y);
    
    this.uiElements.set(componentKey, { container: minimap, content: minimapContent });
  }

  createRadar(componentKey, component) {
    const radar = this.scene.add.circle(
      component.position.x + component.size.width / 2,
      component.position.y + component.size.height / 2,
      component.size.width / 2,
      component.color, component.alpha
    );
    radar.setStrokeStyle(2, 0x00ff00);
    
    // Add radar sweep
    const radarSweep = this.scene.add.graphics();
    radarSweep.setPosition(component.position.x + component.size.width / 2, component.position.y + component.size.height / 2);
    
    this.uiElements.set(componentKey, { container: radar, sweep: radarSweep });
  }

  createHealthBar(componentKey, component) {
    const healthBarBg = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      0x333333, 0.8
    );
    
    const healthBar = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    
    this.uiElements.set(componentKey, { background: healthBarBg, bar: healthBar });
  }

  createShieldBar(componentKey, component) {
    const shieldBarBg = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      0x333333, 0.8
    );
    
    const shieldBar = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    
    this.uiElements.set(componentKey, { background: shieldBarBg, bar: shieldBar });
  }

  createEnergyBar(componentKey, component) {
    const energyBarBg = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      0x333333, 0.8
    );
    
    const energyBar = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    
    this.uiElements.set(componentKey, { background: energyBarBg, bar: energyBar });
  }

  createScoreDisplay(componentKey, component) {
    const scoreText = this.scene.add.text(
      component.position.x, component.position.y,
      'Score: 0',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: scoreText });
  }

  createLevelDisplay(componentKey, component) {
    const levelText = this.scene.add.text(
      component.position.x, component.position.y,
      'Level: 1',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: levelText });
  }

  createWaveDisplay(componentKey, component) {
    const waveText = this.scene.add.text(
      component.position.x, component.position.y,
      'Wave: 1',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: waveText });
  }

  createTimeDisplay(componentKey, component) {
    const timeText = this.scene.add.text(
      component.position.x, component.position.y,
      'Time: 00:00',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: timeText });
  }

  createComboDisplay(componentKey, component) {
    const comboText = this.scene.add.text(
      component.position.x, component.position.y,
      'Combo: 0',
      {
        fontSize: '20px',
        fill: '#ff8800',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: comboText });
  }

  createMultiplierDisplay(componentKey, component) {
    const multiplierText = this.scene.add.text(
      component.position.x, component.position.y,
      'Multiplier: 1x',
      {
        fontSize: '20px',
        fill: '#ff00ff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: multiplierText });
  }

  createWeaponDisplay(componentKey, component) {
    const weaponText = this.scene.add.text(
      component.position.x, component.position.y,
      'Weapon: Basic Blaster',
      {
        fontSize: '20px',
        fill: '#ffffff',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: weaponText });
  }

  createPowerUpDisplay(componentKey, component) {
    const powerUpText = this.scene.add.text(
      component.position.x, component.position.y,
      'Power-ups: None',
      {
        fontSize: '20px',
        fill: '#00ff00',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: powerUpText });
  }

  createAchievementDisplay(componentKey, component) {
    const achievementText = this.scene.add.text(
      component.position.x, component.position.y,
      'Achievements: 0',
      {
        fontSize: '20px',
        fill: '#ffdd00',
        fontStyle: 'bold'
      }
    );
    
    this.uiElements.set(componentKey, { text: achievementText });
  }

  createNotificationSystem(componentKey, component) {
    const notificationPanel = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    notificationPanel.setStrokeStyle(2, 0xffffff);
    
    this.uiElements.set(componentKey, { panel: notificationPanel, notifications: [] });
  }

  createChatSystem(componentKey, component) {
    const chatPanel = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    chatPanel.setStrokeStyle(2, 0xffffff);
    
    const chatText = this.scene.add.text(
      component.position.x + 10, component.position.y + 10,
      'Chat System\nReady to use',
      {
        fontSize: '14px',
        fill: '#ffffff',
        wordWrap: { width: component.size.width - 20 }
      }
    );
    
    this.uiElements.set(componentKey, { panel: chatPanel, text: chatText, messages: [] });
  }

  createSettingsPanel(componentKey, component) {
    const settingsPanel = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    settingsPanel.setStrokeStyle(2, 0xffffff);
    
    const settingsText = this.scene.add.text(
      component.position.x + 10, component.position.y + 10,
      'Settings Panel\nAudio: ON\nGraphics: HIGH\nControls: DEFAULT',
      {
        fontSize: '14px',
        fill: '#ffffff',
        wordWrap: { width: component.size.width - 20 }
      }
    );
    
    this.uiElements.set(componentKey, { panel: settingsPanel, text: settingsText });
  }

  createInventoryPanel(componentKey, component) {
    const inventoryPanel = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    inventoryPanel.setStrokeStyle(2, 0xffffff);
    
    const inventoryText = this.scene.add.text(
      component.position.x + 10, component.position.y + 10,
      'Inventory\nEmpty',
      {
        fontSize: '14px',
        fill: '#ffffff',
        wordWrap: { width: component.size.width - 20 }
      }
    );
    
    this.uiElements.set(componentKey, { panel: inventoryPanel, text: inventoryText, items: [] });
  }

  createStatsPanel(componentKey, component) {
    const statsPanel = this.scene.add.rectangle(
      component.position.x, component.position.y,
      component.size.width, component.size.height,
      component.color, component.alpha
    );
    statsPanel.setStrokeStyle(2, 0xffffff);
    
    const statsText = this.scene.add.text(
      component.position.x + 10, component.position.y + 10,
      'Statistics\nKills: 0\nDeaths: 0\nScore: 0',
      {
        fontSize: '14px',
        fill: '#ffffff',
        wordWrap: { width: component.size.width - 20 }
      }
    );
    
    this.uiElements.set(componentKey, { panel: statsPanel, text: statsText });
  }

  // Update methods
  updateHealthBar(health, maxHealth) {
    const healthBar = this.uiElements.get('HEALTH_BAR');
    if (healthBar && healthBar.bar) {
      const percentage = health / maxHealth;
      const width = healthBar.bar.displayWidth * percentage;
      healthBar.bar.setDisplaySize(width, healthBar.bar.displayHeight);
      
      // Change color based on health
      if (percentage > 0.6) {
        healthBar.bar.setFillStyle(0x00ff00);
      } else if (percentage > 0.3) {
        healthBar.bar.setFillStyle(0xffff00);
      } else {
        healthBar.bar.setFillStyle(0xff0000);
      }
    }
  }

  updateShieldBar(shield, maxShield) {
    const shieldBar = this.uiElements.get('SHIELD_BAR');
    if (shieldBar && shieldBar.bar) {
      const percentage = shield / maxShield;
      const width = shieldBar.bar.displayWidth * percentage;
      shieldBar.bar.setDisplaySize(width, shieldBar.bar.displayHeight);
    }
  }

  updateEnergyBar(energy, maxEnergy) {
    const energyBar = this.uiElements.get('ENERGY_BAR');
    if (energyBar && energyBar.bar) {
      const percentage = energy / maxEnergy;
      const width = energyBar.bar.displayWidth * percentage;
      energyBar.bar.setDisplaySize(width, energyBar.bar.displayHeight);
    }
  }

  updateScoreDisplay(score) {
    const scoreDisplay = this.uiElements.get('SCORE_DISPLAY');
    if (scoreDisplay && scoreDisplay.text) {
      scoreDisplay.text.setText(`Score: ${score.toLocaleString()}`);
    }
  }

  updateLevelDisplay(level) {
    const levelDisplay = this.uiElements.get('LEVEL_DISPLAY');
    if (levelDisplay && levelDisplay.text) {
      levelDisplay.text.setText(`Level: ${level}`);
    }
  }

  updateWaveDisplay(wave) {
    const waveDisplay = this.uiElements.get('WAVE_DISPLAY');
    if (waveDisplay && waveDisplay.text) {
      waveDisplay.text.setText(`Wave: ${wave}`);
    }
  }

  updateTimeDisplay(time) {
    const timeDisplay = this.uiElements.get('TIME_DISPLAY');
    if (timeDisplay && timeDisplay.text) {
      const minutes = Math.floor(time / 60000);
      const seconds = Math.floor((time % 60000) / 1000);
      timeDisplay.text.setText(`Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }
  }

  updateComboDisplay(combo) {
    const comboDisplay = this.uiElements.get('COMBO_DISPLAY');
    if (comboDisplay && comboDisplay.text) {
      comboDisplay.text.setText(`Combo: ${combo}`);
      
      // Animate combo display
      if (combo > 0) {
        this.scene.tweens.add({
          targets: comboDisplay.text,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200,
          yoyo: true
        });
      }
    }
  }

  updateMultiplierDisplay(multiplier) {
    const multiplierDisplay = this.uiElements.get('MULTIPLIER_DISPLAY');
    if (multiplierDisplay && multiplierDisplay.text) {
      multiplierDisplay.text.setText(`Multiplier: ${multiplier}x`);
    }
  }

  updateWeaponDisplay(weaponName) {
    const weaponDisplay = this.uiElements.get('WEAPON_DISPLAY');
    if (weaponDisplay && weaponDisplay.text) {
      weaponDisplay.text.setText(`Weapon: ${weaponName}`);
    }
  }

  updatePowerUpDisplay(powerUps) {
    const powerUpDisplay = this.uiElements.get('POWERUP_DISPLAY');
    if (powerUpDisplay && powerUpDisplay.text) {
      if (powerUps.length === 0) {
        powerUpDisplay.text.setText('Power-ups: None');
      } else {
        powerUpDisplay.text.setText(`Power-ups: ${powerUps.join(', ')}`);
      }
    }
  }

  updateAchievementDisplay(achievements) {
    const achievementDisplay = this.uiElements.get('ACHIEVEMENT_DISPLAY');
    if (achievementDisplay && achievementDisplay.text) {
      achievementDisplay.text.setText(`Achievements: ${achievements}`);
    }
  }

  updateMiniMap() {
    const minimap = this.uiElements.get('MINI_MAP');
    if (minimap && minimap.content) {
      minimap.content.clear();
      
      // Draw player position
      const player = this.scene.player;
      if (player) {
        minimap.content.fillStyle(0x00ff00);
        minimap.content.fillCircle(100, 75, 5);
      }
      
      // Draw enemies
      this.scene.enemies.children.entries.forEach(enemy => {
        if (enemy.active) {
          const x = (enemy.x / this.scene.scale.width) * 200;
          const y = (enemy.y / this.scene.scale.height) * 150;
          minimap.content.fillStyle(0xff0000);
          minimap.content.fillCircle(x, y, 3);
        }
      });
    }
  }

  updateRadar() {
    const radar = this.uiElements.get('RADAR');
    if (radar && radar.sweep) {
      radar.sweep.clear();
      
      // Draw radar sweep
      const time = this.scene.time.now;
      const angle = (time / 1000) * 360;
      radar.sweep.lineStyle(2, 0x00ff00);
      radar.sweep.moveTo(0, 0);
      radar.sweep.lineTo(
        Math.cos(angle * Math.PI / 180) * 75,
        Math.sin(angle * Math.PI / 180) * 75
      );
      
      // Draw enemy blips
      this.scene.enemies.children.entries.forEach(enemy => {
        if (enemy.active) {
          const distance = Phaser.Math.Distance.Between(
            this.scene.player.x, this.scene.player.y,
            enemy.x, enemy.y
          );
          if (distance < 300) {
            const angle = Phaser.Math.Angle.Between(
              this.scene.player.x, this.scene.player.y,
              enemy.x, enemy.y
            );
            const x = Math.cos(angle) * (distance / 300) * 75;
            const y = Math.sin(angle) * (distance / 300) * 75;
            radar.sweep.fillStyle(0xff0000);
            radar.sweep.fillCircle(x, y, 2);
          }
        }
      });
    }
  }

  showNotification(message, type = 'info') {
    const notificationSystem = this.uiElements.get('NOTIFICATION_SYSTEM');
    if (notificationSystem) {
      const notification = this.scene.add.text(
        notificationSystem.panel.x, notificationSystem.panel.y,
        message,
        {
          fontSize: '16px',
          fill: type === 'error' ? '#ff0000' : type === 'success' ? '#00ff00' : '#ffffff',
          fontStyle: 'bold'
        }
      );
      
      // Animate notification
      this.scene.tweens.add({
        targets: notification,
        alpha: 0,
        y: notification.y - 50,
        duration: 3000,
        onComplete: () => {
          if (notification.active) notification.destroy();
        }
      });
    }
  }

  addChatMessage(message) {
    const chatSystem = this.uiElements.get('CHAT_SYSTEM');
    if (chatSystem) {
      chatSystem.messages.push(message);
      
      // Keep only last 10 messages
      if (chatSystem.messages.length > 10) {
        chatSystem.messages.shift();
      }
      
      // Update chat display
      chatSystem.text.setText(chatSystem.messages.join('\n'));
    }
  }

  updateStatsPanel(stats) {
    const statsPanel = this.uiElements.get('STATS_PANEL');
    if (statsPanel && statsPanel.text) {
      statsPanel.text.setText(
        `Statistics\nKills: ${stats.kills || 0}\nDeaths: ${stats.deaths || 0}\nScore: ${stats.score || 0}\nAccuracy: ${stats.accuracy || 0}%`
      );
    }
  }

  // Animation methods
  createPulseAnimation(element) {
    this.scene.tweens.add({
      targets: element,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      loop: -1
    });
  }

  createFadeAnimation(element, duration = 1000) {
    this.scene.tweens.add({
      targets: element,
      alpha: 0,
      duration: duration,
      onComplete: () => {
        if (element.active) element.destroy();
      }
    });
  }

  createSlideAnimation(element, direction = 'left') {
    const startX = element.x;
    const startY = element.y;
    
    if (direction === 'left') {
      element.setPosition(startX - 200, startY);
      this.scene.tweens.add({
        targets: element,
        x: startX,
        duration: 500,
        ease: 'Back.easeOut'
      });
    } else if (direction === 'right') {
      element.setPosition(startX + 200, startY);
      this.scene.tweens.add({
        targets: element,
        x: startX,
        duration: 500,
        ease: 'Back.easeOut'
      });
    }
  }

  // Utility methods
  hideUI() {
    this.uiElements.forEach(element => {
      if (element.container) element.container.setVisible(false);
      if (element.text) element.text.setVisible(false);
      if (element.panel) element.panel.setVisible(false);
    });
  }

  showUI() {
    this.uiElements.forEach(element => {
      if (element.container) element.container.setVisible(true);
      if (element.text) element.text.setVisible(true);
      if (element.panel) element.panel.setVisible(true);
    });
  }

  destroyUI() {
    this.uiElements.forEach(element => {
      if (element.container) element.container.destroy();
      if (element.text) element.text.destroy();
      if (element.panel) element.panel.destroy();
    });
    this.uiElements.clear();
  }
}

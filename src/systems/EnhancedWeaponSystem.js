// Enhanced Weapon System for #1 Space Shooter Game

export class EnhancedWeaponSystem {
  constructor() {
    this.weapons = {
      basic: {
        name: 'Basic Laser',
        type: 'single',
        damage: 1,
        speed: 8,
        fireRate: 300, // milliseconds between shots
        color: '#00aaff',
        width: 4,
        height: 10,
        description: 'Standard energy weapon'
      },
      rapid: {
        name: 'Rapid Fire',
        type: 'rapid',
        damage: 1,
        speed: 10,
        fireRate: 100, // Much faster
        color: '#ffff00',
        width: 3,
        height: 8,
        description: 'High-speed energy bursts'
      },
      spread: {
        name: 'Spread Shot',
        type: 'spread',
        damage: 1,
        speed: 7,
        fireRate: 400,
        color: '#ff6600',
        width: 4,
        height: 8,
        spread: 0.3, // radians
        count: 3,
        description: 'Three-way energy spread'
      },
      homing: {
        name: 'Homing Missiles',
        type: 'homing',
        damage: 2,
        speed: 6,
        fireRate: 600,
        color: '#ff00ff',
        width: 6,
        height: 12,
        description: 'Heat-seeking projectiles'
      },
      plasma: {
        name: 'Plasma Cannon',
        type: 'plasma',
        damage: 3,
        speed: 5,
        fireRate: 800,
        color: '#00ff00',
        width: 8,
        height: 15,
        description: 'High-damage plasma bolts'
      },
      laser: {
        name: 'Laser Beam',
        type: 'beam',
        damage: 5,
        speed: 15,
        fireRate: 1000,
        color: '#ff0000',
        width: 6,
        height: 20,
        description: 'Devastating laser beam'
      },
      multi: {
        name: 'Multi-Shot',
        type: 'multi',
        damage: 1,
        speed: 8,
        fireRate: 200,
        color: '#00ffff',
        width: 4,
        height: 10,
        count: 5,
        spread: 0.5,
        description: 'Five-way energy burst'
      }
    };
    
    this.currentWeapon = 'basic';
    this.weaponLevel = 1;
    this.maxWeaponLevel = 5;
    this.rapidFireActive = false;
    this.rapidFireTime = 0;
    this.lastShotTime = 0;
    this.weaponUpgrades = new Map();
  }

  // Get current weapon stats
  getCurrentWeapon() {
    const weapon = this.weapons[this.currentWeapon];
    const level = this.weaponLevel;
    
    return {
      ...weapon,
      damage: weapon.damage + (level - 1),
      speed: weapon.speed + (level - 1) * 0.5,
      fireRate: Math.max(50, weapon.fireRate - (level - 1) * 20)
    };
  }

  // Check if player can shoot
  canShoot() {
    const currentTime = Date.now();
    const weapon = this.getCurrentWeapon();
    
    // Rapid fire override
    if (this.rapidFireActive) {
      return currentTime - this.lastShotTime > 50; // Very fast rapid fire
    }
    
    return currentTime - this.lastShotTime > weapon.fireRate;
  }

  // Shoot with current weapon
  shoot(player, bullets) {
    if (!this.canShoot()) return;

    const currentTime = Date.now();
    this.lastShotTime = currentTime;
    
    const weapon = this.getCurrentWeapon();
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y;

    switch (weapon.type) {
      case 'single':
        this.createSingleShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'rapid':
        this.createRapidShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'spread':
        this.createSpreadShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'homing':
        this.createHomingShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'plasma':
        this.createPlasmaShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'beam':
        this.createLaserBeam(playerCenterX, playerCenterY, weapon, bullets);
        break;
        
      case 'multi':
        this.createMultiShot(playerCenterX, playerCenterY, weapon, bullets);
        break;
      default:
        break;
    }
  }

  // Create single shot
  createSingleShot(x, y, weapon, bullets) {
    bullets.push({
      x: x - weapon.width / 2,
      y: y,
      width: weapon.width,
      height: weapon.height,
      speed: weapon.speed,
      type: 'player_laser',
      color: weapon.color,
      damage: weapon.damage,
      owner: 'player',
      weapon: weapon.name
    });
  }

  // Create rapid fire shot
  createRapidShot(x, y, weapon, bullets) {
    // Create multiple bullets in rapid succession
    for (let i = 0; i < 3; i++) {
      bullets.push({
        x: x - weapon.width / 2 + (Math.random() - 0.5) * 4,
        y: y - i * 5,
        width: weapon.width,
        height: weapon.height,
        speed: weapon.speed + Math.random() * 2,
        type: 'player_rapid',
        color: weapon.color,
        damage: weapon.damage,
        owner: 'player',
        weapon: weapon.name
      });
    }
  }

  // Create spread shot
  createSpreadShot(x, y, weapon, bullets) {
    const angles = [-weapon.spread, 0, weapon.spread];
    
    angles.forEach(angle => {
      bullets.push({
        x: x - weapon.width / 2,
        y: y,
        width: weapon.width,
        height: weapon.height,
        speed: weapon.speed,
        type: 'player_spread',
        color: weapon.color,
        damage: weapon.damage,
        owner: 'player',
        weapon: weapon.name,
        direction: angle
      });
    });
  }

  // Create homing shot
  createHomingShot(x, y, weapon, bullets) {
    bullets.push({
      x: x - weapon.width / 2,
      y: y,
      width: weapon.width,
      height: weapon.height,
      speed: weapon.speed,
      type: 'player_homing',
      color: weapon.color,
      damage: weapon.damage,
      owner: 'player',
      weapon: weapon.name,
      homing: true,
      target: null
    });
  }

  // Create plasma shot
  createPlasmaShot(x, y, weapon, bullets) {
    bullets.push({
      x: x - weapon.width / 2,
      y: y,
      width: weapon.width,
      height: weapon.height,
      speed: weapon.speed,
      type: 'player_plasma',
      color: weapon.color,
      damage: weapon.damage,
      owner: 'player',
      weapon: weapon.name,
      plasma: true,
      energy: 100
    });
  }

  // Create laser beam
  createLaserBeam(x, y, weapon, bullets) {
    bullets.push({
      x: x - weapon.width / 2,
      y: y,
      width: weapon.width,
      height: weapon.height,
      speed: weapon.speed,
      type: 'player_laser_beam',
      color: weapon.color,
      damage: weapon.damage,
      owner: 'player',
      weapon: weapon.name,
      beam: true,
      piercing: true
    });
  }

  // Create multi-shot
  createMultiShot(x, y, weapon, bullets) {
    const angles = [];
    const angleStep = weapon.spread / (weapon.count - 1);
    
    for (let i = 0; i < weapon.count; i++) {
      angles.push(-weapon.spread / 2 + i * angleStep);
    }
    
    angles.forEach(angle => {
      bullets.push({
        x: x - weapon.width / 2,
        y: y,
        width: weapon.width,
        height: weapon.height,
        speed: weapon.speed,
        type: 'player_multi',
        color: weapon.color,
        damage: weapon.damage,
        owner: 'player',
        weapon: weapon.name,
        direction: angle
      });
    });
  }

  // Switch weapon
  switchWeapon(weaponName) {
    if (this.weapons[weaponName]) {
      this.currentWeapon = weaponName;
    }
  }

  // Upgrade weapon
  upgradeWeapon() {
    if (this.weaponLevel < this.maxWeaponLevel) {
      this.weaponLevel++;
    }
  }

  // Activate rapid fire
  activateRapidFire(duration = 5000) {
    this.rapidFireActive = true;
    this.rapidFireTime = Date.now() + duration;
  }

  // Update weapon system
  update() {
    // Check rapid fire timeout
    if (this.rapidFireActive && Date.now() > this.rapidFireTime) {
      this.rapidFireActive = false;
    }
  }

  // Get available weapons
  getAvailableWeapons() {
    return Object.keys(this.weapons).map(key => ({
      key,
      ...this.weapons[key]
    }));
  }

  // Get weapon info for UI
  getWeaponInfo() {
    const weapon = this.getCurrentWeapon();
    return {
      name: weapon.name,
      type: weapon.type,
      damage: weapon.damage,
      speed: weapon.speed,
      fireRate: weapon.fireRate,
      level: this.weaponLevel,
      maxLevel: this.maxWeaponLevel,
      rapidFire: this.rapidFireActive,
      rapidFireTime: this.rapidFireTime - Date.now()
    };
  }

  // Draw weapon info on screen
  drawWeaponInfo(ctx, canvas) {
    const info = this.getWeaponInfo();
    const x = canvas.width - 200;
    const y = 20;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText(`Weapon: ${info.name}`, x, y);
    ctx.fillText(`Level: ${info.level}/${info.maxLevel}`, x, y + 20);
    ctx.fillText(`Damage: ${info.damage}`, x, y + 40);
    ctx.fillText(`Speed: ${info.speed.toFixed(1)}`, x, y + 60);
    
    if (info.rapidFire) {
      ctx.fillStyle = '#ffff00';
      ctx.fillText(`RAPID FIRE!`, x, y + 80);
      ctx.fillText(`${Math.ceil(info.rapidFireTime / 1000)}s`, x, y + 100);
    }
  }
}

export default EnhancedWeaponSystem;

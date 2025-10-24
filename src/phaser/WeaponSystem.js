// Weapon System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class WeaponSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentWeapon = 'BASIC';
    this.weaponLevels = {
      BASIC: 1,
      SPREAD: 1,
      LASER: 1,
      HOMING: 1,
      PIERCE: 1,
      EXPLOSIVE: 1,
      RAPID: 1,
      FREEZE: 1,
      ELECTRIC: 1,
      PLASMA: 1
    };
    this.weaponTypes = {
      BASIC: { 
        name: 'Basic Blaster', 
        emoji: '🔫', 
        damage: 1, 
        fireRate: 500, 
        bulletSpeed: 300,
        description: 'Standard energy blaster'
      },
      SPREAD: { 
        name: 'Spread Shot', 
        emoji: '🌟', 
        damage: 1, 
        fireRate: 600, 
        bulletSpeed: 250,
        description: 'Fires multiple bullets in a spread pattern'
      },
      LASER: { 
        name: 'Laser Cannon', 
        emoji: '🔴', 
        damage: 3, 
        fireRate: 800, 
        bulletSpeed: 400,
        description: 'High-damage laser beam'
      },
      HOMING: { 
        name: 'Homing Missiles', 
        emoji: '🎯', 
        damage: 2, 
        fireRate: 700, 
        bulletSpeed: 200,
        description: 'Missiles that track enemies'
      },
      PIERCE: { 
        name: 'Pierce Shot', 
        emoji: '⚔️', 
        damage: 2, 
        fireRate: 600, 
        bulletSpeed: 350,
        description: 'Bullets that pierce through enemies'
      },
      EXPLOSIVE: { 
        name: 'Explosive Rounds', 
        emoji: '💥', 
        damage: 4, 
        fireRate: 900, 
        bulletSpeed: 250,
        description: 'Bullets that explode on impact'
      },
      RAPID: { 
        name: 'Rapid Fire', 
        emoji: '⚡', 
        damage: 1, 
        fireRate: 200, 
        bulletSpeed: 300,
        description: 'Very fast firing rate'
      },
      FREEZE: { 
        name: 'Freeze Ray', 
        emoji: '❄️', 
        damage: 1, 
        fireRate: 500, 
        bulletSpeed: 200,
        description: 'Freezes enemies on impact'
      },
      ELECTRIC: { 
        name: 'Lightning Gun', 
        emoji: '⚡', 
        damage: 2, 
        fireRate: 400, 
        bulletSpeed: 500,
        description: 'Electric bolts that chain between enemies'
      },
      PLASMA: { 
        name: 'Plasma Cannon', 
        emoji: '🟣', 
        damage: 5, 
        fireRate: 1000, 
        bulletSpeed: 400,
        description: 'Most powerful weapon in the game'
      }
    };
    this.lastFireTime = 0;
  }

  createWeaponSprites() {
    Object.keys(this.weaponTypes).forEach(weaponType => {
      const config = this.weaponTypes[weaponType];
      const text = this.scene.add.text(0, 0, config.emoji, {
        fontSize: '24px',
        fill: '#ffffff'
      });
      text.generateTexture(`weapon_${weaponType}`, 20, 20);
      text.destroy();
    });
  }

  canFire() {
    const currentTime = this.scene.time.now;
    const weaponConfig = this.weaponTypes[this.currentWeapon];
    const fireRate = weaponConfig.fireRate / this.weaponLevels[this.currentWeapon];
    
    return currentTime - this.lastFireTime >= fireRate;
  }

  fireWeapon(x, y) {
    if (!this.canFire()) return;
    
    this.lastFireTime = this.scene.time.now;
    
    switch (this.currentWeapon) {
      case 'BASIC':
        this.fireBasic(x, y);
        break;
      case 'SPREAD':
        this.fireSpread(x, y);
        break;
      case 'LASER':
        this.fireLaser(x, y);
        break;
      case 'HOMING':
        this.fireHoming(x, y);
        break;
      case 'PIERCE':
        this.firePierce(x, y);
        break;
      case 'EXPLOSIVE':
        this.fireExplosive(x, y);
        break;
      case 'RAPID':
        this.fireRapid(x, y);
        break;
      case 'FREEZE':
        this.fireFreeze(x, y);
        break;
      case 'ELECTRIC':
        this.fireElectric(x, y);
        break;
      case 'PLASMA':
        this.firePlasma(x, y);
        break;
    }
  }

  fireBasic(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-300);
    bullet.setTint(0xffff00);
    bullet.setData('damage', this.weaponTypes.BASIC.damage * this.weaponLevels.BASIC);
    bullet.setData('type', 'basic');
  }

  fireSpread(x, y) {
    const angles = [-0.3, 0, 0.3];
    const config = this.weaponTypes.SPREAD;
    
    angles.forEach(angle => {
      const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
      bullet.setVelocityY(-config.bulletSpeed);
      bullet.setVelocityX(Math.sin(angle) * 100);
      bullet.setTint(0x00ff00);
      bullet.setData('damage', config.damage * this.weaponLevels.SPREAD);
      bullet.setData('type', 'spread');
    });
  }

  fireLaser(x, y) {
    const laser = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    laser.setVelocityY(-400);
    laser.setTint(0xff0000);
    laser.setScale(2, 3);
    laser.setData('damage', this.weaponTypes.LASER.damage * this.weaponLevels.LASER);
    laser.setData('type', 'laser');
  }

  fireHoming(x, y) {
    const missile = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    missile.setVelocityY(-200);
    missile.setTint(0xff8800);
    missile.setScale(1.5);
    missile.setData('damage', this.weaponTypes.HOMING.damage * this.weaponLevels.HOMING);
    missile.setData('type', 'homing');
    missile.setData('homing', true);
  }

  firePierce(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-350);
    bullet.setTint(0x00ffff);
    bullet.setData('damage', this.weaponTypes.PIERCE.damage * this.weaponLevels.PIERCE);
    bullet.setData('type', 'pierce');
    bullet.setData('pierce', true);
  }

  fireExplosive(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-250);
    bullet.setTint(0xff6600);
    bullet.setScale(1.5);
    bullet.setData('damage', this.weaponTypes.EXPLOSIVE.damage * this.weaponLevels.EXPLOSIVE);
    bullet.setData('type', 'explosive');
    bullet.setData('explosive', true);
  }

  fireRapid(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-300);
    bullet.setTint(0xffff00);
    bullet.setData('damage', this.weaponTypes.RAPID.damage * this.weaponLevels.RAPID);
    bullet.setData('type', 'rapid');
  }

  fireFreeze(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-200);
    bullet.setTint(0x00ffff);
    bullet.setData('damage', this.weaponTypes.FREEZE.damage * this.weaponLevels.FREEZE);
    bullet.setData('type', 'freeze');
    bullet.setData('freeze', true);
  }

  fireElectric(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-500);
    bullet.setTint(0xffff00);
    bullet.setScale(1.2);
    bullet.setData('damage', this.weaponTypes.ELECTRIC.damage * this.weaponLevels.ELECTRIC);
    bullet.setData('type', 'electric');
    bullet.setData('electric', true);
  }

  firePlasma(x, y) {
    const bullet = this.scene.bullets.create(x, y - 30, 'bulletSprite');
    bullet.setVelocityY(-400);
    bullet.setTint(0x8800ff);
    bullet.setScale(2);
    bullet.setData('damage', this.weaponTypes.PLASMA.damage * this.weaponLevels.PLASMA);
    bullet.setData('type', 'plasma');
  }

  updateBullets() {
    this.scene.bullets.children.entries.forEach(bullet => {
      // Remove bullets that are off screen
      if (bullet.y < 0) {
        bullet.destroy();
        return;
      }
      
      // Update homing bullets
      if (bullet.getData('homing')) {
        this.updateHomingBullet(bullet);
      }
      
      // Update electric bullets
      if (bullet.getData('electric')) {
        this.updateElectricBullet(bullet);
      }
    });
  }

  updateHomingBullet(bullet) {
    if (this.scene.enemies.children.entries.length > 0) {
      const nearestEnemy = this.findNearestEnemy(bullet);
      if (nearestEnemy) {
        const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, nearestEnemy.x, nearestEnemy.y);
        bullet.setVelocityX(Math.cos(angle) * 200);
        bullet.setVelocityY(Math.sin(angle) * 200);
      }
    }
  }

  updateElectricBullet(bullet) {
    // Electric bullets create chain lightning
    const nearbyEnemies = this.scene.enemies.children.entries.filter(enemy => 
      Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y) < 100
    );
    
    if (nearbyEnemies.length > 0) {
      this.createChainLightning(bullet.x, bullet.y, nearbyEnemies);
    }
  }

  findNearestEnemy(bullet) {
    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    this.scene.enemies.children.entries.forEach(enemy => {
      const distance = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestEnemy = enemy;
      }
    });
    
    return nearestEnemy;
  }

  createChainLightning(x, y, enemies) {
    enemies.forEach((enemy, index) => {
      this.scene.time.delayedCall(index * 100, () => {
        this.createLightningEffect(x, y, enemy.x, enemy.y);
        this.scene.enemySystem.damageEnemy(enemy, 2);
      });
    });
  }

  createLightningEffect(x1, y1, x2, y2) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(3, 0xffff00, 0.8);
    graphics.beginPath();
    graphics.moveTo(x1, y1);
    graphics.lineTo(x2, y2);
    graphics.strokePath();
    
    this.scene.time.delayedCall(200, () => {
      graphics.destroy();
    });
  }

  switchWeapon(weaponType) {
    if (this.weaponTypes[weaponType]) {
      this.currentWeapon = weaponType;
    }
  }

  upgradeWeapon(weaponType) {
    if (this.weaponLevels[weaponType] < 5) {
      this.weaponLevels[weaponType]++;
    }
  }

  getCurrentWeaponInfo() {
    return {
      type: this.currentWeapon,
      config: this.weaponTypes[this.currentWeapon],
      level: this.weaponLevels[this.currentWeapon]
    };
  }

  getAllWeapons() {
    return Object.keys(this.weaponTypes).map(weaponType => ({
      type: weaponType,
      config: this.weaponTypes[weaponType],
      level: this.weaponLevels[weaponType]
    }));
  }
}

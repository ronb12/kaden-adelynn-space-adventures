export interface Weapon {
  id: string;
  name: string;
  type: 'basic' | 'rapid' | 'spread' | 'homing' | 'plasma' | 'laser' | 'multi' | 'explosive' | 'piercing' | 'freeze' | 'electric' | 'fire' | 'ice' | 'poison' | 'gravity' | 'time' | 'space' | 'quantum' | 'cosmic' | 'ultimate';
  damage: number;
  speed: number;
  fireRate: number;
  color: string;
  size: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';
  unlockLevel: number;
  cost: number;
  specialEffect?: string;
}

export class AdvancedWeaponSystem {
  private weapons: Weapon[] = [];
  private currentWeapon: Weapon;
  private unlockedWeapons: Set<string> = new Set(['basic']);
  private weaponLevels: Map<string, number> = new Map();

  constructor() {
    this.initializeWeapons();
    this.currentWeapon = this.weapons.find(w => w.id === 'basic')!;
  }

  private initializeWeapons() {
    this.weapons = [
      // Basic Weapons
      { id: 'basic', name: 'Plasma Cannon', type: 'basic', damage: 10, speed: 8, fireRate: 300, color: '#00ffff', size: 3, description: 'Standard plasma weapon', rarity: 'common', unlockLevel: 1, cost: 0 },
      { id: 'rapid', name: 'Rapid Fire', type: 'rapid', damage: 8, speed: 10, fireRate: 150, color: '#ffff00', size: 2, description: 'High-speed projectiles', rarity: 'common', unlockLevel: 2, cost: 100 },
      { id: 'spread', name: 'Spread Shot', type: 'spread', damage: 12, speed: 6, fireRate: 400, color: '#ff8800', size: 4, description: 'Wide area coverage', rarity: 'common', unlockLevel: 3, cost: 150 },
      
      // Advanced Weapons
      { id: 'homing', name: 'Homing Missiles', type: 'homing', damage: 15, speed: 5, fireRate: 500, color: '#ff00ff', size: 5, description: 'Target-seeking missiles', rarity: 'rare', unlockLevel: 5, cost: 300 },
      { id: 'plasma', name: 'Plasma Beam', type: 'plasma', damage: 20, speed: 12, fireRate: 600, color: '#00ff00', size: 6, description: 'High-energy plasma beam', rarity: 'rare', unlockLevel: 6, cost: 400 },
      { id: 'laser', name: 'Laser Cannon', type: 'laser', damage: 25, speed: 15, fireRate: 800, color: '#ff0000', size: 4, description: 'Precise laser weapon', rarity: 'rare', unlockLevel: 7, cost: 500 },
      { id: 'multi', name: 'Multi-Shot', type: 'multi', damage: 18, speed: 8, fireRate: 350, color: '#8800ff', size: 3, description: 'Multiple projectiles', rarity: 'rare', unlockLevel: 8, cost: 600 },
      
      // Explosive Weapons
      { id: 'explosive', name: 'Explosive Rounds', type: 'explosive', damage: 30, speed: 6, fireRate: 700, color: '#ff4400', size: 8, description: 'Area damage explosives', rarity: 'epic', unlockLevel: 10, cost: 800 },
      { id: 'piercing', name: 'Piercing Shot', type: 'piercing', damage: 22, speed: 10, fireRate: 500, color: '#4400ff', size: 4, description: 'Penetrates multiple enemies', rarity: 'epic', unlockLevel: 12, cost: 1000 },
      { id: 'freeze', name: 'Freeze Ray', type: 'freeze', damage: 15, speed: 7, fireRate: 400, color: '#00aaff', size: 5, description: 'Slows enemies', rarity: 'epic', unlockLevel: 14, cost: 1200 },
      
      // Elemental Weapons
      { id: 'electric', name: 'Lightning Gun', type: 'electric', damage: 28, speed: 12, fireRate: 450, color: '#ffff00', size: 6, description: 'Electric chain damage', rarity: 'epic', unlockLevel: 16, cost: 1500 },
      { id: 'fire', name: 'Flame Thrower', type: 'fire', damage: 24, speed: 8, fireRate: 300, color: '#ff2200', size: 7, description: 'Continuous fire damage', rarity: 'epic', unlockLevel: 18, cost: 1800 },
      { id: 'ice', name: 'Ice Shards', type: 'ice', damage: 20, speed: 9, fireRate: 350, color: '#88ffff', size: 4, description: 'Freezing projectiles', rarity: 'epic', unlockLevel: 20, cost: 2000 },
      { id: 'poison', name: 'Toxic Darts', type: 'poison', damage: 18, speed: 6, fireRate: 400, color: '#88ff00', size: 3, description: 'Poison over time', rarity: 'epic', unlockLevel: 22, cost: 2200 },
      
      // Advanced Physics Weapons
      { id: 'gravity', name: 'Gravity Well', type: 'gravity', damage: 35, speed: 4, fireRate: 1000, color: '#440044', size: 10, description: 'Pulls enemies together', rarity: 'legendary', unlockLevel: 25, cost: 3000 },
      { id: 'time', name: 'Time Dilation', type: 'time', damage: 32, speed: 14, fireRate: 600, color: '#ff88ff', size: 5, description: 'Slows time around projectiles', rarity: 'legendary', unlockLevel: 28, cost: 4000 },
      { id: 'space', name: 'Spatial Rift', type: 'space', damage: 40, speed: 8, fireRate: 800, color: '#0088ff', size: 8, description: 'Teleports through enemies', rarity: 'legendary', unlockLevel: 30, cost: 5000 },
      
      // Quantum Weapons
      { id: 'quantum', name: 'Quantum Blaster', type: 'quantum', damage: 45, speed: 16, fireRate: 500, color: '#ff0088', size: 6, description: 'Quantum uncertainty projectiles', rarity: 'legendary', unlockLevel: 35, cost: 7500 },
      { id: 'cosmic', name: 'Cosmic Ray', type: 'cosmic', damage: 50, speed: 18, fireRate: 1000, color: '#ffffff', size: 10, description: 'Cosmic energy beam', rarity: 'legendary', unlockLevel: 40, cost: 10000 },
      { id: 'ultimate', name: 'Ultimate Destroyer', type: 'ultimate', damage: 100, speed: 20, fireRate: 200, color: '#ff0000', size: 15, description: 'The ultimate weapon', rarity: 'ultimate', unlockLevel: 50, cost: 50000 }
    ];
  }

  getWeapon(id: string): Weapon | undefined {
    return this.weapons.find(w => w.id === id);
  }

  getAllWeapons(): Weapon[] {
    return this.weapons;
  }

  getUnlockedWeapons(): Weapon[] {
    return this.weapons.filter(w => this.unlockedWeapons.has(w.id));
  }

  getCurrentWeapon(): Weapon {
    return this.currentWeapon;
  }

  switchWeapon(weaponId: string): boolean {
    if (this.unlockedWeapons.has(weaponId)) {
      const weapon = this.getWeapon(weaponId);
      if (weapon) {
        this.currentWeapon = weapon;
        return true;
      }
    }
    return false;
  }

  unlockWeapon(weaponId: string): boolean {
    const weapon = this.getWeapon(weaponId);
    if (weapon && !this.unlockedWeapons.has(weaponId)) {
      this.unlockedWeapons.add(weaponId);
      return true;
    }
    return false;
  }

  upgradeWeapon(weaponId: string): boolean {
    const currentLevel = this.weaponLevels.get(weaponId) || 1;
    const maxLevel = 10;
    
    if (currentLevel < maxLevel) {
      this.weaponLevels.set(weaponId, currentLevel + 1);
      return true;
    }
    return false;
  }

  getWeaponLevel(weaponId: string): number {
    return this.weaponLevels.get(weaponId) || 1;
  }

  canUnlockWeapon(weaponId: string, playerLevel: number, playerScore: number): boolean {
    const weapon = this.getWeapon(weaponId);
    if (!weapon) return false;
    
    return playerLevel >= weapon.unlockLevel && playerScore >= weapon.cost;
  }

  shootWeapon(playerX: number, playerY: number, playerWidth: number): any[] {
    const bullets = [];
    const weapon = this.currentWeapon;
    const level = this.getWeaponLevel(weapon.id);
    const damage = weapon.damage * level;
    const speed = weapon.speed + (level * 0.5);
    const size = weapon.size + (level * 0.5);

    switch (weapon.type) {
      case 'basic':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color
        });
        break;

      case 'rapid':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 1.5,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color
        });
        break;

      case 'spread':
        for (let i = -1; i <= 1; i++) {
          bullets.push({
            x: playerX + playerWidth / 2 - size / 2 + (i * 20),
            y: playerY - 5,
            width: size,
            height: size * 2,
            speed: speed,
            direction: -1,
            type: 'player',
            damage: damage,
            color: weapon.color,
            angle: i * 0.3
          });
        }
        break;

      case 'homing':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          homing: true
        });
        break;

      case 'plasma':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 3,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          plasma: true
        });
        break;

      case 'laser':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 4,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          laser: true
        });
        break;

      case 'multi':
        for (let i = 0; i < 3; i++) {
          bullets.push({
            x: playerX + playerWidth / 2 - size / 2 + (i - 1) * 15,
            y: playerY - 5,
            width: size,
            height: size * 2,
            speed: speed,
            direction: -1,
            type: 'player',
            damage: damage,
            color: weapon.color
          });
        }
        break;

      case 'explosive':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          explosive: true,
          explosionRadius: size * 3
        });
        break;

      case 'piercing':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          piercing: true
        });
        break;

      case 'freeze':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          freeze: true
        });
        break;

      case 'electric':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          electric: true,
          chainTargets: 3
        });
        break;

      case 'fire':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          fire: true,
          burnDuration: 3000
        });
        break;

      case 'ice':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          ice: true
        });
        break;

      case 'poison':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          poison: true,
          poisonDuration: 5000
        });
        break;

      case 'gravity':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          gravity: true,
          pullRadius: size * 4
        });
        break;

      case 'time':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          timeDilation: true
        });
        break;

      case 'space':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          teleport: true
        });
        break;

      case 'quantum':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          quantum: true
        });
        break;

      case 'cosmic':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          cosmic: true
        });
        break;

      case 'ultimate':
        bullets.push({
          x: playerX + playerWidth / 2 - size / 2,
          y: playerY - 5,
          width: size,
          height: size * 2,
          speed: speed,
          direction: -1,
          type: 'player',
          damage: damage,
          color: weapon.color,
          ultimate: true
        });
        break;
    }

    return bullets;
  }

  getWeaponInfo(weaponId: string): string {
    const weapon = this.getWeapon(weaponId);
    if (!weapon) return '';
    
    const level = this.getWeaponLevel(weaponId);
    return `${weapon.name} (Level ${level}) - ${weapon.description}`;
  }

  getWeaponStats(weaponId: string): any {
    const weapon = this.getWeapon(weaponId);
    if (!weapon) return null;
    
    const level = this.getWeaponLevel(weaponId);
    return {
      name: weapon.name,
      level: level,
      damage: weapon.damage * level,
      speed: weapon.speed + (level * 0.5),
      fireRate: Math.max(50, weapon.fireRate - (level * 10)),
      size: weapon.size + (level * 0.5),
      rarity: weapon.rarity,
      unlocked: this.unlockedWeapons.has(weaponId)
    };
  }
}

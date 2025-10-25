export interface MoneyCollectible {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  type: 'coin' | 'gem' | 'credit' | 'energy_core';
  collected: boolean;
  animationTime: number;
}

export interface PlayerMoney {
  coins: number;
  gems: number;
  credits: number;
  energyCores: number;
  totalValue: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'weapon' | 'ship' | 'shield' | 'engine' | 'special';
  level: number;
  maxLevel: number;
  cost: {
    coins: number;
    gems: number;
    credits: number;
    energyCores: number;
  };
  effects: {
    damage?: number;
    speed?: number;
    health?: number;
    fireRate?: number;
    shield?: number;
  };
  unlocked: boolean;
  icon: string;
}

export class MoneySystem {
  private moneyCollectibles: MoneyCollectible[] = [];
  private playerMoney: PlayerMoney = {
    coins: 0,
    gems: 0,
    credits: 0,
    energyCores: 0,
    totalValue: 0
  };
  private upgrades: Upgrade[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 5000; // 5 seconds

  constructor() {
    this.initializeUpgrades();
  }

  private initializeUpgrades() {
    this.upgrades = [
      // Weapon Upgrades
      {
        id: 'laser_upgrade',
        name: 'Laser Enhancement',
        description: 'Increases laser damage by 25%',
        category: 'weapon',
        level: 0,
        maxLevel: 5,
        cost: { coins: 100, gems: 0, credits: 0, energyCores: 0 },
        effects: { damage: 25 },
        unlocked: true,
        icon: '⚡'
      },
      {
        id: 'rapid_fire',
        name: 'Rapid Fire System',
        description: 'Increases fire rate by 30%',
        category: 'weapon',
        level: 0,
        maxLevel: 3,
        cost: { coins: 200, gems: 5, credits: 0, energyCores: 0 },
        effects: { fireRate: 30 },
        unlocked: true,
        icon: '🔥'
      },
      {
        id: 'plasma_cannon',
        name: 'Plasma Cannon',
        description: 'Unlocks powerful plasma weapon',
        category: 'weapon',
        level: 0,
        maxLevel: 1,
        cost: { coins: 500, gems: 20, credits: 10, energyCores: 0 },
        effects: { damage: 100 },
        unlocked: false,
        icon: '💥'
      },
      
      // Ship Upgrades
      {
        id: 'hull_reinforcement',
        name: 'Hull Reinforcement',
        description: 'Increases ship health by 50',
        category: 'ship',
        level: 0,
        maxLevel: 5,
        cost: { coins: 150, gems: 0, credits: 0, energyCores: 0 },
        effects: { health: 50 },
        unlocked: true,
        icon: '🛡️'
      },
      {
        id: 'engine_boost',
        name: 'Engine Boost',
        description: 'Increases ship speed by 20%',
        category: 'engine',
        level: 0,
        maxLevel: 3,
        cost: { coins: 300, gems: 10, credits: 0, energyCores: 0 },
        effects: { speed: 20 },
        unlocked: true,
        icon: '🚀'
      },
      {
        id: 'quantum_shield',
        name: 'Quantum Shield',
        description: 'Advanced energy shield system',
        category: 'shield',
        level: 0,
        maxLevel: 1,
        cost: { coins: 1000, gems: 50, credits: 25, energyCores: 5 },
        effects: { shield: 200 },
        unlocked: false,
        icon: '🔮'
      },
      
      // Special Upgrades
      {
        id: 'wing_fighter_support',
        name: 'Wing Fighter Support',
        description: 'Deploys AI wing fighters',
        category: 'special',
        level: 0,
        maxLevel: 1,
        cost: { coins: 2000, gems: 100, credits: 50, energyCores: 10 },
        effects: {},
        unlocked: false,
        icon: '✈️'
      },
      {
        id: 'time_dilation',
        name: 'Time Dilation Field',
        description: 'Slows down enemy projectiles',
        category: 'special',
        level: 0,
        maxLevel: 1,
        cost: { coins: 5000, gems: 200, credits: 100, energyCores: 25 },
        effects: {},
        unlocked: false,
        icon: '⏰'
      }
    ];
  }

  spawnMoneyCollectible(canvas: HTMLCanvasElement, x?: number, y?: number): MoneyCollectible {
    const types: Array<'coin' | 'gem' | 'credit' | 'energy_core'> = ['coin', 'gem', 'credit', 'energy_core'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const collectible: MoneyCollectible = {
      id: `money_${Date.now()}_${Math.random()}`,
      x: x || Math.random() * (canvas.width - 20),
      y: y || -20,
      width: 20,
      height: 20,
      value: this.getValueForType(type),
      type,
      collected: false,
      animationTime: 0
    };

    this.moneyCollectibles.push(collectible);
    return collectible;
  }

  private getValueForType(type: string): number {
    switch (type) {
      case 'coin': return 1;
      case 'gem': return 5;
      case 'credit': return 10;
      case 'energy_core': return 25;
      default: return 1;
    }
  }

  updateMoneyCollectibles(deltaTime: number, canvas: HTMLCanvasElement): void {
    this.moneyCollectibles = this.moneyCollectibles.filter(collectible => {
      if (collectible.collected) return false;
      
      collectible.y += 2; // Fall down
      collectible.animationTime += deltaTime;
      
      // Remove if off screen
      if (collectible.y > canvas.height + 50) {
        return false;
      }
      
      return true;
    });

    // Spawn new money collectibles
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      if (Math.random() < 0.3) { // 30% chance to spawn
        this.spawnMoneyCollectible(canvas);
      }
    }
  }

  collectMoney(collectible: MoneyCollectible): void {
    if (collectible.collected) return;
    
    collectible.collected = true;
    
    switch (collectible.type) {
      case 'coin':
        this.playerMoney.coins += collectible.value;
        break;
      case 'gem':
        this.playerMoney.gems += collectible.value;
        break;
      case 'credit':
        this.playerMoney.credits += collectible.value;
        break;
      case 'energy_core':
        this.playerMoney.energyCores += collectible.value;
        break;
    }
    
    this.updateTotalValue();
  }

  private updateTotalValue(): void {
    this.playerMoney.totalValue = 
      this.playerMoney.coins + 
      (this.playerMoney.gems * 5) + 
      (this.playerMoney.credits * 10) + 
      (this.playerMoney.energyCores * 25);
  }

  canAffordUpgrade(upgrade: Upgrade): boolean {
    return this.playerMoney.coins >= upgrade.cost.coins &&
           this.playerMoney.gems >= upgrade.cost.gems &&
           this.playerMoney.credits >= upgrade.cost.credits &&
           this.playerMoney.energyCores >= upgrade.cost.energyCores;
  }

  purchaseUpgrade(upgradeId: string): boolean {
    const upgrade = this.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || !this.canAffordUpgrade(upgrade)) {
      return false;
    }

    // Deduct cost
    this.playerMoney.coins -= upgrade.cost.coins;
    this.playerMoney.gems -= upgrade.cost.gems;
    this.playerMoney.credits -= upgrade.cost.credits;
    this.playerMoney.energyCores -= upgrade.cost.energyCores;

    // Upgrade
    upgrade.level++;
    upgrade.unlocked = true;

    // Update cost for next level
    upgrade.cost.coins = Math.floor(upgrade.cost.coins * 1.5);
    upgrade.cost.gems = Math.floor(upgrade.cost.gems * 1.3);
    upgrade.cost.credits = Math.floor(upgrade.cost.credits * 1.4);
    upgrade.cost.energyCores = Math.floor(upgrade.cost.energyCores * 1.2);

    this.updateTotalValue();
    return true;
  }

  getMoneyCollectibles(): MoneyCollectible[] {
    return this.moneyCollectibles;
  }

  getPlayerMoney(): PlayerMoney {
    return this.playerMoney;
  }

  getUpgrades(): Upgrade[] {
    return this.upgrades;
  }

  getUpgradeById(id: string): Upgrade | undefined {
    return this.upgrades.find(u => u.id === id);
  }

  // Save/Load functionality
  saveGame(): string {
    const saveData = {
      playerMoney: this.playerMoney,
      upgrades: this.upgrades,
      timestamp: Date.now()
    };
    return JSON.stringify(saveData);
  }

  loadGame(saveData: string): boolean {
    try {
      const data = JSON.parse(saveData);
      this.playerMoney = data.playerMoney;
      this.upgrades = data.upgrades;
      this.updateTotalValue();
      return true;
    } catch (error) {
      console.error('Failed to load game data:', error);
      return false;
    }
  }

  // Reset game
  resetGame(): void {
    this.playerMoney = {
      coins: 0,
      gems: 0,
      credits: 0,
      energyCores: 0,
      totalValue: 0
    };
    this.moneyCollectibles = [];
    this.initializeUpgrades();
  }
}


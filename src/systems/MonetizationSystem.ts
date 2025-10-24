export interface Currency {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  type: 'premium' | 'earned' | 'bonus';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'ship' | 'powerup' | 'cosmetic' | 'currency' | 'premium';
  category: 'weapons' | 'ships' | 'powerups' | 'cosmetics' | 'bundles' | 'currency';
  price: number;
  currency: 'credits' | 'gems' | 'coins' | 'premium';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'ultimate';
  unlockLevel: number;
  icon: string;
  preview?: string;
  stats?: any;
  effects?: string[];
  limited?: boolean;
  limitedTime?: Date;
  discount?: number;
  bundle?: string[];
  requirements?: ShopItemRequirement[];
}

export interface ShopItemRequirement {
  type: 'level' | 'achievement' | 'mission' | 'currency' | 'item';
  target: string | number;
  description: string;
}

export interface Purchase {
  id: string;
  itemId: string;
  playerId: string;
  amount: number;
  currency: string;
  price: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  receipt?: string;
}

export interface AdReward {
  id: string;
  type: 'video' | 'banner' | 'interstitial' | 'rewarded';
  reward: AdRewardItem;
  cooldown: number;
  maxPerDay: number;
  currentCount: number;
  lastWatched: Date;
}

export interface AdRewardItem {
  type: 'currency' | 'weapon' | 'ship' | 'powerup' | 'lives' | 'score';
  amount: number;
  item?: string;
  description: string;
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in days
  benefits: SubscriptionBenefit[];
  active: boolean;
  startDate?: Date;
  endDate?: Date;
  autoRenew: boolean;
}

export interface SubscriptionBenefit {
  type: 'currency' | 'weapon' | 'ship' | 'powerup' | 'lives' | 'score' | 'experience';
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  description: string;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  items: BundleItem[];
  price: number;
  currency: string;
  discount: number;
  limited: boolean;
  limitedTime?: Date;
  unlockLevel: number;
  icon: string;
}

export interface BundleItem {
  type: 'weapon' | 'ship' | 'powerup' | 'currency' | 'cosmetic';
  itemId: string;
  amount: number;
  description: string;
}

export class MonetizationSystem {
  private currencies: Map<string, Currency> = new Map();
  private shopItems: Map<string, ShopItem> = new Map();
  private purchases: Purchase[] = [];
  private adRewards: Map<string, AdReward> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private bundles: Map<string, Bundle> = new Map();
  private playerId: string = '';

  constructor() {
    this.initializeCurrencies();
    this.initializeShopItems();
    this.initializeAdRewards();
    this.initializeSubscriptions();
    this.initializeBundles();
  }

  private initializeCurrencies() {
    this.currencies.set('credits', {
      id: 'credits',
      name: 'Space Credits',
      symbol: 'C',
      amount: 0,
      type: 'earned'
    });

    this.currencies.set('gems', {
      id: 'gems',
      name: 'Cosmic Gems',
      symbol: '💎',
      amount: 0,
      type: 'premium'
    });

    this.currencies.set('coins', {
      id: 'coins',
      name: 'Galaxy Coins',
      symbol: '🪙',
      amount: 0,
      type: 'earned'
    });

    this.currencies.set('premium', {
      id: 'premium',
      name: 'Premium Currency',
      symbol: '⭐',
      amount: 0,
      type: 'premium'
    });
  }

  private initializeShopItems() {
    const items: ShopItem[] = [
      // Weapons
      {
        id: 'weapon_rapid',
        name: 'Rapid Fire Cannon',
        description: 'High-speed projectile weapon',
        type: 'weapon',
        category: 'weapons',
        price: 100,
        currency: 'credits',
        rarity: 'common',
        unlockLevel: 2,
        icon: '🔫',
        stats: { damage: 8, speed: 10, fireRate: 150 }
      },
      {
        id: 'weapon_plasma',
        name: 'Plasma Beam',
        description: 'High-energy plasma weapon',
        type: 'weapon',
        category: 'weapons',
        price: 500,
        currency: 'credits',
        rarity: 'rare',
        unlockLevel: 5,
        icon: '⚡',
        stats: { damage: 20, speed: 12, fireRate: 600 }
      },
      {
        id: 'weapon_laser',
        name: 'Laser Cannon',
        description: 'Precise laser weapon',
        type: 'weapon',
        category: 'weapons',
        price: 1000,
        currency: 'credits',
        rarity: 'epic',
        unlockLevel: 8,
        icon: '🔴',
        stats: { damage: 25, speed: 15, fireRate: 800 }
      },
      {
        id: 'weapon_ultimate',
        name: 'Ultimate Destroyer',
        description: 'The ultimate weapon',
        type: 'weapon',
        category: 'weapons',
        price: 5000,
        currency: 'gems',
        rarity: 'ultimate',
        unlockLevel: 20,
        icon: '💥',
        stats: { damage: 100, speed: 20, fireRate: 200 }
      },

      // Ships
      {
        id: 'ship_fighter',
        name: 'Space Fighter',
        description: 'Fast and agile fighter ship',
        type: 'ship',
        category: 'ships',
        price: 200,
        currency: 'credits',
        rarity: 'common',
        unlockLevel: 3,
        icon: '🚀',
        stats: { speed: 3, health: 100, agility: 5 }
      },
      {
        id: 'ship_destroyer',
        name: 'Destroyer Class',
        description: 'Heavy combat ship',
        type: 'ship',
        category: 'ships',
        price: 1000,
        currency: 'credits',
        rarity: 'rare',
        unlockLevel: 10,
        icon: '🛸',
        stats: { speed: 2, health: 200, agility: 3 }
      },
      {
        id: 'ship_legendary',
        name: 'Legendary Cruiser',
        description: 'Legendary space cruiser',
        type: 'ship',
        category: 'ships',
        price: 3000,
        currency: 'gems',
        rarity: 'legendary',
        unlockLevel: 15,
        icon: '🌟',
        stats: { speed: 4, health: 300, agility: 4 }
      },

      // Power-ups
      {
        id: 'powerup_shield',
        name: 'Energy Shield',
        description: 'Temporary energy shield',
        type: 'powerup',
        category: 'powerups',
        price: 50,
        currency: 'credits',
        rarity: 'common',
        unlockLevel: 1,
        icon: '🛡️',
        effects: ['shield', 'damage_reduction']
      },
      {
        id: 'powerup_rapid',
        name: 'Rapid Fire Boost',
        description: 'Temporary rapid fire boost',
        type: 'powerup',
        category: 'powerups',
        price: 75,
        currency: 'credits',
        rarity: 'common',
        unlockLevel: 2,
        icon: '⚡',
        effects: ['rapid_fire', 'fire_rate_boost']
      },

      // Cosmetics
      {
        id: 'cosmetic_trail',
        name: 'Energy Trail',
        description: 'Cosmetic energy trail effect',
        type: 'cosmetic',
        category: 'cosmetics',
        price: 100,
        currency: 'credits',
        rarity: 'common',
        unlockLevel: 1,
        icon: '✨',
        effects: ['trail_effect', 'energy_trail']
      },
      {
        id: 'cosmetic_explosion',
        name: 'Cosmic Explosion',
        description: 'Enhanced explosion effects',
        type: 'cosmetic',
        category: 'cosmetics',
        price: 200,
        currency: 'credits',
        rarity: 'rare',
        unlockLevel: 5,
        icon: '💥',
        effects: ['explosion_effect', 'cosmic_explosion']
      },

      // Currency Packs
      {
        id: 'currency_credits_100',
        name: '100 Space Credits',
        description: '100 Space Credits',
        type: 'currency',
        category: 'currency',
        price: 0.99,
        currency: 'premium',
        rarity: 'common',
        unlockLevel: 1,
        icon: 'C',
        effects: ['credits_100']
      },
      {
        id: 'currency_credits_500',
        name: '500 Space Credits',
        description: '500 Space Credits',
        type: 'currency',
        category: 'currency',
        price: 4.99,
        currency: 'premium',
        rarity: 'common',
        unlockLevel: 1,
        icon: 'C',
        effects: ['credits_500']
      },
      {
        id: 'currency_gems_100',
        name: '100 Cosmic Gems',
        description: '100 Cosmic Gems',
        type: 'currency',
        category: 'currency',
        price: 1.99,
        currency: 'premium',
        rarity: 'rare',
        unlockLevel: 1,
        icon: '💎',
        effects: ['gems_100']
      }
    ];

    items.forEach(item => {
      this.shopItems.set(item.id, item);
    });
  }

  private initializeAdRewards() {
    this.adRewards.set('video_credits', {
      id: 'video_credits',
      type: 'video',
      reward: {
        type: 'currency',
        amount: 50,
        item: 'credits',
        description: '50 Space Credits'
      },
      cooldown: 300000, // 5 minutes
      maxPerDay: 10,
      currentCount: 0,
      lastWatched: new Date(0)
    });

    this.adRewards.set('video_lives', {
      id: 'video_lives',
      type: 'video',
      reward: {
        type: 'lives',
        amount: 1,
        description: '1 Extra Life'
      },
      cooldown: 600000, // 10 minutes
      maxPerDay: 5,
      currentCount: 0,
      lastWatched: new Date(0)
    });

    this.adRewards.set('video_powerup', {
      id: 'video_powerup',
      type: 'video',
      reward: {
        type: 'powerup',
        amount: 1,
        item: 'random',
        description: 'Random Power-up'
      },
      cooldown: 900000, // 15 minutes
      maxPerDay: 3,
      currentCount: 0,
      lastWatched: new Date(0)
    });
  }

  private initializeSubscriptions() {
    this.subscriptions.set('premium_monthly', {
      id: 'premium_monthly',
      name: 'Premium Monthly',
      description: 'Monthly premium subscription',
      price: 9.99,
      currency: 'premium',
      duration: 30,
      benefits: [
        {
          type: 'currency',
          amount: 100,
          frequency: 'daily',
          description: '100 Space Credits daily'
        },
        {
          type: 'currency',
          amount: 10,
          frequency: 'daily',
          description: '10 Cosmic Gems daily'
        },
        {
          type: 'experience',
          amount: 2,
          frequency: 'daily',
          description: '2x Experience multiplier'
        }
      ],
      active: false,
      autoRenew: true
    });

    this.subscriptions.set('premium_yearly', {
      id: 'premium_yearly',
      name: 'Premium Yearly',
      description: 'Yearly premium subscription',
      price: 99.99,
      currency: 'premium',
      duration: 365,
      benefits: [
        {
          type: 'currency',
          amount: 150,
          frequency: 'daily',
          description: '150 Space Credits daily'
        },
        {
          type: 'currency',
          amount: 15,
          frequency: 'daily',
          description: '15 Cosmic Gems daily'
        },
        {
          type: 'experience',
          amount: 3,
          frequency: 'daily',
          description: '3x Experience multiplier'
        }
      ],
      active: false,
      autoRenew: true
    });
  }

  private initializeBundles() {
    this.bundles.set('starter_pack', {
      id: 'starter_pack',
      name: 'Starter Pack',
      description: 'Perfect for new players',
      items: [
        { type: 'weapon', itemId: 'weapon_rapid', amount: 1, description: 'Rapid Fire Cannon' },
        { type: 'ship', itemId: 'ship_fighter', amount: 1, description: 'Space Fighter' },
        { type: 'currency', itemId: 'credits', amount: 500, description: '500 Space Credits' }
      ],
      price: 4.99,
      currency: 'premium',
      discount: 50,
      limited: false,
      unlockLevel: 1,
      icon: '🎁'
    });

    this.bundles.set('weapon_pack', {
      id: 'weapon_pack',
      name: 'Weapon Pack',
      description: 'Collection of powerful weapons',
      items: [
        { type: 'weapon', itemId: 'weapon_plasma', amount: 1, description: 'Plasma Beam' },
        { type: 'weapon', itemId: 'weapon_laser', amount: 1, description: 'Laser Cannon' },
        { type: 'currency', itemId: 'credits', amount: 1000, description: '1000 Space Credits' }
      ],
      price: 9.99,
      currency: 'premium',
      discount: 30,
      limited: false,
      unlockLevel: 5,
      icon: '🔫'
    });

    this.bundles.set('ultimate_pack', {
      id: 'ultimate_pack',
      name: 'Ultimate Pack',
      description: 'The ultimate collection',
      items: [
        { type: 'weapon', itemId: 'weapon_ultimate', amount: 1, description: 'Ultimate Destroyer' },
        { type: 'ship', itemId: 'ship_legendary', amount: 1, description: 'Legendary Cruiser' },
        { type: 'currency', itemId: 'gems', amount: 500, description: '500 Cosmic Gems' }
      ],
      price: 29.99,
      currency: 'premium',
      discount: 40,
      limited: true,
      limitedTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      unlockLevel: 20,
      icon: '👑'
    });
  }

  setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  getCurrency(currencyId: string): Currency | null {
    return this.currencies.get(currencyId) || null;
  }

  getAllCurrencies(): Currency[] {
    return Array.from(this.currencies.values());
  }

  addCurrency(currencyId: string, amount: number): boolean {
    const currency = this.currencies.get(currencyId);
    if (currency) {
      currency.amount += amount;
      return true;
    }
    return false;
  }

  spendCurrency(currencyId: string, amount: number): boolean {
    const currency = this.currencies.get(currencyId);
    if (currency && currency.amount >= amount) {
      currency.amount -= amount;
      return true;
    }
    return false;
  }

  getShopItems(category?: string): ShopItem[] {
    let items = Array.from(this.shopItems.values());
    
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    return items;
  }

  getShopItem(itemId: string): ShopItem | null {
    return this.shopItems.get(itemId) || null;
  }

  canPurchase(itemId: string, playerLevel: number): boolean {
    const item = this.shopItems.get(itemId);
    if (!item) return false;
    
    if (playerLevel < item.unlockLevel) return false;
    
    const currency = this.currencies.get(item.currency);
    if (!currency || currency.amount < item.price) return false;
    
    return true;
  }

  purchaseItem(itemId: string): Purchase | null {
    const item = this.shopItems.get(itemId);
    if (!item) return null;
    
    if (!this.canPurchase(itemId, 1)) return null; // Assuming player level 1 for now
    
    if (!this.spendCurrency(item.currency, item.price)) return null;
    
    const purchase: Purchase = {
      id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemId: itemId,
      playerId: this.playerId,
      amount: 1,
      currency: item.currency,
      price: item.price,
      timestamp: new Date(),
      status: 'completed'
    };
    
    this.purchases.push(purchase);
    return purchase;
  }

  getAdRewards(): AdReward[] {
    return Array.from(this.adRewards.values());
  }

  canWatchAd(rewardId: string): boolean {
    const reward = this.adRewards.get(rewardId);
    if (!reward) return false;
    
    const now = new Date();
    const timeSinceLastWatched = now.getTime() - reward.lastWatched.getTime();
    
    if (timeSinceLastWatched < reward.cooldown) return false;
    if (reward.currentCount >= reward.maxPerDay) return false;
    
    return true;
  }

  watchAd(rewardId: string): AdRewardItem | null {
    const reward = this.adRewards.get(rewardId);
    if (!reward || !this.canWatchAd(rewardId)) return null;
    
    reward.currentCount++;
    reward.lastWatched = new Date();
    
    // Apply reward
    if (reward.reward.type === 'currency') {
      this.addCurrency(reward.reward.item || 'credits', reward.reward.amount);
    }
    
    return reward.reward;
  }

  getSubscriptions(): Subscription[] {
    return Array.from(this.subscriptions.values());
  }

  subscribe(subscriptionId: string): boolean {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return false;
    
    subscription.active = true;
    subscription.startDate = new Date();
    subscription.endDate = new Date(Date.now() + subscription.duration * 24 * 60 * 60 * 1000);
    
    return true;
  }

  getBundles(): Bundle[] {
    return Array.from(this.bundles.values());
  }

  getBundle(bundleId: string): Bundle | null {
    return this.bundles.get(bundleId) || null;
  }

  purchaseBundle(bundleId: string): Purchase | null {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) return null;
    
    if (!this.spendCurrency(bundle.currency, bundle.price)) return null;
    
    const purchase: Purchase = {
      id: `bundle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemId: bundleId,
      playerId: this.playerId,
      amount: 1,
      currency: bundle.currency,
      price: bundle.price,
      timestamp: new Date(),
      status: 'completed'
    };
    
    this.purchases.push(purchase);
    return purchase;
  }

  getPurchases(): Purchase[] {
    return this.purchases;
  }

  getPlayerPurchases(playerId: string): Purchase[] {
    return this.purchases.filter(purchase => purchase.playerId === playerId);
  }

  getTotalSpent(): number {
    return this.purchases
      .filter(purchase => purchase.status === 'completed')
      .reduce((total, purchase) => total + purchase.price, 0);
  }

  getRevenueStats(): any {
    const completedPurchases = this.purchases.filter(p => p.status === 'completed');
    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.price, 0);
    const purchaseCount = completedPurchases.length;
    const averagePurchase = purchaseCount > 0 ? totalRevenue / purchaseCount : 0;
    
    return {
      totalRevenue,
      purchaseCount,
      averagePurchase,
      currencyBreakdown: this.getCurrencyBreakdown(completedPurchases)
    };
  }

  private getCurrencyBreakdown(purchases: Purchase[]): any {
    const breakdown: any = {};
    purchases.forEach(purchase => {
      if (!breakdown[purchase.currency]) {
        breakdown[purchase.currency] = { count: 0, revenue: 0 };
      }
      breakdown[purchase.currency].count++;
      breakdown[purchase.currency].revenue += purchase.price;
    });
    return breakdown;
  }
}

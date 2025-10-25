import React from 'react';
import { MoneySystem, Upgrade, PlayerMoney } from '../systems/MoneySystem';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  moneySystem: MoneySystem;
  onPurchase: (upgradeId: string) => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  onClose,
  moneySystem,
  onPurchase,
  onToast
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [playerMoney, setPlayerMoney] = React.useState<PlayerMoney>(moneySystem.getPlayerMoney());
  const [upgrades, setUpgrades] = React.useState<Upgrade[]>(moneySystem.getUpgrades());

  React.useEffect(() => {
    if (isOpen) {
      setPlayerMoney(moneySystem.getPlayerMoney());
      setUpgrades(moneySystem.getUpgrades());
    }
  }, [isOpen, moneySystem]);

  const categories = [
    { id: 'all', name: 'All', icon: '🛍️' },
    { id: 'weapon', name: 'Weapons', icon: '⚔️' },
    { id: 'ship', name: 'Ship', icon: '🚀' },
    { id: 'shield', name: 'Shield', icon: '🛡️' },
    { id: 'engine', name: 'Engine', icon: '⚡' },
    { id: 'special', name: 'Special', icon: '✨' }
  ];

  const filteredUpgrades = selectedCategory === 'all' 
    ? upgrades 
    : upgrades.filter(upgrade => upgrade.category === selectedCategory);

  const handlePurchase = (upgradeId: string) => {
    const success = moneySystem.purchaseUpgrade(upgradeId);
    if (success) {
      setPlayerMoney(moneySystem.getPlayerMoney());
      setUpgrades(moneySystem.getUpgrades());
      onPurchase(upgradeId);
      onToast?.('Upgrade purchased successfully!', 'success');
    } else {
      onToast?.('Not enough resources!', 'error');
    }
  };

  const formatCost = (cost: Upgrade['cost']) => {
    const parts = [];
    if (cost.coins > 0) parts.push(`${cost.coins} 🪙`);
    if (cost.gems > 0) parts.push(`${cost.gems} 💎`);
    if (cost.credits > 0) parts.push(`${cost.credits} 💳`);
    if (cost.energyCores > 0) parts.push(`${cost.energyCores} ⚡`);
    return parts.join(' ');
  };

  const getUpgradeStatus = (upgrade: Upgrade) => {
    if (upgrade.level >= upgrade.maxLevel) return 'maxed';
    if (upgrade.unlocked && upgrade.level > 0) return 'owned';
    if (moneySystem.canAffordUpgrade(upgrade)) return 'affordable';
    return 'locked';
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="store-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛍️ Upgrade Store</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="store-content">
          {/* Player Money Display */}
          <div className="money-display">
            <div className="money-item">
              <span className="money-icon">🪙</span>
              <span className="money-value">{playerMoney.coins}</span>
              <span className="money-label">Coins</span>
            </div>
            <div className="money-item">
              <span className="money-icon">💎</span>
              <span className="money-value">{playerMoney.gems}</span>
              <span className="money-label">Gems</span>
            </div>
            <div className="money-item">
              <span className="money-icon">💳</span>
              <span className="money-value">{playerMoney.credits}</span>
              <span className="money-label">Credits</span>
            </div>
            <div className="money-item">
              <span className="money-icon">⚡</span>
              <span className="money-value">{playerMoney.energyCores}</span>
              <span className="money-label">Energy Cores</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Upgrades Grid */}
          <div className="upgrades-grid">
            {filteredUpgrades.map(upgrade => {
              const status = getUpgradeStatus(upgrade);
              const canPurchase = status === 'affordable' || (status === 'owned' && upgrade.level < upgrade.maxLevel);
              
              return (
                <div key={upgrade.id} className={`upgrade-card ${status}`}>
                  <div className="upgrade-header">
                    <div className="upgrade-icon">{upgrade.icon}</div>
                    <div className="upgrade-info">
                      <h3>{upgrade.name}</h3>
                      <p>{upgrade.description}</p>
                    </div>
                  </div>
                  
                  <div className="upgrade-level">
                    Level: {upgrade.level}/{upgrade.maxLevel}
                  </div>
                  
                  <div className="upgrade-cost">
                    Cost: {formatCost(upgrade.cost)}
                  </div>
                  
                  <div className="upgrade-effects">
                    {Object.entries(upgrade.effects).map(([key, value]) => (
                      <div key={key} className="effect-item">
                        <span className="effect-label">{key}:</span>
                        <span className="effect-value">+{value}%</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className={`purchase-btn ${canPurchase ? 'enabled' : 'disabled'}`}
                    onClick={() => canPurchase && handlePurchase(upgrade.id)}
                    disabled={!canPurchase}
                  >
                    {status === 'maxed' ? 'MAXED' : 
                     status === 'owned' ? 'UPGRADE' : 
                     status === 'affordable' ? 'PURCHASE' : 'LOCKED'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


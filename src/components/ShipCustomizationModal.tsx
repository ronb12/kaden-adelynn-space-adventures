import React, { useState } from 'react';
import { ShipCustomization, HullDesign, WeaponLoadout, EngineSystem, ShieldSystem, PaintJob } from '../systems/AdvancedMultiplayerSystem';

interface ShipCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomization: ShipCustomization;
  onSave: (customization: ShipCustomization) => void;
  availableShips: string[];
  availableWeapons: string[];
  availableEngines: string[];
  availableShields: string[];
}

export const ShipCustomizationModal: React.FC<ShipCustomizationModalProps> = ({
  isOpen,
  onClose,
  currentCustomization,
  onSave,
  availableShips,
  availableWeapons,
  availableEngines,
  availableShields
}) => {
  const [customization, setCustomization] = useState<ShipCustomization>(currentCustomization);
  const [activeTab, setActiveTab] = useState<'hull' | 'weapons' | 'engines' | 'shields' | 'paint'>('hull');

  const hullOptions: HullDesign[] = [
    {
      type: 'fighter',
      model: 'basic_fighter',
      health: 100,
      armor: 50,
      maneuverability: 80,
      cargo: 10
    },
    {
      type: 'fighter',
      model: 'advanced_fighter',
      health: 120,
      armor: 60,
      maneuverability: 90,
      cargo: 15
    },
    {
      type: 'cruiser',
      model: 'heavy_cruiser',
      health: 200,
      armor: 100,
      maneuverability: 50,
      cargo: 50
    },
    {
      type: 'bomber',
      model: 'assault_bomber',
      health: 150,
      armor: 80,
      maneuverability: 60,
      cargo: 30
    },
    {
      type: 'interceptor',
      model: 'speed_interceptor',
      health: 80,
      armor: 40,
      maneuverability: 100,
      cargo: 5
    }
  ];

  const weaponOptions = [
    { id: 'laser_cannon', name: 'Laser Cannon', damage: 25, range: 1000, fireRate: 2, energyCost: 10 },
    { id: 'plasma_gun', name: 'Plasma Gun', damage: 40, range: 800, fireRate: 1, energyCost: 20 },
    { id: 'missile_launcher', name: 'Missile Launcher', damage: 100, range: 2000, fireRate: 0.5, energyCost: 50 },
    { id: 'ion_cannon', name: 'Ion Cannon', damage: 30, range: 1200, fireRate: 1.5, energyCost: 15 },
    { id: 'particle_beam', name: 'Particle Beam', damage: 60, range: 1500, fireRate: 0.8, energyCost: 30 }
  ];

  const engineOptions: EngineSystem[] = [
    { type: 'ion_drive', thrust: 100, efficiency: 80, maneuverability: 70, fuelConsumption: 1 },
    { type: 'plasma_drive', thrust: 120, efficiency: 85, maneuverability: 80, fuelConsumption: 1.2 },
    { type: 'quantum_drive', thrust: 150, efficiency: 90, maneuverability: 90, fuelConsumption: 1.5 },
    { type: 'warp_drive', thrust: 200, efficiency: 95, maneuverability: 60, fuelConsumption: 2 }
  ];

  const shieldOptions: ShieldSystem[] = [
    { type: 'energy_shield', capacity: 100, recharge: 10, resistance: 50, coverage: 100 },
    { type: 'plasma_shield', capacity: 120, recharge: 12, resistance: 60, coverage: 100 },
    { type: 'quantum_shield', capacity: 150, recharge: 15, resistance: 70, coverage: 100 },
    { type: 'adaptive_shield', capacity: 100, recharge: 8, resistance: 80, coverage: 100 }
  ];

  const paintOptions = [
    { primary: '#00ff00', secondary: '#006600', accent: '#ffff00', name: 'Military Green' },
    { primary: '#ff0000', secondary: '#cc0000', accent: '#ffaa00', name: 'Combat Red' },
    { primary: '#0000ff', secondary: '#0000cc', accent: '#00ffff', name: 'Navy Blue' },
    { primary: '#ffff00', secondary: '#cccc00', accent: '#ff8800', name: 'Gold Squadron' },
    { primary: '#ff00ff', secondary: '#cc00cc', accent: '#ff88ff', name: 'Purple Thunder' },
    { primary: '#00ffff', secondary: '#00cccc', accent: '#88ffff', name: 'Cyan Storm' }
  ];

  const handleSave = () => {
    onSave(customization);
    onClose();
  };

  const updateHull = (hull: HullDesign) => {
    setCustomization(prev => ({ ...prev, hull }));
  };

  const updateWeapon = (slot: 'primary' | 'secondary' | 'special', weapon: any) => {
    setCustomization(prev => ({
      ...prev,
      weapons: {
        ...prev.weapons,
        [slot]: weapon
      }
    }));
  };

  const updateEngine = (engine: EngineSystem) => {
    setCustomization(prev => ({ ...prev, engines: engine }));
  };

  const updateShield = (shield: ShieldSystem) => {
    setCustomization(prev => ({ ...prev, shields: shield }));
  };

  const updatePaint = (paint: PaintJob) => {
    setCustomization(prev => ({ ...prev, paint }));
  };

  if (!isOpen) return null;

  return (
    <div className="ship-customization-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🚀 Ship Customization</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="customization-content">
            {/* Tab Navigation */}
            <div className="customization-tabs">
              <button 
                className={activeTab === 'hull' ? 'active' : ''}
                onClick={() => setActiveTab('hull')}
              >
                🛸 Hull
              </button>
              <button 
                className={activeTab === 'weapons' ? 'active' : ''}
                onClick={() => setActiveTab('weapons')}
              >
                🔫 Weapons
              </button>
              <button 
                className={activeTab === 'engines' ? 'active' : ''}
                onClick={() => setActiveTab('engines')}
              >
                ⚡ Engines
              </button>
              <button 
                className={activeTab === 'shields' ? 'active' : ''}
                onClick={() => setActiveTab('shields')}
              >
                🛡️ Shields
              </button>
              <button 
                className={activeTab === 'paint' ? 'active' : ''}
                onClick={() => setActiveTab('paint')}
              >
                🎨 Paint
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              {/* Hull Selection */}
              {activeTab === 'hull' && (
                <div className="hull-selection">
                  <h3>🛸 Select Hull Design</h3>
                  <div className="hull-grid">
                    {hullOptions.map((hull, index) => (
                      <div 
                        key={index}
                        className={`hull-card ${customization.hull.model === hull.model ? 'selected' : ''}`}
                        onClick={() => updateHull(hull)}
                      >
                        <div className="hull-preview">
                          <div className="ship-icon">
                            {hull.type === 'fighter' && '✈️'}
                            {hull.type === 'cruiser' && '🚢'}
                            {hull.type === 'bomber' && '💣'}
                            {hull.type === 'interceptor' && '⚡'}
                          </div>
                        </div>
                        <div className="hull-info">
                          <h4>{hull.model.replace('_', ' ')}</h4>
                          <div className="hull-stats">
                            <div className="stat">
                              <span>Health: {hull.health}</span>
                            </div>
                            <div className="stat">
                              <span>Armor: {hull.armor}</span>
                            </div>
                            <div className="stat">
                              <span>Maneuver: {hull.maneuverability}</span>
                            </div>
                            <div className="stat">
                              <span>Cargo: {hull.cargo}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weapon Selection */}
              {activeTab === 'weapons' && (
                <div className="weapon-selection">
                  <h3>🔫 Configure Weapons</h3>
                  
                  <div className="weapon-slots">
                    <div className="weapon-slot">
                      <h4>Primary Weapon</h4>
                      <div className="weapon-grid">
                        {weaponOptions.map((weapon, index) => (
                          <div 
                            key={index}
                            className={`weapon-card ${customization.weapons.primary.type === weapon.id ? 'selected' : ''}`}
                            onClick={() => updateWeapon('primary', weapon)}
                          >
                            <div className="weapon-icon">⚡</div>
                            <div className="weapon-info">
                              <h5>{weapon.name}</h5>
                              <div className="weapon-stats">
                                <span>Damage: {weapon.damage}</span>
                                <span>Range: {weapon.range}</span>
                                <span>Rate: {weapon.fireRate}/s</span>
                                <span>Energy: {weapon.energyCost}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="weapon-slot">
                      <h4>Secondary Weapon</h4>
                      <div className="weapon-grid">
                        {weaponOptions.map((weapon, index) => (
                          <div 
                            key={index}
                            className={`weapon-card ${customization.weapons.secondary.type === weapon.id ? 'selected' : ''}`}
                            onClick={() => updateWeapon('secondary', weapon)}
                          >
                            <div className="weapon-icon">🎯</div>
                            <div className="weapon-info">
                              <h5>{weapon.name}</h5>
                              <div className="weapon-stats">
                                <span>Damage: {weapon.damage}</span>
                                <span>Range: {weapon.range}</span>
                                <span>Rate: {weapon.fireRate}/s</span>
                                <span>Energy: {weapon.energyCost}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="weapon-slot">
                      <h4>Special Weapon</h4>
                      <div className="weapon-grid">
                        {weaponOptions.map((weapon, index) => (
                          <div 
                            key={index}
                            className={`weapon-card ${customization.weapons.special.type === weapon.id ? 'selected' : ''}`}
                            onClick={() => updateWeapon('special', weapon)}
                          >
                            <div className="weapon-icon">💥</div>
                            <div className="weapon-info">
                              <h5>{weapon.name}</h5>
                              <div className="weapon-stats">
                                <span>Damage: {weapon.damage}</span>
                                <span>Range: {weapon.range}</span>
                                <span>Rate: {weapon.fireRate}/s</span>
                                <span>Energy: {weapon.energyCost}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Engine Selection */}
              {activeTab === 'engines' && (
                <div className="engine-selection">
                  <h3>⚡ Select Engine System</h3>
                  <div className="engine-grid">
                    {engineOptions.map((engine, index) => (
                      <div 
                        key={index}
                        className={`engine-card ${customization.engines.type === engine.type ? 'selected' : ''}`}
                        onClick={() => updateEngine(engine)}
                      >
                        <div className="engine-icon">🚀</div>
                        <div className="engine-info">
                          <h4>{engine.type.replace('_', ' ')}</h4>
                          <div className="engine-stats">
                            <div className="stat">
                              <span>Thrust: {engine.thrust}</span>
                            </div>
                            <div className="stat">
                              <span>Efficiency: {engine.efficiency}%</span>
                            </div>
                            <div className="stat">
                              <span>Maneuver: {engine.maneuverability}</span>
                            </div>
                            <div className="stat">
                              <span>Fuel: {engine.fuelConsumption}x</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shield Selection */}
              {activeTab === 'shields' && (
                <div className="shield-selection">
                  <h3>🛡️ Select Shield System</h3>
                  <div className="shield-grid">
                    {shieldOptions.map((shield, index) => (
                      <div 
                        key={index}
                        className={`shield-card ${customization.shields.type === shield.type ? 'selected' : ''}`}
                        onClick={() => updateShield(shield)}
                      >
                        <div className="shield-icon">🛡️</div>
                        <div className="shield-info">
                          <h4>{shield.type.replace('_', ' ')}</h4>
                          <div className="shield-stats">
                            <div className="stat">
                              <span>Capacity: {shield.capacity}</span>
                            </div>
                            <div className="stat">
                              <span>Recharge: {shield.recharge}/s</span>
                            </div>
                            <div className="stat">
                              <span>Resistance: {shield.resistance}%</span>
                            </div>
                            <div className="stat">
                              <span>Coverage: {shield.coverage}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Paint Selection */}
              {activeTab === 'paint' && (
                <div className="paint-selection">
                  <h3>🎨 Select Paint Job</h3>
                  <div className="paint-grid">
                    {paintOptions.map((paint, index) => (
                      <div 
                        key={index}
                        className={`paint-card ${customization.paint.primary === paint.primary ? 'selected' : ''}`}
                        onClick={() => updatePaint({
                          primary: paint.primary,
                          secondary: paint.secondary,
                          accent: paint.accent,
                          finish: 'metallic'
                        })}
                      >
                        <div 
                          className="paint-preview"
                          style={{
                            background: `linear-gradient(45deg, ${paint.primary}, ${paint.secondary})`,
                            border: `2px solid ${paint.accent}`
                          }}
                        ></div>
                        <div className="paint-info">
                          <h4>{paint.name}</h4>
                          <div className="color-palette">
                            <div 
                              className="color-swatch" 
                              style={{ backgroundColor: paint.primary }}
                            ></div>
                            <div 
                              className="color-swatch" 
                              style={{ backgroundColor: paint.secondary }}
                            ></div>
                            <div 
                              className="color-swatch" 
                              style={{ backgroundColor: paint.accent }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipCustomizationModal;

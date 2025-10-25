import React, { useState, useEffect } from 'react';
import { ProgressionSystem, Achievement, FactionReputation } from '../systems/AdvancedMultiplayerSystem';

interface ProgressionSystemProps {
  progression: ProgressionSystem;
  onLevelUp: (newLevel: number) => void;
  onAchievementUnlock: (achievement: Achievement) => void;
  onReputationChange: (faction: string, newReputation: number) => void;
}

export const ProgressionSystemComponent: React.FC<ProgressionSystemProps> = ({
  progression,
  onLevelUp,
  onAchievementUnlock,
  onReputationChange
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'reputation' | 'unlocks'>('overview');
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevel, setNewLevel] = useState(0);

  const experienceToNextLevel = progression.playerLevel * 1000;
  const experienceProgress = (progression.experience / experienceToNextLevel) * 100;

  const availableAchievements: Achievement[] = [
    {
      id: 'first_kill',
      name: 'First Blood',
      description: 'Eliminate your first enemy',
      progress: 0,
      maxProgress: 1,
      rewards: { experience: 100, credits: 50, items: ['basic_weapon'], reputation: 10 },
      unlocked: false
    },
    {
      id: 'team_player',
      name: 'Team Player',
      description: 'Complete 10 missions with your squad',
      progress: 0,
      maxProgress: 10,
      rewards: { experience: 500, credits: 200, items: ['team_badge'], reputation: 25 },
      unlocked: false
    },
    {
      id: 'ace_pilot',
      name: 'Ace Pilot',
      description: 'Achieve 50 kills in combat',
      progress: 0,
      maxProgress: 50,
      rewards: { experience: 1000, credits: 500, items: ['ace_wings'], reputation: 50 },
      unlocked: false
    },
    {
      id: 'explorer',
      name: 'Space Explorer',
      description: 'Discover 5 new star systems',
      progress: 0,
      maxProgress: 5,
      rewards: { experience: 800, credits: 300, items: ['explorer_badge'], reputation: 30 },
      unlocked: false
    },
    {
      id: 'engineer',
      name: 'Master Engineer',
      description: 'Repair 100 ships in combat',
      progress: 0,
      maxProgress: 100,
      rewards: { experience: 1200, credits: 400, items: ['engineer_toolkit'], reputation: 40 },
      unlocked: false
    }
  ];

  const factionReputations: FactionReputation[] = [
    {
      faction: 'Galactic Federation',
      reputation: 0,
      standing: 'neutral',
      benefits: ['Standard missions', 'Basic equipment access']
    },
    {
      faction: 'Mercenary Guild',
      reputation: 0,
      standing: 'neutral',
      benefits: ['Bounty hunting missions', 'Weapon discounts']
    },
    {
      faction: 'Explorer Corps',
      reputation: 0,
      standing: 'neutral',
      benefits: ['Exploration missions', 'Advanced scanners']
    },
    {
      faction: 'Pirate Syndicate',
      reputation: 0,
      standing: 'hostile',
      benefits: ['Raid missions', 'Stolen goods market']
    }
  ];

  const unlockedShips = [
    { id: 'basic_fighter', name: 'Basic Fighter', unlocked: true, level: 1 },
    { id: 'advanced_fighter', name: 'Advanced Fighter', unlocked: progression.playerLevel >= 5, level: 5 },
    { id: 'heavy_cruiser', name: 'Heavy Cruiser', unlocked: progression.playerLevel >= 10, level: 10 },
    { id: 'stealth_interceptor', name: 'Stealth Interceptor', unlocked: progression.playerLevel >= 15, level: 15 },
    { id: 'battle_carrier', name: 'Battle Carrier', unlocked: progression.playerLevel >= 20, level: 20 }
  ];

  const unlockedWeapons = [
    { id: 'laser_cannon', name: 'Laser Cannon', unlocked: true, level: 1 },
    { id: 'plasma_gun', name: 'Plasma Gun', unlocked: progression.playerLevel >= 3, level: 3 },
    { id: 'missile_launcher', name: 'Missile Launcher', unlocked: progression.playerLevel >= 7, level: 7 },
    { id: 'ion_cannon', name: 'Ion Cannon', unlocked: progression.playerLevel >= 12, level: 12 },
    { id: 'particle_beam', name: 'Particle Beam', unlocked: progression.playerLevel >= 18, level: 18 }
  ];

  const unlockedAbilities = [
    { id: 'basic_maneuver', name: 'Basic Maneuver', unlocked: true, level: 1 },
    { id: 'evasive_maneuver', name: 'Evasive Maneuver', unlocked: progression.playerLevel >= 4, level: 4 },
    { id: 'boost', name: 'Engine Boost', unlocked: progression.playerLevel >= 8, level: 8 },
    { id: 'target_lock', name: 'Target Lock', unlocked: progression.playerLevel >= 6, level: 6 },
    { id: 'rapid_fire', name: 'Rapid Fire', unlocked: progression.playerLevel >= 11, level: 11 },
    { id: 'repair', name: 'Emergency Repair', unlocked: progression.playerLevel >= 9, level: 9 },
    { id: 'shield_boost', name: 'Shield Boost', unlocked: progression.playerLevel >= 13, level: 13 },
    { id: 'scan', name: 'Long Range Scan', unlocked: progression.playerLevel >= 14, level: 14 }
  ];

  useEffect(() => {
    // Check for level up
    if (progression.experience >= experienceToNextLevel) {
      setNewLevel(progression.playerLevel + 1);
      setShowLevelUpModal(true);
      onLevelUp(progression.playerLevel + 1);
    }
  }, [progression.experience, experienceToNextLevel, progression.playerLevel, onLevelUp]);

  const handleAchievementProgress = (achievementId: string, progress: number) => {
    const achievement = availableAchievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.progress = Math.min(progress, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress) {
        achievement.unlocked = true;
        achievement.timestamp = Date.now();
        onAchievementUnlock(achievement);
      }
    }
  };

  const handleReputationChange = (faction: string, change: number) => {
    const factionRep = factionReputations.find(f => f.faction === faction);
    if (factionRep) {
      factionRep.reputation += change;
      
      // Update standing based on reputation
      if (factionRep.reputation >= 100) {
        factionRep.standing = 'allied';
      } else if (factionRep.reputation >= 50) {
        factionRep.standing = 'friendly';
      } else if (factionRep.reputation >= -50) {
        factionRep.standing = 'neutral';
      } else if (factionRep.reputation >= -100) {
        factionRep.standing = 'unfriendly';
      } else {
        factionRep.standing = 'hostile';
      }
      
      onReputationChange(faction, factionRep.reputation);
    }
  };

  return (
    <div className="progression-system">
      {/* Level Up Modal */}
      {showLevelUpModal && (
        <div className="level-up-modal">
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="level-up-celebration">
                <h2>🎉 Level Up!</h2>
                <div className="level-display">
                  <span className="old-level">{progression.playerLevel}</span>
                  <span className="arrow">→</span>
                  <span className="new-level">{newLevel}</span>
                </div>
                <div className="level-rewards">
                  <h3>🎁 Rewards</h3>
                  <div className="rewards-list">
                    <div className="reward-item">
                      <span className="reward-icon">⭐</span>
                      <span>5 Skill Points</span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-icon">💰</span>
                      <span>500 Credits</span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-icon">🚀</span>
                      <span>New Ship Unlocked</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="continue-btn"
                  onClick={() => setShowLevelUpModal(false)}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progression Tabs */}
      <div className="progression-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button 
          className={activeTab === 'reputation' ? 'active' : ''}
          onClick={() => setActiveTab('reputation')}
        >
          🤝 Reputation
        </button>
        <button 
          className={activeTab === 'unlocks' ? 'active' : ''}
          onClick={() => setActiveTab('unlocks')}
        >
          🔓 Unlocks
        </button>
      </div>

      {/* Tab Content */}
      <div className="progression-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="player-stats">
              <h3>📊 Player Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Level</span>
                  <span className="stat-value">{progression.playerLevel}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Experience</span>
                  <span className="stat-value">{progression.experience.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Skill Points</span>
                  <span className="stat-value">{progression.skillPoints}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Achievements</span>
                  <span className="stat-value">{progression.achievements.length}</span>
                </div>
              </div>
            </div>

            <div className="experience-bar">
              <h4>Experience Progress</h4>
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${experienceProgress}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {progression.experience.toLocaleString()} / {experienceToNextLevel.toLocaleString()} XP
                </span>
              </div>
            </div>

            <div className="recent-achievements">
              <h4>Recent Achievements</h4>
              <div className="achievements-list">
                {progression.achievements.slice(-3).map(achievement => (
                  <div key={achievement.id} className="achievement-item">
                    <span className="achievement-icon">🏆</span>
                    <div className="achievement-info">
                      <span className="achievement-name">{achievement.name}</span>
                      <span className="achievement-description">{achievement.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="achievements-tab">
            <h3>🏆 Achievements</h3>
            <div className="achievements-grid">
              {availableAchievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}
                >
                  <div className="achievement-header">
                    <span className="achievement-icon">
                      {achievement.unlocked ? '🏆' : '🔒'}
                    </span>
                    <span className="achievement-name">{achievement.name}</span>
                  </div>
                  <div className="achievement-description">
                    {achievement.description}
                  </div>
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {achievement.progress} / {achievement.maxProgress}
                    </span>
                  </div>
                  {achievement.unlocked && (
                    <div className="achievement-rewards">
                      <span className="reward-text">Rewards:</span>
                      <div className="rewards">
                        <span>+{achievement.rewards.experience} XP</span>
                        <span>+{achievement.rewards.credits} Credits</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reputation Tab */}
        {activeTab === 'reputation' && (
          <div className="reputation-tab">
            <h3>🤝 Faction Reputation</h3>
            <div className="factions-list">
              {factionReputations.map(faction => (
                <div key={faction.faction} className="faction-card">
                  <div className="faction-header">
                    <span className="faction-name">{faction.faction}</span>
                    <span className={`faction-standing ${faction.standing}`}>
                      {faction.standing}
                    </span>
                  </div>
                  <div className="reputation-bar">
                    <div 
                      className="reputation-fill" 
                      style={{ 
                        width: `${Math.max(0, Math.min(100, (faction.reputation + 100) / 2))}%`,
                        backgroundColor: faction.reputation >= 0 ? '#00ff00' : '#ff0000'
                      }}
                    ></div>
                  </div>
                  <div className="reputation-value">
                    {faction.reputation > 0 ? '+' : ''}{faction.reputation}
                  </div>
                  <div className="faction-benefits">
                    <h5>Benefits:</h5>
                    <ul>
                      {faction.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Unlocks Tab */}
        {activeTab === 'unlocks' && (
          <div className="unlocks-tab">
            <h3>🔓 Unlocked Content</h3>
            
            <div className="unlocks-section">
              <h4>🚀 Ships</h4>
              <div className="unlocks-grid">
                {unlockedShips.map(ship => (
                  <div 
                    key={ship.id} 
                    className={`unlock-card ${ship.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="unlock-icon">🚀</div>
                    <div className="unlock-info">
                      <span className="unlock-name">{ship.name}</span>
                      <span className="unlock-level">Level {ship.level}</span>
                    </div>
                    <div className="unlock-status">
                      {ship.unlocked ? '✅' : '🔒'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="unlocks-section">
              <h4>🔫 Weapons</h4>
              <div className="unlocks-grid">
                {unlockedWeapons.map(weapon => (
                  <div 
                    key={weapon.id} 
                    className={`unlock-card ${weapon.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="unlock-icon">🔫</div>
                    <div className="unlock-info">
                      <span className="unlock-name">{weapon.name}</span>
                      <span className="unlock-level">Level {weapon.level}</span>
                    </div>
                    <div className="unlock-status">
                      {weapon.unlocked ? '✅' : '🔒'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="unlocks-section">
              <h4>⚡ Abilities</h4>
              <div className="unlocks-grid">
                {unlockedAbilities.map(ability => (
                  <div 
                    key={ability.id} 
                    className={`unlock-card ${ability.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="unlock-icon">⚡</div>
                    <div className="unlock-info">
                      <span className="unlock-name">{ability.name}</span>
                      <span className="unlock-level">Level {ability.level}</span>
                    </div>
                    <div className="unlock-status">
                      {ability.unlocked ? '✅' : '🔒'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressionSystemComponent;

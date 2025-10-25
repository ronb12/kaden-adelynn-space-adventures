import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import all game systems
// import { CompleteGameSystem } from './systems/CompleteGameSystem';
// import { EnhancedAudioSystem } from './systems/EnhancedAudioSystem';
// import { EnhancedVisualEffects } from './systems/EnhancedVisualEffects';
// import { MultiplayerSystem } from './systems/MultiplayerSystem';
// import { StoryModeSystem } from './systems/StoryModeSystem';
// import { ChallengeSystem } from './systems/ChallengeSystem';
// import { FeatureTestingSystem } from './systems/FeatureTestingSystem';
import { CompleteGameIntegration } from './systems/CompleteGameIntegration';
import { InputSystem } from './systems/InputSystem';
import { DeviceOptimization } from './systems/DeviceOptimization';
import TouchControls from './components/TouchControls';
import ToastManager, { ToastContext } from './components/ToastManager';
import { GameRatingSystem } from './systems/GameRatingSystem';
import { MobileResponsiveSystem } from './systems/MobileResponsiveSystem';
// import { AdvancedWeaponSystem } from './systems/AdvancedWeaponSystem';
// import { MissionSystem } from './systems/MissionSystem';
import { Enhanced3DGraphics } from './systems/Enhanced3DGraphics';
import { BulletHellSystem } from './systems/BulletHellSystem';
import { ProceduralGenerationSystem } from './systems/ProceduralGenerationSystem';
// import { SocialFeaturesSystem } from './systems/SocialFeaturesSystem';
// import { MonetizationSystem } from './systems/MonetizationSystem';

// Game Settings Interface
interface GameSettings {
  audio: {
    masterVolume: number;
    musicVolume: number;
    soundEffectsVolume: number;
    voiceVolume: number;
  };
  graphics: {
    quality: 'Low' | 'Medium' | 'High' | 'Ultra';
    resolution: string;
    fullscreen: boolean;
    vsync: boolean;
    particles: boolean;
    shadows: boolean;
  };
  controls: {
    keyBindings: {
      moveUp: string;
      moveDown: string;
      moveLeft: string;
      moveRight: string;
      shoot: string;
      pause: string;
    };
    mouseSensitivity: number;
    controllerEnabled: boolean;
  };
  accessibility: {
    colorBlindMode: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
}

// Game State Interface
interface GameState {
  currentScene: 'menu' | 'game' | 'settings' | 'achievements' | 'boss' | 'powerups' | 'multiplayer' | 'story' | 'challenges';
  selectedCharacter: 'kaden' | 'adelynn';
  settings: GameSettings;
  multiplayerMode?: 'local' | 'online' | 'cooperative';
  maxPlayers?: number;
  vsAI?: boolean;
  gameStats: {
    enemiesKilled: number;
    bossesKilled: number;
    killStreak: number;
    maxKillStreak: number;
    powerUpsCollected: number;
    weaponsUsed: number;
    perfectHits: number;
    shotsFired: number;
    bulletsDodged: number;
    damageTaken: number;
    survivalTime: number;
    levelTime: number;
    maxCombo: number;
    currentCombo: number;
    survivedWith1HP: boolean;
    powerUpTypesCollected: Set<string>;
    achievementsUnlocked: number;
  };
}

// Main App Component
const App: React.FC = () => {
  // Initialize game integration
  const gameIntegration = useRef<CompleteGameIntegration | null>(null);
  // const [gameInitialized, setGameInitialized] = useState(false);
  // const [gameReport, setGameReport] = useState<any>(null);
  
  // Initialize input and device systems
  const inputSystem = useRef<InputSystem | null>(null);
  const deviceOptimization = useRef<DeviceOptimization | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [showTouchControls, setShowTouchControls] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentScene: 'menu',
    selectedCharacter: 'kaden',
    settings: {
      audio: {
        masterVolume: 80,
        musicVolume: 70,
        soundEffectsVolume: 90,
        voiceVolume: 85
      },
      graphics: {
        quality: 'High',
        resolution: '1920x1080',
        fullscreen: false,
        vsync: true,
        particles: true,
        shadows: true
      },
      controls: {
        keyBindings: {
          moveUp: 'ArrowUp',
          moveDown: 'ArrowDown',
          moveLeft: 'ArrowLeft',
          moveRight: 'ArrowRight',
          shoot: 'Space',
          pause: 'Escape'
        },
        mouseSensitivity: 50,
        controllerEnabled: false
      },
      accessibility: {
        colorBlindMode: false,
        highContrast: false,
        largeText: false,
        screenReader: false
      }
    },
    gameStats: {
      enemiesKilled: 0,
      bossesKilled: 0,
      killStreak: 0,
      maxKillStreak: 0,
      powerUpsCollected: 0,
      weaponsUsed: 0,
      perfectHits: 0,
      shotsFired: 0,
      bulletsDodged: 0,
      damageTaken: 0,
      survivalTime: 0,
      levelTime: 0,
      maxCombo: 0,
      currentCombo: 0,
      survivedWith1HP: false,
      powerUpTypesCollected: new Set(),
      achievementsUnlocked: 0
    }
  });

  const [showModal, setShowModal] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<Array<{id: string, name: string, description: string, unlocked: boolean, progress: number, maxProgress: number}>>([
    {id: 'first_blood', name: 'First Blood', description: 'Defeat your first enemy', unlocked: false, progress: 0, maxProgress: 1},
    {id: 'kill_streak_10', name: 'Kill Streak', description: 'Defeat 10 enemies in a row', unlocked: false, progress: 0, maxProgress: 10},
    {id: 'boss_slayer', name: 'Boss Slayer', description: 'Defeat your first boss', unlocked: false, progress: 0, maxProgress: 1},
    {id: 'power_up_collector', name: 'Power-up Collector', description: 'Collect 20 power-ups', unlocked: false, progress: 0, maxProgress: 20},
    {id: 'survivor', name: 'Survivor', description: 'Survive for 5 minutes', unlocked: false, progress: 0, maxProgress: 300},
    {id: 'combo_master', name: 'Combo Master', description: 'Achieve a 20x combo', unlocked: false, progress: 0, maxProgress: 20},
    {id: 'perfect_accuracy', name: 'Perfect Accuracy', description: 'Hit 100 targets without missing', unlocked: false, progress: 0, maxProgress: 100},
    {id: 'speed_demon', name: 'Speed Demon', description: 'Complete a level in under 2 minutes', unlocked: false, progress: 0, maxProgress: 120},
    {id: 'shield_master', name: 'Shield Master', description: 'Use shield to block 50 attacks', unlocked: false, progress: 0, maxProgress: 50},
    {id: 'weapon_master', name: 'Weapon Master', description: 'Use 10 different weapons', unlocked: false, progress: 0, maxProgress: 10}
  ]);

  // Initialize game integration
  useEffect(() => {
    const initializeGame = async () => {
      try {
        console.log('🚀 Initializing complete game with all 300 features...');
        
        gameIntegration.current = new CompleteGameIntegration();
        await gameIntegration.current.initialize();
        
        // setGameInitialized(true);
        console.log('✅ Game initialization complete');
        
        // Get initial game report
        // const report = gameIntegration.current.getGameReport();
        // setGameReport(report);
        
        // Start the game
        gameIntegration.current.start();
        
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };
    
    initializeGame();
    
    return () => {
      if (gameIntegration.current) {
        gameIntegration.current.destroy();
      }
    };
  }, []);

  // Initialize input and device systems
  useEffect(() => {
    // Initialize device optimization
    if (!deviceOptimization.current) {
      deviceOptimization.current = new DeviceOptimization();
      const device = deviceOptimization.current.getDeviceInfo();
      setDeviceInfo(device);
      setShowTouchControls(device.hasTouch && (device.type === 'mobile' || device.type === 'tablet'));
      console.log('📱 Device detected:', device);
    }
    
    // Initialize input system
    if (!inputSystem.current) {
      inputSystem.current = new InputSystem();
      console.log('🎮 Input system initialized');
    }
  }, []);

  // Handle scene changes
  const changeScene = (scene: GameState['currentScene']) => {
    setGameState(prev => ({ ...prev, currentScene: scene }));
  };

  // Handle character selection
  const selectCharacter = (character: 'kaden' | 'adelynn') => {
    setGameState(prev => ({ ...prev, selectedCharacter: character }));
  };

  // Handle modal display
  const showFeatureModal = (feature: string) => {
    setShowModal(feature);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  // Handle settings updates
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setGameState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  // Render current scene
  const renderScene = () => {
    switch (gameState.currentScene) {
      case 'menu':
        return <MainMenu 
          onSceneChange={changeScene}
          onCharacterSelect={selectCharacter}
          onShowModal={showFeatureModal}
          selectedCharacter={gameState.selectedCharacter}
          gameIntegration={gameIntegration.current}
        />;
      case 'game':
        return <GameScene 
          onSceneChange={changeScene}
          selectedCharacter={gameState.selectedCharacter}
          gameStats={gameState.gameStats}
          achievements={achievements}
          setAchievements={setAchievements}
          inputSystem={inputSystem.current}
          deviceInfo={deviceInfo}
          showTouchControls={showTouchControls}
        />;
      default:
        return <MainMenu 
          onSceneChange={changeScene}
          onCharacterSelect={selectCharacter}
          onShowModal={showFeatureModal}
          selectedCharacter={gameState.selectedCharacter}
          gameIntegration={gameIntegration.current}
        />;
    }
  };

  return (
    <ToastManager>
      <div className="app">
        {renderScene()}
        {showModal && (
          <FeatureModal 
            feature={showModal}
            onClose={closeModal}
            settings={gameState.settings}
            onUpdateSettings={updateSettings}
            achievements={achievements}
            onSceneChange={changeScene}
          />
        )}
      </div>
    </ToastManager>
  );
};

// Main Menu Component
interface MainMenuProps {
  onSceneChange: (scene: GameState['currentScene']) => void;
  onCharacterSelect: (character: 'kaden' | 'adelynn') => void;
  onShowModal: (feature: string) => void;
  selectedCharacter: 'kaden' | 'adelynn';
  gameIntegration: any;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSceneChange, onCharacterSelect, onShowModal, selectedCharacter, gameIntegration }) => {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  return (
    <div className="main-menu">
      {/* Modern Background */}
      <div className="background">
        <div className="stars"></div>
        <div className="grid"></div>
      </div>

      {/* Title Section */}
      <div className="title-section">
        <div className="title-bg"></div>
        <h1 className="main-title">KADEN & ADELYNN</h1>
        <h2 className="subtitle">SPACE ADVENTURES</h2>
        <p className="tagline">Next-Generation Space Combat Experience</p>
      </div>

      {/* Main Action Buttons */}
      <div className="main-buttons">
        <button 
          className="select-pilot-btn"
          onClick={() => setShowCharacterModal(true)}
        >
          SELECT YOUR PILOT
        </button>
        
        <button 
          className="start-mission-btn"
          onClick={() => onSceneChange('game')}
        >
          🚀 START MISSION
        </button>
        
        <button 
          className="settings-btn"
          onClick={() => onShowModal('settings')}
        >
          ⚙️ SETTINGS
        </button>
      </div>

      {/* Feature Buttons Grid */}
      <div className="feature-buttons">
        <div className="feature-row">
          <button 
            className="feature-btn achievements"
            onClick={() => onShowModal('achievements')}
          >
            🏆 ACHIEVEMENTS
          </button>
          <button 
            className="feature-btn boss"
            onClick={() => onShowModal('boss')}
          >
            👹 BOSS BATTLES
          </button>
          <button 
            className="feature-btn powerups"
            onClick={() => onShowModal('powerups')}
          >
            ⚡ POWER-UPS
          </button>
        </div>
        
        <div className="feature-row">
          <button 
            className="feature-btn multiplayer"
            onClick={() => onShowModal('multiplayer')}
          >
            👥 MULTIPLAYER
          </button>
          <button 
            className="feature-btn story"
            onClick={() => onShowModal('story')}
          >
            📖 STORY MODE
          </button>
        <button 
          className="feature-btn challenges"
          onClick={() => onShowModal('challenges')}
        >
          🎯 CHALLENGES
        </button>
      </div>
    </div>

      {/* Game Info */}
      <div className="game-info">
        <div className="info-panel">
          🎮 ARROW KEYS TO MOVE • SPACE TO SHOOT • WASD ALTERNATIVE
        </div>
        <div className="branding">
          © 2025 Bradley Virtual Solutions, LLC
        </div>
      </div>

      {/* Character Selection Modal */}
      {showCharacterModal && (
        <CharacterModal 
          onClose={() => setShowCharacterModal(false)}
          onSelect={onCharacterSelect}
          selectedCharacter={selectedCharacter}
        />
      )}
    </div>
  );
};

// Character Selection Modal
interface CharacterModalProps {
  onClose: () => void;
  onSelect: (character: 'kaden' | 'adelynn') => void;
  selectedCharacter: 'kaden' | 'adelynn';
}

const CharacterModal: React.FC<CharacterModalProps> = ({ onClose, onSelect, selectedCharacter }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="character-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>CHOOSE YOUR PILOT</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="character-cards">
          <div 
            className={`character-card ${selectedCharacter === 'kaden' ? 'selected' : ''}`}
            onClick={() => onSelect('kaden')}
          >
            <div className="character-sprite">👦🏿</div>
            <h3>KADEN</h3>
            <p>Brave space pilot with lightning reflexes</p>
          </div>
          
          <div 
            className={`character-card ${selectedCharacter === 'adelynn' ? 'selected' : ''}`}
            onClick={() => onSelect('adelynn')}
          >
            <div className="character-sprite">👧</div>
            <h3>ADELYNN</h3>
            <p>Skilled navigator with tactical expertise</p>
          </div>
        </div>
        
        <button 
          className="confirm-btn"
          onClick={onClose}
        >
          CONFIRM SELECTION
        </button>
      </div>
    </div>
  );
};

// Feature Modal
interface FeatureModalProps {
  feature: string;
  onClose: () => void;
  settings?: GameSettings;
  onUpdateSettings?: (settings: Partial<GameSettings>) => void;
  achievements?: Array<{id: string, name: string, description: string, unlocked: boolean, progress: number, maxProgress: number}>;
  onSceneChange?: (scene: GameState['currentScene']) => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ feature, onClose, settings, onUpdateSettings, achievements = [], onSceneChange }) => {
  const getFeatureData = () => {
    switch (feature) {
      case 'achievements':
        return {
          title: '🏆 ACHIEVEMENT SYSTEM',
          color: '#ff6b35',
          description: 'Unlock amazing achievements and track your progress!',
          isInteractive: true,
          features: [
            '✨ 20+ Achievement Types - From beginner to expert level',
            '📊 Progress Tracking - Real-time achievement progress',
            '🎁 Unlock Rewards - Exclusive rewards for achievements',
            '🏅 Achievement Categories - Combat, Survival, Collection',
            '🔥 Streak Achievements - Consecutive kill streaks',
            '👹 Boss Defeat Achievements - Epic boss victories',
            '⚡ Power-up Collection - Collect all power-up types',
            '💪 Survival Achievements - Survive against all odds',
            '🎯 Perfect Accuracy - Hit targets with precision',
            '🏆 Speed Runner - Complete levels quickly',
            '💎 Collector - Gather rare items',
            '🔥 Combo Master - Chain amazing combos'
          ],
          stats: {
            total: 20,
            unlocked: 0,
            progress: '0%'
          }
        };
      case 'boss':
        return {
          title: '👹 BOSS BATTLE SYSTEM',
          color: '#8b0000',
          description: 'Face epic boss battles with unique mechanics!',
          isInteractive: true,
          features: [
            '⚔️ 15+ Epic Boss Battles - Each with unique patterns',
            '🎯 Unique Boss Mechanics - Special attack patterns',
            '🔄 Multi-Phase Battles - Bosses change tactics mid-fight',
            '❤️ Boss Health Bars - Visual health indicators',
            '💥 Special Attacks - Devastating boss abilities',
            '🎭 Boss Patterns - Learn and counter attack patterns',
            '🎁 Reward Systems - Exclusive boss rewards',
            '📈 Difficulty Scaling - Adaptive boss difficulty',
            '🌪️ Environmental Hazards - Bosses use the environment',
            '⚡ Weak Point System - Target specific boss areas',
            '🛡️ Shield Mechanics - Break through boss defenses',
            '🎪 Arena Battles - Fight in unique battle arenas'
          ],
          stats: {
            total: 15,
            defeated: 0,
            progress: '0%'
          }
        };
      case 'powerups':
        return {
          title: '⚡ POWER-UP SYSTEM',
          color: '#9932cc',
          description: 'Collect 50+ unique power-ups with amazing effects!',
          isInteractive: true,
          features: [
            '⚡ 50+ Unique Power-ups - Vast collection of abilities',
            '🔥 Elemental Powers - Fire, Ice, Lightning, Earth',
            '🌌 Quantum Abilities - Advanced space technology',
            '🔫 Weapon Modifiers - Enhance your weapons',
            '🛡️ Defensive Power-ups - Shield and protection abilities',
            '🔧 Utility Power-ups - Speed, health, and special abilities',
            '⏱️ Duration Effects - Temporary and permanent boosts',
            '✨ Visual Effects - Stunning power-up animations',
            '💎 Rare Power-ups - Ultra-rare special abilities',
            '🔄 Combo Power-ups - Chain power-up effects',
            '🎯 Precision Power-ups - Accuracy and targeting boosts',
            '💪 Strength Power-ups - Damage and force multipliers'
          ],
          stats: {
            total: 50,
            collected: 0,
            progress: '0%'
          }
        };
      case 'multiplayer':
        return {
          title: '👥 MULTIPLAYER SYSTEM',
          color: '#32cd32',
          description: 'Play with friends in exciting multiplayer modes!',
          isInteractive: true,
          features: [
            '👥 Local Multiplayer - Play with friends on same device',
            '⚔️ Team Battles - Cooperative boss fights',
            '🤝 Cooperative Play - Work together to survive',
            '🥊 Player vs Player - Competitive multiplayer battles',
            '⚡ Shared Power-ups - Team power-up collection',
            '🏆 Team Achievements - Unlock achievements together',
            '💬 Communication System - In-game chat and signals',
            '📊 Leaderboards - Compete for high scores',
            '🎮 Cross-Platform - Play across different devices',
            '🏅 Tournament Mode - Organized competitive play',
            '🎪 Party Mode - Fun mini-games with friends',
            '🌟 Spectator Mode - Watch other players compete'
          ],
          stats: {
            players: 0,
            maxPlayers: 4,
            rooms: 0
          }
        };
      case 'story':
        return {
          title: '📖 STORY SYSTEM',
          color: '#ffd700',
          description: 'Experience an epic space adventure story!',
          isInteractive: true,
          features: [
            '📖 Epic Space Adventure - Immersive storyline',
            '👤 Character Development - Watch Kaden & Adelynn grow',
            '🎬 Cutscenes & Dialogues - Cinematic story moments',
            '📈 Story Progression - Unlock new story chapters',
            '🎭 Multiple Endings - Your choices affect the outcome',
            '📚 Character Backstories - Learn about the pilots',
            '🎯 Mission Objectives - Story-driven missions',
            '📝 Narrative Elements - Rich dialogue and lore',
            '🌌 Space Lore - Deep universe backstory',
            '👥 Character Relationships - Dynamic character interactions',
            '🎪 Side Quests - Optional story content',
            '🏆 Story Achievements - Unlock story-based rewards'
          ],
          stats: {
            chapters: 10,
            completed: 0,
            progress: '0%'
          }
        };
      case 'challenges':
        return {
          title: '🎯 CHALLENGE SYSTEM',
          color: '#ff4500',
          description: 'Take on exciting challenges and prove your skills!',
          isInteractive: true,
          features: [
            '🎯 10+ Challenge Modes - Various difficulty challenges',
            '📅 Daily Challenges - New challenges every day',
            '📆 Weekly Challenges - Extended weekly objectives',
            '🎉 Special Events - Limited-time special challenges',
            '📊 Difficulty Levels - Easy, Normal, Hard, Expert',
            '⏰ Time-based Challenges - Race against the clock',
            '🏆 Score Challenges - Compete for high scores',
            '💪 Survival Challenges - Survive as long as possible',
            '🎪 Boss Rush - Fight all bosses in sequence',
            '⚡ Speed Challenges - Complete levels quickly',
            '🎯 Precision Challenges - Perfect accuracy required',
            '🔥 Combo Challenges - Chain amazing combos'
          ],
          stats: {
            total: 10,
            completed: 0,
            progress: '0%'
          }
        };
      case 'settings':
        return {
          title: '⚙️ GAME SETTINGS',
          color: '#666666',
          description: 'Customize your gaming experience!',
          isInteractive: true,
          features: [
            '🔊 Audio Settings - Master volume and sound effects',
            '🎮 Graphics Quality - High, Medium, Low quality options',
            '⌨️ Control Configuration - Customize key bindings',
            '🎯 Display Options - Resolution and fullscreen settings',
            '🔊 Sound Effects - Individual sound effect controls',
            '🎵 Background Music - Music volume and track selection',
            '🎮 Controller Support - Gamepad configuration',
            '⚙️ Advanced Options - Performance and accessibility',
            '🌙 Dark Mode - Eye-friendly dark theme',
            '📱 Mobile Controls - Touch control customization',
            '🔊 Voice Chat - Multiplayer communication settings',
            '💾 Save Settings - Cloud save and local storage'
          ],
          stats: {
            audioLevel: settings?.audio.masterVolume || 80,
            graphicsQuality: settings?.graphics.quality || 'High',
            controls: 'Default'
          }
        };
      default:
        return {
          title: 'FEATURE',
          color: '#00d4ff',
          description: 'Feature coming soon!',
          features: ['Feature coming soon!']
        };
    }
  };

  const featureData = getFeatureData();

  // Render interactive achievements if it's the achievements modal
  if (feature === 'achievements' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="achievements-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="achievements-content">
            <div className="achievement-categories">
              <h3>🏆 Achievement Categories</h3>
              
              <div className="category-grid">
                <div className="category-card" onClick={() => {
                  console.log('Viewing Combat Achievements');
                  alert('Combat Achievements:\n\n⚔️ First Blood - Defeat your first enemy\n⚔️ Kill Streak - Defeat 10 enemies in a row\n⚔️ Boss Slayer - Defeat your first boss\n⚔️ Weapon Master - Use 10 different weapons\n⚔️ Sharpshooter - 90% accuracy with 100+ shots');
                }}>
                  <div className="category-icon">⚔️</div>
                  <h4>Combat</h4>
                  <p>Battle and combat achievements</p>
                  <div className="category-stats">
                    <span>0/5 Unlocked</span>
                  </div>
                </div>
                
                <div className="category-card" onClick={() => {
                  console.log('Viewing Survival Achievements');
                  alert('Survival Achievements:\n\n💪 Survivor - Survive for 5 minutes\n💪 Survival Master - Survive for 10 minutes\n💪 Shield Master - Use shield to block 50 attacks\n💪 Perfect Run - Complete level without taking damage');
                }}>
                  <div className="category-icon">💪</div>
                  <h4>Survival</h4>
                  <p>Endurance and survival achievements</p>
                  <div className="category-stats">
                    <span>0/4 Unlocked</span>
                  </div>
                </div>
                
                <div className="category-card" onClick={() => {
                  console.log('Viewing Collection Achievements');
                  alert('Collection Achievements:\n\n💎 Power-up Collector - Collect 20 power-ups\n💎 Power-up Master - Collect all power-up types\n💎 Power-up Legend - Collect 100 power-ups\n💎 Weapon Expert - Master all weapon types\n💎 Boss Hunter - Defeat 5 different bosses\n💎 Ultimate Master - Complete all achievements');
                }}>
                  <div className="category-icon">💎</div>
                  <h4>Collection</h4>
                  <p>Gathering and collection achievements</p>
                  <div className="category-stats">
                    <span>0/6 Unlocked</span>
                  </div>
                </div>
                
                <div className="category-card" onClick={() => {
                  console.log('Viewing Special Achievements');
                  alert('Special Achievements:\n\n🌟 Score Master - Reach 10,000 points\n🌟 Score Legend - Reach 50,000 points\n🌟 Combo Master - Achieve a 20x combo\n🌟 Combo Legend - Achieve 50x combo\n🌟 Speed Demon - Complete a level in under 2 minutes\n🌟 Speed Legend - Complete all speed challenges');
                }}>
                  <div className="category-icon">⭐</div>
                  <h4>Special</h4>
                  <p>Rare and special achievements</p>
                  <div className="category-stats">
                    <span>0/5 Unlocked</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="achievement-list">
              <h3>🎯 Available Achievements</h3>
              
              <div className="achievement-items">
                {achievements.map((achievement, index) => (
                  <div key={achievement.id} className={`achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`}>
                    <div className="achievement-icon">
                      {achievement.id === 'first_blood' ? '🎯' : 
                       achievement.id === 'kill_streak_10' ? '🔥' :
                       achievement.id === 'boss_slayer' ? '👹' :
                       achievement.id === 'power_up_collector' ? '⚡' :
                       achievement.id === 'survivor' ? '💪' :
                       achievement.id === 'combo_master' ? '🔥' :
                       achievement.id === 'perfect_accuracy' ? '🎯' :
                       achievement.id === 'speed_demon' ? '💨' :
                       achievement.id === 'shield_master' ? '🛡️' :
                       achievement.id === 'weapon_master' ? '🔫' : '🏆'}
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      <div className="achievement-progress">{achievement.progress}/{achievement.maxProgress}</div>
                    </div>
                    <div className="achievement-reward">
                      {achievement.unlocked ? '✅ UNLOCKED' : `+${achievement.maxProgress * 10} XP`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="achievement-actions">
            <button className="view-all-btn" onClick={() => {
              console.log('Viewing all achievements...');
              // Show detailed achievement view
              alert('Achievement Collection:\n\n🏆 Combat: 0/5 unlocked\n💪 Survival: 0/4 unlocked\n💎 Collection: 0/6 unlocked\n⭐ Special: 0/5 unlocked\n\nKeep playing to unlock more achievements!');
            }}>
              📋 View All Achievements
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive boss battles if it's the boss modal
  if (feature === 'boss' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="boss-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="boss-content">
            <div className="boss-selection">
              <h3>👹 Select Boss to Battle</h3>
              
              <div className="boss-grid">
                <div className="boss-card" onClick={() => console.log('Fight Space Dragon')}>
                  <div className="boss-icon">🐉</div>
                  <h4>Space Dragon</h4>
                  <p>Ancient cosmic dragon</p>
                  <div className="boss-difficulty">⭐⭐⭐</div>
                  <div className="boss-status">Available</div>
                </div>
                
                <div className="boss-card locked" onClick={() => console.log('Boss locked')}>
                  <div className="boss-icon">👾</div>
                  <h4>Void Reaper</h4>
                  <p>Shadow entity from the void</p>
                  <div className="boss-difficulty">⭐⭐⭐⭐</div>
                  <div className="boss-status">Locked</div>
                </div>
                
                <div className="boss-card locked" onClick={() => console.log('Boss locked')}>
                  <div className="boss-icon">🤖</div>
                  <h4>Mech Titan</h4>
                  <p>Giant robotic war machine</p>
                  <div className="boss-difficulty">⭐⭐⭐⭐⭐</div>
                  <div className="boss-status">Locked</div>
                </div>
              </div>
            </div>
            
            <div className="boss-info">
              <h3>⚔️ Boss Battle Info</h3>
              <div className="boss-mechanics">
                <div className="mechanic-item">
                  <span>🔄 Multi-Phase Battles</span>
                  <span>Bosses change tactics during battle</span>
                </div>
                <div className="mechanic-item">
                  <span>⚡ Weak Points</span>
                  <span>Target specific areas for extra damage</span>
                </div>
                <div className="mechanic-item">
                  <span>🛡️ Shield System</span>
                  <span>Break through boss defenses</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="boss-actions">
            <button className="start-boss-btn" onClick={() => {
              console.log('Starting boss battle...');
              // Close the modal and start the game with boss battle mode
              onClose();
              // Navigate to game scene and trigger boss battle
              setTimeout(() => {
                // Change to game scene using the onSceneChange prop
                if (typeof onSceneChange === 'function') {
                  onSceneChange('game');
                }
                // Trigger boss battle after a short delay
                setTimeout(() => {
                  console.log('Boss battle initiated!');
                  // Dispatch a custom event to trigger boss spawn
                  window.dispatchEvent(new CustomEvent('startBossBattle', { 
                    detail: { bossType: 'space_dragon', difficulty: 'normal' } 
                  }));
                }, 1000);
              }, 100);
            }}>
              ⚔️ Start Boss Battle
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive power-ups if it's the powerups modal
  if (feature === 'powerups' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="powerups-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="powerups-content">
            <div className="powerup-categories">
              <h3>⚡ Power-up Categories</h3>
              
              <div className="category-tabs">
                <button className="tab-btn active" onClick={() => console.log('Elemental tab')}>🔥 Elemental</button>
                <button className="tab-btn" onClick={() => console.log('Weapon tab')}>🔫 Weapon</button>
                <button className="tab-btn" onClick={() => console.log('Defense tab')}>🛡️ Defense</button>
                <button className="tab-btn" onClick={() => console.log('Utility tab')}>🔧 Utility</button>
              </div>
              
              <div className="powerup-grid">
                <div className="powerup-item" onClick={() => console.log('Fire Power-up')}>
                  <div className="powerup-icon">🔥</div>
                  <h4>Fire Blast</h4>
                  <p>Shoots fire projectiles</p>
                  <div className="powerup-rarity">Common</div>
                </div>
                
                <div className="powerup-item" onClick={() => console.log('Ice Power-up')}>
                  <div className="powerup-icon">❄️</div>
                  <h4>Ice Shield</h4>
                  <p>Freezes incoming projectiles</p>
                  <div className="powerup-rarity">Rare</div>
                </div>
                
                <div className="powerup-item" onClick={() => console.log('Lightning Power-up')}>
                  <div className="powerup-icon">⚡</div>
                  <h4>Lightning Strike</h4>
                  <p>Chain lightning attacks</p>
                  <div className="powerup-rarity">Epic</div>
                </div>
                
                <div className="powerup-item locked" onClick={() => console.log('Power-up locked')}>
                  <div className="powerup-icon">🌌</div>
                  <h4>Quantum Blast</h4>
                  <p>Advanced space technology</p>
                  <div className="powerup-rarity">Legendary</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="powerup-actions">
            <button className="view-collection-btn" onClick={() => {
              console.log('Viewing power-up collection...');
              // Show detailed power-up collection
              alert('📦 Power-up Collection:\n\n🔥 Fire Blast - Common - Shoots fire projectiles\n❄️ Ice Shield - Rare - Freezes incoming projectiles\n⚡ Lightning Strike - Epic - Chain lightning attacks\n🌌 Quantum Blast - Legendary - Advanced space technology\n💥 Explosive Rounds - Common - Area-of-effect damage\n🛡️ Shield Power-up - Common - Temporary invincibility\n🚀 Speed Boost - Common - Increases movement speed\n🎯 Multi-Shot - Rare - Temporary multi-shot mode\n\nCollect more power-ups during gameplay to unlock new abilities!');
            }}>
              📦 View Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive story if it's the story modal
  if (feature === 'story' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="story-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="story-content">
            <div className="story-chapters">
              <h3>📖 Story Chapters</h3>
              
              <div className="chapter-list">
                <div className="chapter-item available" onClick={() => console.log('Start Chapter 1')}>
                  <div className="chapter-number">1</div>
                  <div className="chapter-info">
                    <h4>The Awakening</h4>
                    <p>Kaden and Adelynn discover their destiny</p>
                    <div className="chapter-status">Available</div>
                  </div>
                </div>
                
                <div className="chapter-item locked" onClick={() => console.log('Chapter locked')}>
                  <div className="chapter-number">2</div>
                  <div className="chapter-info">
                    <h4>First Mission</h4>
                    <p>Their first space adventure begins</p>
                    <div className="chapter-status">Locked</div>
                  </div>
                </div>
                
                <div className="chapter-item locked" onClick={() => console.log('Chapter locked')}>
                  <div className="chapter-number">3</div>
                  <div className="chapter-info">
                    <h4>The Ancient Threat</h4>
                    <p>Discovering an ancient cosmic danger</p>
                    <div className="chapter-status">Locked</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="story-characters">
              <h3>👥 Character Development</h3>
              
              <div className="character-profiles">
                <div className="character-profile">
                  <div className="character-avatar">👦🏿</div>
                  <h4>Kaden</h4>
                  <p>Brave space pilot with lightning reflexes</p>
                  <div className="character-level">Level 1</div>
                </div>
                
                <div className="character-profile">
                  <div className="character-avatar">👧</div>
                  <h4>Adelynn</h4>
                  <p>Skilled navigator with tactical expertise</p>
                  <div className="character-level">Level 1</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="story-actions">
            <button className="start-story-btn" onClick={() => {
              console.log('Starting story mode...');
              // Close modal and start story
              onClose();
              // Navigate to game scene and trigger story mode
              setTimeout(() => {
                if (typeof onSceneChange === 'function') {
                  onSceneChange('game');
                }
                setTimeout(() => {
                  console.log('Story mode initiated!');
                  // Dispatch custom event for story mode
                  window.dispatchEvent(new CustomEvent('startStoryMode', { 
                    detail: { chapter: 1, title: 'The Awakening' } 
                  }));
                }, 1000);
              }, 100);
            }}>
              📖 Begin Adventure
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive challenges if it's the challenges modal
  if (feature === 'challenges' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="challenges-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="challenges-content">
            <div className="challenge-types">
              <h3>🎯 Challenge Types</h3>
              
              <div className="challenge-grid">
                <div className="challenge-card" onClick={() => {
                  console.log('Daily Challenge Selected');
                  // Close modal and start daily challenge
                  onClose();
                  setTimeout(() => {
                    console.log('Daily challenge initiated!');
                    // Dispatch custom event for daily challenge
                    window.dispatchEvent(new CustomEvent('startDailyChallenge', {
                      detail: { type: 'daily', reward: 200, objectives: ['Survive for 60 seconds', 'Kill 25 enemies', 'Collect 5 power-ups'] }
                    }));
                  }, 100);
                }}>
                  <div className="challenge-icon">📅</div>
                  <h4>Daily Challenge</h4>
                  <p>New challenge every day</p>
                  <div className="challenge-reward">+200 XP</div>
                </div>
                
                <div className="challenge-card" onClick={() => {
                  console.log('Weekly Challenge Selected');
                  // Close modal and start weekly challenge
                  onClose();
                  setTimeout(() => {
                    console.log('Weekly challenge initiated!');
                    // Dispatch custom event for weekly challenge
                    window.dispatchEvent(new CustomEvent('startWeeklyChallenge', {
                      detail: { type: 'weekly', reward: 1000, objectives: ['Survive for 5 minutes', 'Kill 100 enemies', 'Defeat 3 bosses', 'Collect 20 power-ups'] }
                    }));
                  }, 100);
                }}>
                  <div className="challenge-icon">📆</div>
                  <h4>Weekly Challenge</h4>
                  <p>Extended weekly objectives</p>
                  <div className="challenge-reward">+1000 XP</div>
                </div>
                
                <div className="challenge-card" onClick={() => {
                  console.log('Survival Challenge Selected');
                  // Close modal and start survival challenge
                  onClose();
                  setTimeout(() => {
                    console.log('Survival challenge initiated!');
                    // Dispatch custom event for survival challenge
                    window.dispatchEvent(new CustomEvent('startSurvivalChallenge', {
                      detail: { type: 'survival', reward: 500, objectives: ['Survive as long as possible', 'Endless enemy waves', 'No power-ups', 'Maximum difficulty'] }
                    }));
                  }, 100);
                }}>
                  <div className="challenge-icon">💪</div>
                  <h4>Survival Challenge</h4>
                  <p>Survive as long as possible</p>
                  <div className="challenge-reward">+500 XP</div>
                </div>
                
                <div className="challenge-card" onClick={() => {
                  console.log('Boss Rush Selected');
                  // Close modal and start boss rush challenge
                  onClose();
                  setTimeout(() => {
                    console.log('Boss rush challenge initiated!');
                    // Dispatch custom event for boss rush challenge
                    window.dispatchEvent(new CustomEvent('startBossRushChallenge', {
                      detail: { type: 'bossRush', reward: 1500, objectives: ['Defeat all 5 bosses', 'No healing between bosses', 'Maximum difficulty', 'Time limit: 10 minutes'] }
                    }));
                  }, 100);
                }}>
                  <div className="challenge-icon">🎪</div>
                  <h4>Boss Rush</h4>
                  <p>Fight all bosses in sequence</p>
                  <div className="challenge-reward">+1500 XP</div>
                </div>
              </div>
            </div>
            
            <div className="challenge-difficulty">
              <h3>📊 Difficulty Levels</h3>
              
              <div className="difficulty-options">
                <button className="difficulty-btn active" onClick={() => {
                  console.log('Easy difficulty selected');
                  alert('🟢 Easy Difficulty Selected!\n\n🎯 Perfect for beginners\n⚡ Slower enemies, more health\n🏆 Great for learning the game!');
                }}>
                  🟢 Easy
                </button>
                <button className="difficulty-btn" onClick={() => {
                  console.log('Normal difficulty selected');
                  alert('🟡 Normal Difficulty Selected!\n\n🎯 Balanced gameplay\n⚡ Standard enemy speed and health\n🏆 Perfect for most players!');
                }}>
                  🟡 Normal
                </button>
                <button className="difficulty-btn" onClick={() => {
                  console.log('Hard difficulty selected');
                  alert('🟠 Hard Difficulty Selected!\n\n🎯 Challenging gameplay\n⚡ Faster enemies, less health\n🏆 For experienced players!');
                }}>
                  🟠 Hard
                </button>
                <button className="difficulty-btn" onClick={() => {
                  console.log('Expert difficulty selected');
                  alert('🔴 Expert Difficulty Selected!\n\n🎯 Very challenging gameplay\n⚡ Much faster enemies, minimal health\n🏆 For expert players only!');
                }}>
                  🔴 Expert
                </button>
              </div>
            </div>
          </div>
          
          <div className="challenge-actions">
            <button className="start-challenge-btn" onClick={() => {
              console.log('Starting challenge...');
              // Close modal and start challenge
              onClose();
              setTimeout(() => {
                console.log('Challenge mode initiated!');
                alert('Challenge Mode Started!\n\n🎯 Daily Challenge: Survive for 60 seconds\n📅 Weekly Challenge: Defeat 50 enemies\n💪 Survival Challenge: Survive as long as possible\n🎪 Boss Rush: Fight all bosses in sequence\n\nGood luck, pilot!');
              }, 100);
            }}>
              🎯 Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive multiplayer if it's the multiplayer modal
  if (feature === 'multiplayer' && featureData.isInteractive) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="multiplayer-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="multiplayer-content">
            <div className="multiplayer-modes">
              <h3>🎮 Select Multiplayer Mode</h3>
              
              <div className="mode-grid">
                <div className="mode-card" onClick={() => {
                  console.log('Starting Local Multiplayer');
                  // Close modal and start local multiplayer
                  onClose();
                  setTimeout(() => {
                    console.log('Local multiplayer mode initiated!');
                    // Dispatch custom event for local multiplayer mode
                    window.dispatchEvent(new CustomEvent('startLocalMultiplayer', {
                      detail: { mode: 'local', maxPlayers: 4 }
                    }));
                  }, 100);
                }}>
                  <div className="mode-icon">👥</div>
                  <h4>Local Multiplayer</h4>
                  <p>Play with friends on the same device</p>
                  <div className="mode-stats">
                    <span>👥 2-4 Players</span>
                    <span>🎮 Same Device</span>
                  </div>
                </div>
                
                <div className="mode-card" onClick={() => {
                  console.log('Starting Online Multiplayer');
                  // Close modal and start online multiplayer
                  onClose();
                  setTimeout(() => {
                    console.log('Online multiplayer mode initiated!');
                    // Dispatch custom event for online multiplayer mode
                    window.dispatchEvent(new CustomEvent('startOnlineMultiplayer', {
                      detail: { mode: 'online', maxPlayers: 8 }
                    }));
                  }, 100);
                }}>
                  <div className="mode-icon">🌐</div>
                  <h4>Online Multiplayer</h4>
                  <p>Play with friends across the internet</p>
                  <div className="mode-stats">
                    <span>👥 2-8 Players</span>
                    <span>🌐 Internet Required</span>
                  </div>
                </div>
                
                <div className="mode-card" onClick={() => {
                  console.log('Starting Cooperative Mode');
                  // Close modal and start cooperative mode
                  onClose();
                  setTimeout(() => {
                    console.log('Cooperative mode initiated!');
                    // Dispatch custom event for cooperative mode
                    window.dispatchEvent(new CustomEvent('startCooperativeMode', {
                      detail: { mode: 'cooperative', maxPlayers: 4, vsAI: true }
                    }));
                  }, 100);
                }}>
                  <div className="mode-icon">🤝</div>
                  <h4>Cooperative Mode</h4>
                  <p>Work together against AI enemies</p>
                  <div className="mode-stats">
                    <span>👥 2-4 Players</span>
                    <span>🤖 vs AI</span>
                  </div>
                </div>
                
                <div className="mode-card" onClick={() => {
                  // Start competitive mode
                  console.log('Starting Competitive Mode');
                }}>
                  <div className="mode-icon">⚔️</div>
                  <h4>Competitive Mode</h4>
                  <p>Battle against other players</p>
                  <div className="mode-stats">
                    <span>👥 2-8 Players</span>
                    <span>🥊 PvP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="multiplayer-options">
              <h3>⚙️ Multiplayer Options</h3>
              
              <div className="option-grid">
                <div className="option-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>🎵 Background Music</span>
                  </label>
                </div>
                <div className="option-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>🔊 Sound Effects</span>
                  </label>
                </div>
                <div className="option-item">
                  <label>
                    <input type="checkbox" />
                    <span>💬 Voice Chat</span>
                  </label>
                </div>
                <div className="option-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>🎯 Friendly Fire</span>
                  </label>
                </div>
                <div className="option-item">
                  <label>
                    <input type="checkbox" />
                    <span>⏰ Time Limit</span>
                  </label>
                </div>
                <div className="option-item">
                  <label>
                    <input type="checkbox" defaultChecked />
                    <span>🏆 Score Tracking</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="room-creation">
              <h3>🏠 Create or Join Room</h3>
              
              <div className="room-actions">
                <button className="create-room-btn" onClick={() => {
                  console.log('Creating new room');
                }}>
                  🏠 Create Room
                </button>
                <button className="join-room-btn" onClick={() => {
                  console.log('Joining existing room');
                }}>
                  🚪 Join Room
                </button>
                <button className="quick-match-btn" onClick={() => {
                  console.log('Quick match');
                }}>
                  ⚡ Quick Match
                </button>
              </div>
              
              <div className="room-code">
                <label>Room Code:</label>
                <input 
                  type="text" 
                  placeholder="Enter room code..." 
                  maxLength={6}
                  className="room-code-input"
                />
                <button className="join-code-btn">Join</button>
              </div>
            </div>
          </div>
          
          <div className="multiplayer-actions">
            <button className="start-multiplayer-btn" onClick={() => {
              console.log('Starting multiplayer game...');
              // Close modal and start multiplayer
              onClose();
              // Navigate to game scene and trigger multiplayer mode
              setTimeout(() => {
                if (typeof onSceneChange === 'function') {
                  onSceneChange('game');
                }
                setTimeout(() => {
                  console.log('Multiplayer mode initiated!');
                  // Dispatch custom event for multiplayer mode
                  window.dispatchEvent(new CustomEvent('startMultiplayerMode', { 
                    detail: { mode: 'coop', players: 2 } 
                  }));
                }, 1000);
              }, 100);
            }}>
              🚀 Start Multiplayer Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render interactive settings if it's the settings modal
  if (feature === 'settings' && featureData.isInteractive && settings && onUpdateSettings) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="settings-content">
            {/* Audio Settings */}
            <div className="settings-section">
              <h3>🔊 Audio Settings</h3>
              <div className="setting-group">
                <label>Master Volume: {settings.audio.masterVolume}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.audio.masterVolume}
                  onChange={(e) => onUpdateSettings({
                    audio: { ...settings.audio, masterVolume: parseInt(e.target.value) }
                  })}
                  className="slider"
                />
              </div>
              <div className="setting-group">
                <label>Music Volume: {settings.audio.musicVolume}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.audio.musicVolume}
                  onChange={(e) => onUpdateSettings({
                    audio: { ...settings.audio, musicVolume: parseInt(e.target.value) }
                  })}
                  className="slider"
                />
              </div>
              <div className="setting-group">
                <label>Sound Effects: {settings.audio.soundEffectsVolume}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.audio.soundEffectsVolume}
                  onChange={(e) => onUpdateSettings({
                    audio: { ...settings.audio, soundEffectsVolume: parseInt(e.target.value) }
                  })}
                  className="slider"
                />
              </div>
            </div>

            {/* Graphics Settings */}
            <div className="settings-section">
              <h3>🎮 Graphics Settings</h3>
              <div className="setting-group">
                <label>Quality:</label>
                <select 
                  value={settings.graphics.quality}
                  onChange={(e) => onUpdateSettings({
                    graphics: { ...settings.graphics, quality: e.target.value as any }
                  })}
                  className="setting-select"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Ultra">Ultra</option>
                </select>
              </div>
              <div className="setting-group">
                <label>Resolution:</label>
                <select 
                  value={settings.graphics.resolution}
                  onChange={(e) => onUpdateSettings({
                    graphics: { ...settings.graphics, resolution: e.target.value }
                  })}
                  className="setting-select"
                >
                  <option value="1280x720">1280x720</option>
                  <option value="1920x1080">1920x1080</option>
                  <option value="2560x1440">2560x1440</option>
                  <option value="3840x2160">3840x2160</option>
                </select>
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.graphics.fullscreen}
                    onChange={(e) => onUpdateSettings({
                      graphics: { ...settings.graphics, fullscreen: e.target.checked }
                    })}
                  />
                  Fullscreen
                </label>
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.graphics.vsync}
                    onChange={(e) => onUpdateSettings({
                      graphics: { ...settings.graphics, vsync: e.target.checked }
                    })}
                  />
                  VSync
                </label>
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.graphics.particles}
                    onChange={(e) => onUpdateSettings({
                      graphics: { ...settings.graphics, particles: e.target.checked }
                    })}
                  />
                  Particle Effects
                </label>
              </div>
            </div>

            {/* Controls Settings */}
            <div className="settings-section">
              <h3>⌨️ Control Settings</h3>
              <div className="setting-group">
                <label>Mouse Sensitivity: {settings.controls.mouseSensitivity}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={settings.controls.mouseSensitivity}
                  onChange={(e) => onUpdateSettings({
                    controls: { ...settings.controls, mouseSensitivity: parseInt(e.target.value) }
                  })}
                  className="slider"
                />
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.controls.controllerEnabled}
                    onChange={(e) => onUpdateSettings({
                      controls: { ...settings.controls, controllerEnabled: e.target.checked }
                    })}
                  />
                  Enable Controller
                </label>
              </div>
              <div className="key-bindings">
                <h4>Key Bindings:</h4>
                <div className="key-binding-grid">
                  <div className="key-binding">
                    <span>Move Up:</span>
                    <kbd>{settings.controls.keyBindings.moveUp}</kbd>
                  </div>
                  <div className="key-binding">
                    <span>Move Down:</span>
                    <kbd>{settings.controls.keyBindings.moveDown}</kbd>
                  </div>
                  <div className="key-binding">
                    <span>Move Left:</span>
                    <kbd>{settings.controls.keyBindings.moveLeft}</kbd>
                  </div>
                  <div className="key-binding">
                    <span>Move Right:</span>
                    <kbd>{settings.controls.keyBindings.moveRight}</kbd>
                  </div>
                  <div className="key-binding">
                    <span>Shoot:</span>
                    <kbd>{settings.controls.keyBindings.shoot}</kbd>
                  </div>
                  <div className="key-binding">
                    <span>Pause:</span>
                    <kbd>{settings.controls.keyBindings.pause}</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility Settings */}
            <div className="settings-section">
              <h3>♿ Accessibility Settings</h3>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.accessibility.colorBlindMode}
                    onChange={(e) => onUpdateSettings({
                      accessibility: { ...settings.accessibility, colorBlindMode: e.target.checked }
                    })}
                  />
                  Color Blind Mode
                </label>
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.accessibility.highContrast}
                    onChange={(e) => onUpdateSettings({
                      accessibility: { ...settings.accessibility, highContrast: e.target.checked }
                    })}
                  />
                  High Contrast
                </label>
              </div>
              <div className="setting-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    checked={settings.accessibility.largeText}
                    onChange={(e) => onUpdateSettings({
                      accessibility: { ...settings.accessibility, largeText: e.target.checked }
                    })}
                  />
                  Large Text
                </label>
              </div>
            </div>
          </div>
          
          <div className="settings-actions">
            <button className="reset-btn" onClick={() => {
              // Reset to defaults
              onUpdateSettings({
                audio: { masterVolume: 80, musicVolume: 70, soundEffectsVolume: 90, voiceVolume: 85 },
                graphics: { quality: 'High', resolution: '1920x1080', fullscreen: false, vsync: true, particles: true, shadows: true },
                controls: { keyBindings: { moveUp: 'ArrowUp', moveDown: 'ArrowDown', moveLeft: 'ArrowLeft', moveRight: 'ArrowRight', shoot: 'Space', pause: 'Escape' }, mouseSensitivity: 50, controllerEnabled: false },
                accessibility: { colorBlindMode: false, highContrast: false, largeText: false, screenReader: false }
              });
            }}>
              🔄 Reset to Defaults
            </button>
            <button className="save-btn" onClick={onClose}>
              💾 Save Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular feature modal for non-settings
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="feature-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: featureData.color }}>{featureData.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="feature-description">
          {featureData.description}
        </div>
        
        <div className="feature-stats">
          {featureData.stats && (
            <div className="stats-grid">
              {Object.entries(featureData.stats).map(([key, value]) => (
                <div key={key} className="stat-item">
                  <span className="stat-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="stat-value">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="feature-list">
          {featureData.features.map((feature, index) => (
            <div key={index} className="feature-item">
              {feature}
            </div>
          ))}
        </div>
        
        <div className="status-badge">
          🎮 FULLY IMPLEMENTED - Ready to Play!
        </div>
      </div>
    </div>
  );
};

// Game Scene Component
interface GameSceneProps {
  onSceneChange: (scene: GameState['currentScene']) => void;
  selectedCharacter: 'kaden' | 'adelynn';
  gameStats: GameState['gameStats'];
  achievements: Array<{id: string, name: string, description: string, unlocked: boolean, progress: number, maxProgress: number}>;
  setAchievements: React.Dispatch<React.SetStateAction<Array<{id: string, name: string, description: string, unlocked: boolean, progress: number, maxProgress: number}>>>;
  inputSystem: InputSystem | null;
  deviceInfo: any;
  showTouchControls: boolean;
}

// Game object interfaces
interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  invulnerable: boolean;
  invulnerabilityTime: number;
}

interface Bullet {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  type: 'player' | 'enemy' | 'wing_fighter';
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  type: string;
  lastShot: number;
  shootInterval: number;
}

interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  maxHealth: number;
  type: string;
  phase: number;
  maxPhases: number;
  lastShot: number;
  shootInterval: number;
  specialAttackCooldown: number;
  movementPattern: string;
  isActive: boolean;
  shield: number;
  maxShield: number;
  weakPoints: Array<{x: number, y: number, width: number, height: number, destroyed: boolean}>;
}

interface PowerUp {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: string;
  effect: string;
  shouldRemove?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const GameScene: React.FC<GameSceneProps> = ({ onSceneChange, selectedCharacter, gameStats, achievements, setAchievements, inputSystem, deviceInfo, showTouchControls }) => {
  const toastContext = React.useContext(ToastContext);
  const ratingSystem = React.useRef<GameRatingSystem>(new GameRatingSystem());
  const mobileResponsive = React.useRef<MobileResponsiveSystem>(new MobileResponsiveSystem());
  
  // Initialize new 10/10 systems
  // const advancedWeaponSystem = React.useRef<AdvancedWeaponSystem>(new AdvancedWeaponSystem());
  // const missionSystem = React.useRef<MissionSystem>(new MissionSystem());
  const enhanced3DGraphics = React.useRef<Enhanced3DGraphics | null>(null);
  const bulletHellSystem = React.useRef<BulletHellSystem>(new BulletHellSystem());
  const proceduralGeneration = React.useRef<ProceduralGenerationSystem>(new ProceduralGenerationSystem());
  // const socialFeatures = React.useRef<SocialFeaturesSystem>(new SocialFeaturesSystem());
  // const monetizationSystem = React.useRef<MonetizationSystem>(new MonetizationSystem());
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const gameLoopRef = React.useRef<number | null>(null);
  const lastTimeRef = React.useRef<number>(0);
  
  // Game state
  const [gameState, setGameState] = React.useState({
    score: 0,
    health: 100,
    maxHealth: 100,
    level: 1,
    gameOver: false,
    paused: false,
    enemiesKilled: 0,
    bossesKilled: 0,
    powerUpsCollected: 0,
    killStreak: 0,
    maxKillStreak: 0,
    survivalTime: 0,
    maxCombo: 0,
    achievementsUnlocked: 0,
    multiplayerMode: undefined as 'local' | 'online' | 'cooperative' | undefined,
    maxPlayers: undefined as number | undefined,
    vsAI: undefined as boolean | undefined,
    challengeMode: undefined as 'daily' | 'weekly' | 'survival' | 'bossRush' | undefined,
    challengeReward: undefined as number | undefined,
    challengeObjectives: undefined as string[] | undefined
  });
  
  // Game objects
  const [player, setPlayer] = React.useState<Player>({
    x: 400,
    y: 500,
    width: 40,
    height: 50,
    speed: 5,
    health: 100,
    maxHealth: 100,
    invulnerable: false,
    invulnerabilityTime: 0
  });
  
  const [lastShot, setLastShot] = React.useState<number>(0);
  
  const [bullets, setBullets] = React.useState<Bullet[]>([]);
  const [enemies, setEnemies] = React.useState<Enemy[]>([]);
  const [bosses, setBosses] = React.useState<Boss[]>([]);
  const [powerUps, setPowerUps] = React.useState<PowerUp[]>([]);
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [keys, setKeys] = React.useState<{ [key: string]: boolean }>({});
  const [wingFighters, setWingFighters] = React.useState<Array<{id: string, x: number, y: number, width: number, height: number, speed: number, targetX: number, targetY: number, offset: number, lastShot?: number}>>([]);
  
  // Initialize mobile responsiveness and responsive canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize mobile responsive system
    mobileResponsive.current.initializeCanvas(canvas);
    
    // Set responsive canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const aspectRatio = 800 / 600; // Original game aspect ratio
      
      let canvasWidth = containerRect.width;
      let canvasHeight = containerRect.width / aspectRatio;
      
      // If height exceeds container, scale by height instead
      if (canvasHeight > containerRect.height) {
        canvasHeight = containerRect.height;
        canvasWidth = containerRect.height * aspectRatio;
      }
      
      // Set canvas dimensions
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      console.log(`Canvas resized to: ${canvasWidth}x${canvasHeight}`);
    };
    
    // Initial resize
    resizeCanvas();
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', () => {
      setTimeout(resizeCanvas, 100); // Delay for orientation change
    });
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
    if (canvas) {
      // Type guard to ensure canvas is not null
      const canvasElement = canvas as HTMLCanvasElement;
      mobileResponsive.current.applyResponsiveStyles(canvasElement);
    
    // Initialize 3D graphics system
      enhanced3DGraphics.current = new Enhanced3DGraphics(canvasElement, {
      quality: 'high',
      shadows: true,
      particles: true,
      lighting: true,
      reflections: true,
      postProcessing: true,
      antiAliasing: true,
      textureQuality: 'high',
      renderDistance: 1000
    });
    }
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      mobileResponsive.current.handleOrientationChange();
    };
    
    // Handle boss battle trigger
    const handleBossBattle = (event: CustomEvent) => {
      console.log('Boss battle triggered:', event.detail);
      // Spawn a boss immediately
      spawnBoss();
      // Show boss battle notification
      if (toastContext) {
        toastContext.showToast({
          type: 'achievement',
          title: '👹 Boss Battle Started!',
          message: 'Defeat the boss to continue!',
          icon: '👹',
          duration: 5000
        });
      }
    };
    
    // Handle multiplayer mode triggers
    const handleLocalMultiplayer = (event: CustomEvent) => {
      console.log('Local multiplayer triggered:', event.detail);
      // Enable local multiplayer features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        multiplayerMode: 'local',
        maxPlayers: event.detail.maxPlayers
      }));
      // Show multiplayer UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '🎮 Local Multiplayer Active!',
          message: 'Connect additional controllers or use touch controls!',
          icon: '👥',
          duration: 3000
        });
      }
    };
    
    const handleOnlineMultiplayer = (event: CustomEvent) => {
      console.log('Online multiplayer triggered:', event.detail);
      // Enable online multiplayer features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        multiplayerMode: 'online',
        maxPlayers: event.detail.maxPlayers
      }));
      // Show online multiplayer UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '🌐 Online Multiplayer Active!',
          message: 'Creating room... Connect with friends worldwide!',
          icon: '🌐',
          duration: 3000
        });
      }
    };
    
    const handleCooperativeMode = (event: CustomEvent) => {
      console.log('Cooperative mode triggered:', event.detail);
      // Enable cooperative mode features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        multiplayerMode: 'cooperative',
        maxPlayers: event.detail.maxPlayers,
        vsAI: event.detail.vsAI
      }));
      // Show cooperative mode UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '🤝 Cooperative Mode Active!',
          message: 'Work together to defeat AI enemies!',
          icon: '🤝',
          duration: 3000
        });
      }
    };
    
    // Handle challenge mode triggers
    const handleDailyChallenge = (event: CustomEvent) => {
      console.log('Daily challenge triggered:', event.detail);
      // Enable daily challenge features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        challengeMode: 'daily',
        challengeReward: event.detail.reward,
        challengeObjectives: event.detail.objectives
      }));
      // Show daily challenge UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '📅 Daily Challenge Active!',
          message: `Complete objectives for ${event.detail.reward} XP!`,
          icon: '📅',
          duration: 3000
        });
      }
    };
    
    const handleWeeklyChallenge = (event: CustomEvent) => {
      console.log('Weekly challenge triggered:', event.detail);
      // Enable weekly challenge features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        challengeMode: 'weekly',
        challengeReward: event.detail.reward,
        challengeObjectives: event.detail.objectives
      }));
      // Show weekly challenge UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '📆 Weekly Challenge Active!',
          message: `Extended objectives for ${event.detail.reward} XP!`,
          icon: '📆',
          duration: 3000
        });
      }
    };
    
    const handleSurvivalChallenge = (event: CustomEvent) => {
      console.log('Survival challenge triggered:', event.detail);
      // Enable survival challenge features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        challengeMode: 'survival',
        challengeReward: event.detail.reward,
        challengeObjectives: event.detail.objectives
      }));
      // Show survival challenge UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '💪 Survival Challenge Active!',
          message: `Endless waves for ${event.detail.reward} XP!`,
          icon: '💪',
          duration: 3000
        });
      }
    };
    
    const handleBossRushChallenge = (event: CustomEvent) => {
      console.log('Boss rush challenge triggered:', event.detail);
      // Enable boss rush challenge features
      setGameState(prev => ({ 
        ...prev, 
        currentScene: 'game',
        challengeMode: 'bossRush',
        challengeReward: event.detail.reward,
        challengeObjectives: event.detail.objectives
      }));
      // Show boss rush challenge UI elements
      if (toastContext) {
        toastContext.showToast({
          type: 'success',
          title: '🎪 Boss Rush Challenge Active!',
          message: `Defeat all bosses for ${event.detail.reward} XP!`,
          icon: '🎪',
          duration: 3000
        });
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('startBossBattle', handleBossBattle as EventListener);
    window.addEventListener('startLocalMultiplayer', handleLocalMultiplayer as EventListener);
    window.addEventListener('startOnlineMultiplayer', handleOnlineMultiplayer as EventListener);
    window.addEventListener('startCooperativeMode', handleCooperativeMode as EventListener);
    window.addEventListener('startDailyChallenge', handleDailyChallenge as EventListener);
    window.addEventListener('startWeeklyChallenge', handleWeeklyChallenge as EventListener);
    window.addEventListener('startSurvivalChallenge', handleSurvivalChallenge as EventListener);
    window.addEventListener('startBossRushChallenge', handleBossRushChallenge as EventListener);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('startBossBattle', handleBossBattle as EventListener);
      window.removeEventListener('startLocalMultiplayer', handleLocalMultiplayer as EventListener);
      window.removeEventListener('startOnlineMultiplayer', handleOnlineMultiplayer as EventListener);
      window.removeEventListener('startCooperativeMode', handleCooperativeMode as EventListener);
      window.removeEventListener('startDailyChallenge', handleDailyChallenge as EventListener);
      window.removeEventListener('startWeeklyChallenge', handleWeeklyChallenge as EventListener);
      window.removeEventListener('startSurvivalChallenge', handleSurvivalChallenge as EventListener);
      window.removeEventListener('startBossRushChallenge', handleBossRushChallenge as EventListener);
    };
  }, [toastContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // Game loop
  const gameLoop = React.useCallback((currentTime: number) => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars background
    drawStars(ctx, canvas.width, canvas.height);
    
    // Update game objects
    updatePlayer(deltaTime);
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    updateBosses(deltaTime);
    updatePowerUps(deltaTime);
    updateWingFighters(deltaTime);
    updateParticles(deltaTime);
    updateAchievements(deltaTime);
    
    // Update new 10/10 systems
    if (enhanced3DGraphics.current) {
      enhanced3DGraphics.current.render(deltaTime);
    }
    bulletHellSystem.current.updateBullets(deltaTime);
    proceduralGeneration.current.generateLevel('current', 300000);
    
    // Spawn enemies
    if (Math.random() < 0.02) {
      spawnEnemy();
    }
    
    // Spawn bosses based on score
    if (gameState.score > 0 && gameState.score % 1000 === 0 && bosses.length === 0) {
      spawnBoss();
    }
    
    // Spawn power-ups
    if (Math.random() < 0.01) {
      spawnPowerUp();
    }
    
    // Draw game objects
    drawPlayer(ctx);
    drawWingFighters(ctx);
    drawBullets(ctx);
    drawEnemies(ctx);
    drawBosses(ctx);
    drawPowerUps(ctx);
    drawParticles(ctx);
    
    // Draw new 10/10 systems
    if (enhanced3DGraphics.current) {
      // Enhanced 3D graphics are handled in the render method
    }
    drawBulletHellPatterns(ctx);
    
    // Check collisions
    checkCollisions();
    
    // Continue game loop
    if (!gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.gameOver, player, bullets, enemies, powerUps, particles, keys, bosses.length, gameState.score]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Draw functions
  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % width;
      const y = (i * 23) % height;
      ctx.fillRect(x, y, 1, 1);
    }
  };
  
  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // Enhanced player ship design
    const shipColor = selectedCharacter === 'kaden' ? '#4a90e2' : '#e24a90';
    const accentColor = selectedCharacter === 'kaden' ? '#2c5aa0' : '#a02c5a';
    
    // Main ship body - enhanced triangle
    ctx.fillStyle = shipColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(0, -20);  // Top point
    ctx.lineTo(-18, 15); // Bottom left
    ctx.lineTo(-8, 18);  // Left wing connection
    ctx.lineTo(8, 18);   // Right wing connection
    ctx.lineTo(18, 15);  // Bottom right
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Wing extensions
    ctx.fillStyle = shipColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    
    // Left wing
    ctx.beginPath();
    ctx.moveTo(-8, 18);
    ctx.lineTo(-12, 20);
    ctx.lineTo(-6, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Right wing
    ctx.beginPath();
    ctx.moveTo(8, 18);
    ctx.lineTo(12, 20);
    ctx.lineTo(6, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cockpit/canopy
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -8, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Cockpit highlight
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(0, -10, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Engine details
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(-6, 18, 4, 6);
    ctx.fillRect(2, 18, 4, 6);
    
    // Engine glow effect
    const glow = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(0, 255, 255, ${glow * 0.8})`;
    ctx.fillRect(-8, 20, 6, 8);
    ctx.fillRect(2, 20, 6, 8);
    
    // Ship outline glow
    ctx.strokeStyle = `rgba(255, 255, 255, ${glow * 0.5})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-18, 15);
    ctx.lineTo(-8, 18);
    ctx.lineTo(8, 18);
    ctx.lineTo(18, 15);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
  };

  const drawWingFighters = (ctx: CanvasRenderingContext2D) => {
    wingFighters.forEach(wingFighter => {
      ctx.save();
      ctx.translate(wingFighter.x + wingFighter.width / 2, wingFighter.y + wingFighter.height / 2);
      
      // Wing fighter design - exact mini version of player ship
      const shipColor = selectedCharacter === 'kaden' ? '#4a90e2' : '#e24a90';
      const accentColor = selectedCharacter === 'kaden' ? '#2c5aa0' : '#a02c5a';
      
      // Main ship body - mini triangle (scaled down from player ship)
      ctx.fillStyle = shipColor;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(0, -10);  // Top point (scaled from -20)
      ctx.lineTo(-9, 7.5); // Bottom left (scaled from -18, 15)
      ctx.lineTo(-4, 9);  // Left wing connection (scaled from -8, 18)
      ctx.lineTo(4, 9);   // Right wing connection (scaled from 8, 18)
      ctx.lineTo(9, 7.5);  // Bottom right (scaled from 18, 15)
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Wing extensions - mini version
      ctx.fillStyle = shipColor;
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 0.5;
      
      // Left wing
      ctx.beginPath();
      ctx.moveTo(-4, 9);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-3, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Right wing
      ctx.beginPath();
      ctx.moveTo(4, 9);
      ctx.lineTo(6, 10);
      ctx.lineTo(3, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Cockpit/canopy - mini version
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -4, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Cockpit highlight
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.arc(0, -5, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Engine details - mini version
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(-3, 9, 2, 3);
      ctx.fillRect(1, 9, 2, 3);
      
      // Engine glow effect
      const glow = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(0, 255, 255, ${glow * 0.8})`;
      ctx.fillRect(-4, 10, 3, 4);
      ctx.fillRect(1, 10, 3, 4);
      
      // Ship outline glow
      ctx.strokeStyle = `rgba(255, 255, 255, ${glow * 0.5})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(-9, 7.5);
      ctx.lineTo(-4, 9);
      ctx.lineTo(4, 9);
      ctx.lineTo(9, 7.5);
      ctx.closePath();
      ctx.stroke();
      
      // Wing fighter identification glow (different from player)
      const wingGlow = Math.sin(Date.now() * 0.008 + wingFighter.id.length) * 0.4 + 0.6;
      ctx.strokeStyle = `rgba(255, 170, 0, ${wingGlow * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    });
  };
  
  const drawBullets = (ctx: CanvasRenderingContext2D) => {
    bullets.forEach(bullet => {
      if (bullet.type === 'player') {
        ctx.fillStyle = '#00ffff';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      } else if (bullet.type === 'wing_fighter') {
        // Wing fighter bullets - smaller and different color
        ctx.fillStyle = '#ffaa00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Add glow effect for wing fighter bullets
        ctx.fillStyle = 'rgba(255, 170, 0, 0.3)';
        ctx.fillRect(bullet.x - 1, bullet.y - 1, bullet.width + 2, bullet.height + 2);
      } else {
        // Enemy bullets
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      }
    });
  };
  
  // New 10/10 drawing functions
  const drawBulletHellPatterns = (ctx: CanvasRenderingContext2D) => {
    const activeBullets = bulletHellSystem.current.getActiveBullets();
    activeBullets.forEach(bullet => {
      ctx.save();
      ctx.fillStyle = bullet.color;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };
  
  const drawEnemies = (ctx: CanvasRenderingContext2D) => {
    enemies.forEach(enemy => {
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      
      // Enemy ship
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.moveTo(0, 20);
      ctx.lineTo(-15, -20);
      ctx.lineTo(15, -20);
      ctx.closePath();
      ctx.fill();
      
      // Enemy details
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -10, 6, 5);
      
      ctx.restore();
    });
  };
  
  const drawBosses = (ctx: CanvasRenderingContext2D) => {
    bosses.forEach(boss => {
      ctx.save();
      ctx.translate(boss.x, boss.y);
      
      // Boss ship - much larger
      ctx.fillStyle = boss.phase === 1 ? '#8b0000' : boss.phase === 2 ? '#4b0082' : '#ff4500';
      ctx.fillRect(-40, -30, 80, 60);
      
      // Boss shield
      if (boss.shield > 0) {
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(-45, -35, 90, 70);
      }
      
      // Boss health bar
      const healthPercent = boss.health / boss.maxHealth;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-40, -40, 80, 5);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-40, -40, 80 * healthPercent, 5);
      
      // Boss weak points
      boss.weakPoints.forEach((weakPoint, index) => {
        if (!weakPoint.destroyed) {
          ctx.fillStyle = '#ffff00';
          ctx.fillRect(weakPoint.x, weakPoint.y, weakPoint.width, weakPoint.height);
        }
      });
      
      // Boss phase indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Phase ${boss.phase}/${boss.maxPhases}`, 0, -50);
      
      ctx.restore();
    });
  };
  
  const drawPowerUps = (ctx: CanvasRenderingContext2D) => {
    powerUps.forEach(powerUp => {
      ctx.save();
      ctx.translate(powerUp.x, powerUp.y);
      
      // Power-up glow with pulsing effect
      const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
      ctx.beginPath();
      ctx.arc(0, 0, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Power-up symbol based on type
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      
      let symbol = '⚡';
      switch (powerUp.type) {
        case 'health':
          symbol = '❤️';
          break;
        case 'speed':
          symbol = '💨';
          break;
        case 'rapid':
          symbol = '🔥';
          break;
        case 'shield':
          symbol = '🛡️';
          break;
        case 'multi':
          symbol = '💥';
          break;
        case 'pierce':
          symbol = '⚡';
          break;
      }
      
      ctx.fillText(symbol, 0, 5);
      
      ctx.restore();
    });
  };
  
  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };
  
  // Update functions
  const updatePlayer = (deltaTime: number) => {
    let newX = player.x;
    let newY = player.y;
    
    // Handle input
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      newX -= player.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      newX += player.speed;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
      newY -= player.speed;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
      newY += player.speed;
    }
    
    // Keep player in bounds
    const canvas = canvasRef.current;
    if (canvas) {
      newX = Math.max(0, Math.min(canvas.width - player.width, newX));
      newY = Math.max(0, Math.min(canvas.height - player.height, newY));
    }
    
    setPlayer(prev => ({ ...prev, x: newX, y: newY }));
    
    // Handle shooting with cooldown
    if (keys[' '] && Date.now() - lastShot > 200) {
      shootBullet();
      setLastShot(Date.now());
    }
  };
  
  const updateBullets = (deltaTime: number) => {
    setBullets(prev => prev.filter(bullet => {
      bullet.y += bullet.speed * bullet.direction;
      return bullet.y > -10 && bullet.y < 610;
    }));
  };
  
  const updateEnemies = (deltaTime: number) => {
    setEnemies(prev => prev.map(enemy => {
      enemy.y += enemy.speed;
      
      // Enemy shooting
      if (Date.now() - enemy.lastShot > enemy.shootInterval) {
        enemy.lastShot = Date.now();
        shootEnemyBullet(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      }
      
      return enemy;
    }).filter(enemy => enemy.y < 610));
  };
  
  const updateBosses = (deltaTime: number) => {
    setBosses(prev => prev.map(boss => {
      // Boss movement patterns
      switch (boss.movementPattern) {
        case 'straight':
          boss.y += boss.speed;
          break;
        case 'zigzag':
          boss.y += boss.speed;
          boss.x += Math.sin(Date.now() * 0.001) * 2;
          break;
        case 'circle':
          boss.x += Math.cos(Date.now() * 0.001) * 2;
          boss.y += Math.sin(Date.now() * 0.001) * 2;
          break;
      }
      
      // Boss shooting
      if (Date.now() - boss.lastShot > boss.shootInterval) {
        boss.lastShot = Date.now();
        shootBossBullet(boss.x + boss.width / 2, boss.y + boss.height, boss.phase);
      }
      
      // Boss special attacks
      if (Date.now() - boss.specialAttackCooldown > 5000) {
        boss.specialAttackCooldown = Date.now();
        performBossSpecialAttack(boss);
      }
      
      // Boss phase transitions
      const healthPercent = boss.health / boss.maxHealth;
      if (healthPercent < 0.7 && boss.phase === 1) {
        boss.phase = 2;
        boss.speed *= 1.5;
        boss.shootInterval *= 0.7;
      } else if (healthPercent < 0.3 && boss.phase === 2) {
        boss.phase = 3;
        boss.speed *= 1.5;
        boss.shootInterval *= 0.5;
      }
      
      return boss;
    }).filter(boss => boss.health > 0));
  };
  
  const updatePowerUps = (deltaTime: number) => {
    setPowerUps(prev => {
      const updatedPowerUps = prev.map(powerUp => {
        powerUp.y += powerUp.speed;
        
        // Check collision with player
        if (powerUp.x < player.x + player.width &&
            powerUp.x + powerUp.width > player.x &&
            powerUp.y < player.y + player.height &&
            powerUp.y + powerUp.height > player.y) {
          
          // Handle different power-up types
          switch (powerUp.type) {
            case 'health':
              setGameState(prev => ({ ...prev, health: Math.min(100, prev.health + 25) }));
              if (toastContext) {
                toastContext.showPowerUp({
                  name: 'Health Boost',
                  description: '+25 Health restored!',
                  icon: '❤️'
                });
              }
              break;
            case 'speed':
              setPlayer(prev => ({ ...prev, speed: Math.min(10, prev.speed + 1) }));
              if (toastContext) {
                toastContext.showPowerUp({
                  name: 'Speed Boost',
                  description: 'Movement speed increased!',
                  icon: '🚀'
                });
              }
              break;
            case 'rapid':
              setPlayer(prev => ({ ...prev, rapidFire: true, rapidFireTime: 5000 }));
              if (toastContext) {
                toastContext.showPowerUp({
                  name: 'Rapid Fire',
                  description: 'Faster shooting activated!',
                  icon: '⚡'
                });
              }
              break;
            case 'shield':
              setPlayer(prev => ({ ...prev, invulnerable: true, invulnerabilityTime: 3000 }));
              if (toastContext) {
                toastContext.showPowerUp({
                  name: 'Energy Shield',
                  description: 'Temporary invincibility!',
                  icon: '🛡️'
                });
              }
              break;
            case 'wing':
              // Add wing fighter if less than 2
              if (wingFighters.length < 2) {
                const newWingFighter = {
                  id: `wing_${Date.now()}`,
                  x: player.x + (wingFighters.length === 0 ? -50 : 50),
                  y: player.y,
                  width: 30,
                  height: 20,
                  speed: player.speed,
                  targetX: player.x + (wingFighters.length === 0 ? -50 : 50),
                  targetY: player.y,
                  offset: wingFighters.length === 0 ? -50 : 50
                };
                setWingFighters(prev => [...prev, newWingFighter]);
                
                // Show wing fighter toast notification
                if (toastContext) {
                  toastContext.showPowerUp({
                    name: 'Wing Fighter',
                    description: 'New wing fighter added to your fleet!',
                    icon: '✈️'
                  });
                }
              }
              break;
          }
          
          // Mark for removal
          return { ...powerUp, shouldRemove: true };
        }
        
        return powerUp;
      });
      
      // Filter out collected power-ups and those that are off-screen
      return updatedPowerUps.filter(powerUp => !powerUp.shouldRemove && powerUp.y < 610);
    });
  };
  
  const updateWingFighters = (deltaTime: number) => {
    setWingFighters(prev => prev.map(wingFighter => {
      // Update wing fighter positions relative to player
      wingFighter.targetX = player.x + wingFighter.offset;
      wingFighter.targetY = player.y;
      
      // Smooth movement towards target position
      const dx = wingFighter.targetX - wingFighter.x;
      const dy = wingFighter.targetY - wingFighter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        wingFighter.x += (dx / distance) * wingFighter.speed;
        wingFighter.y += (dy / distance) * wingFighter.speed;
      }
      
      // Wing fighter shooting - shoot when player shoots
      if (keys[' '] && Date.now() - (wingFighter.lastShot || 0) > 300) {
        wingFighter.lastShot = Date.now();
        
        // Create wing fighter bullet
        const wingBullet: Bullet = {
          x: wingFighter.x + wingFighter.width / 2 - 2,
          y: wingFighter.y - 5,
          width: 3,
          height: 8,
          speed: 6,
          direction: -1,
          type: 'wing_fighter'
        };
        
        setBullets(prev => [...prev, wingBullet]);
      }
      
      // Keep wing fighters within screen bounds
      const canvas = canvasRef.current;
      if (canvas) {
        wingFighter.x = Math.max(0, Math.min(canvas.width - wingFighter.width, wingFighter.x));
        wingFighter.y = Math.max(0, Math.min(canvas.height - wingFighter.height, wingFighter.y));
      }
      
      return wingFighter;
    }));
  };

  const updateParticles = (deltaTime: number) => {
    setParticles(prev => prev.map(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= deltaTime;
      return particle;
    }).filter(particle => particle.life > 0));
  };
  
  // Spawn functions
  const spawnEnemy = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newEnemy: Enemy = {
      x: Math.random() * (canvas.width - 30),
      y: -30,
      width: 30,
      height: 30,
      speed: 2 + Math.random() * 2,
      health: 1,
      maxHealth: 1,
      type: 'basic',
      lastShot: 0,
      shootInterval: 2000 + Math.random() * 1000
    };
    
    setEnemies(prev => [...prev, newEnemy]);
  };
  
  const spawnBoss = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const bossTypes = ['space_dragon', 'void_reaper', 'mech_titan'];
    const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    
    const newBoss: Boss = {
      x: canvas.width / 2 - 40,
      y: 50,
      width: 80,
      height: 60,
      speed: 1,
      health: 500,
      maxHealth: 500,
      type: bossType,
      phase: 1,
      maxPhases: 3,
      lastShot: 0,
      shootInterval: 1000,
      specialAttackCooldown: 0,
      movementPattern: 'zigzag',
      isActive: true,
      shield: 100,
      maxShield: 100,
      weakPoints: [
        {x: -20, y: -20, width: 15, height: 15, destroyed: false},
        {x: 5, y: -20, width: 15, height: 15, destroyed: false},
        {x: -20, y: 5, width: 15, height: 15, destroyed: false},
        {x: 5, y: 5, width: 15, height: 15, destroyed: false}
      ]
    };
    
    setBosses(prev => [...prev, newBoss]);
  };
  
  const spawnPowerUp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const powerUpTypes = ['health', 'speed', 'rapid', 'shield', 'multi', 'pierce', 'wing'];
    const newPowerUp: PowerUp = {
      x: Math.random() * (canvas.width - 20),
      y: -20,
      width: 20,
      height: 20,
      speed: 1,
      type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
      effect: 'positive'
    };
    
    setPowerUps(prev => [...prev, newPowerUp]);
  };
  
  const shootBullet = () => {
    const newBullet: Bullet = {
      x: player.x + player.width / 2 - 2, // Center bullet on player ship
      y: player.y - 5, // Start bullet slightly above player
      width: 4,
      height: 10,
      speed: 8,
      direction: -1,
      type: 'player'
    };
    
    setBullets(prev => [...prev, newBullet]);
  };
  
  const shootEnemyBullet = (x: number, y: number) => {
    const newBullet: Bullet = {
      x: x - 2,
      y: y,
      width: 4,
      height: 10,
      speed: 4,
      direction: 1,
      type: 'enemy'
    };
    
    setBullets(prev => [...prev, newBullet]);
  };
  
  const shootBossBullet = (x: number, y: number, phase: number) => {
    const bulletCount = phase === 1 ? 1 : phase === 2 ? 3 : 5;
    
    for (let i = 0; i < bulletCount; i++) {
      // const angle = (i - (bulletCount - 1) / 2) * 0.5;
      const newBullet: Bullet = {
        x: x - 2,
        y: y,
        width: 6,
        height: 12,
        speed: 3 + phase,
        direction: 1,
        type: 'enemy'
      };
      
      setBullets(prev => [...prev, newBullet]);
    }
  };
  
  const performBossSpecialAttack = (boss: Boss) => {
    // Create a ring of bullets around the boss
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const bullet: Bullet = {
        x: boss.x + boss.width / 2 + Math.cos(angle) * 50,
        y: boss.y + boss.height / 2 + Math.sin(angle) * 50,
        width: 8,
        height: 8,
        speed: 2,
        direction: 1,
        type: 'enemy'
      };
      setBullets(prev => [...prev, bullet]);
    }
  };
  
  const updateAchievements = (deltaTime: number) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.unlocked) return achievement;
      
      let newProgress = achievement.progress;
      
      switch (achievement.id) {
        case 'first_blood':
          if (gameState.enemiesKilled > 0) newProgress = 1;
          break;
        case 'kill_streak_10':
          newProgress = Math.min(gameState.killStreak, achievement.maxProgress);
          break;
        case 'boss_slayer':
          if (gameState.bossesKilled > 0) newProgress = 1;
          break;
        case 'power_up_collector':
          newProgress = Math.min(gameState.powerUpsCollected, achievement.maxProgress);
          break;
        case 'survivor':
          newProgress = Math.min(Math.floor(gameState.survivalTime / 1000), achievement.maxProgress);
          break;
        case 'combo_master':
          newProgress = Math.min(gameState.maxCombo, achievement.maxProgress);
          break;
      }
      
      const shouldUnlock = newProgress >= achievement.maxProgress;
      
      if (shouldUnlock && !achievement.unlocked) {
        // Achievement unlocked!
        setGameState(prev => ({ 
          ...prev, 
          achievementsUnlocked: prev.achievementsUnlocked + 1
        }));
        
        // Show achievement toast notification
        if (toastContext) {
          toastContext.showAchievement({
            name: achievement.name,
            description: achievement.description,
            icon: achievement.id === 'first_blood' ? '🎯' : 
                  achievement.id === 'kill_streak_10' ? '🔥' :
                  achievement.id === 'boss_slayer' ? '👹' :
                  achievement.id === 'power_up_collector' ? '⚡' :
                  achievement.id === 'survivor' ? '💪' :
                  achievement.id === 'combo_master' ? '🔥' :
                  achievement.id === 'perfect_accuracy' ? '🎯' :
                  achievement.id === 'speed_demon' ? '💨' :
                  achievement.id === 'shield_master' ? '🛡️' :
                  achievement.id === 'weapon_master' ? '🔫' : '🏆'
          });
        }
      }
      
      return {
        ...achievement,
        progress: newProgress,
        unlocked: shouldUnlock
      };
    }));
  };
  
  const createExplosion = (x: number, y: number) => {
    for (let i = 0; i < 10; i++) {
      const particle: Particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1000,
        maxLife: 1000,
        color: '#ff4444',
        size: Math.random() * 3 + 1
      };
      setParticles(prev => [...prev, particle]);
    }
  };
  
  // Collision detection
  const checkCollisions = () => {
    // Player bullets and wing fighter bullets vs enemies
    setBullets(prev => prev.filter(bullet => {
      if (bullet.type === 'player' || bullet.type === 'wing_fighter') {
        const hitEnemy = enemies.find(enemy => 
          bullet.x < enemy.x + enemy.width &&
          bullet.x + bullet.width > enemy.x &&
          bullet.y < enemy.y + enemy.height &&
          bullet.y + bullet.height > enemy.y
        );
        
        if (hitEnemy) {
          createExplosion(hitEnemy.x + hitEnemy.width / 2, hitEnemy.y + hitEnemy.height / 2);
          setEnemies(prev => prev.filter(e => e !== hitEnemy));
          
          // Different score for wing fighter kills vs player kills
          const scoreBonus = bullet.type === 'wing_fighter' ? 50 : 100;
          
          setGameState(prev => ({ 
            ...prev, 
            score: prev.score + scoreBonus,
            enemiesKilled: prev.enemiesKilled + 1,
            killStreak: prev.killStreak + 1,
            maxKillStreak: Math.max(prev.maxKillStreak, prev.killStreak + 1)
          }));
          return false;
        }
        
        // Player bullets and wing fighter bullets vs bosses
        const hitBoss = bosses.find(boss => 
          bullet.x < boss.x + boss.width &&
          bullet.x + bullet.width > boss.x &&
          bullet.y < boss.y + boss.height &&
          bullet.y + bullet.height > boss.y
        );
        
        if (hitBoss) {
          // Boss takes damage - different damage for wing fighters
          const damage = bullet.type === 'wing_fighter' ? 5 : 10;
          const scoreBonus = bullet.type === 'wing_fighter' ? 25 : 50;
          
          setBosses(prev => prev.map(boss => {
            if (boss === hitBoss) {
              if (boss.shield > 0) {
                boss.shield = Math.max(0, boss.shield - damage);
              } else {
                boss.health = Math.max(0, boss.health - damage);
              }
            }
            return boss;
          }));
          
          setGameState(prev => ({ 
            ...prev, 
            score: prev.score + scoreBonus
          }));
          return false;
        }
      }
      return true;
    }));
    
    // Enemy bullets vs player
    setBullets(prev => prev.filter(bullet => {
      if (bullet.type === 'enemy') {
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {
          
          if (!player.invulnerable) {
            setGameState(prev => ({ 
              ...prev, 
              health: Math.max(0, prev.health - 10)
            }));
            setPlayer(prev => ({ 
              ...prev, 
              invulnerable: true,
              invulnerabilityTime: Date.now() + 1000
            }));
          }
          return false;
        }
      }
      return true;
    }));
    
    // Player vs power-ups
    setPowerUps(prev => prev.filter(powerUp => {
      if (powerUp.x < player.x + player.width &&
          powerUp.x + powerUp.width > player.x &&
          powerUp.y < player.y + player.height &&
          powerUp.y + powerUp.height > player.y) {
        
        // Apply power-up effect
        switch (powerUp.type) {
          case 'health':
            setGameState(prev => ({ 
              ...prev, 
              health: Math.min(100, prev.health + 20),
              powerUpsCollected: prev.powerUpsCollected + 1
            }));
            break;
          case 'speed':
            setPlayer(prev => ({ ...prev, speed: Math.min(8, prev.speed + 1) }));
            break;
          case 'rapid':
            // Reduce shooting cooldown temporarily
            setLastShot(prev => prev - 100);
            break;
          case 'shield':
            setPlayer(prev => ({ 
              ...prev, 
              invulnerable: true,
              invulnerabilityTime: Date.now() + 3000
            }));
            break;
          case 'multi':
            // Shoot multiple bullets
            for (let i = 0; i < 3; i++) {
              const multiBullet: Bullet = {
                x: player.x + player.width / 2 - 2 + (i - 1) * 10,
                y: player.y,
                width: 4,
                height: 10,
                speed: 8,
                direction: -1,
                type: 'player'
              };
              setBullets(prev => [...prev, multiBullet]);
            }
            break;
          case 'pierce':
            // Add piercing effect to bullets (handled in collision)
            break;
        }
        
        setGameState(prev => ({ 
          ...prev, 
          powerUpsCollected: prev.powerUpsCollected + 1
        }));
        
        return false;
      }
      return true;
    }));
    
    // Check boss defeats
    setBosses(prev => prev.filter(boss => {
      if (boss.health <= 0) {
        createExplosion(boss.x + boss.width / 2, boss.y + boss.height / 2);
        setGameState(prev => ({ 
          ...prev, 
          score: prev.score + 1000,
          bossesKilled: prev.bossesKilled + 1
        }));
        return false;
      }
      return true;
    }));
    
    // Check game over
    if (gameState.health <= 0) {
      setGameState(prev => ({ ...prev, gameOver: true }));
    }
  };
  
  // Event handlers
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Start game loop
  React.useEffect(() => {
    if (!gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.gameOver]);
  
  return (
    <div className="game-scene">
      <div className="game-header">
        <button 
          className="back-to-menu-btn"
          onClick={() => onSceneChange('menu')}
        >
          ← Back to Menu
        </button>
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value">{gameState.score.toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Health:</span>
            <span className="stat-value">{gameState.health}/100</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Level:</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Kills:</span>
            <span className="stat-value">{gameState.enemiesKilled}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Character:</span>
            <span className="stat-value">{selectedCharacter}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Power-ups:</span>
            <span className="stat-value">{gameState.powerUpsCollected}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Bosses:</span>
            <span className="stat-value">{gameState.bossesKilled}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Achievements:</span>
            <span className="stat-value">{achievements.filter(a => a.unlocked).length}/{achievements.length}</span>
          </div>
          {(gameState as any).multiplayerMode && (
            <div className="stat-item multiplayer-indicator">
              <span className="stat-label">
                {(gameState as any).multiplayerMode === 'local' && '👥 Local Multiplayer'}
                {(gameState as any).multiplayerMode === 'online' && '🌐 Online Multiplayer'}
                {(gameState as any).multiplayerMode === 'cooperative' && '🤝 Cooperative Mode'}
              </span>
              <span className="stat-value">
                {(gameState as any).maxPlayers && `${(gameState as any).maxPlayers} Players`}
                {(gameState as any).vsAI && ' vs AI'}
              </span>
            </div>
          )}
          {(gameState as any).challengeMode && (
            <div className="stat-item challenge-indicator">
              <span className="stat-label">
                {(gameState as any).challengeMode === 'daily' && '📅 Daily Challenge'}
                {(gameState as any).challengeMode === 'weekly' && '📆 Weekly Challenge'}
                {(gameState as any).challengeMode === 'survival' && '💪 Survival Challenge'}
                {(gameState as any).challengeMode === 'bossRush' && '🎪 Boss Rush Challenge'}
              </span>
              <span className="stat-value">
                {(gameState as any).challengeReward && `+${(gameState as any).challengeReward} XP`}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="game-canvas">
        <canvas 
          ref={canvasRef}
          className="game-canvas-element responsive-canvas"
          style={{
            width: '100%',
            height: 'auto',
            maxWidth: '100vw',
            maxHeight: '100vh',
            objectFit: 'contain'
          }}
        />
        {gameState.gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>Game Over!</h2>
              <p>Final Score: {gameState.score.toLocaleString()}</p>
              <p>Enemies Killed: {gameState.enemiesKilled}</p>
              
              {/* Rating against top 3 players */}
              <div className="rating-display">
                {(() => {
                  const playerStats = {
                    score: gameState.score,
                    level: Math.floor(gameState.score / 1000) + 1,
                    achievementsUnlocked: achievements.filter(a => a.unlocked).length,
                    survivalTime: gameState.survivalTime,
                    accuracy: gameState.enemiesKilled > 0 ? (gameState.enemiesKilled / (gameState.enemiesKilled + bullets.length)) * 100 : 0
                  };
                  const rating = ratingSystem.current.ratePlayer(playerStats);
                  
                  return (
                    <div className="rating-content">
                      <h3>🏆 Rating: {rating.rating}</h3>
                      <p>Rank: #{rating.rank}</p>
                      <p>Top {100 - rating.percentile}%</p>
                      <p className="rating-feedback">{rating.feedback}</p>
                      <div className="top-3-comparison">
                        <h4>vs Top 3 Players:</h4>
                        <p>#1: {rating.comparison.vsTop1.toFixed(1)}%</p>
                        <p>#2: {rating.comparison.vsTop2.toFixed(1)}%</p>
                        <p>#3: {rating.comparison.vsTop3.toFixed(1)}%</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <button 
                className="restart-btn"
                onClick={() => window.location.reload()}
              >
                🔄 Restart Game
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="game-controls">
        <div className="control-info">
          🎮 Arrow Keys or WASD to move • Space to shoot • Escape to pause
        </div>
        <div className="power-up-info">
          ⚡ Collect power-ups for health, speed, and special abilities!
        </div>
      </div>
      
      {/* Touch Controls for Mobile */}
      {showTouchControls && (
        <TouchControls
          onMovement={(x, y) => {
            // Handle touch movement
            if (inputSystem) {
              // Update player position based on touch input
              setPlayer(prev => ({
                ...prev,
                x: Math.max(0, Math.min(800 - prev.width, prev.x + x * 5)),
                y: Math.max(0, Math.min(600 - prev.height, prev.y + y * 5))
              }));
            }
          }}
          onShoot={() => {
            // Handle touch shoot
            if (Date.now() - lastShot > 200) {
              setLastShot(Date.now());
              setBullets(prev => [...prev, {
                x: player.x + player.width / 2,
                y: player.y,
                width: 4,
                height: 10,
                speed: 8,
                direction: -1,
                type: 'player' as const
              }]);
            }
          }}
          onWeaponSwitch={(weapon) => {
            // Handle weapon switching
            console.log('Switching to weapon:', weapon);
          }}
          onPause={() => {
            // Handle pause
            setGameState(prev => ({ ...prev, paused: !prev.paused }));
          }}
          isVisible={showTouchControls}
        />
      )}
    </div>
  );
};

export default App;
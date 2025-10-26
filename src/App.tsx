import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Import game systems
import { CompleteGameIntegration } from './systems/CompleteGameIntegration';
import { InputSystem } from './systems/InputSystem';
import { DeviceOptimization } from './systems/DeviceOptimization';
import TouchControls from './components/TouchControls';
import ToastManager, { ToastContext } from './components/ToastManager';

// iOS-compatible styles
const gameButtonStyles = `
  .game-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    justify-content: center;
  }
  
  .game-btn {
    padding: 10px 20px;
    border: 2px solid #3498db;
    border-radius: 8px;
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: #ecf0f1;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
  }
  
  .game-btn:hover {
    background: linear-gradient(135deg, #3498db, #2980b9);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
  }
  
  /* iOS-specific styles */
  @supports (-webkit-touch-callout: none) {
    .game-btn {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    canvas {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
  
  /* iOS viewport height fix */
  :root {
    --vh: 1vh;
  }
  
  .app {
    height: 100vh;
    height: calc(var(--vh, 1vh) * 100);
  }
  
  @media (max-width: 768px) {
    .game-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .game-btn {
      width: 200px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = gameButtonStyles;
  document.head.appendChild(styleSheet);
}

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
  const toastContext = React.useContext(ToastContext);
  
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
        voiceVolume: 80
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
        mouseSensitivity: 1.0,
        controllerEnabled: true
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
    { id: 'first_kill', name: 'First Blood', description: 'Kill your first enemy', unlocked: false, progress: 0, maxProgress: 1 },
    { id: 'survivor', name: 'Survivor', description: 'Survive for 60 seconds', unlocked: false, progress: 0, maxProgress: 60 },
    { id: 'combo_master', name: 'Combo Master', description: 'Achieve a 10x combo', unlocked: false, progress: 0, maxProgress: 10 }
  ]);

  // Initialize game integration
  useEffect(() => {
    const initializeGame = async () => {
      try {
        if (!gameIntegration.current) {
          gameIntegration.current = new CompleteGameIntegration();
          console.log('🎮 Game integration initialized');
          gameIntegration.current.start();
          console.log('✅ Game initialization complete');
        }
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
  
  // iOS-specific initialization
  useEffect(() => {
    const initializeIOS = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        console.log('🍎 iOS initialization starting...');
        
        // Force hardware acceleration
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvas.style.transform = 'translateZ(0)';
          canvas.style.webkitTransform = 'translateZ(0)';
        }
        
        // Prevent iOS Safari from hiding the address bar
        window.addEventListener('orientationchange', () => {
          setTimeout(() => {
            window.scrollTo(0, 1);
          }, 100);
        });
        
        // Handle iOS viewport changes
        const handleViewportChange = () => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        handleViewportChange();
        
        // iOS touch event optimization
        document.addEventListener('touchstart', (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        }, { passive: false });
        
        console.log('🍎 iOS initialization complete');
      }
    };
    
    initializeIOS();
  }, []);

  // Initialize input and device systems
  useEffect(() => {
    if (!deviceOptimization.current) {
      deviceOptimization.current = new DeviceOptimization();
      const device = deviceOptimization.current.getDeviceInfo();
      setDeviceInfo(device);
      setShowTouchControls(device.hasTouch && (device.type === 'mobile' || device.type === 'tablet'));
      console.log('📱 Device detected:', device);
      
      // iOS-specific optimizations
      if (device.platform === 'ios') {
        console.log('🍎 iOS device detected - applying optimizations');
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        const preventZoom = (e: TouchEvent) => {
          const now = new Date().getTime();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        };
        
        // Prevent pull-to-refresh
        const preventPullToRefresh = (e: TouchEvent) => {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        };
        
        // Prevent context menu
        const preventContextMenu = (e: Event) => {
          e.preventDefault();
        };
        
        // Add event listeners
        document.addEventListener('touchend', preventZoom, { passive: false });
        document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
        document.addEventListener('contextmenu', preventContextMenu);
        
        // iOS Safari specific optimizations
        if (device.browser === 'safari') {
          // Prevent bounce scrolling
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.height = '100%';
          
          // Hide address bar
          window.addEventListener('load', () => {
            setTimeout(() => {
              window.scrollTo(0, 1);
            }, 0);
          });
        }
        
        // Add iOS-specific meta tags if not present
        const addIOSMetaTags = () => {
          const existingViewport = document.querySelector('meta[name="viewport"]');
          if (!existingViewport) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover, maximum-scale=1.0, minimum-scale=1.0, shrink-to-fit=no';
            document.head.appendChild(viewport);
          }
          
          // Add iOS status bar styling
          const existingStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
          if (!existingStatusBar) {
            const statusBar = document.createElement('meta');
            statusBar.name = 'apple-mobile-web-app-status-bar-style';
            statusBar.content = 'black-translucent';
            document.head.appendChild(statusBar);
          }
          
          // Add iOS web app capabilities
          const existingWebApp = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
          if (!existingWebApp) {
            const webApp = document.createElement('meta');
            webApp.name = 'apple-mobile-web-app-capable';
            webApp.content = 'yes';
            document.head.appendChild(webApp);
          }
        };
        
        addIOSMetaTags();
      }
    }
    
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
          selectedCharacter={gameState.selectedCharacter}
          onShowModal={showFeatureModal}
        />;
    }
  };

  return (
    <ToastManager>
      <div className="app">
        {renderScene()}
        
        {/* Feature Modals */}
        {showModal === 'settings' && (
          <SettingsModal 
            onClose={closeModal}
            settings={gameState.settings}
            onUpdateSettings={updateSettings}
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
  selectedCharacter: 'kaden' | 'adelynn';
  onShowModal: (feature: string) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSceneChange, onCharacterSelect, selectedCharacter, onShowModal }) => {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  return (
    <div className="main-menu">
      {/* Modern Background */}
      <div className="background">
        <div className="stars"></div>
        <div className="grid"></div>
      </div>
      
      <div className="title-section">
        <div className="title-bg"></div>
        <h1 className="main-title">🚀 Kaden & Adelynn Space Adventures</h1>
        <h2 className="subtitle">Epic 2D Space Shooter</h2>
        <p className="tagline">Fight aliens, collect power-ups, defeat bosses, and save the galaxy!</p>
      </div>
      
      <div className="main-buttons">
        <button 
          className="select-pilot-btn"
          onClick={() => setShowCharacterModal(true)}
        >
          👦🏿👧 Select Your Pilot
        </button>
        
        <button 
          className="start-mission-btn"
          onClick={() => onSceneChange('game')}
        >
          🚀 Start Mission
        </button>
        
        <button 
          className="settings-btn"
          onClick={() => onShowModal('settings')}
        >
          ⚙️ Settings
        </button>
      </div>
      
      <div className="feature-buttons">
        <div className="feature-row">
          <button className="feature-btn achievements" onClick={() => onShowModal('achievements')}>
            🏆 Achievements
          </button>
          <button className="feature-btn boss" onClick={() => onShowModal('boss')}>
            👹 Boss Battles
          </button>
          <button className="feature-btn powerups" onClick={() => onShowModal('powerups')}>
            ⚡ Power-ups
          </button>
        </div>
        
        <div className="feature-row">
          <button className="feature-btn multiplayer" onClick={() => onShowModal('multiplayer')}>
            👥 Multiplayer
          </button>
          <button className="feature-btn story" onClick={() => onShowModal('story')}>
            📖 Story Mode
          </button>
          <button className="feature-btn challenges" onClick={() => onShowModal('challenges')}>
            🎯 Challenges
          </button>
        </div>
      </div>
      
      <div className="game-info">
        <div className="info-panel">
          <p>🎮 Use arrow keys or WASD to move, Space to shoot</p>
          <p>📱 Touch controls available on mobile devices</p>
          <p>🎯 Collect power-ups and defeat bosses to progress</p>
        </div>
        <div className="branding">
          <p>© 2024 Bradley Virtual Solutions - Epic Space Adventures</p>
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

// Character Modal Component
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
          <h2>👦🏿👧 Select Your Pilot</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="character-cards">
          <div 
            className={`character-card ${selectedCharacter === 'kaden' ? 'selected' : ''}`}
            onClick={() => onSelect('kaden')}
          >
            <div className="character-sprite">👦🏿</div>
            <h3>Kaden</h3>
            <p>Brave space pilot with lightning reflexes and tactical expertise. Perfect for aggressive players who love fast-paced action.</p>
          </div>
          
          <div 
            className={`character-card ${selectedCharacter === 'adelynn' ? 'selected' : ''}`}
            onClick={() => onSelect('adelynn')}
          >
            <div className="character-sprite">👧</div>
            <h3>Adelynn</h3>
            <p>Skilled navigator with strategic thinking and precision shooting. Ideal for players who prefer calculated approaches.</p>
          </div>
        </div>
        
        <button className="confirm-btn" onClick={onClose}>
          ✅ Confirm Selection
        </button>
      </div>
    </div>
  );
};

// Settings Modal Component
interface SettingsModalProps {
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, settings, onUpdateSettings }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Game Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
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
          </div>
          
          <div className="settings-actions">
            <button className="reset-btn" onClick={() => console.log('Reset settings')}>
              🔄 Reset
            </button>
            <button className="save-btn" onClick={onClose}>
              💾 Save
            </button>
          </div>
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

const GameScene: React.FC<GameSceneProps> = ({ onSceneChange, selectedCharacter, gameStats, achievements, setAchievements, inputSystem, deviceInfo, showTouchControls }) => {
  const toastContext = React.useContext(ToastContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  
  // Game state
  const [gameState, setGameState] = useState({
    paused: false,
    gameOver: false,
    score: 0,
    level: 1,
    lives: 3
  });
  
  const [player, setPlayer] = useState({
    x: 400,
    y: 500,
    width: 40,
    height: 40,
    speed: 5
  });
  
  const [bullets, setBullets] = useState<Array<{x: number, y: number, width: number, height: number, speed: number, direction: number, type: 'player' | 'enemy'}>>([]);
  const [enemies, setEnemies] = useState<Array<{x: number, y: number, width: number, height: number, speed: number, health: number}>>([]);
  const [lastShot, setLastShot] = useState(0);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.paused || gameState.gameOver) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setPlayer(prev => ({ ...prev, y: Math.max(0, prev.y - prev.speed) }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setPlayer(prev => ({ ...prev, y: Math.min(canvas.height - prev.height, prev.y + prev.speed) }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setPlayer(prev => ({ ...prev, x: Math.max(0, prev.x - prev.speed) }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setPlayer(prev => ({ ...prev, x: Math.min(canvas.width - prev.width, prev.x + prev.speed) }));
          break;
        case ' ':
          e.preventDefault();
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
          break;
        case 'Escape':
          e.preventDefault();
          setGameState(prev => ({ ...prev, paused: !prev.paused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.paused, gameState.gameOver, player, lastShot]);

  // Game loop for rendering
  useEffect(() => {
    const gameLoop = () => {
      if (gameState.paused || gameState.gameOver) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = '#000011';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw starfield
      drawStarfield(ctx, canvas.width, canvas.height);
      
      // Draw player ship
      drawPlayerShip(ctx, player, selectedCharacter);
      
      // Draw bullets
      bullets.forEach(bullet => {
        ctx.fillStyle = bullet.type === 'player' ? '#00ff00' : '#ff0000';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
      });
      
      // Draw enemies
      enemies.forEach(enemy => {
        ctx.fillStyle = '#ff6666';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Health bar
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / 100) * enemy.width, 4);
      });
      
      // Update bullets
      setBullets(prev => prev.map(bullet => ({
        ...bullet,
        y: bullet.y + (bullet.speed * bullet.direction)
      })).filter(bullet => bullet.y > 0 && bullet.y < canvas.height));
      
      // Update enemies
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        y: enemy.y + enemy.speed
      })).filter(enemy => enemy.y < canvas.height));
      
      // Spawn enemies occasionally
      if (Math.random() < 0.01) {
        setEnemies(prev => [...prev, {
          x: Math.random() * (canvas.width - 40),
          y: -40,
          width: 40,
          height: 40,
          speed: 2,
          health: 100
        }]);
      }
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.paused, gameState.gameOver, player, bullets, enemies, selectedCharacter]);

  // Draw starfield
  const drawStarfield = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % width;
      const y = (i * 23) % height;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }
  };

  // Draw player ship
  const drawPlayerShip = (ctx: CanvasRenderingContext2D, player: any, character: string) => {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    
    // Ship body based on character
    if (character === 'kaden') {
      // Kaden's ship - more angular
      ctx.fillStyle = '#4A90E2';
      ctx.beginPath();
      ctx.moveTo(0, -player.height / 2);
      ctx.lineTo(-player.width / 2, player.height / 2);
      ctx.lineTo(0, player.height / 4);
      ctx.lineTo(player.width / 2, player.height / 2);
      ctx.closePath();
      ctx.fill();
      
      // Ship details
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-player.width / 4, -player.height / 4, player.width / 2, player.height / 2);
    } else {
      // Adelynn's ship - more rounded
      ctx.fillStyle = '#E24A90';
      ctx.beginPath();
      ctx.ellipse(0, 0, player.width / 2, player.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Ship details
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, player.width / 3, player.height / 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Health bar
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(-player.width / 2, -player.height / 2 - 15, player.width, 4);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-player.width / 2, -player.height / 2 - 15, player.width, 4);
    
    ctx.restore();
  };
  
  return (
    <div className="game-scene">
      <div className="game-header">
        <button className="back-to-menu-btn" onClick={() => onSceneChange('menu')}>
          ← Back to Menu
        </button>
        
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score</span>
            <span className="stat-value">{gameState.score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Level</span>
            <span className="stat-value">{gameState.level}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Lives</span>
            <span className="stat-value">{gameState.lives}</span>
          </div>
        </div>
      </div>
      
      <div className="game-canvas">
        <canvas 
          ref={canvasRef}
          id="game-canvas" 
          width={800} 
          height={600}
          className="responsive-canvas"
        ></canvas>
        
        {gameState.gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-content">
              <h2>💥 Game Over!</h2>
              <p>Final Score: {gameState.score}</p>
              <p>Level Reached: {gameState.level}</p>
              <button className="restart-btn" onClick={() => window.location.reload()}>
                🔄 Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="game-controls">
        <div className="control-info">
          🎮 Use arrow keys or WASD to move, Space to shoot
        </div>
        {showTouchControls && (
          <div className="power-up-info">
            📱 Touch controls enabled for mobile
          </div>
        )}
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
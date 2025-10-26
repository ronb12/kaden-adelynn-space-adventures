import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { Player, Enemy, Bullet, Collectible, Boss, GameState, GameScene } from './types/GameTypes';
import { TriangleShipRenderer } from './graphics/TriangleShipRenderer';
import { CollectiblesSystem, CollectibleRenderer } from './systems/CollectiblesSystem';
import { EnhancedShootingSystem, BulletRenderer } from './systems/EnhancedShootingSystem';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  
  // Game state
  const [gameScene, setGameScene] = useState<GameScene>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<'kaden' | 'adelynn'>('kaden');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    health: 100,
    level: 1,
    gameTime: 0,
    isPlaying: false,
    isPaused: false,
    gameOver: false
  });

  // Game objects
  const playerRef = useRef<Player>({
    id: 'player',
    x: 0,
    y: 0,
    width: 50,
    height: 60,
    speed: 5,
    health: 100,
    maxHealth: 100,
    lives: 3,
    score: 0,
    invulnerable: false,
    invulnerabilityTime: 0,
    character: 'kaden'
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const bossesRef = useRef<Boss[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Systems
  const collectiblesSystemRef = useRef<CollectiblesSystem | null>(null);
  const shootingSystemRef = useRef<EnhancedShootingSystem | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Initialize systems
      collectiblesSystemRef.current = new CollectiblesSystem(canvas.width, canvas.height);
      shootingSystemRef.current = new EnhancedShootingSystem();
      
      // Initialize player position
      playerRef.current.x = canvas.width / 2 - 25;
      playerRef.current.y = canvas.height - 80;
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      
      if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
      
      if (e.code === 'Escape') {
        e.preventDefault();
        if (gameScene === 'playing') {
          setGameScene('paused');
        } else if (gameScene === 'paused') {
          setGameScene('playing');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameScene]);

  // Game loop
  const gameLoop = useCallback(() => {
    if (gameScene !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw enhanced starfield background
    const time = Date.now() * 0.001;
    ctx.fillStyle = '#ffffff';
    
    // Create multiple layers of stars
    for (let layer = 0; layer < 3; layer++) {
      const starCount = layer === 0 ? 200 : layer === 1 ? 100 : 50;
      const starSize = layer === 0 ? 1 : layer === 1 ? 2 : 3;
      const starSpeed = (layer + 1) * 0.1;
      const starOpacity = layer === 0 ? 0.8 : layer === 1 ? 0.6 : 0.4;
      
      ctx.globalAlpha = starOpacity;
      ctx.fillStyle = layer === 0 ? '#ffffff' : layer === 1 ? '#cccccc' : '#aaaaaa';
      
      for (let i = 0; i < starCount; i++) {
        const x = (i * 37) % canvas.width;
        const y = (i * 23 + time * starSpeed * 100) % canvas.height;
        
        // Add twinkling effect
        const twinkle = Math.sin(time * 2 + i) * 0.5 + 0.5;
        ctx.globalAlpha = starOpacity * twinkle;
        
        ctx.fillRect(x, y, starSize, starSize);
      }
    }
    
    ctx.globalAlpha = 1;

    // Update game time
    setGameState(prev => ({
      ...prev,
      gameTime: prev.gameTime + 16
    }));

    // Update systems
    if (collectiblesSystemRef.current) {
      collectiblesSystemRef.current.update(16);
    }
    if (shootingSystemRef.current) {
      shootingSystemRef.current.update(16, playerRef.current, enemiesRef.current, bossesRef.current);
    }

    // Update player
    updatePlayer();
    
    // Update enemies
    updateEnemies();
    
    // Update bosses
    updateBosses();
    
    // Check collisions
    checkCollisions();
    
    // Draw everything
    drawPlayer(ctx);
    drawEnemies(ctx);
    drawBosses(ctx);
    drawBullets(ctx);
    drawCollectibles(ctx);
    drawUI(ctx);

    // Continue game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameScene]);

  // Start game loop when playing
  useEffect(() => {
    if (gameScene === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameScene, gameLoop]);

  // Update functions
  const updatePlayer = useCallback(() => {
    const player = playerRef.current;
    const keys = keysRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle player movement
    if (keys['ArrowLeft'] || keys['KeyA']) {
      player.x = Math.max(0, player.x - player.speed);
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    }
    if (keys['ArrowUp'] || keys['KeyW']) {
      player.y = Math.max(0, player.y - player.speed);
    }
    if (keys['ArrowDown'] || keys['KeyS']) {
      player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    }

    // Update invulnerability
    if (player.invulnerable) {
      player.invulnerabilityTime--;
      if (player.invulnerabilityTime <= 0) {
        player.invulnerable = false;
      }
    }
  }, []);

  const updateEnemies = useCallback(() => {
    const enemies = enemiesRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Spawn enemies
    if (Math.random() < 0.01) {
      const enemyTypes: Enemy['type'][] = ['basic', 'fast', 'heavy', 'zigzag'];
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      
      const enemy: Enemy = {
        id: `enemy_${Date.now()}_${Math.random()}`,
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 40,
        height: 50,
        speed: 2 + Math.random() * 2,
        health: type === 'heavy' ? 3 : type === 'zigzag' ? 2 : 1,
        maxHealth: type === 'heavy' ? 3 : type === 'zigzag' ? 2 : 1,
        type,
        direction: 1,
        shootTimer: 0
      };
      
      enemies.push(enemy);
    }

    // Update enemies
    enemies.forEach(enemy => {
      enemy.y += enemy.speed;
      
      // Enemy shooting
      if (shootingSystemRef.current && shootingSystemRef.current.canEnemyShoot(enemy.id)) {
        shootingSystemRef.current.enemyShoot(enemy);
      }
    });

    // Remove enemies that are off-screen
    enemiesRef.current = enemies.filter(enemy => enemy.y < canvas.height + 50);
  }, []);

  const updateBosses = useCallback(() => {
    const bosses = bossesRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Spawn boss every 30 seconds
    if (gameState.score > 0 && gameState.score % 3000 === 0 && bosses.length === 0) {
      const bossTypes: Boss['type'][] = ['destroyer', 'battleship'];
      const type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
      
      const boss: Boss = {
        id: `boss_${Date.now()}_${Math.random()}`,
        x: canvas.width / 2 - 75,
        y: 50,
        width: 150,
        height: 100,
        health: 20,
        maxHealth: 20,
        speed: 1,
        type,
        shootTimer: 0,
        phase: 1
      };
      
      bosses.push(boss);
    }

    // Update bosses
    bosses.forEach(boss => {
      // Boss movement pattern
      boss.x += Math.sin(Date.now() * 0.001) * 2;
      
      // Boss shooting
      if (shootingSystemRef.current && shootingSystemRef.current.canBossShoot(boss.id)) {
        shootingSystemRef.current.bossShoot(boss);
      }
    });
  }, [gameState.score]);

  const checkCollisions = useCallback(() => {
    const player = playerRef.current;
    const bullets = bulletsRef.current;
    const enemies = enemiesRef.current;
    const bosses = bossesRef.current;

    // Player vs Enemies
    enemies.forEach((enemy, enemyIndex) => {
      if (player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y) {
        
        // Player takes damage
        takeDamage(20);
        enemies.splice(enemyIndex, 1);
      }
    });

    // Player vs Bosses
    bosses.forEach((boss, bossIndex) => {
      if (player.x < boss.x + boss.width &&
          player.x + player.width > boss.x &&
          player.y < boss.y + boss.height &&
          player.y + player.height > boss.y) {
        
        // Player takes damage
        takeDamage(30);
      }
    });

    // Bullets vs Enemies
    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.type === 'player') {
        enemies.forEach((enemy, enemyIndex) => {
          if (bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            
            // Enemy takes damage
            enemy.health -= bullet.damage;
            bullets.splice(bulletIndex, 1);
            
            if (enemy.health <= 0) {
              // Enemy destroyed
              enemies.splice(enemyIndex, 1);
              setGameState(prev => ({
                ...prev,
                score: prev.score + 100
              }));
            }
          }
        });

        // Bullets vs Bosses
        bosses.forEach((boss, bossIndex) => {
          if (bullet.x < boss.x + boss.width &&
              bullet.x + bullet.width > boss.x &&
              bullet.y < boss.y + boss.height &&
              bullet.y + bullet.height > boss.y) {
            
            // Boss takes damage
            boss.health -= bullet.damage;
            bullets.splice(bulletIndex, 1);
            
            if (boss.health <= 0) {
              // Boss destroyed
              bosses.splice(bossIndex, 1);
              setGameState(prev => ({
                ...prev,
                score: prev.score + 1000
              }));
            }
          }
        });
      } else if (bullet.type === 'enemy') {
        // Enemy bullets vs Player
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {
          
          // Player takes damage
          takeDamage(bullet.damage);
          bullets.splice(bulletIndex, 1);
        }
      }
    });

    // Player vs Collectibles
    if (collectiblesSystemRef.current) {
      const collectedItem = collectiblesSystemRef.current.checkCollision(
        player.x, player.y, player.width, player.height
      );
      
      if (collectedItem) {
        // Apply collectible effect
        switch (collectedItem.type) {
          case 'health':
            player.health = Math.min(player.maxHealth, player.health + collectedItem.value);
            break;
          case 'score':
            setGameState(prev => ({
              ...prev,
              score: prev.score + collectedItem.value
            }));
            break;
          case 'shield':
            player.invulnerable = true;
            player.invulnerabilityTime = collectedItem.duration || 10000;
            break;
          case 'speed':
            player.speed = Math.min(10, player.speed + collectedItem.value);
            break;
        }
        
        console.log(`🎁 Collected ${collectedItem.type}: +${collectedItem.value}`);
      }
    }
  }, []);

  const takeDamage = useCallback((damage: number) => {
    const player = playerRef.current;
    
    if (player.invulnerable) return;

    player.health -= damage;
    player.invulnerable = true;
    player.invulnerabilityTime = 2000; // 2 seconds

    if (player.health <= 0) {
      player.lives--;
      player.health = player.maxHealth;
      
      if (player.lives <= 0) {
        setGameScene('gameOver');
      }
    }
  }, []);

  const shoot = useCallback(() => {
    if (gameScene !== 'playing') return;

    const player = playerRef.current;
    
    // Use enhanced shooting system
    if (shootingSystemRef.current) {
      const bullets = shootingSystemRef.current.playerShoot(
        player.x + player.width / 2, 
        player.y
      );
      
      // Add bullets to the game
      bulletsRef.current.push(...bullets);
    }
  }, [gameScene]);

  // Draw functions
  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current;
    
    if (player.invulnerable) {
      ctx.globalAlpha = 0.5;
    }

    // Draw triangle player ship
    TriangleShipRenderer.drawPlayerShip(ctx, player, selectedCharacter);

    ctx.globalAlpha = 1;
  }, [selectedCharacter]);

  const drawEnemies = useCallback((ctx: CanvasRenderingContext2D) => {
    const enemies = enemiesRef.current;
    
    enemies.forEach(enemy => {
      TriangleShipRenderer.drawEnemyShip(ctx, enemy);
    });
  }, []);

  const drawBosses = useCallback((ctx: CanvasRenderingContext2D) => {
    const bosses = bossesRef.current;
    
    bosses.forEach(boss => {
      TriangleShipRenderer.drawBossShip(ctx, boss);
    });
  }, []);

  const drawBullets = useCallback((ctx: CanvasRenderingContext2D) => {
    const bullets = bulletsRef.current;
    
    bullets.forEach(bullet => {
      BulletRenderer.drawBullet(ctx, bullet);
    });
  }, []);

  const drawCollectibles = useCallback((ctx: CanvasRenderingContext2D) => {
    if (collectiblesSystemRef.current) {
      const collectibles = collectiblesSystemRef.current.getCollectibles();
      collectibles.forEach(collectible => {
        CollectibleRenderer.drawCollectible(ctx, collectible);
      });
    }
  }, []);

  const drawUI = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Draw UI background panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, 150);
    
    // Draw gradient overlay
    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, 'rgba(0, 170, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, 150);

    // Score with glow effect
    ctx.shadowColor = '#00aaff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Orbitron';
    ctx.fillText(`SCORE: ${gameState.score.toLocaleString()}`, 30, 40);
    
    // Lives with glow effect
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 8;
    ctx.fillText(`LIVES: ${playerRef.current.lives}`, 30, 70);
    
    // Health bar
    const healthBarWidth = 200;
    const healthBarHeight = 20;
    const healthBarX = 30;
    const healthBarY = 90;
    
    // Health bar background
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // Health bar fill
    const healthPercentage = playerRef.current.health / playerRef.current.maxHealth;
    const healthColor = healthPercentage > 0.6 ? '#00ff00' : healthPercentage > 0.3 ? '#ffff00' : '#ff0000';
    
    ctx.fillStyle = healthColor;
    ctx.shadowColor = healthColor;
    ctx.shadowBlur = 5;
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercentage, healthBarHeight);
    
    // Health text
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Orbitron';
    ctx.fillText(`HEALTH: ${playerRef.current.health}/${playerRef.current.maxHealth}`, healthBarX, healthBarY - 5);
    
    // Level
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Orbitron';
    ctx.fillText(`LEVEL: ${gameState.level}`, canvas.width - 200, 40);
    
    // Game time
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 8;
    ctx.fillText(`TIME: ${Math.floor(gameState.gameTime / 1000)}s`, canvas.width - 200, 70);
    
    // Instructions
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px Orbitron';
    ctx.fillText('ARROW KEYS: MOVE | SPACE: SHOOT | ESC: PAUSE', canvas.width / 2 - 200, canvas.height - 20);
    
    ctx.shadowBlur = 0;
  }, [gameState]);

  const startGame = () => {
    setGameScene('playing');
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      gameOver: false
    }));
  };

  const selectCharacter = (character: 'kaden' | 'adelynn') => {
    setSelectedCharacter(character);
    playerRef.current.character = character;
  };

  return (
    <div className="game-container">
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="game-canvas"
      />
      
      {gameScene === 'menu' && (
        <div className="main-menu">
          <h1 className="game-title">🚀 Kaden & Adelynn Space Adventures</h1>
          <div className="menu-buttons">
            <button className="start-game-btn" onClick={startGame}>
              🚀 Start Mission
            </button>
            <button className="character-select-btn" onClick={() => setGameScene('character')}>
              👦👧 Select Pilot
            </button>
            <button className="settings-btn" onClick={() => setGameScene('settings')}>
              ⚙️ Settings
            </button>
          </div>
        </div>
      )}

      {gameScene === 'character' && (
        <div className="character-selection">
          <h2>Select Your Pilot</h2>
          <div className="character-options">
            <button 
              className={`character-option ${selectedCharacter === 'kaden' ? 'selected' : ''}`}
              onClick={() => selectCharacter('kaden')}
            >
              <div className="character-preview kaden">🔺</div>
              <span>Kaden</span>
            </button>
            <button 
              className={`character-option ${selectedCharacter === 'adelynn' ? 'selected' : ''}`}
              onClick={() => selectCharacter('adelynn')}
            >
              <div className="character-preview adelynn">🔺</div>
              <span>Adelynn</span>
            </button>
          </div>
          <button className="back-btn" onClick={() => setGameScene('menu')}>
            ← Back to Menu
          </button>
        </div>
      )}

      {gameScene === 'paused' && (
        <div className="pause-menu">
          <h2>⏸️ Game Paused</h2>
          <button className="resume-btn" onClick={() => setGameScene('playing')}>
            ▶️ Resume
          </button>
          <button className="menu-btn" onClick={() => setGameScene('menu')}>
            🏠 Main Menu
          </button>
        </div>
      )}

      {gameScene === 'gameOver' && (
        <div className="game-over-menu">
          <h2>💥 Game Over</h2>
          <p>Final Score: {gameState.score}</p>
          <button className="restart-btn" onClick={startGame}>
            🔄 Play Again
          </button>
          <button className="menu-btn" onClick={() => setGameScene('menu')}>
            🏠 Main Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
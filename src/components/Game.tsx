import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Game.css';

// Import all the new systems
import { PowerUpSystem } from '../systems/PowerUpSystem';
import { WingFighterSystem } from '../systems/WingFighterSystem';
import { ShieldSystem } from '../systems/ShieldSystem';
import { ComboSystem } from '../systems/ComboSystem';
import { KillStreakSystem } from '../systems/KillStreakSystem';
import { EnhancedBossSystem } from '../systems/EnhancedBossSystem';
import { EnhancedEnemySystem } from '../systems/EnhancedEnemySystem';
import { EnhancedAchievementSystem } from '../systems/EnhancedAchievementSystem';
import { AudioSystem } from '../systems/AudioSystem';
import { DifficultySystem } from '../systems/DifficultySystem';
import { MobileSystem } from '../systems/MobileSystem';

// Import new features
import { Storyline } from '../story/Storyline';
import { ShipDesigns, ShipRenderer } from '../graphics/ShipDesigns';
import { KadenSprite, KadenSpriteRenderer } from '../graphics/KadenSprite';
import { AdelynnSprite, AdelynnSpriteRenderer } from '../graphics/AdelynnSprite';
import { GameEnhancementSystem } from '../systems/GameEnhancementSystem';
import SettingsPanel from './SettingsPanel';
import CharacterSelection from './CharacterSelection';
import PWAInstallPrompt from './PWAInstallPrompt';

// Import types
import { Player, Enemy, Bullet, PowerUp, Boss, Achievement, GameStats, GameState } from '../types/GameTypes';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Game state
  const [gameState, setGameState] = useState<GameState['state']>('menu');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('kaden');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showCharacterSelection, setShowCharacterSelection] = useState<boolean>(false);
  const [currentStoryEvent, setCurrentStoryEvent] = useState<string>('');
  const [gameSettings, setGameSettings] = useState<any>({
    masterVolume: 0.7,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    particleEffects: true,
    screenShake: true,
    visualEffects: true,
    highQuality: true,
    difficulty: 'medium',
    autoShoot: false,
    showFPS: false,
    showHitboxes: false,
    keyboardControls: true,
    touchControls: true,
    gamepadSupport: true,
    selectedCharacter: 'kaden',
    fullscreen: false,
    vsync: true,
    frameRate: 60
  });
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    highScore: parseInt(localStorage.getItem('highScore') || '0'),
    lives: 3,
    health: 50,
    maxHealth: 50,
    combo: 0,
    killStreak: 0,
    maxCombo: 0,
    maxKillStreak: 0,
    playerLevel: 1,
    playerXP: 0,
    bossesDefeated: 0,
    enemiesDestroyed: 0,
    powerUpsCollected: 0,
    gameTime: 0,
    difficulty: 'medium',
    wingFighters: 0,
    shieldsUsed: 0,
    weaponsUsed: 0,
    livesLost: 0,
    shieldTime: 0,
    rapidFireTime: 0,
    doubleShotTime: 0,
    rapidFireUses: 0,
    doubleShotUses: 0,
    shieldUses: 0,
    speedBoostUses: 0,
    healthBoostUses: 0,
    scoreMultiplierUses: 0
  });

  // Player state
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    speed: 4,
    maxSpeed: 6,
    health: 100,
    maxHealth: 100,
    invulnerable: false,
    invulnerabilityTime: 0,
    level: 1,
    xp: 0,
    maxXP: 100,
    hasShield: false,
    shieldTime: 0,
    rapidFire: false,
    rapidFireTime: 0,
    doubleShot: false,
    wingFighters: []
  });

  // Game objects
  const bulletsRef = useRef<Bullet[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const bossesRef = useRef<Boss[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);

  // Systems
  const powerUpSystemRef = useRef<PowerUpSystem>(new PowerUpSystem());
  const wingFighterSystemRef = useRef<WingFighterSystem>(new WingFighterSystem());
  const shieldSystemRef = useRef<ShieldSystem>(new ShieldSystem());
  const comboSystemRef = useRef<ComboSystem>(new ComboSystem());
  const killStreakSystemRef = useRef<KillStreakSystem>(new KillStreakSystem());
  const bossSystemRef = useRef<EnhancedBossSystem>(new EnhancedBossSystem());
  const enemySystemRef = useRef<EnhancedEnemySystem>(new EnhancedEnemySystem());
  const achievementSystemRef = useRef<EnhancedAchievementSystem>(new EnhancedAchievementSystem());
  const audioSystemRef = useRef<AudioSystem>(new AudioSystem());
  const difficultySystemRef = useRef<DifficultySystem>(new DifficultySystem());
  const mobileSystemRef = useRef<MobileSystem>(new MobileSystem());

  // Input state
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const touchRef = useRef<{ startX: number; startY: number; currentX: number; currentY: number }>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const { width, height } = mobileSystemRef.current.getOptimalCanvasSize();
    canvas.width = width;
    canvas.height = height;

    // Optimize for mobile
    mobileSystemRef.current.optimizeForIOS();
    mobileSystemRef.current.optimizeForAndroid();
    mobileSystemRef.current.optimizeCanvasForDPI(canvas);

    // Initialize player position
    playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
    playerRef.current.y = canvas.height - 100;

    // Set up event listeners
    setupEventListeners();

    return () => {
      cleanupEventListeners();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setupEventListeners = () => {
    // Keyboard events
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Touch events
    if (mobileSystemRef.current.hasTouchSupport()) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
    }
  };

  const cleanupEventListeners = () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    keysRef.current[event.key] = true;
    
    if (event.key === ' ') {
      event.preventDefault();
      shoot();
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    keysRef.current[event.key] = false;
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchRef.current.startX = touch.clientX;
    touchRef.current.startY = touch.clientY;
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;
  };

  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    event.preventDefault();
    const touch = event.changedTouches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Check if touch is on shoot button
    const shootButton = document.querySelector('.touch-shoot-button');
    if (shootButton) {
      const buttonRect = shootButton.getBoundingClientRect();
      if (touchX >= buttonRect.left - rect.left && 
          touchX <= buttonRect.right - rect.left &&
          touchY >= buttonRect.top - rect.top && 
          touchY <= buttonRect.bottom - rect.top) {
        shoot();
        mobileSystemRef.current.lightVibrate();
        return;
      }
    }

    // Handle touch movement for player control
    const deltaX = touchRef.current.currentX - touchRef.current.startX;
    const deltaY = touchRef.current.currentY - touchRef.current.startY;
    
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      // Move player based on touch movement
      const canvas = canvasRef.current;
      if (canvas) {
        playerRef.current.x = Math.max(0, Math.min(canvas.width - playerRef.current.width, playerRef.current.x + deltaX * 0.5));
        playerRef.current.y = Math.max(0, Math.min(canvas.height - playerRef.current.height, playerRef.current.y + deltaY * 0.5));
      }
    }
  };

  const shoot = useCallback(() => {
    if (gameState !== 'playing') return;

    const player = playerRef.current;
    const bullets = bulletsRef.current;

    // Player bullet
    bullets.push({
      x: player.x + player.width / 2 - 2,
      y: player.y,
      width: 4,
      height: 8,
      speed: 6,
      type: 'player_laser',
      color: '#00ff00',
      damage: 1,
      owner: 'player'
    });

    // Double shot
    if (player.doubleShot) {
      bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 8,
        speed: 6,
        type: 'player_laser',
        color: '#00ff00',
        damage: 1,
        owner: 'player'
      });
    }

    // Wing fighter bullets
    const wingBullets = wingFighterSystemRef.current.shootWingFighters(player);
    bullets.push(...wingBullets);

    audioSystemRef.current.playShootSound();
  }, [gameState]);

  const startGame = () => {
    setGameState('playing');
    setGameStats(prev => ({
      ...prev,
      score: 0,
      lives: difficultySystemRef.current.getPlayerHealth() / 10,
      health: difficultySystemRef.current.getPlayerHealth(),
      maxHealth: difficultySystemRef.current.getPlayerHealth(),
      gameTime: 0
    }));

    // Reset player
    const canvas = canvasRef.current;
    if (canvas) {
      playerRef.current.x = canvas.width / 2 - playerRef.current.width / 2;
      playerRef.current.y = canvas.height - 100;
      playerRef.current.health = difficultySystemRef.current.getPlayerHealth();
      playerRef.current.speed = difficultySystemRef.current.getPlayerSpeed();
    }

    // Clear game objects
    bulletsRef.current = [];
    enemiesRef.current = [];
    bossesRef.current = [];
    powerUpsRef.current = [];

    // Reset systems
    comboSystemRef.current.resetCombo();
    killStreakSystemRef.current.resetStreak();
    achievementSystemRef.current = new EnhancedAchievementSystem();

    // Start game loop
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = useCallback((currentTime: number) => {
    if (gameState !== 'playing') return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    updateGame(deltaTime);
    render();

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateGame = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const player = playerRef.current;
    const bullets = bulletsRef.current;
    const enemies = enemiesRef.current;
    const bosses = bossesRef.current;
    const powerUps = powerUpsRef.current;

    // Update game time
    setGameStats(prev => ({
      ...prev,
      gameTime: prev.gameTime + deltaTime
    }));

    // Update player
    updatePlayer(deltaTime);

    // Update systems
    comboSystemRef.current.updateCombo(deltaTime);
    killStreakSystemRef.current.updateStreak(deltaTime);
    shieldSystemRef.current.updateShield(player, deltaTime);
    wingFighterSystemRef.current.updateWingFighters(player, canvas);

    // Update game objects
    updateBullets(deltaTime);
    updateEnemies(deltaTime);
    updateBosses(deltaTime);
    updatePowerUps(deltaTime);

    // Spawn new objects
    spawnEnemies();
    spawnBosses();
    spawnPowerUps();

    // Check collisions
    checkCollisions();

    // Update achievements
    const newAchievement = achievementSystemRef.current.updateAchievements(gameStats);
    if (newAchievement) {
      achievementSystemRef.current.displayAchievement(newAchievement);
      audioSystemRef.current.playAchievementSound();
      mobileSystemRef.current.heavyVibrate();
    }

    achievementSystemRef.current.updateAchievementDisplay();
  };

  const updatePlayer = (deltaTime: number) => {
    const player = playerRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle input
    if (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A']) {
      player.x -= player.speed;
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D']) {
      player.x += player.speed;
    }
    if (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W']) {
      player.y -= player.speed;
    }
    if (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S']) {
      player.y += player.speed;
    }

    // Keep player within bounds
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Update invulnerability
    if (player.invulnerable) {
      player.invulnerabilityTime -= deltaTime;
      if (player.invulnerabilityTime <= 0) {
        player.invulnerable = false;
      }
    }

    // Update rapid fire
    if (player.rapidFire) {
      player.rapidFireTime -= deltaTime;
      if (player.rapidFireTime <= 0) {
        player.rapidFire = false;
      }
    }
  };

  const updateBullets = (deltaTime: number) => {
    const bullets = bulletsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      bullet.y += bullet.speed * (bullet.owner === 'player' ? -1 : 1);

      // Remove bullets that are off-screen
      if (bullet.y < -bullet.height || bullet.y > canvas.height + bullet.height) {
        bullets.splice(i, 1);
      }
    }
  };

  const updateEnemies = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const enemyBullets = enemySystemRef.current.updateEnemies(canvas, playerRef.current);
    bulletsRef.current.push(...enemyBullets);
  };

  const updateBosses = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bossBullets = bossSystemRef.current.updateBosses(canvas, playerRef.current);
    bulletsRef.current.push(...bossBullets);
  };

  const updatePowerUps = (deltaTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    powerUpSystemRef.current.updatePowerUps(canvas);
  };

  const spawnEnemies = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newEnemy = enemySystemRef.current.spawnEnemy(canvas, gameStats.score);
    if (newEnemy) {
      enemiesRef.current.push(newEnemy);
    }
  };

  const spawnBosses = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newBoss = bossSystemRef.current.spawnBoss(canvas, gameStats.score);
    if (newBoss) {
      bossesRef.current.push(newBoss);
    }
  };

  const spawnPowerUps = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newPowerUp = powerUpSystemRef.current.spawnPowerUp(canvas, gameStats.score);
    if (newPowerUp) {
      powerUpsRef.current.push(newPowerUp);
    }
  };

  const checkCollisions = useCallback(() => {
    const player = playerRef.current;
    const bullets = bulletsRef.current;
    const enemies = enemiesRef.current;
    const bosses = bossesRef.current;
    const powerUps = powerUpsRef.current;

    // Bullet vs Enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (bullet.owner !== 'player') continue;

      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        if (isColliding(bullet, enemy)) {
          bullets.splice(i, 1);
          const destroyed = enemySystemRef.current.damageEnemy(j, bullet.damage);
          
          if (destroyed) {
            enemies.splice(j, 1);
            const comboMultiplier = comboSystemRef.current.addKill();
            const streakData = killStreakSystemRef.current.addKill();
            
            setGameStats(prev => ({
              ...prev,
              score: prev.score + (100 * comboMultiplier * streakData.multiplier),
              enemiesDestroyed: prev.enemiesDestroyed + 1
            }));

            audioSystemRef.current.playEnemyDestroySound();
            mobileSystemRef.current.mediumVibrate();
          } else {
            audioSystemRef.current.playEnemyHitSound();
          }
          break;
        }
      }
    }

    // Bullet vs Boss collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (bullet.owner !== 'player') continue;

      for (let j = bosses.length - 1; j >= 0; j--) {
        const boss = bosses[j];
        if (isColliding(bullet, boss)) {
          bullets.splice(i, 1);
          boss.health -= bullet.damage;
          
          if (boss.health <= 0) {
            bosses.splice(j, 1);
            setGameStats(prev => ({
              ...prev,
              score: prev.score + 1000,
              bossesDefeated: prev.bossesDefeated + 1
            }));

            audioSystemRef.current.playBossDestroySound();
            mobileSystemRef.current.heavyVibrate();
          } else {
            audioSystemRef.current.playBossHitSound();
          }
          break;
        }
      }
    }

    // Player vs Enemy/Boss collisions
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (isColliding(player, enemy)) {
        enemies.splice(i, 1);
        takeDamage(1);
        break;
      }
    }

    for (let i = bosses.length - 1; i >= 0; i--) {
      const boss = bosses[i];
      if (isColliding(player, boss)) {
        takeDamage(2);
        break;
      }
    }

    // Player vs Enemy Bullet collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bullet = bullets[i];
      if (bullet.owner === 'player') continue;

      if (isColliding(player, bullet)) {
        bullets.splice(i, 1);
        takeDamage(bullet.damage);
        break;
      }
    }

    // Player vs PowerUp collisions
    for (let i = powerUps.length - 1; i >= 0; i--) {
      const powerUp = powerUps[i];
      if (isColliding(player, powerUp)) {
        powerUps.splice(i, 1);
        powerUpSystemRef.current.collectPowerUp(powerUp, player);
        
        setGameStats(prev => ({
          ...prev,
          powerUpsCollected: prev.powerUpsCollected + 1
        }));

        audioSystemRef.current.playPowerUpSound();
        mobileSystemRef.current.lightVibrate();
        break;
      }
    }
  }, [gameStats]);

  const takeDamage = (damage: number) => {
    if (playerRef.current.invulnerable) return;

    // Check shield first
    if (shieldSystemRef.current.takeDamage(playerRef.current, damage)) {
      return; // Shield absorbed damage
    }

    setGameStats(prev => {
      const newHealth = prev.health - damage;
      if (newHealth <= 0) {
        // Player died
        setGameState('gameOver');
        if (prev.score > prev.highScore) {
          localStorage.setItem('highScore', prev.score.toString());
          return { ...prev, highScore: prev.score };
        }
        return prev;
      }
      return { ...prev, health: newHealth };
    });

    // Make player invulnerable briefly
    playerRef.current.invulnerable = true;
    playerRef.current.invulnerabilityTime = 2000;
  };

  const isColliding = (obj1: any, obj2: any): boolean => {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars background
    drawStars(ctx, canvas);

    // Draw game objects
    drawPlayer(ctx);
    drawBullets(ctx);
    enemySystemRef.current.drawEnemies(ctx);
    bossSystemRef.current.drawBosses(ctx);
    drawPowerUps(ctx);
    wingFighterSystemRef.current.drawWingFighters(ctx);
    shieldSystemRef.current.drawShield(ctx, playerRef.current);

    // Draw UI
    drawUI(ctx, canvas);
    comboSystemRef.current.drawComboUI(ctx, canvas);
    killStreakSystemRef.current.drawStreakUI(ctx, canvas);
    achievementSystemRef.current.drawAchievementNotification(ctx, canvas);
  };

  const drawStars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 7) % canvas.width;
      const y = (i * 11) % canvas.height;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current;
    
    if (player.invulnerable) {
      ctx.globalAlpha = 0.5;
    }

    // Draw enhanced player ship using ShipRenderer
    if (selectedCharacter === 'kaden') {
      ShipRenderer.drawKadenShip(ctx, player.x, player.y, player.width, player.height, 0);
    } else if (selectedCharacter === 'adelynn') {
      ShipRenderer.drawAdelynnShip(ctx, player.x, player.y, player.width, player.height, 0);
    }

    ctx.globalAlpha = 1;
  };

  const drawBullets = useCallback((ctx: CanvasRenderingContext2D) => {
    const bullets = bulletsRef.current;
    
    bullets.forEach(bullet => {
      ctx.save();
      
      // Enhanced bullet drawing
      if (bullet.owner === 'player') {
        // Player bullets - energy blasts
        ctx.fillStyle = bullet.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = bullet.color;
        
        // Draw energy bullet
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, bullet.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(bullet.x + bullet.width/2, bullet.y + bullet.height/2, bullet.width/4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Enemy bullets - plasma shots
        ctx.fillStyle = bullet.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = bullet.color;
        
        // Draw plasma bullet
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Add inner glow
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(bullet.x + 1, bullet.y + 1, bullet.width - 2, bullet.height - 2);
      }
      
      ctx.restore();
    });
  }, []);

  const drawPowerUps = (ctx: CanvasRenderingContext2D) => {
    const powerUps = powerUpSystemRef.current.getPowerUps();
    
    powerUps.forEach(powerUp => {
      ctx.fillStyle = powerUp.color;
      ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
      
      // Draw power-up icon
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        powerUp.icon,
        powerUp.x + powerUp.width / 2,
        powerUp.y + powerUp.height / 2 + 5
      );
      ctx.textAlign = 'left';
    });
  };

  const drawUI = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${gameStats.score}`, 20, 40);
    
    // High Score
    ctx.font = '18px Arial';
    ctx.fillText(`High Score: ${gameStats.highScore}`, 20, 70);
    
    // Health
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Health: ${gameStats.health}`, 20, 100);
    
    // Lives
    ctx.fillStyle = '#ffff00';
    ctx.fillText(`Lives: ${gameStats.lives}`, 20, 130);
    
    // Difficulty
    ctx.fillStyle = difficultySystemRef.current.getDifficultyColor();
    ctx.fillText(`Difficulty: ${difficultySystemRef.current.getDifficultyName()}`, 20, 160);
    
    // Game Time
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`Time: ${Math.floor(gameStats.gameTime / 1000)}s`, 20, 190);
  }, [gameStats]);

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          border: '2px solid #333',
          background: '#000000'
        }}
      />
      
      {gameState === 'menu' && (
        <div className="menu-overlay">
          <h1 className="game-title">🚀 Kaden & Adelynn Space Adventures</h1>
          <p className="game-subtitle">Epic Space Shooter Adventure</p>
          
          {/* Character Display */}
          <div className="selected-character-display">
            <div className="character-icon-display">
              <canvas 
                ref={(canvas) => {
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    canvas.width = 80;
                    canvas.height = 80;
                    
                    if (selectedCharacter === 'kaden') {
                      const kadenRenderer = new KadenSpriteRenderer();
                      kadenRenderer.renderKaden(ctx, 40, 40, 'idle', Date.now());
                    } else if (selectedCharacter === 'adelynn') {
                      const adelynnRenderer = new AdelynnSpriteRenderer();
                      adelynnRenderer.renderAdelynn(ctx, 40, 40, 'idle', Date.now());
                    }
                  }
                }}
                width="80" 
                height="80"
                className="main-menu-character-sprite"
              />
            </div>
            <h3>Selected Pilot: {Storyline.characters[selectedCharacter as keyof typeof Storyline.characters]?.name}</h3>
            <p>{Storyline.characters[selectedCharacter as keyof typeof Storyline.characters]?.ship}</p>
          </div>
          
          <div className="menu-buttons">
            <button className="menu-button" onClick={startGame}>
              🎮 Start Game
            </button>
            <button className="menu-button" onClick={() => setShowCharacterSelection(true)}>
              👥 Choose Character
            </button>
            <button className="menu-button" onClick={() => setShowSettings(true)}>
              ⚙️ Settings
            </button>
          </div>
          
          <div className="game-info">
            <p><strong>🎯 Mission:</strong> Defend the galaxy from alien invaders!</p>
            <p><strong>🚀 Features:</strong> Power-ups, Boss Battles, Achievements & More!</p>
            <p><strong>🎮 Controls:</strong> Arrow Keys / WASD to move, Space to shoot</p>
            <p><strong>📱 Mobile:</strong> Touch controls with haptic feedback</p>
            <p className="company-branding"><strong>© 2025 Bradley Virtual Solutions, LLC</strong></p>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="game-over-overlay">
          <h2 className="game-over-title">💥 Game Over!</h2>
          <div className="game-over-stats">
            <p><strong>🏆 Final Score:</strong> {gameStats.score.toLocaleString()}</p>
            <p><strong>⭐ High Score:</strong> {gameStats.highScore.toLocaleString()}</p>
            <p><strong>👾 Enemies Destroyed:</strong> {gameStats.enemiesDestroyed}</p>
            <p><strong>👹 Bosses Defeated:</strong> {gameStats.bossesDefeated}</p>
            <p><strong>🔥 Max Combo:</strong> {gameStats.maxCombo}</p>
            <p><strong>⚔️ Max Kill Streak:</strong> {gameStats.maxKillStreak}</p>
            <p><strong>⏰ Survival Time:</strong> {Math.floor(gameStats.gameTime / 1000)}s</p>
          </div>
          <div className="game-over-buttons">
            <button className="menu-button" onClick={startGame}>
              🔄 Play Again
            </button>
            <button className="menu-button" onClick={() => setGameState('menu')}>
              🏠 Main Menu
            </button>
          </div>
          <p className="company-branding"><strong>© 2025 Bradley Virtual Solutions, LLC</strong></p>
        </div>
      )}
      
      {gameState === 'playing' && mobileSystemRef.current.hasTouchSupport() && (
        <div className="touch-controls">
          <button 
            className="touch-shoot-button"
            onTouchStart={(e) => {
              e.preventDefault();
              shoot();
              mobileSystemRef.current.lightVibrate();
            }}
          >
            🔫 SHOOT
          </button>
        </div>
      )}

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={setGameSettings}
      />

      {/* Character Selection */}
      <CharacterSelection 
        isOpen={showCharacterSelection}
        onClose={() => setShowCharacterSelection(false)}
        onCharacterSelect={setSelectedCharacter}
      />

      {/* Story Event Display */}
      {currentStoryEvent && (
        <div className="story-event-display">
          <div className="story-event-content">
            <h3>📖 Story Event</h3>
            <p>{currentStoryEvent}</p>
            <button onClick={() => setCurrentStoryEvent('')}>Continue</button>
          </div>
        </div>
      )}
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Game;
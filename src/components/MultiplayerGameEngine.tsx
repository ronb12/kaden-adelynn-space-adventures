import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  health: number;
  maxHealth: number;
  score: number;
  isAlive: boolean;
  keys: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    shoot: boolean;
  };
}

interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  health: number;
  maxHealth: number;
  type: 'basic' | 'fast' | 'heavy' | 'boss';
  color: string;
  isAlive: boolean;
}

interface Bullet {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  ownerId: string;
  damage: number;
  color: string;
  isAlive: boolean;
}

interface PowerUp {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'health' | 'weapon' | 'speed' | 'shield';
  color: string;
  isAlive: boolean;
}

interface MultiplayerGameEngineProps {
  playerCount: number;
  onGameOver: (scores: { [playerId: string]: number }) => void;
  onScoreUpdate: (scores: { [playerId: string]: number }) => void;
}

export const MultiplayerGameEngine: React.FC<MultiplayerGameEngineProps> = ({
  playerCount,
  onGameOver,
  onScoreUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameOver'>('playing');
  const [players, setPlayers] = useState<Player[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [gameTime, setGameTime] = useState(0);
  const [enemySpawnTimer, setEnemySpawnTimer] = useState(0);
  const [powerUpSpawnTimer, setPowerUpSpawnTimer] = useState(0);

  // Initialize players
  useEffect(() => {
    const initialPlayers: Player[] = [
      {
        id: 'player1',
        name: 'Kaden',
        x: 100,
        y: 200,
        width: 40,
        height: 30,
        color: '#00ff00',
        health: 100,
        maxHealth: 100,
        score: 0,
        isAlive: true,
        keys: { up: false, down: false, left: false, right: false, shoot: false }
      },
      {
        id: 'player2',
        name: 'Adelynn',
        x: 100,
        y: 300,
        width: 40,
        height: 30,
        color: '#ff6b6b',
        health: 100,
        maxHealth: 100,
        score: 0,
        isAlive: true,
        keys: { up: false, down: false, left: false, right: false, shoot: false }
      },
      {
        id: 'player3',
        name: 'Engineer',
        x: 100,
        y: 400,
        width: 40,
        height: 30,
        color: '#4ecdc4',
        health: 100,
        maxHealth: 100,
        score: 0,
        isAlive: true,
        keys: { up: false, down: false, left: false, right: false, shoot: false }
      },
      {
        id: 'player4',
        name: 'Navigator',
        x: 100,
        y: 500,
        width: 40,
        height: 30,
        color: '#ffe66d',
        health: 100,
        maxHealth: 100,
        score: 0,
        isAlive: true,
        keys: { up: false, down: false, left: false, right: false, shoot: false }
      }
    ].slice(0, playerCount);

    setPlayers(initialPlayers);
  }, [playerCount]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      updateGame();
      renderGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, players, enemies, bullets, powerUps]);

  // Input handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      setPlayers(prevPlayers => 
        prevPlayers.map(player => {
          const newKeys = { ...player.keys };
          
          // Player 1 controls (WASD + Space)
          if (player.id === 'player1') {
            if (key === 'w') newKeys.up = true;
            if (key === 's') newKeys.down = true;
            if (key === 'a') newKeys.left = true;
            if (key === 'd') newKeys.right = true;
            if (key === ' ') newKeys.shoot = true;
          }
          // Player 2 controls (Arrow keys + Enter)
          else if (player.id === 'player2') {
            if (key === 'arrowup') newKeys.up = true;
            if (key === 'arrowdown') newKeys.down = true;
            if (key === 'arrowleft') newKeys.left = true;
            if (key === 'arrowright') newKeys.right = true;
            if (key === 'enter') newKeys.shoot = true;
          }
          // Player 3 controls (IJKL + U)
          else if (player.id === 'player3') {
            if (key === 'i') newKeys.up = true;
            if (key === 'k') newKeys.down = true;
            if (key === 'j') newKeys.left = true;
            if (key === 'l') newKeys.right = true;
            if (key === 'u') newKeys.shoot = true;
          }
          // Player 4 controls (TFGH + Y)
          else if (player.id === 'player4') {
            if (key === 't') newKeys.up = true;
            if (key === 'g') newKeys.down = true;
            if (key === 'f') newKeys.left = true;
            if (key === 'h') newKeys.right = true;
            if (key === 'y') newKeys.shoot = true;
          }
          
          return { ...player, keys: newKeys };
        })
      );
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      setPlayers(prevPlayers => 
        prevPlayers.map(player => {
          const newKeys = { ...player.keys };
          
          if (player.id === 'player1') {
            if (key === 'w') newKeys.up = false;
            if (key === 's') newKeys.down = false;
            if (key === 'a') newKeys.left = false;
            if (key === 'd') newKeys.right = false;
            if (key === ' ') newKeys.shoot = false;
          } else if (player.id === 'player2') {
            if (key === 'arrowup') newKeys.up = false;
            if (key === 'arrowdown') newKeys.down = false;
            if (key === 'arrowleft') newKeys.left = false;
            if (key === 'arrowright') newKeys.right = false;
            if (key === 'enter') newKeys.shoot = false;
          } else if (player.id === 'player3') {
            if (key === 'i') newKeys.up = false;
            if (key === 'k') newKeys.down = false;
            if (key === 'j') newKeys.left = false;
            if (key === 'l') newKeys.right = false;
            if (key === 'u') newKeys.shoot = false;
          } else if (player.id === 'player4') {
            if (key === 't') newKeys.up = false;
            if (key === 'g') newKeys.down = false;
            if (key === 'f') newKeys.left = false;
            if (key === 'h') newKeys.right = false;
            if (key === 'y') newKeys.shoot = false;
          }
          
          return { ...player, keys: newKeys };
        })
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateGame = () => {
    if (gameState !== 'playing') return;

    // Update game time
    setGameTime(prev => prev + 1);

    // Update players
    setPlayers(prevPlayers => 
      prevPlayers.map(player => {
        if (!player.isAlive) return player;

        let newX = player.x;
        let newY = player.y;
        const speed = 5;

        if (player.keys.up && newY > 0) newY -= speed;
        if (player.keys.down && newY < 600 - player.height) newY += speed;
        if (player.keys.left && newX > 0) newX -= speed;
        if (player.keys.right && newX < 800 - player.width) newX += speed;

        // Handle shooting
        if (player.keys.shoot && gameTime % 10 === 0) {
          const newBullet: Bullet = {
            id: `bullet_${Date.now()}_${Math.random()}`,
            x: newX + player.width,
            y: newY + player.height / 2,
            width: 10,
            height: 5,
            speedX: 8,
            speedY: 0,
            ownerId: player.id,
            damage: 10,
            color: player.color,
            isAlive: true
          };
          setBullets(prev => [...prev, newBullet]);
        }

        return { ...player, x: newX, y: newY };
      })
    );

    // Update bullets
    setBullets(prevBullets => 
      prevBullets
        .map(bullet => ({
          ...bullet,
          x: bullet.x + bullet.speedX,
          y: bullet.y + bullet.speedY
        }))
        .filter(bullet => bullet.x < 800 && bullet.x > 0 && bullet.isAlive)
    );

    // Update enemies
    setEnemies(prevEnemies => 
      prevEnemies
        .map(enemy => ({
          ...enemy,
          x: enemy.x + enemy.speedX,
          y: enemy.y + enemy.speedY
        }))
        .filter(enemy => enemy.x > -50 && enemy.isAlive)
    );

    // Spawn enemies
    setEnemySpawnTimer(prev => {
      if (prev <= 0) {
        spawnEnemy();
        return 60 + Math.random() * 60; // Spawn every 1-2 seconds
      }
      return prev - 1;
    });

    // Spawn power-ups
    setPowerUpSpawnTimer(prev => {
      if (prev <= 0) {
        spawnPowerUp();
        return 300 + Math.random() * 300; // Spawn every 5-10 seconds
      }
      return prev - 1;
    });

    // Check collisions
    checkCollisions();
    
    // Update scores
    const scores = players.reduce((acc, player) => {
      acc[player.id] = player.score;
      return acc;
    }, {} as { [playerId: string]: number });
    onScoreUpdate(scores);
  };

  const spawnEnemy = () => {
    const enemyTypes = [
      { type: 'basic', color: '#ff0000', health: 20, speed: -2 },
      { type: 'fast', color: '#ff8800', health: 15, speed: -3 },
      { type: 'heavy', color: '#8800ff', health: 40, speed: -1 }
    ];
    
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const newEnemy: Enemy = {
      id: `enemy_${Date.now()}_${Math.random()}`,
      x: 800,
      y: Math.random() * (600 - 30),
      width: 30,
      height: 30,
      speedX: enemyType.speed,
      speedY: (Math.random() - 0.5) * 2,
      health: enemyType.health,
      maxHealth: enemyType.health,
      type: enemyType.type as any,
      color: enemyType.color,
      isAlive: true
    };
    
    setEnemies(prev => [...prev, newEnemy]);
  };

  const spawnPowerUp = () => {
    const powerUpTypes = [
      { type: 'health', color: '#00ff00' },
      { type: 'weapon', color: '#ffff00' },
      { type: 'speed', color: '#00ffff' },
      { type: 'shield', color: '#ff00ff' }
    ];
    
    const powerUpType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const newPowerUp: PowerUp = {
      id: `powerup_${Date.now()}_${Math.random()}`,
      x: Math.random() * (800 - 20),
      y: Math.random() * (600 - 20),
      width: 20,
      height: 20,
      type: powerUpType.type as any,
      color: powerUpType.color,
      isAlive: true
    };
    
    setPowerUps(prev => [...prev, newPowerUp]);
  };

  const checkCollisions = () => {
    // Bullet vs Enemy collisions
    setBullets(prevBullets => {
      const remainingBullets = [...prevBullets];
      const bulletsToRemove: string[] = [];
      
      prevBullets.forEach(bullet => {
        enemies.forEach(enemy => {
          if (enemy.isAlive && bullet.isAlive &&
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y) {
            
            // Hit!
            bulletsToRemove.push(bullet.id);
            
            // Update enemy health
            setEnemies(prevEnemies => 
              prevEnemies.map(e => 
                e.id === enemy.id 
                  ? { ...e, health: Math.max(0, e.health - bullet.damage), isAlive: e.health - bullet.damage > 0 }
                  : e
              )
            );
            
            // Update player score
            setPlayers(prevPlayers => 
              prevPlayers.map(p => 
                p.id === bullet.ownerId 
                  ? { ...p, score: p.score + 10 }
                  : p
              )
            );
          }
        });
      });
      
      return remainingBullets.filter(bullet => !bulletsToRemove.includes(bullet.id));
    });

    // Enemy vs Player collisions
    setPlayers(prevPlayers => 
      prevPlayers.map(player => {
        if (!player.isAlive) return player;
        
        const hitEnemy = enemies.find(enemy => 
          enemy.isAlive &&
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        );
        
        if (hitEnemy) {
          const newHealth = Math.max(0, player.health - 20);
          return { 
            ...player, 
            health: newHealth, 
            isAlive: newHealth > 0
          };
        }
        
        return player;
      })
    );

    // Power-up vs Player collisions
    setPlayers(prevPlayers => 
      prevPlayers.map(player => {
        if (!player.isAlive) return player;
        
        const hitPowerUp = powerUps.find(powerUp => 
          powerUp.isAlive &&
          player.x < powerUp.x + powerUp.width &&
          player.x + player.width > powerUp.x &&
          player.y < powerUp.y + powerUp.height &&
          player.y + player.height > powerUp.y
        );
        
        if (hitPowerUp) {
          // Apply power-up effect
          let newHealth = player.health;
          if (hitPowerUp.type === 'health') {
            newHealth = Math.min(player.maxHealth, player.health + 25);
          }
          
          // Remove power-up
          setPowerUps(prev => prev.filter(p => p.id !== hitPowerUp.id));
          
          return { ...player, health: newHealth };
        }
        
        return player;
      })
    );

    // Check game over
    const alivePlayers = players.filter(p => p.isAlive);
    if (alivePlayers.length === 0) {
      setGameState('gameOver');
      const scores = players.reduce((acc, player) => {
        acc[player.id] = player.score;
        return acc;
      }, {} as { [playerId: string]: number });
      onGameOver(scores);
    }
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw starfield
    drawStarfield(ctx);

    // Draw power-ups
    powerUps.forEach(powerUp => {
      if (powerUp.isAlive) {
        ctx.fillStyle = powerUp.color;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        
        // Add glow effect
        ctx.shadowColor = powerUp.color;
        ctx.shadowBlur = 10;
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        ctx.shadowBlur = 0;
      }
    });

    // Draw enemies
    enemies.forEach(enemy => {
      if (enemy.isAlive) {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // Health bar
        if (enemy.health < enemy.maxHealth) {
          ctx.fillStyle = '#ff0000';
          ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4);
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(enemy.x, enemy.y - 10, (enemy.health / enemy.maxHealth) * enemy.width, 4);
        }
      }
    });

    // Draw bullets
    bullets.forEach(bullet => {
      if (bullet.isAlive) {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Add glow effect
        ctx.shadowColor = bullet.color;
        ctx.shadowBlur = 5;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.shadowBlur = 0;
      }
    });

    // Draw players
    players.forEach(player => {
      if (player.isAlive) {
        // Ship body
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Ship details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height - 10);
        
        // Health bar
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(player.x, player.y - 10, player.width, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(player.x, player.y - 10, (player.health / player.maxHealth) * player.width, 4);
        
        // Player name
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText(player.name, player.x, player.y - 15);
      }
    });
  };

  const drawStarfield = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 37) % 800;
      const y = (i * 23) % 600;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setGameTime(0);
    setEnemySpawnTimer(60);
    setPowerUpSpawnTimer(300);
  };

  const pauseGame = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  return (
    <div className="multiplayer-game-engine">
      {/* Game Canvas */}
      <div className="game-viewport">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="game-canvas"
        />
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <button onClick={startGame} disabled={gameState === 'playing'}>
          {gameState === 'gameOver' ? 'Restart Game' : 'Start Game'}
        </button>
        <button onClick={pauseGame}>
          {gameState === 'paused' ? 'Resume' : 'Pause'}
        </button>
      </div>

      {/* Player Controls Info */}
      <div className="controls-info">
        <h3>🎮 Player Controls</h3>
        <div className="player-controls">
          <div className="control-set">
            <h4>Player 1 (Kaden)</h4>
            <p>WASD + Space</p>
          </div>
          <div className="control-set">
            <h4>Player 2 (Adelynn)</h4>
            <p>Arrow Keys + Enter</p>
          </div>
          <div className="control-set">
            <h4>Player 3 (Engineer)</h4>
            <p>IJKL + U</p>
          </div>
          <div className="control-set">
            <h4>Player 4 (Navigator)</h4>
            <p>TFGH + Y</p>
          </div>
        </div>
      </div>

      {/* Game Status */}
      <div className="game-status">
        <h3>🎯 Game Status</h3>
        <div className="status-info">
          <p>Time: {Math.floor(gameTime / 60)}s</p>
          <p>Enemies: {enemies.filter(e => e.isAlive).length}</p>
          <p>Bullets: {bullets.length}</p>
          <p>Power-ups: {powerUps.filter(p => p.isAlive).length}</p>
        </div>
      </div>

      {/* Player Scores */}
      <div className="player-scores">
        <h3>🏆 Scores</h3>
        <div className="scores-list">
          {players.map(player => (
            <div key={player.id} className="score-item">
              <span className="player-name" style={{ color: player.color }}>
                {player.name}
              </span>
              <span className="player-score">{player.score}</span>
              <span className="player-health">
                ❤️ {player.health}/{player.maxHealth}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameEngine;
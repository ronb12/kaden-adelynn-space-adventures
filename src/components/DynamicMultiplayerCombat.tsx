import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AdvancedMultiplayerSystem } from '../systems/AdvancedMultiplayerSystem';

interface CombatShip {
  id: string;
  x: number;
  y: number;
  angle: number;
  velocity: { x: number; y: number };
  health: number;
  shield: number;
  energy: number;
  role: string;
  color: string;
  isPlayer: boolean;
  lastUpdate: number;
}

interface Projectile {
  id: string;
  x: number;
  y: number;
  angle: number;
  velocity: { x: number; y: number };
  damage: number;
  type: 'laser' | 'missile' | 'plasma';
  ownerId: string;
  lifetime: number;
}

interface Explosion {
  id: string;
  x: number;
  y: number;
  size: number;
  intensity: number;
  lifetime: number;
  type: 'ship' | 'weapon' | 'environmental';
}

interface EnvironmentalHazard {
  id: string;
  x: number;
  y: number;
  radius: number;
  type: 'asteroid' | 'solar_storm' | 'gravity_well';
  intensity: number;
  lifetime: number;
}

interface MissionObjective {
  id: string;
  type: 'eliminate' | 'escort' | 'defend' | 'explore';
  target: string;
  progress: number;
  maxProgress: number;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface DynamicMultiplayerCombatProps {
  multiplayerSystem: AdvancedMultiplayerSystem;
  isSquadLeader: boolean;
  playerRole: string;
  onMissionComplete: (success: boolean) => void;
}

export const DynamicMultiplayerCombat: React.FC<DynamicMultiplayerCombatProps> = ({
  multiplayerSystem,
  isSquadLeader,
  playerRole,
  onMissionComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | undefined>(undefined);
  const [ships, setShips] = useState<CombatShip[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [hazards, setHazards] = useState<EnvironmentalHazard[]>([]);
  const [missionObjectives, setMissionObjectives] = useState<MissionObjective[]>([]);
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [weaponSystem, setWeaponSystem] = useState<'laser' | 'missile' | 'plasma'>('laser');
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'mission_complete'>('playing');

  // Initialize game
  useEffect(() => {
    initializeGame();
    startGameLoop();
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, []);

  const initializeGame = () => {
    // Initialize player ships
    const initialShips: CombatShip[] = [
      {
        id: 'player_1',
        x: 200,
        y: 300,
        angle: 0,
        velocity: { x: 0, y: 0 },
        health: 100,
        shield: 100,
        energy: 100,
        role: 'pilot',
        color: '#00ff00',
        isPlayer: true,
        lastUpdate: Date.now()
      },
      {
        id: 'player_2',
        x: 400,
        y: 300,
        angle: 0,
        velocity: { x: 0, y: 0 },
        health: 100,
        shield: 100,
        energy: 100,
        role: 'gunner',
        color: '#ff6b6b',
        isPlayer: true,
        lastUpdate: Date.now()
      },
      {
        id: 'player_3',
        x: 200,
        y: 500,
        angle: 0,
        velocity: { x: 0, y: 0 },
        health: 100,
        shield: 100,
        energy: 100,
        role: 'engineer',
        color: '#4ecdc4',
        isPlayer: true,
        lastUpdate: Date.now()
      },
      {
        id: 'player_4',
        x: 400,
        y: 500,
        angle: 0,
        velocity: { x: 0, y: 0 },
        health: 100,
        shield: 100,
        energy: 100,
        role: 'navigator',
        color: '#ffe66d',
        isPlayer: true,
        lastUpdate: Date.now()
      }
    ];

    // Initialize enemy ships
    const enemyShips: CombatShip[] = [
      {
        id: 'enemy_1',
        x: 800,
        y: 200,
        angle: Math.PI,
        velocity: { x: -2, y: 0 },
        health: 80,
        shield: 60,
        energy: 100,
        role: 'fighter',
        color: '#ff0000',
        isPlayer: false,
        lastUpdate: Date.now()
      },
      {
        id: 'enemy_2',
        x: 900,
        y: 400,
        angle: Math.PI,
        velocity: { x: -1.5, y: 0.5 },
        health: 100,
        shield: 80,
        energy: 100,
        role: 'bomber',
        color: '#cc0000',
        isPlayer: false,
        lastUpdate: Date.now()
      },
      {
        id: 'enemy_3',
        x: 850,
        y: 600,
        angle: Math.PI,
        velocity: { x: -1, y: -0.5 },
        health: 60,
        shield: 40,
        energy: 100,
        role: 'interceptor',
        color: '#990000',
        isPlayer: false,
        lastUpdate: Date.now()
      }
    ];

    setShips([...initialShips, ...enemyShips]);

    // Initialize mission objectives
    const objectives: MissionObjective[] = [
      {
        id: 'eliminate_enemies',
        type: 'eliminate',
        target: 'enemy_ships',
        progress: 0,
        maxProgress: 3,
        description: 'Eliminate all enemy ships',
        priority: 'high'
      },
      {
        id: 'protect_team',
        type: 'defend',
        target: 'friendly_ships',
        progress: 4,
        maxProgress: 4,
        description: 'Keep all team members alive',
        priority: 'critical'
      }
    ];

    setMissionObjectives(objectives);

    // Initialize environmental hazards
    const initialHazards: EnvironmentalHazard[] = [
      {
        id: 'asteroid_1',
        x: 600,
        y: 300,
        radius: 30,
        type: 'asteroid',
        intensity: 50,
        lifetime: 1000
      },
      {
        id: 'solar_storm_1',
        x: 700,
        y: 500,
        radius: 50,
        type: 'solar_storm',
        intensity: 75,
        lifetime: 2000
      }
    ];

    setHazards(initialHazards);
  };

  const startGameLoop = () => {
    const gameLoop = () => {
      updateGame();
      renderGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop();
  };

  const updateGame = () => {
    if (gameState !== 'playing') return;

    // Update ships
    setShips(prevShips => 
      prevShips.map(ship => {
        // Apply velocity
        const newX = ship.x + ship.velocity.x;
        const newY = ship.y + ship.velocity.y;
        
        // Keep ships in bounds
        const boundedX = Math.max(50, Math.min(950, newX));
        const boundedY = Math.max(50, Math.min(650, newY));
        
        // Update velocity with some randomness for enemy ships
        let newVelocity = { ...ship.velocity };
        if (!ship.isPlayer) {
          newVelocity.x += (Math.random() - 0.5) * 0.1;
          newVelocity.y += (Math.random() - 0.5) * 0.1;
          
          // Limit velocity
          const maxSpeed = 3;
          const speed = Math.sqrt(newVelocity.x ** 2 + newVelocity.y ** 2);
          if (speed > maxSpeed) {
            newVelocity.x = (newVelocity.x / speed) * maxSpeed;
            newVelocity.y = (newVelocity.y / speed) * maxSpeed;
          }
        }

        return {
          ...ship,
          x: boundedX,
          y: boundedY,
          velocity: newVelocity,
          lastUpdate: Date.now()
        };
      })
    );

    // Update projectiles
    setProjectiles(prevProjectiles => 
      prevProjectiles
        .map(projectile => ({
          ...projectile,
          x: projectile.x + projectile.velocity.x,
          y: projectile.y + projectile.velocity.y,
          lifetime: projectile.lifetime - 1
        }))
        .filter(projectile => projectile.lifetime > 0)
    );

    // Update explosions
    setExplosions(prevExplosions => 
      prevExplosions
        .map(explosion => ({
          ...explosion,
          lifetime: explosion.lifetime - 1,
          size: explosion.size * 0.98
        }))
        .filter(explosion => explosion.lifetime > 0)
    );

    // Update hazards
    setHazards(prevHazards => 
      prevHazards
        .map(hazard => ({
          ...hazard,
          lifetime: hazard.lifetime - 1
        }))
        .filter(hazard => hazard.lifetime > 0)
    );

    // Check collisions
    checkCollisions();
    
    // Update mission objectives
    updateMissionObjectives();
  };

  const checkCollisions = () => {
    // Check projectile-ship collisions
    setProjectiles(prevProjectiles => {
      const remainingProjectiles = [...prevProjectiles];
      const newExplosions: Explosion[] = [];

      prevProjectiles.forEach(projectile => {
        ships.forEach(ship => {
          if (projectile.ownerId !== ship.id) {
            const distance = Math.sqrt(
              (projectile.x - ship.x) ** 2 + (projectile.y - ship.y) ** 2
            );
            
            if (distance < 20) {
              // Hit!
              const explosion: Explosion = {
                id: `explosion_${Date.now()}`,
                x: projectile.x,
                y: projectile.y,
                size: 30,
                intensity: 100,
                lifetime: 30,
                type: 'weapon'
              };
              newExplosions.push(explosion);

              // Remove projectile
              const index = remainingProjectiles.findIndex(p => p.id === projectile.id);
              if (index >= 0) {
                remainingProjectiles.splice(index, 1);
              }

              // Damage ship
              setShips(prevShips => 
                prevShips.map(s => 
                  s.id === ship.id 
                    ? { ...s, health: Math.max(0, s.health - projectile.damage) }
                    : s
                )
              );
            }
          }
        });
      });

      if (newExplosions.length > 0) {
        setExplosions(prev => [...prev, ...newExplosions]);
      }

      return remainingProjectiles;
    });
  };

  const updateMissionObjectives = () => {
    setMissionObjectives(prevObjectives => {
      const updatedObjectives = [...prevObjectives];
      
      // Update eliminate enemies objective
      const eliminateObjective = updatedObjectives.find(obj => obj.id === 'eliminate_enemies');
      if (eliminateObjective) {
        const aliveEnemies = ships.filter(ship => !ship.isPlayer && ship.health > 0).length;
        eliminateObjective.progress = 3 - aliveEnemies;
      }

      // Update protect team objective
      const protectObjective = updatedObjectives.find(obj => obj.id === 'protect_team');
      if (protectObjective) {
        const alivePlayers = ships.filter(ship => ship.isPlayer && ship.health > 0).length;
        protectObjective.progress = alivePlayers;
      }

      return updatedObjectives;
    });
  };

  const fireWeapon = useCallback((shipId: string, targetX: number, targetY: number) => {
    const ship = ships.find(s => s.id === shipId);
    if (!ship || ship.energy < 10) return;

    const angle = Math.atan2(targetY - ship.y, targetX - ship.x);
    const speed = 8;
    
    const projectile: Projectile = {
      id: `projectile_${Date.now()}`,
      x: ship.x,
      y: ship.y,
      angle,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      },
      damage: weaponSystem === 'laser' ? 25 : weaponSystem === 'missile' ? 50 : 40,
      type: weaponSystem,
      ownerId: shipId,
      lifetime: 120
    };

    setProjectiles(prev => [...prev, projectile]);

    // Reduce ship energy
    setShips(prevShips => 
      prevShips.map(s => 
        s.id === shipId 
          ? { ...s, energy: Math.max(0, s.energy - 10) }
          : s
      )
    );
  }, [ships, weaponSystem]);

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

    // Draw environmental hazards
    hazards.forEach(hazard => drawHazard(ctx, hazard));

    // Draw ships
    ships.forEach(ship => drawShip(ctx, ship));

    // Draw projectiles
    projectiles.forEach(projectile => drawProjectile(ctx, projectile));

    // Draw explosions
    explosions.forEach(explosion => drawExplosion(ctx, explosion));

    // Draw targeting reticle
    if (selectedTarget) {
      const target = ships.find(s => s.id === selectedTarget);
      if (target) {
        drawTargetingReticle(ctx, target);
      }
    }
  };

  const drawStarfield = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 37) % 1000;
      const y = (i * 23) % 700;
      const size = Math.random() * 2;
      ctx.fillRect(x, y, size, size);
    }
  };

  const drawShip = (ctx: CanvasRenderingContext2D, ship: CombatShip) => {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);

    // Ship body
    ctx.fillStyle = ship.color;
    ctx.fillRect(-15, -8, 30, 16);

    // Ship details
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-10, -4, 20, 8);

    // Health bar
    if (ship.health < 100) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-15, -20, 30, 4);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-15, -20, (ship.health / 100) * 30, 4);
    }

    // Shield indicator
    if (ship.shield > 0) {
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(-18, -11, 36, 22);
    }

    ctx.restore();
  };

  const drawProjectile = (ctx: CanvasRenderingContext2D, projectile: Projectile) => {
    ctx.save();
    ctx.translate(projectile.x, projectile.y);
    ctx.rotate(projectile.angle);

    switch (projectile.type) {
      case 'laser':
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(15, 0);
        ctx.stroke();
        break;
      case 'missile':
        ctx.fillStyle = '#ff8800';
        ctx.fillRect(-5, -3, 10, 6);
        break;
      case 'plasma':
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  };

  const drawExplosion = (ctx: CanvasRenderingContext2D, explosion: Explosion) => {
    const alpha = explosion.lifetime / 30;
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Explosion effect
    const gradient = ctx.createRadialGradient(
      explosion.x, explosion.y, 0,
      explosion.x, explosion.y, explosion.size
    );
    gradient.addColorStop(0, '#ffff00');
    gradient.addColorStop(0.5, '#ff8800');
    gradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  };

  const drawHazard = (ctx: CanvasRenderingContext2D, hazard: EnvironmentalHazard) => {
    ctx.save();
    
    switch (hazard.type) {
      case 'asteroid':
        ctx.fillStyle = '#666666';
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'solar_storm':
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'gravity_well':
        ctx.fillStyle = '#8800ff';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(hazard.x, hazard.y, hazard.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  const drawTargetingReticle = (ctx: CanvasRenderingContext2D, target: CombatShip) => {
    ctx.save();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    
    // Outer ring
    ctx.beginPath();
    ctx.arc(target.x, target.y, 25, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner crosshairs
    ctx.beginPath();
    ctx.moveTo(target.x - 15, target.y);
    ctx.lineTo(target.x + 15, target.y);
    ctx.moveTo(target.x, target.y - 15);
    ctx.lineTo(target.x, target.y + 15);
    ctx.stroke();
    
    ctx.restore();
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find closest enemy ship
    const enemies = ships.filter(ship => !ship.isPlayer && ship.health > 0);
    if (enemies.length > 0) {
      const closest = enemies.reduce((closest, enemy) => {
        const distance = Math.sqrt((enemy.x - x) ** 2 + (enemy.y - y) ** 2);
        const closestDistance = Math.sqrt((closest.x - x) ** 2 + (closest.y - y) ** 2);
        return distance < closestDistance ? enemy : closest;
      });

      setSelectedTarget(closest.id);
      fireWeapon('player_1', closest.x, closest.y);
    }
  };

  return (
    <div className="dynamic-multiplayer-combat">
      {/* Combat Viewport */}
      <div className="combat-viewport">
        <canvas
          ref={canvasRef}
          width={1000}
          height={700}
          onClick={handleCanvasClick}
          className="combat-canvas"
        />
      </div>

      {/* Combat HUD */}
      <div className="combat-hud">
        {/* Top Bar */}
        <div className="hud-top">
          <div className="mission-status">
            <h3>🎯 Mission Status</h3>
            <div className="objectives-list">
              {missionObjectives.map(objective => (
                <div key={objective.id} className={`objective ${objective.priority}`}>
                  <span className="objective-type">{objective.type}</span>
                  <span className="objective-progress">
                    {objective.progress}/{objective.maxProgress}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="team-status">
            <h3>👥 Team Status</h3>
            <div className="team-members">
              {ships.filter(ship => ship.isPlayer).map(ship => (
                <div key={ship.id} className="team-member">
                  <div className="member-info">
                    <span className="member-name">{ship.role}</span>
                    <div className="health-bar">
                      <div 
                        className="health-fill" 
                        style={{ width: `${ship.health}%` }}
                      ></div>
                    </div>
                    <div className="shield-bar">
                      <div 
                        className="shield-fill" 
                        style={{ width: `${ship.shield}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="hud-bottom">
          <div className="weapon-systems">
            <h4>🔫 Weapon Systems</h4>
            <div className="weapon-selector">
              <button 
                className={weaponSystem === 'laser' ? 'active' : ''}
                onClick={() => setWeaponSystem('laser')}
              >
                ⚡ Laser
              </button>
              <button 
                className={weaponSystem === 'missile' ? 'active' : ''}
                onClick={() => setWeaponSystem('missile')}
              >
                🚀 Missile
              </button>
              <button 
                className={weaponSystem === 'plasma' ? 'active' : ''}
                onClick={() => setWeaponSystem('plasma')}
              >
                💥 Plasma
              </button>
            </div>
          </div>

          <div className="ship-status">
            <h4>🚀 Ship Status</h4>
            <div className="status-bars">
              <div className="status-item">
                <span>Health</span>
                <div className="status-bar">
                  <div 
                    className="status-fill health" 
                    style={{ width: `${ships.find(s => s.id === 'player_1')?.health || 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="status-item">
                <span>Shield</span>
                <div className="status-bar">
                  <div 
                    className="status-fill shield" 
                    style={{ width: `${ships.find(s => s.id === 'player_1')?.shield || 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="status-item">
                <span>Energy</span>
                <div className="status-bar">
                  <div 
                    className="status-fill energy" 
                    style={{ width: `${ships.find(s => s.id === 'player_1')?.energy || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="target-info">
            <h4>🎯 Target Info</h4>
            {selectedTarget && (
              <div className="target-details">
                <span>Target: {selectedTarget}</span>
                <span>Distance: {Math.round(Math.random() * 500)}m</span>
                <span>Status: Active</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicMultiplayerCombat;

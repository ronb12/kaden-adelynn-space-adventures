// Enhanced Ship Designs for Kaden & Adelynn Space Adventures

export const ShipDesigns = {
  // Player Ships
  playerShips: {
    kaden: {
      name: "Thunderbolt Fighter",
      color: "#0066ff",
      accentColor: "#00aaff",
      trailColor: "#0088ff",
      design: {
        body: "streamlined",
        wings: "swept-back",
        engine: "twin-engines",
        weapons: "dual-cannons"
      },
      abilities: {
        rapidFire: {
          color: "#ffff00",
          effect: "rapid-fire-burst"
        },
        shieldBoost: {
          color: "#00ff00",
          effect: "energy-shield"
        },
        speedBurst: {
          color: "#ff6600",
          effect: "speed-trail"
        }
      }
    },
    adelynn: {
      name: "Starlight Defender",
      color: "#ff0066",
      accentColor: "#ff44aa",
      trailColor: "#ff0088",
      design: {
        body: "angular",
        wings: "delta-wing",
        engine: "quad-engines",
        weapons: "multi-cannon"
      },
      abilities: {
        doubleShot: {
          color: "#00ffff",
          effect: "twin-blast"
        },
        energyShield: {
          color: "#ff00ff",
          effect: "purple-shield"
        },
        wingFighters: {
          color: "#ffff00",
          effect: "drone-support"
        }
      }
    }
  },

  // Enemy Ship Designs
  enemyShips: {
    basic: {
      name: "Scout Fighter",
      color: "#ff4444",
      accentColor: "#ff6666",
      design: "triangular",
      size: "small",
      speed: "medium",
      health: 1,
      description: "Fast and agile alien scout ships"
    },
    fast: {
      name: "Interceptor",
      color: "#ff8800",
      accentColor: "#ffaa44",
      design: "needle-like",
      size: "small",
      speed: "high",
      health: 1,
      description: "Lightning-fast alien interceptors"
    },
    heavy: {
      name: "Assault Cruiser",
      color: "#8800ff",
      accentColor: "#aa44ff",
      design: "bulky",
      size: "large",
      speed: "slow",
      health: 3,
      description: "Heavily armored alien assault ships"
    },
    zigzag: {
      name: "Evasive Fighter",
      color: "#00ff88",
      accentColor: "#44ffaa",
      design: "irregular",
      size: "medium",
      speed: "variable",
      health: 2,
      description: "Unpredictable alien fighters with erratic movement"
    },
    kamikaze: {
      name: "Suicide Bomber",
      color: "#ff0088",
      accentColor: "#ff44aa",
      design: "explosive",
      size: "small",
      speed: "high",
      health: 1,
      description: "Desperate alien pilots on suicide missions"
    },
    shooter: {
      name: "Gunboat",
      color: "#ffff00",
      accentColor: "#ffff44",
      design: "weapon-heavy",
      size: "medium",
      speed: "medium",
      health: 2,
      description: "Heavily armed alien gunboats"
    }
  },

  // Boss Ship Designs
  bossShips: {
    mothership: {
      name: "Alien Mothership",
      color: "#880000",
      accentColor: "#aa4444",
      design: "massive",
      size: "huge",
      speed: "slow",
      health: 100,
      description: "The massive alien mothership - the ultimate threat",
      phases: [
        {
          health: 100,
          attacks: ["spawn-fighters", "energy-blast"],
          color: "#880000"
        },
        {
          health: 50,
          attacks: ["spawn-fighters", "energy-blast", "laser-beam"],
          color: "#aa4444"
        },
        {
          health: 25,
          attacks: ["spawn-fighters", "energy-blast", "laser-beam", "explosive-charge"],
          color: "#cc6666"
        }
      ]
    }
  },

  // Visual Effects
  effects: {
    explosions: {
      small: {
        color: "#ff6600",
        size: 20,
        duration: 500
      },
      medium: {
        color: "#ff8800",
        size: 40,
        duration: 800
      },
      large: {
        color: "#ffaa00",
        size: 80,
        duration: 1200
      },
      boss: {
        color: "#ff0000",
        size: 150,
        duration: 2000
      }
    },
    trails: {
      player: {
        color: "#00aaff",
        length: 10,
        fade: 0.1
      },
      enemy: {
        color: "#ff4444",
        length: 5,
        fade: 0.2
      }
    },
    shields: {
      player: {
        color: "#00ff00",
        opacity: 0.3,
        pulse: true
      },
      enemy: {
        color: "#ff00ff",
        opacity: 0.2,
        pulse: false
      }
    }
  }
};

// Ship Drawing Functions
export const ShipRenderer = {
  // Draw Kaden's Ship - Star Trek Inspired Design
  drawKadenShip(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(angle);
    
    const time = Date.now() * 0.003;
    const pulse = Math.sin(time) * 0.1 + 0.9;
    
    // Main saucer section (Star Trek style)
    ctx.fillStyle = '#4A90E2';
    ctx.strokeStyle = '#2E5BBA';
    ctx.lineWidth = 2;
    
    // Primary hull - saucer shape
    ctx.beginPath();
    ctx.ellipse(0, -height/4, width/2.5, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Secondary hull - cylindrical
    ctx.fillStyle = '#5BA0F2';
    ctx.beginPath();
    ctx.ellipse(0, height/8, width/4, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Warp nacelles (Star Trek signature)
    ctx.fillStyle = '#6BB6FF';
    ctx.strokeStyle = '#4A90E2';
    ctx.lineWidth = 1.5;
    
    // Left nacelle
    ctx.beginPath();
    ctx.ellipse(-width/2.2, height/6, width/8, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right nacelle
    ctx.beginPath();
    ctx.ellipse(width/2.2, height/6, width/8, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Nacelle pylons
    ctx.strokeStyle = '#2E5BBA';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-width/4, height/8);
    ctx.lineTo(-width/2.2, height/6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width/4, height/8);
    ctx.lineTo(width/2.2, height/6);
    ctx.stroke();
    
    // Bridge module
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.ellipse(0, -height/3, width/8, height/12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Deflector dish
    ctx.fillStyle = '#00BFFF';
    ctx.beginPath();
    ctx.ellipse(0, height/3, width/6, height/8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Warp core glow
    ctx.fillStyle = `rgba(0, 191, 255, ${pulse * 0.6})`;
    ctx.shadowColor = '#00BFFF';
    ctx.shadowBlur = 10 * pulse;
    ctx.beginPath();
    ctx.ellipse(0, height/8, width/12, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Navigation lights
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-width/3, -height/4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(width/3, -height/4, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // Draw Adelynn's Ship - Battlestar Galactica Inspired Design
  drawAdelynnShip(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(angle);
    
    const time = Date.now() * 0.003;
    const pulse = Math.sin(time) * 0.1 + 0.9;
    
    // Main hull - Battlestar style with flight pods
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 3;
    
    // Central hull
    ctx.beginPath();
    ctx.ellipse(0, 0, width/3, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Left flight pod (Battlestar signature)
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.ellipse(-width/2.5, -height/6, width/4, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right flight pod
    ctx.beginPath();
    ctx.ellipse(width/2.5, -height/6, width/4, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Flight pod connections
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-width/3, -height/8);
    ctx.lineTo(-width/2.5, -height/6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width/3, -height/8);
    ctx.lineTo(width/2.5, -height/6);
    ctx.stroke();
    
    // Command tower
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.ellipse(0, -height/3, width/8, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Heavy armor plating
    ctx.fillStyle = '#696969';
    ctx.strokeStyle = '#2F4F4F';
    ctx.lineWidth = 2;
    
    // Top armor
    ctx.beginPath();
    ctx.ellipse(0, -height/2.5, width/2, height/8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Side armor plates
    for (let i = 0; i < 3; i++) {
      const y = -height/4 + (i * height/6);
      ctx.beginPath();
      ctx.ellipse(-width/2.8, y, width/12, height/8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(width/2.8, y, width/12, height/8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    // Heavy weapon mounts
    ctx.fillStyle = '#2F4F4F';
    ctx.strokeStyle = '#1C1C1C';
    ctx.lineWidth = 2;
    
    // Forward cannons
    ctx.beginPath();
    ctx.rect(-width/6, -height/2 - 8, width/12, 16);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(width/6 - width/12, -height/2 - 8, width/12, 16);
    ctx.fill();
    ctx.stroke();
    
    // Side turrets
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      ctx.beginPath();
      ctx.arc(side * width/2.2, -height/6 + (i * height/3), 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    // Engine glow
    ctx.fillStyle = `rgba(255, 100, 0, ${pulse * 0.8})`;
    ctx.shadowColor = '#FF6400';
    ctx.shadowBlur = 15 * pulse;
    ctx.beginPath();
    ctx.ellipse(0, height/2.5, width/8, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Navigation lights
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-width/3, -height/4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.arc(width/3, -height/4, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // Draw Enemy Ship
  drawEnemyShip(ctx, x, y, width, height, type, angle = 0) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(angle);
    
    const shipData = ShipDesigns.enemyShips[type];
    if (!shipData) return;
    
    ctx.fillStyle = shipData.color;
    ctx.strokeStyle = shipData.accentColor;
    ctx.lineWidth = 2;
    
    switch (type) {
      case 'basic':
        // Cylon Raider inspired design
        ctx.fillStyle = '#8B0000';
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 2;
        
        // Main body - angular Cylon design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/3, -height/4);
        ctx.lineTo(-width/2, 0);
        ctx.lineTo(-width/3, height/4);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/3, height/4);
        ctx.lineTo(width/2, 0);
        ctx.lineTo(width/3, -height/4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Cylon eye
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(0, -height/4, width/8, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'fast':
        // Sleek alien interceptor
        ctx.fillStyle = '#2F4F4F';
        ctx.strokeStyle = '#00CED1';
        ctx.lineWidth = 1.5;
        
        // Needle-like design with sci-fi elements
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/4, -height/6);
        ctx.lineTo(-width/6, 0);
        ctx.lineTo(-width/4, height/6);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/4, height/6);
        ctx.lineTo(width/6, 0);
        ctx.lineTo(width/4, -height/6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Engine glow
        ctx.fillStyle = '#00CED1';
        ctx.beginPath();
        ctx.arc(0, height/3, width/8, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'heavy':
        // Armored alien cruiser
        ctx.fillStyle = '#696969';
        ctx.strokeStyle = '#2F4F4F';
        ctx.lineWidth = 3;
        
        // Bulky armored design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/2, -height/4);
        ctx.lineTo(-width/2, height/4);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/2, height/4);
        ctx.lineTo(width/2, -height/4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Armor plating
        ctx.fillStyle = '#2F4F4F';
        ctx.beginPath();
        ctx.ellipse(0, 0, width/3, height/4, 0, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'zigzag':
        // Organic alien vessel
        ctx.fillStyle = '#8B4513';
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 2;
        
        // Irregular organic design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/3, -height/4);
        ctx.lineTo(width/3, 0);
        ctx.lineTo(-width/3, height/4);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/3, height/4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Organic details
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(-width/6, -height/6, width/12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/6, height/6, width/12, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'kamikaze':
        // Explosive alien drone
        ctx.fillStyle = '#FF4500';
        ctx.strokeStyle = '#FF6347';
        ctx.lineWidth = 2;
        
        // Angular explosive design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/2, 0);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Explosive glow
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(0, 0, width/4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'shooter':
        // Weapon-heavy alien gunship
        ctx.fillStyle = '#4B0082';
        ctx.strokeStyle = '#9370DB';
        ctx.lineWidth = 2;
        
        // Weapon-heavy design with turrets
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/3, -height/4);
        ctx.lineTo(-width/2, 0);
        ctx.lineTo(-width/3, height/4);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/3, height/4);
        ctx.lineTo(width/2, 0);
        ctx.lineTo(width/3, -height/4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Weapon turrets
        ctx.fillStyle = '#9370DB';
        ctx.beginPath();
        ctx.arc(-width/4, -height/6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width/4, -height/6, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      default:
        // Default enemy ship design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/2, height/2);
        ctx.lineTo(width/2, height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
    }
    
    ctx.restore();
  },

  // Draw Boss Ship - Enhanced with detailed graphics
  drawBossShip(ctx, x, y, width, height, health, maxHealth, bossType = 'destroyer') {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    
    // Health-based color intensity
    const healthRatio = health / maxHealth;
    const time = Date.now() * 0.003; // For pulsing effects
    
    // Draw different boss types with unique designs
    switch (bossType) {
      case 'destroyer':
        this.drawDestroyerBoss(ctx, width, height, healthRatio, time);
        break;
      case 'battleship':
        this.drawBattleshipBoss(ctx, width, height, healthRatio, time);
        break;
      case 'mothership':
        this.drawMothershipBoss(ctx, width, height, healthRatio, time);
        break;
      case 'space_dragon':
        this.drawSpaceDragonBoss(ctx, width, height, healthRatio, time);
        break;
      case 'void_reaper':
        this.drawVoidReaperBoss(ctx, width, height, healthRatio, time);
        break;
      case 'mech_titan':
        this.drawMechTitanBoss(ctx, width, height, healthRatio, time);
        break;
      case 'crystal_guardian':
        this.drawCrystalGuardianBoss(ctx, width, height, healthRatio, time);
        break;
      case 'plasma_beast':
        this.drawPlasmaBeastBoss(ctx, width, height, healthRatio, time);
        break;
      case 'quantum_entity':
        this.drawQuantumEntityBoss(ctx, width, height, healthRatio, time);
        break;
      case 'cyber_dreadnought':
        this.drawCyberDreadnoughtBoss(ctx, width, height, healthRatio, time);
        break;
      case 'neural_network':
        this.drawNeuralNetworkBoss(ctx, width, height, healthRatio, time);
        break;
      case 'gravity_well':
        this.drawGravityWellBoss(ctx, width, height, healthRatio, time);
        break;
      case 'solar_flare':
        this.drawSolarFlareBoss(ctx, width, height, healthRatio, time);
        break;
      case 'ice_leviathan':
        this.drawIceLeviathanBoss(ctx, width, height, healthRatio, time);
        break;
      case 'storm_king':
        this.drawStormKingBoss(ctx, width, height, healthRatio, time);
        break;
      default:
        this.drawDestroyerBoss(ctx, width, height, healthRatio, time);
    }
    
    ctx.restore();
  },

  // Destroyer Boss - Sleek, fast design
  drawDestroyerBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Outer glow effect
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20 * glowIntensity;
    
    // Main hull - elongated diamond shape
    ctx.fillStyle = `rgba(200, 50, 50, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.lineTo(width/3, -height/4);
    ctx.lineTo(width/2, 0);
    ctx.lineTo(width/3, height/4);
    ctx.lineTo(0, height/2);
    ctx.lineTo(-width/3, height/4);
    ctx.lineTo(-width/2, 0);
    ctx.lineTo(-width/3, -height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Engine pods
    ctx.fillStyle = '#ffaa00';
    ctx.strokeStyle = '#ff8800';
    ctx.lineWidth = 2;
    
    // Left engine
    ctx.beginPath();
    ctx.ellipse(-width/2.5, height/3, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right engine
    ctx.beginPath();
    ctx.ellipse(width/2.5, height/3, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Engine flames
    ctx.fillStyle = `rgba(255, 100, 0, ${glowIntensity})`;
    ctx.beginPath();
    ctx.ellipse(-width/2.5, height/2.5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width/2.5, height/2.5, 8, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Central core with pulsing effect
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(0, 0, width/8, 0, Math.PI * 2);
    ctx.fill();
    
    // Weapon turrets
    ctx.fillStyle = '#666666';
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4;
      const turretX = Math.cos(angle) * (width/3);
      const turretY = Math.sin(angle) * (height/3);
      
      ctx.beginPath();
      ctx.arc(turretX, turretY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  },

  // Battleship Boss - Heavy, armored design
  drawBattleshipBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.5) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Outer glow
    ctx.shadowColor = '#6600ff';
    ctx.shadowBlur = 25 * glowIntensity;
    
    // Main hull - rectangular with rounded corners
    ctx.fillStyle = `rgba(100, 50, 200, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#aa66ff';
    ctx.lineWidth = 4;
    
    ctx.beginPath();
    ctx.roundRect(-width/2, -height/2, width, height, 15);
    ctx.fill();
    ctx.stroke();
    
    // Armor plating
    ctx.fillStyle = '#444444';
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 2;
    
    // Top armor
    ctx.beginPath();
    ctx.roundRect(-width/2 + 10, -height/2 + 10, width - 20, 20, 5);
    ctx.fill();
    ctx.stroke();
    
    // Bottom armor
    ctx.beginPath();
    ctx.roundRect(-width/2 + 10, height/2 - 30, width - 20, 20, 5);
    ctx.fill();
    ctx.stroke();
    
    // Side armor plates
    for (let i = 0; i < 3; i++) {
      const y = -height/3 + (i * height/3);
      ctx.beginPath();
      ctx.roundRect(-width/2 + 5, y - 8, 15, 16, 3);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.roundRect(width/2 - 20, y - 8, 15, 16, 3);
      ctx.fill();
      ctx.stroke();
    }
    
    // Central command center
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(0, 0, width/6, 0, Math.PI * 2);
    ctx.fill();
    
    // Heavy weapon mounts
    ctx.fillStyle = '#333333';
    ctx.strokeStyle = '#555555';
    ctx.lineWidth = 2;
    
    // Front cannons
    ctx.beginPath();
    ctx.rect(-width/4, -height/2 - 10, width/8, 20);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.rect(width/4 - width/8, -height/2 - 10, width/8, 20);
    ctx.fill();
    ctx.stroke();
    
    // Side turrets
    for (let i = 0; i < 2; i++) {
      const side = i === 0 ? -1 : 1;
      ctx.beginPath();
      ctx.arc(side * width/2.5, -height/4 + (i * height/2), 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  },

  // Mothership Boss - Massive, intimidating design
  drawMothershipBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.3) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Massive outer glow
    ctx.shadowColor = '#ff6600';
    ctx.shadowBlur = 30 * glowIntensity;
    
    // Main body - large hexagonal shape
    ctx.fillStyle = `rgba(200, 100, 0, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#ffaa00';
    ctx.lineWidth = 5;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * (width/2);
      const y = Math.sin(angle) * (height/2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Inner structure
    ctx.fillStyle = '#ff8800';
    ctx.strokeStyle = '#ffaa44';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * (width/3);
      const y = Math.sin(angle) * (height/3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Central core with energy field
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity})`;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.arc(0, 0, width/8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Energy rings
    ctx.strokeStyle = `rgba(255, 255, 255, ${glowIntensity * 0.5})`;
    ctx.lineWidth = 1;
    
    for (let ring = 1; ring <= 3; ring++) {
      ctx.beginPath();
      ctx.arc(0, 0, width/8 + ring * 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Weapon arrays
    ctx.fillStyle = '#666666';
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const weaponX = Math.cos(angle) * (width/2.2);
      const weaponY = Math.sin(angle) * (height/2.2);
      
      ctx.beginPath();
      ctx.arc(weaponX, weaponY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Weapon barrels
      ctx.beginPath();
      ctx.moveTo(weaponX, weaponY);
      ctx.lineTo(weaponX + Math.cos(angle) * 15, weaponY + Math.sin(angle) * 15);
      ctx.stroke();
    }
    
    // Shield generators
    ctx.fillStyle = `rgba(0, 150, 255, ${glowIntensity * 0.7})`;
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI * 2) / 4 + Math.PI/4;
      const genX = Math.cos(angle) * (width/1.8);
      const genY = Math.sin(angle) * (height/1.8);
      
      ctx.beginPath();
      ctx.arc(genX, genY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  },

  // Space Dragon Boss - Ancient cosmic dragon
  drawSpaceDragonBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.4) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Dragon body - serpentine design
    ctx.fillStyle = `rgba(139, 0, 0, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 4;
    
    // Main body - elongated serpentine shape
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dragon head
    ctx.beginPath();
    ctx.ellipse(0, -height/3, width/4, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Dragon wings
    ctx.fillStyle = `rgba(75, 0, 130, ${0.6 + glowIntensity * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(-width/3, -height/6, width/6, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(width/3, -height/6, width/6, height/4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dragon eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(-width/8, -height/3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width/8, -height/3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Dragon breath glow
    ctx.fillStyle = `rgba(255, 100, 0, ${glowIntensity})`;
    ctx.shadowColor = '#FF6400';
    ctx.shadowBlur = 20 * glowIntensity;
    ctx.beginPath();
    ctx.ellipse(0, -height/2.5, width/8, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
  },

  // Void Reaper Boss - Shadow entity
  drawVoidReaperBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.6) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Void entity - shadowy design
    ctx.fillStyle = `rgba(75, 0, 130, ${0.7 + glowIntensity * 0.3})`;
    ctx.strokeStyle = '#4B0082';
    ctx.lineWidth = 3;
    
    // Main shadow body
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Void tendrils
    ctx.strokeStyle = `rgba(75, 0, 130, ${glowIntensity * 0.8})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const startX = Math.cos(angle) * (width/3);
      const startY = Math.sin(angle) * (height/3);
      const endX = Math.cos(angle) * (width/1.5);
      const endY = Math.sin(angle) * (height/1.5);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Void core
    ctx.fillStyle = `rgba(255, 255, 255, ${glowIntensity * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, 0, width/8, 0, Math.PI * 2);
    ctx.fill();
  },

  // Mech Titan Boss - Giant robotic war machine
  drawMechTitanBoss(ctx, width, height, healthRatio, time) {
    const pulse = Math.sin(time * 0.3) * 0.1 + 0.9;
    const glowIntensity = healthRatio * pulse;
    
    // Mech body - massive robotic design
    ctx.fillStyle = `rgba(47, 79, 79, ${0.8 + glowIntensity * 0.2})`;
    ctx.strokeStyle = '#2F4F4F';
    ctx.lineWidth = 4;
    
    // Main mech body
    ctx.beginPath();
    ctx.ellipse(0, 0, width/2, height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Mech head
    ctx.fillStyle = '#696969';
    ctx.beginPath();
    ctx.ellipse(0, -height/3, width/4, height/6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Mech arms
    ctx.fillStyle = '#2F4F4F';
    ctx.beginPath();
    ctx.ellipse(-width/2.5, 0, width/8, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(width/2.5, 0, width/8, height/3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Mech weapons
    ctx.fillStyle = '#1C1C1C';
    ctx.beginPath();
    ctx.rect(-width/2.5, -height/6, width/12, height/3);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(width/2.5 - width/12, -height/6, width/12, height/3);
    ctx.fill();
    
    // Power core
    ctx.fillStyle = `rgba(0, 255, 255, ${glowIntensity})`;
    ctx.shadowColor = '#00FFFF';
    ctx.shadowBlur = 15 * glowIntensity;
    ctx.beginPath();
    ctx.arc(0, 0, width/10, 0, Math.PI * 2);
    ctx.fill();
  }
};

export default ShipDesigns;

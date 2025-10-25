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
  // Draw Kaden's Ship
  drawKadenShip(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(angle);
    
    // Ship body
    ctx.fillStyle = "#0066ff";
    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 2;
    
    // Main body
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.lineTo(-width/3, height/4);
    ctx.lineTo(0, height/2);
    ctx.lineTo(width/3, height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Wings
    ctx.beginPath();
    ctx.moveTo(-width/3, height/4);
    ctx.lineTo(-width/2, height/6);
    ctx.lineTo(-width/4, -height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width/3, height/4);
    ctx.lineTo(width/2, height/6);
    ctx.lineTo(width/4, -height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Engine glow
    ctx.fillStyle = "#0088ff";
    ctx.beginPath();
    ctx.arc(0, height/3, width/6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  },

  // Draw Adelynn's Ship
  drawAdelynnShip(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    ctx.rotate(angle);
    
    // Ship body
    ctx.fillStyle = "#ff0066";
    ctx.strokeStyle = "#ff44aa";
    ctx.lineWidth = 2;
    
    // Main body (delta wing design)
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.lineTo(-width/2, height/2);
    ctx.lineTo(width/2, height/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Central body
    ctx.beginPath();
    ctx.moveTo(0, -height/2);
    ctx.lineTo(-width/4, height/4);
    ctx.lineTo(0, height/2);
    ctx.lineTo(width/4, height/4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Engine glow
    ctx.fillStyle = "#ff0088";
    ctx.beginPath();
    ctx.arc(0, height/3, width/8, 0, Math.PI * 2);
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
        // Triangular design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/2, height/2);
        ctx.lineTo(width/2, height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'fast':
        // Needle-like design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/4, height/2);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/4, height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
        
      case 'heavy':
        // Bulky design
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
        break;
        
      case 'zigzag':
        // Irregular design
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
        break;
        
      case 'kamikaze':
        // Explosive design
        ctx.beginPath();
        ctx.moveTo(0, -height/2);
        ctx.lineTo(-width/2, 0);
        ctx.lineTo(0, height/2);
        ctx.lineTo(width/2, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Explosive glow
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(0, 0, width/4, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 'shooter':
        // Weapon-heavy design
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
        
        // Weapon barrels
        ctx.fillStyle = shipData.accentColor;
        ctx.fillRect(-width/2, -height/6, width/4, height/3);
        ctx.fillRect(width/4, -height/6, width/4, height/3);
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
  }
};

export default ShipDesigns;

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
    }
    
    ctx.restore();
  },

  // Draw Boss Ship
  drawBossShip(ctx, x, y, width, height, health, maxHealth) {
    ctx.save();
    ctx.translate(x + width/2, y + height/2);
    
    // Health-based color
    const healthRatio = health / maxHealth;
    let color = "#880000";
    if (healthRatio > 0.5) color = "#880000";
    else if (healthRatio > 0.25) color = "#aa4444";
    else color = "#cc6666";
    
    ctx.fillStyle = color;
    ctx.strokeStyle = "#ff4444";
    ctx.lineWidth = 3;
    
    // Main body
    ctx.beginPath();
    ctx.arc(0, 0, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Armor plates
    ctx.fillStyle = "#aa4444";
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const plateX = Math.cos(angle) * (width/2 - 20);
      const plateY = Math.sin(angle) * (height/2 - 20);
      
      ctx.beginPath();
      ctx.arc(plateX, plateY, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Central core
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(0, 0, width/6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
};

export default ShipDesigns;

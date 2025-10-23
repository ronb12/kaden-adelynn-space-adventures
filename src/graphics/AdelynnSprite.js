// Enhanced Adelynn Character Sprite - Professional Animated Design
// Based on: Young female tactical engineer, early 20s, calm and focused,
// long silver braid, dark purple flight jacket with glowing pink circuitry patterns,
// holographic wrist console

export const AdelynnSprite = {
  name: "Adelynn",
  age: "early 20s",
  description: "Calm and focused tactical engineer with futuristic sci-fi design",
  
  // Character Design Specifications
  design: {
    hair: {
      color: "#C0C0C0", // Silver
      style: "long braid",
      highlights: "#E0E0E0" // Light silver highlights
    },
    flightJacket: {
      primary: "#4A148C", // Dark purple
      circuitry: "#FF1493", // Glowing pink circuitry patterns
      style: "tactical engineer jacket"
    },
    wristConsole: {
      color: "#00FFFF", // Cyan holographic
      effect: "holographic projections",
      style: "advanced tech interface"
    },
    expression: "calm and focused",
    stance: "professional, slightly analytical"
  },
  
  // Animation States
  animations: {
    idle: {
      description: "Soft idle loop with hair sway and blinking lights on wrist console",
      frames: [
        {
          name: "idle_1",
          description: "Neutral position with subtle hair movement",
          hairSway: 0,
          consoleBlink: 1.0,
          bodyLean: 0
        },
        {
          name: "idle_2",
          description: "Hair swaying slightly, console lights dimming",
          hairSway: 2,
          consoleBlink: 0.7,
          bodyLean: 1
        },
        {
          name: "idle_3",
          description: "Hair returning to center, console brightening",
          hairSway: -1,
          consoleBlink: 1.2,
          bodyLean: 0
        },
        {
          name: "idle_4",
          description: "Gentle hair movement, console pulsing",
          hairSway: 1,
          consoleBlink: 0.8,
          bodyLean: -1
        }
      ]
    },
    
    droneDeploy: {
      description: "Adelynn deploying a small holographic drone",
      frames: [
        {
          name: "deploy_1",
          description: "Raising wrist console to deploy drone",
          hairSway: 0,
          consoleBlink: 2.0,
          bodyLean: 3,
          droneVisible: false
        },
        {
          name: "deploy_2",
          description: "Drone materializing from holographic projection",
          hairSway: 1,
          consoleBlink: 1.5,
          bodyLean: 5,
          droneVisible: true
        },
        {
          name: "deploy_3",
          description: "Drone fully deployed and hovering",
          hairSway: 0,
          consoleBlink: 1.0,
          bodyLean: 2,
          droneVisible: true
        }
      ]
    },
    
    consoleTap: {
      description: "Adelynn tapping her wrist console with glowing HUD projections",
      frames: [
        {
          name: "tap_1",
          description: "Bringing wrist console to attention",
          hairSway: 0,
          consoleBlink: 1.5,
          bodyLean: 2,
          hudVisible: false
        },
        {
          name: "tap_2",
          description: "Tapping console, HUD projections appearing",
          hairSway: 1,
          consoleBlink: 2.0,
          bodyLean: 3,
          hudVisible: true
        },
        {
          name: "tap_3",
          description: "HUD fully projected, analyzing data",
          hairSway: 0,
          consoleBlink: 1.8,
          bodyLean: 2,
          hudVisible: true
        }
      ]
    }
  },
  
  // Sprite Rendering Data (1024x1024 resolution)
  spriteData: {
    width: 1024,
    height: 1024,
    
    // Character proportions (center-based)
    proportions: {
      head: { width: 180, height: 220, x: 512, y: 200 },
      body: { width: 280, height: 380, x: 512, y: 450 },
      arms: { width: 70, height: 180, x: 400, y: 500 },
      legs: { width: 100, height: 280, x: 480, y: 650 },
      hair: { width: 200, height: 400, x: 512, y: 180 },
      console: { width: 80, height: 60, x: 420, y: 550 }
    },
    
    // Color palette
    colors: {
      skin: "#FFDBAC",
      hair: "#C0C0C0",
      hairHighlights: "#E0E0E0",
      flightJacket: "#4A148C",
      circuitry: "#FF1493",
      wristConsole: "#00FFFF",
      consoleGlow: "#00FFFF",
      eyes: "#9370DB",
      mouth: "#FF69B4",
      drone: "#00FFFF",
      hud: "#00FFFF"
    }
  }
};

// Advanced Sprite Renderer for Adelynn
export class AdelynnSpriteRenderer {
  constructor() {
    this.currentFrame = 0;
    this.animationSpeed = 120; // milliseconds per frame
    this.lastUpdate = 0;
  }
  
  // Render Adelynn with animation
  renderAdelynn(ctx, x, y, animation = 'idle', timestamp = 0) {
    const animationData = AdelynnSprite.animations[animation];
    if (!animationData) return;
    
    // Update animation frame
    if (timestamp - this.lastUpdate > this.animationSpeed) {
      this.currentFrame = (this.currentFrame + 1) % animationData.frames.length;
      this.lastUpdate = timestamp;
    }
    
    const frame = animationData.frames[this.currentFrame];
    
    ctx.save();
    ctx.translate(x, y);
    
    // Apply body lean
    if (frame.bodyLean !== 0) {
      ctx.rotate(frame.bodyLean * Math.PI / 180);
    }
    
    // Draw Adelynn character
    this.drawAdelynnBody(ctx, frame);
    this.drawAdelynnHead(ctx, frame);
    this.drawAdelynnHair(ctx, frame);
    this.drawAdelynnFlightJacket(ctx, frame);
    this.drawAdelynnWristConsole(ctx, frame);
    
    // Draw special effects based on animation
    if (frame.droneVisible) {
      this.drawHolographicDrone(ctx, frame);
    }
    if (frame.hudVisible) {
      this.drawHUDProjections(ctx, frame);
    }
    
    ctx.restore();
  }
  
  // Draw Adelynn's body
  drawAdelynnBody(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    // Body base
    ctx.fillStyle = colors.skin;
    ctx.fillRect(
      proportions.body.x - proportions.body.width/2,
      proportions.body.y - proportions.body.height/2,
      proportions.body.width,
      proportions.body.height
    );
  }
  
  // Draw Adelynn's head
  drawAdelynnHead(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    // Head shape
    ctx.fillStyle = colors.skin;
    ctx.beginPath();
    ctx.ellipse(
      proportions.head.x,
      proportions.head.y,
      proportions.head.width/2,
      proportions.head.height/2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Eyes (calm and focused)
    ctx.fillStyle = colors.eyes;
    ctx.beginPath();
    ctx.arc(proportions.head.x - 25, proportions.head.y - 15, 6, 0, Math.PI * 2);
    ctx.arc(proportions.head.x + 25, proportions.head.y - 15, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (calm expression)
    ctx.fillStyle = colors.mouth;
    ctx.beginPath();
    ctx.arc(proportions.head.x, proportions.head.y + 15, 8, 0, Math.PI);
    ctx.fill();
  }
  
  // Draw Adelynn's hair (long silver braid)
  drawAdelynnHair(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    ctx.save();
    
    // Apply hair sway animation
    if (frame.hairSway !== 0) {
      ctx.translate(frame.hairSway * 2, 0);
    }
    
    // Hair base
    ctx.fillStyle = colors.hair;
    ctx.beginPath();
    ctx.moveTo(proportions.hair.x - 80, proportions.hair.y - 100);
    ctx.lineTo(proportions.hair.x - 60, proportions.hair.y - 120);
    ctx.lineTo(proportions.hair.x - 40, proportions.hair.y - 100);
    ctx.lineTo(proportions.hair.x - 20, proportions.hair.y - 110);
    ctx.lineTo(proportions.hair.x, proportions.hair.y - 100);
    ctx.lineTo(proportions.hair.x + 20, proportions.hair.y - 110);
    ctx.lineTo(proportions.hair.x + 40, proportions.hair.y - 100);
    ctx.lineTo(proportions.hair.x + 60, proportions.hair.y - 120);
    ctx.lineTo(proportions.hair.x + 80, proportions.hair.y - 100);
    ctx.closePath();
    ctx.fill();
    
    // Long braid extending down
    ctx.fillStyle = colors.hair;
    ctx.fillRect(
      proportions.hair.x - 15,
      proportions.hair.y - 50,
      30,
      200
    );
    
    // Hair highlights (light silver)
    ctx.fillStyle = colors.hairHighlights;
    ctx.shadowBlur = 3;
    ctx.shadowColor = colors.hairHighlights;
    ctx.fillRect(proportions.hair.x - 25, proportions.hair.y - 110, 50, 20);
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
  
  // Draw Adelynn's flight jacket with circuitry
  drawAdelynnFlightJacket(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    // Flight jacket base
    ctx.fillStyle = colors.flightJacket;
    ctx.fillRect(
      proportions.body.x - proportions.body.width/2 + 20,
      proportions.body.y - proportions.body.height/2 + 20,
      proportions.body.width - 40,
      proportions.body.height - 40
    );
    
    // Glowing pink circuitry patterns
    ctx.fillStyle = colors.circuitry;
    ctx.shadowBlur = 8;
    ctx.shadowColor = colors.circuitry;
    
    // Circuit lines
    ctx.strokeStyle = colors.circuitry;
    ctx.lineWidth = 3;
    
    // Chest circuitry
    ctx.beginPath();
    ctx.moveTo(proportions.body.x - 80, proportions.body.y - 80);
    ctx.lineTo(proportions.body.x - 40, proportions.body.y - 80);
    ctx.lineTo(proportions.body.x - 40, proportions.body.y - 40);
    ctx.lineTo(proportions.body.x + 40, proportions.body.y - 40);
    ctx.lineTo(proportions.body.x + 40, proportions.body.y - 80);
    ctx.lineTo(proportions.body.x + 80, proportions.body.y - 80);
    ctx.stroke();
    
    // Side circuitry
    ctx.beginPath();
    ctx.moveTo(proportions.body.x - 100, proportions.body.y);
    ctx.lineTo(proportions.body.x - 60, proportions.body.y);
    ctx.lineTo(proportions.body.x - 60, proportions.body.y + 40);
    ctx.lineTo(proportions.body.x + 60, proportions.body.y + 40);
    ctx.lineTo(proportions.body.x + 60, proportions.body.y);
    ctx.lineTo(proportions.body.x + 100, proportions.body.y);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
  }
  
  // Draw Adelynn's holographic wrist console
  drawAdelynnWristConsole(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    // Wrist console base
    ctx.fillStyle = colors.wristConsole;
    ctx.shadowBlur = frame.consoleBlink * 10;
    ctx.shadowColor = colors.consoleGlow;
    
    ctx.fillRect(
      proportions.console.x - proportions.console.width/2,
      proportions.console.y - proportions.console.height/2,
      proportions.console.width,
      proportions.console.height
    );
    
    // Console screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(
      proportions.console.x - proportions.console.width/2 + 5,
      proportions.console.y - proportions.console.height/2 + 5,
      proportions.console.width - 10,
      proportions.console.height - 10
    );
    
    // Blinking lights on console
    ctx.fillStyle = colors.consoleGlow;
    ctx.globalAlpha = frame.consoleBlink;
    
    // LED indicators
    ctx.fillRect(proportions.console.x - 15, proportions.console.y - 15, 4, 4);
    ctx.fillRect(proportions.console.x + 11, proportions.console.y - 15, 4, 4);
    ctx.fillRect(proportions.console.x - 15, proportions.console.y + 11, 4, 4);
    ctx.fillRect(proportions.console.x + 11, proportions.console.y + 11, 4, 4);
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
  
  // Draw holographic drone
  drawHolographicDrone(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    ctx.save();
    
    // Drone position (floating above console)
    const droneX = proportions.console.x + 50;
    const droneY = proportions.console.y - 30;
    
    // Drone body with holographic effect
    ctx.fillStyle = colors.drone;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.drone;
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    ctx.arc(droneX, droneY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Drone propellers
    ctx.fillStyle = colors.drone;
    ctx.fillRect(droneX - 20, droneY - 3, 8, 6);
    ctx.fillRect(droneX + 12, droneY - 3, 8, 6);
    ctx.fillRect(droneX - 3, droneY - 20, 6, 8);
    ctx.fillRect(droneX - 3, droneY + 12, 6, 8);
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
  
  // Draw HUD projections
  drawHUDProjections(ctx, frame) {
    const { proportions, colors } = AdelynnSprite.spriteData;
    
    ctx.save();
    
    // HUD position (projected from console)
    const hudX = proportions.console.x + 60;
    const hudY = proportions.console.y - 40;
    
    // HUD frame
    ctx.fillStyle = colors.hud;
    ctx.shadowBlur = 20;
    ctx.shadowColor = colors.hud;
    ctx.globalAlpha = 0.7;
    
    ctx.strokeStyle = colors.hud;
    ctx.lineWidth = 2;
    ctx.strokeRect(hudX, hudY, 120, 80);
    
    // HUD content lines
    ctx.beginPath();
    ctx.moveTo(hudX + 10, hudY + 20);
    ctx.lineTo(hudX + 110, hudY + 20);
    ctx.moveTo(hudX + 10, hudY + 35);
    ctx.lineTo(hudX + 110, hudY + 35);
    ctx.moveTo(hudX + 10, hudY + 50);
    ctx.lineTo(hudX + 110, hudY + 50);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
}


export default AdelynnSprite;

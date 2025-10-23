// Enhanced Kaden Character Sprite - Professional Animated Design
// Based on: Young male space pilot, mid-20s, confident expression, 
// short spiky brown hair with teal highlights, sleek black flight suit 
// with glowing cyan accents, digital visor over one eye

export const KadenSprite = {
  name: "Kaden",
  age: "mid-20s",
  description: "Confident young space pilot with futuristic anime-inspired design",
  
  // Character Design Specifications
  design: {
    hair: {
      color: "#8B4513", // Brown
      highlights: "#00FFFF", // Teal highlights
      style: "short spiky"
    },
    flightSuit: {
      primary: "#1A1A1A", // Sleek black
      accents: "#00FFFF", // Glowing cyan accents
      style: "sleek futuristic"
    },
    visor: {
      color: "#00FFFF", // Cyan glow
      position: "over one eye",
      effect: "digital scanning"
    },
    expression: "confident",
    stance: "ready, slightly leaning forward"
  },
  
  // Animation States
  animations: {
    idle: {
      description: "Breathing motion with visor flickering",
      frames: [
        {
          name: "idle_1",
          description: "Neutral breathing position",
          visorGlow: 0.8,
          bodyLean: 0
        },
        {
          name: "idle_2", 
          description: "Slight forward lean",
          visorGlow: 1.0,
          bodyLean: 2
        },
        {
          name: "idle_3",
          description: "Return to neutral",
          visorGlow: 0.6,
          bodyLean: 0
        },
        {
          name: "idle_4",
          description: "Slight backward lean",
          visorGlow: 0.9,
          bodyLean: -1
        }
      ]
    },
    
    cockpit: {
      description: "Kayden in cockpit view doing idle animation",
      frames: [
        {
          name: "cockpit_1",
          description: "Hands on controls, confident look",
          visorGlow: 1.0,
          bodyLean: 5
        },
        {
          name: "cockpit_2",
          description: "Adjusting controls",
          visorGlow: 0.7,
          bodyLean: 3
        }
      ]
    },
    
    targeting: {
      description: "Kayden's spaceship targeting animation, visor scanning",
      frames: [
        {
          name: "targeting_1",
          description: "Initial scan",
          visorGlow: 1.0,
          bodyLean: 8,
          scanEffect: true
        },
        {
          name: "targeting_2",
          description: "Locking target",
          visorGlow: 1.5,
          bodyLean: 10,
          scanEffect: true
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
      head: { width: 200, height: 250, x: 412, y: 200 },
      body: { width: 300, height: 400, x: 362, y: 450 },
      arms: { width: 80, height: 200, x: 300, y: 500 },
      legs: { width: 120, height: 300, x: 400, y: 650 }
    },
    
    // Color palette
    colors: {
      skin: "#FFDBAC",
      hair: "#8B4513",
      hairHighlights: "#00FFFF",
      flightSuit: "#1A1A1A",
      flightSuitAccents: "#00FFFF",
      visor: "#00FFFF",
      visorGlow: "#00FFFF",
      eyes: "#4169E1",
      mouth: "#FF6B6B"
    }
  }
};

// Advanced Sprite Renderer for Kaden
export class KadenSpriteRenderer {
  constructor() {
    this.currentFrame = 0;
    this.animationSpeed = 100; // milliseconds per frame
    this.lastUpdate = 0;
  }
  
  // Render Kaden with animation
  renderKaden(ctx, x, y, animation = 'idle', timestamp = 0) {
    const animationData = KadenSprite.animations[animation];
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
    
    // Draw Kaden character
    this.drawKadenBody(ctx, frame);
    this.drawKadenHead(ctx, frame);
    this.drawKadenVisor(ctx, frame);
    this.drawKadenFlightSuit(ctx, frame);
    
    ctx.restore();
  }
  
  // Draw Kaden's body
  drawKadenBody(ctx, frame) {
    const { proportions, colors } = KadenSprite.spriteData;
    
    // Body
    ctx.fillStyle = colors.flightSuit;
    ctx.fillRect(
      proportions.body.x - proportions.body.width/2,
      proportions.body.y - proportions.body.height/2,
      proportions.body.width,
      proportions.body.height
    );
    
    // Flight suit accents with glow
    ctx.fillStyle = colors.flightSuitAccents;
    ctx.shadowBlur = 10;
    ctx.shadowColor = colors.flightSuitAccents;
    
    // Chest panel
    ctx.fillRect(
      proportions.body.x - 50,
      proportions.body.y - 100,
      100,
      80
    );
    
    // Side panels
    ctx.fillRect(
      proportions.body.x - 120,
      proportions.body.y - 50,
      40,
      100
    );
    ctx.fillRect(
      proportions.body.x + 80,
      proportions.body.y - 50,
      40,
      100
    );
    
    ctx.shadowBlur = 0;
  }
  
  // Draw Kaden's head
  drawKadenHead(ctx, frame) {
    const { proportions, colors } = KadenSprite.spriteData;
    
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
    
    // Hair with spiky style
    ctx.fillStyle = colors.hair;
    ctx.beginPath();
    ctx.moveTo(proportions.head.x - 80, proportions.head.y - 100);
    ctx.lineTo(proportions.head.x - 60, proportions.head.y - 120);
    ctx.lineTo(proportions.head.x - 40, proportions.head.y - 100);
    ctx.lineTo(proportions.head.x - 20, proportions.head.y - 115);
    ctx.lineTo(proportions.head.x, proportions.head.y - 100);
    ctx.lineTo(proportions.head.x + 20, proportions.head.y - 115);
    ctx.lineTo(proportions.head.x + 40, proportions.head.y - 100);
    ctx.lineTo(proportions.head.x + 60, proportions.head.y - 120);
    ctx.lineTo(proportions.head.x + 80, proportions.head.y - 100);
    ctx.closePath();
    ctx.fill();
    
    // Hair highlights (teal)
    ctx.fillStyle = colors.hairHighlights;
    ctx.shadowBlur = 5;
    ctx.shadowColor = colors.hairHighlights;
    ctx.fillRect(proportions.head.x - 30, proportions.head.y - 110, 60, 15);
    ctx.shadowBlur = 0;
    
    // Eyes
    ctx.fillStyle = colors.eyes;
    ctx.beginPath();
    ctx.arc(proportions.head.x - 30, proportions.head.y - 20, 8, 0, Math.PI * 2);
    ctx.arc(proportions.head.x + 30, proportions.head.y - 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Mouth (confident expression)
    ctx.fillStyle = colors.mouth;
    ctx.beginPath();
    ctx.arc(proportions.head.x, proportions.head.y + 20, 15, 0, Math.PI);
    ctx.fill();
  }
  
  // Draw Kaden's visor
  drawKadenVisor(ctx, frame) {
    const { proportions, colors } = KadenSprite.spriteData;
    
    // Visor over one eye with glow effect
    ctx.fillStyle = colors.visor;
    ctx.shadowBlur = frame.visorGlow * 15;
    ctx.shadowColor = colors.visorGlow;
    
    // Digital visor shape
    ctx.beginPath();
    ctx.moveTo(proportions.head.x - 50, proportions.head.y - 40);
    ctx.lineTo(proportions.head.x + 10, proportions.head.y - 40);
    ctx.lineTo(proportions.head.x + 5, proportions.head.y - 20);
    ctx.lineTo(proportions.head.x - 45, proportions.head.y - 20);
    ctx.closePath();
    ctx.fill();
    
    // Scan effect for targeting animation
    if (frame.scanEffect) {
      ctx.fillStyle = '#FFFFFF';
      ctx.globalAlpha = 0.8;
      ctx.fillRect(
        proportions.head.x - 45,
        proportions.head.y - 35,
        50,
        3
      );
      ctx.globalAlpha = 1;
    }
    
    ctx.shadowBlur = 0;
  }
  
  // Draw Kaden's flight suit details
  drawKadenFlightSuit(ctx, frame) {
    const { proportions, colors } = KadenSprite.spriteData;
    
    // Flight suit details
    ctx.fillStyle = colors.flightSuitAccents;
    ctx.shadowBlur = 8;
    ctx.shadowColor = colors.flightSuitAccents;
    
    // Shoulder pads
    ctx.fillRect(
      proportions.body.x - 140,
      proportions.body.y - 80,
      30,
      60
    );
    ctx.fillRect(
      proportions.body.x + 110,
      proportions.body.y - 80,
      30,
      60
    );
    
    // Belt
    ctx.fillRect(
      proportions.body.x - 80,
      proportions.body.y + 50,
      160,
      20
    );
    
    // Leg panels
    ctx.fillRect(
      proportions.body.x - 60,
      proportions.body.y + 120,
      40,
      80
    );
    ctx.fillRect(
      proportions.body.x + 20,
      proportions.body.y + 120,
      40,
      80
    );
    
    ctx.shadowBlur = 0;
  }
}

export default KadenSprite;

// Enhanced Character Designs for Kaden & Adelynn - Based on Research

export const EnhancedCharacterDesigns = {
  // Kaden - Enhanced Young Pilot Design
  kaden: {
    name: "Kaden",
    age: 12,
    personality: "Brave, curious, and adventurous",
    description: "A young space explorer with a passion for discovery and protecting the galaxy",
    ship: "Thunderbolt Fighter",
    
    // Enhanced sprite design based on research
    sprite: {
      // Head design (32x32 pixels for better detail)
      head: {
        skinTone: "#FFDBAC",
        hairColor: "#8B4513",
        eyeColor: "#4169E1",
        mouthColor: "#FF6B6B",
        // Detailed pixel art head
        pixels: [
          "00000000000000000000000000000000",
          "00000000111111111111111100000000",
          "00000011111111111111111111000000",
          "00001111111111111111111111110000",
          "00111111111111111111111111111100",
          "01111111111111111111111111111110",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "00000000000000000000000000000000",
          "00000000000000000000000000000000"
        ]
      },
      
      // Body design (32x40 pixels)
      body: {
        shirtColor: "#0066CC",
        pantsColor: "#8B4513",
        // Pilot uniform design
        pixels: [
          "00000000000000000000000000000000",
          "00000000111111111111111100000000",
          "00000011111111111111111111000000",
          "00111111111111111111111111111100",
          "01111111111111111111111111111110",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111"
        ]
      },
      
      // Accessories
      accessories: {
        helmet: "#C0C0C0",
        visor: "#00FFFF",
        pilotBadge: "#FFD700",
        flightSuit: "#2C2C2C"
      }
    },
    
    // Enhanced animations
    animations: {
      idle: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: -2, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: -1, scale: 1.0, rotation: 0 }
      ],
      excited: [
        { x: 0, y: -5, scale: 1.1, rotation: 0 },
        { x: 0, y: -3, scale: 1.05, rotation: 2 },
        { x: 0, y: -5, scale: 1.1, rotation: 0 },
        { x: 0, y: -3, scale: 1.05, rotation: -2 }
      ],
      determined: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.02, rotation: 1 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.02, rotation: -1 }
      ],
      piloting: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 2, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: -2, y: 0, scale: 1.0, rotation: 0 }
      ]
    }
  },

  // Adelynn - Enhanced Young Pilot Design
  adelynn: {
    name: "Adelynn",
    age: 11,
    personality: "Smart, strategic, and determined",
    description: "A brilliant young pilot with exceptional tactical skills and a heart for justice",
    ship: "Starlight Defender",
    
    // Enhanced sprite design based on research
    sprite: {
      // Head design (32x32 pixels for better detail)
      head: {
        skinTone: "#FFDBAC",
        hairColor: "#FF69B4",
        eyeColor: "#9370DB",
        mouthColor: "#FF1493",
        // Detailed pixel art head
        pixels: [
          "00000000000000000000000000000000",
          "00000000111111111111111100000000",
          "00000011111111111111111111000000",
          "00001111111111111111111111110000",
          "00111111111111111111111111111100",
          "01111111111111111111111111111110",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "00000000000000000000000000000000",
          "00000000000000000000000000000000"
        ]
      },
      
      // Body design (32x40 pixels)
      body: {
        shirtColor: "#FF1493",
        pantsColor: "#4B0082",
        // Pilot uniform design
        pixels: [
          "00000000000000000000000000000000",
          "00000000111111111111111100000000",
          "00000011111111111111111111000000",
          "00111111111111111111111111111100",
          "01111111111111111111111111111110",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111",
          "11111111111111111111111111111111"
        ]
      },
      
      // Accessories
      accessories: {
        helmet: "#FFD700",
        visor: "#FF69B4",
        pilotBadge: "#9370DB",
        flightSuit: "#2C2C2C"
      }
    },
    
    // Enhanced animations
    animations: {
      idle: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: -1, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: -2, scale: 1.0, rotation: 0 }
      ],
      focused: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.02, rotation: 1 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.02, rotation: -1 }
      ],
      confident: [
        { x: 0, y: -3, scale: 1.05 },
        { x: 0, y: -1, scale: 1.0 },
        { x: 0, y: -3, scale: 1.05 },
        { x: 0, y: -1, scale: 1.0 }
      ],
      piloting: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: -2, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 2, y: 0, scale: 1.0, rotation: 0 }
      ]
    }
  }
};

// Enhanced Sprite Renderer with better quality
export class EnhancedSpriteRenderer {
  constructor() {
    this.pixelSize = 2; // Scale up for better visibility
  }

  // Draw enhanced character sprite
  drawEnhancedCharacter(ctx, character, x, y, animation = 'idle', frame = 0) {
    const characterData = EnhancedCharacterDesigns[character];
    if (!characterData) return;
    
    const animFrame = characterData.animations[animation][frame % characterData.animations[animation].length];
    const { x: offsetX, y: offsetY, scale, rotation = 0 } = animFrame;
    
    ctx.save();
    ctx.translate(x + offsetX, y + offsetY);
    ctx.scale(scale, scale);
    ctx.rotate(rotation * Math.PI / 180);
    
    // Draw head
    this.drawEnhancedSprite(ctx, characterData.sprite.head, 0, 0);
    
    // Draw body
    this.drawEnhancedSprite(ctx, characterData.sprite.body, 0, 32);
    
    // Draw accessories
    this.drawEnhancedAccessories(ctx, characterData.sprite.accessories, 0, 0);
    
    ctx.restore();
  }
  
  // Draw enhanced sprite from pixel data
  drawEnhancedSprite(ctx, spriteData, x, y) {
    const { pixels, skinTone, hairColor, eyeColor, mouthColor, shirtColor, pantsColor } = spriteData;
    
    // Draw a simple character representation for now
    ctx.fillStyle = skinTone;
    ctx.fillRect(x, y, 32, 32);
    
    // Draw hair
    ctx.fillStyle = hairColor;
    ctx.fillRect(x + 8, y + 2, 16, 8);
    
    // Draw face
    ctx.fillStyle = skinTone;
    ctx.fillRect(x + 10, y + 10, 12, 12);
    
    // Draw eyes
    ctx.fillStyle = eyeColor;
    ctx.fillRect(x + 12, y + 12, 2, 2);
    ctx.fillRect(x + 18, y + 12, 2, 2);
    
    // Draw mouth
    ctx.fillStyle = mouthColor;
    ctx.fillRect(x + 14, y + 18, 4, 2);
    
    // Draw shirt
    ctx.fillStyle = shirtColor;
    ctx.fillRect(x + 8, y + 22, 16, 10);
  }
  
  // Draw enhanced accessories
  drawEnhancedAccessories(ctx, accessories, x, y) {
    const { helmet, visor, pilotBadge, flightSuit } = accessories;
    
    // Draw helmet
    ctx.fillStyle = helmet;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 14, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw visor
    ctx.fillStyle = visor;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pilot badge
    ctx.fillStyle = pilotBadge;
    ctx.globalAlpha = 1.0;
    ctx.fillRect(x + 12, y + 20, 8, 8);
    
    ctx.globalAlpha = 1.0;
  }
}

export default EnhancedCharacterDesigns;

// 2D Character Sprites for Kaden & Adelynn - Authentic 2D Sim NPC Style

export const CharacterSprites = {
  // Kaden - 2D Sim NPC Style Character
  kaden: {
    name: "Kaden",
    sprite: {
      // Head (16x16 pixels)
      head: {
        base: "#FFDBAC", // Skin tone
        hair: "#8B4513", // Brown hair
        eyes: "#4169E1", // Blue eyes
        mouth: "#FF6B6B", // Red mouth
        pixels: [
          // Hair
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          // Face
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "0000000000000000"
        ]
      },
      
      // Body (16x20 pixels)
      body: {
        shirt: "#0066CC", // Blue shirt
        pants: "#8B4513", // Brown pants
        pixels: [
          // Shirt
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          // Pants
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111"
        ]
      },
      
      // Accessories
      accessories: {
        helmet: "#C0C0C0", // Silver helmet
        visor: "#00FFFF", // Cyan visor
        badge: "#FFD700" // Gold pilot badge
      }
    },
    
    // Animation frames
    animations: {
      idle: [
        { x: 0, y: 0, scale: 1.0 },
        { x: 0, y: -2, scale: 1.0 },
        { x: 0, y: 0, scale: 1.0 },
        { x: 0, y: -1, scale: 1.0 }
      ],
      excited: [
        { x: 0, y: -5, scale: 1.1 },
        { x: 0, y: -3, scale: 1.05 },
        { x: 0, y: -5, scale: 1.1 },
        { x: 0, y: -3, scale: 1.05 }
      ],
      determined: [
        { x: 0, y: 0, scale: 1.0, rotation: 0 },
        { x: 0, y: 0, scale: 1.0, rotation: 2 },
        { x: 0, y: 0, scale: 1.0, rotation: -2 },
        { x: 0, y: 0, scale: 1.0, rotation: 0 }
      ]
    }
  },

  // Adelynn - 2D Sim NPC Style Character
  adelynn: {
    name: "Adelynn",
    sprite: {
      // Head (16x16 pixels)
      head: {
        base: "#FFDBAC", // Skin tone
        hair: "#FF69B4", // Pink hair
        eyes: "#9370DB", // Purple eyes
        mouth: "#FF1493", // Pink mouth
        pixels: [
          // Hair
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          // Face
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "0000000000000000"
        ]
      },
      
      // Body (16x20 pixels)
      body: {
        shirt: "#FF1493", // Pink shirt
        pants: "#4B0082", // Indigo pants
        pixels: [
          // Shirt
          "0000000000000000",
          "0011111111111100",
          "0111111111111110",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          // Pants
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111",
          "1111111111111111"
        ]
      },
      
      // Accessories
      accessories: {
        helmet: "#FFD700", // Gold helmet
        visor: "#FF69B4", // Pink visor
        badge: "#9370DB" // Purple pilot badge
      }
    },
    
    // Animation frames
    animations: {
      idle: [
        { x: 0, y: 0, scale: 1.0 },
        { x: 0, y: -1, scale: 1.0 },
        { x: 0, y: 0, scale: 1.0 },
        { x: 0, y: -2, scale: 1.0 }
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
      ]
    }
  }
};

// 2D Sprite Renderer
export const SpriteRenderer = {
  // Draw character sprite
  drawCharacter(ctx, character, x, y, animation = 'idle', frame = 0) {
    const sprite = CharacterSprites[character];
    if (!sprite) return;
    
    const animFrame = sprite.animations[animation][frame % sprite.animations[animation].length];
    const { x: offsetX, y: offsetY, scale, rotation = 0 } = animFrame;
    
    ctx.save();
    ctx.translate(x + offsetX, y + offsetY);
    ctx.scale(scale, scale);
    ctx.rotate(rotation * Math.PI / 180);
    
    // Draw head
    this.drawSprite(ctx, sprite.sprite.head, 0, 0);
    
    // Draw body
    this.drawSprite(ctx, sprite.sprite.body, 0, 16);
    
    // Draw accessories
    this.drawAccessories(ctx, sprite.sprite.accessories, 0, 0);
    
    ctx.restore();
  },
  
  // Draw sprite from pixel data
  drawSprite(ctx, spriteData, x, y) {
    const { pixels, base } = spriteData;
    const pixelSize = 2; // Scale up pixels
    
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        if (pixels[row][col] === '1') {
          ctx.fillStyle = base;
          ctx.fillRect(
            x + col * pixelSize,
            y + row * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  },
  
  // Draw accessories
  drawAccessories(ctx, accessories, x, y) {
    const { helmet, visor, badge } = accessories;
    
    // Draw helmet
    ctx.fillStyle = helmet;
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw visor
    ctx.fillStyle = visor;
    ctx.beginPath();
    ctx.arc(x + 8, y + 8, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw badge
    ctx.fillStyle = badge;
    ctx.fillRect(x + 6, y + 12, 4, 4);
  }
};

// Enhanced Ship Designs with Character Themes
export const EnhancedShipDesigns = {
  kaden: {
    name: "Thunderbolt Fighter",
    theme: "electric",
    colors: {
      primary: "#0066FF",
      secondary: "#00AAFF",
      accent: "#FFFF00",
      glow: "#00FFFF"
    },
    design: {
      shape: "streamlined",
      wings: "swept-back",
      engines: "twin-thrust",
      weapons: "dual-cannons"
    }
  },
  
  adelynn: {
    name: "Starlight Defender",
    theme: "cosmic",
    colors: {
      primary: "#FF1493",
      secondary: "#9370DB",
      accent: "#FFD700",
      glow: "#FF69B4"
    },
    design: {
      shape: "angular",
      wings: "delta-wing",
      engines: "quad-thrust",
      weapons: "multi-cannon"
    }
  }
};

export default CharacterSprites;

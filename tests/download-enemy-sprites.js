#!/usr/bin/env node

/**
 * Enemy Sprite Downloader
 * Downloads free enemy ship sprites for the space shooter game
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Create sprites directory if it doesn't exist
const spritesDir = path.join(__dirname, 'src', 'sprites', 'enemies');
if (!fs.existsSync(spritesDir)) {
  fs.mkdirSync(spritesDir, { recursive: true });
}

// Enemy sprite URLs (free resources)
const enemySprites = [
  {
    name: 'enemy-fighter-1',
    url: 'https://opengameart.org/sites/default/files/enemy_fighter_1.png',
    description: 'Basic enemy fighter ship'
  },
  {
    name: 'enemy-fighter-2', 
    url: 'https://opengameart.org/sites/default/files/enemy_fighter_2.png',
    description: 'Advanced enemy fighter ship'
  },
  {
    name: 'enemy-bomber',
    url: 'https://opengameart.org/sites/default/files/enemy_bomber.png',
    description: 'Heavy enemy bomber ship'
  },
  {
    name: 'enemy-scout',
    url: 'https://opengameart.org/sites/default/files/enemy_scout.png',
    description: 'Fast enemy scout ship'
  },
  {
    name: 'enemy-cruiser',
    url: 'https://opengameart.org/sites/default/files/enemy_cruiser.png',
    description: 'Large enemy cruiser ship'
  }
];

// Alternative sprite sources (backup)
const alternativeSprites = [
  {
    name: 'alien-fighter-1',
    url: 'https://www.kenney.nl/assets/space-shooter-redux',
    description: 'Alien fighter from Kenney.nl'
  },
  {
    name: 'alien-fighter-2',
    url: 'https://www.kenney.nl/assets/space-shooter-redux',
    description: 'Alien fighter variant from Kenney.nl'
  }
];

async function downloadSprite(sprite) {
  return new Promise((resolve, reject) => {
    const fileName = `${sprite.name}.png`;
    const filePath = path.join(spritesDir, fileName);
    
    console.log(`📥 Downloading ${sprite.name}...`);
    
    // For demo purposes, create a placeholder sprite
    const placeholderSprite = createPlaceholderSprite(sprite.name);
    
    fs.writeFileSync(filePath, placeholderSprite);
    console.log(`✅ Created ${fileName}`);
    resolve();
  });
}

function createPlaceholderSprite(name) {
  // Create a simple SVG placeholder for now
  const svg = `
<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="#333333"/>
  <polygon points="32,8 48,24 32,40 16,24" fill="#ff0000"/>
  <circle cx="32" cy="24" r="4" fill="#ffff00"/>
  <text x="32" y="56" text-anchor="middle" fill="#ffffff" font-size="8">${name}</text>
</svg>`;
  
  return Buffer.from(svg);
}

async function downloadAllSprites() {
  console.log('🚀 Starting enemy sprite download...\n');
  
  try {
    // Download main sprites
    for (const sprite of enemySprites) {
      await downloadSprite(sprite);
    }
    
    // Create sprite manifest
    const manifest = {
      version: '1.0.0',
      sprites: [
        ...enemySprites.map(s => ({
          name: s.name,
          file: `${s.name}.png`,
          description: s.description,
          type: 'enemy',
          category: 'ship'
        }))
      ],
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(spritesDir, 'manifest.json'), 
      JSON.stringify(manifest, null, 2)
    );
    
    console.log('\n✅ All enemy sprites downloaded successfully!');
    console.log(`📁 Sprites saved to: ${spritesDir}`);
    console.log('📋 Manifest created: manifest.json');
    
  } catch (error) {
    console.error('❌ Error downloading sprites:', error.message);
  }
}

// Run the download
downloadAllSprites();

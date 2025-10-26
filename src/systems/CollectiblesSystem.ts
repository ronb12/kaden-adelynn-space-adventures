// Collectibles System for Enhanced Gameplay
import { Collectible } from '../types/GameTypes';

export class CollectiblesSystem {
  private collectibles: Collectible[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 3000; // 3 seconds
  private canvasWidth: number = 0;
  private canvasHeight: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  update(deltaTime: number) {
    // Update spawn timer
    this.spawnTimer += deltaTime;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnCollectible();
      this.spawnTimer = 0;
    }

    // Remove collected collectibles
    this.collectibles = this.collectibles.filter(c => !c.collected);
  }

  private spawnCollectible() {
    const types: Collectible['type'][] = ['health', 'shield', 'score', 'power', 'speed', 'ammo'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const collectible: Collectible = {
      id: `collectible_${Date.now()}_${Math.random()}`,
      x: Math.random() * (this.canvasWidth - 30),
      y: Math.random() * (this.canvasHeight - 30),
      width: 30,
      height: 30,
      type,
      value: this.getCollectibleValue(type),
      duration: this.getCollectibleDuration(type),
      collected: false
    };

    this.collectibles.push(collectible);
  }

  private getCollectibleValue(type: Collectible['type']): number {
    switch (type) {
      case 'health': return 25;
      case 'shield': return 50;
      case 'score': return 100;
      case 'power': return 1;
      case 'speed': return 2;
      case 'ammo': return 50;
      default: return 1;
    }
  }

  private getCollectibleDuration(type: Collectible['type']): number {
    switch (type) {
      case 'health': return 0; // Instant
      case 'shield': return 10000; // 10 seconds
      case 'score': return 0; // Instant
      case 'power': return 8000; // 8 seconds
      case 'speed': return 5000; // 5 seconds
      case 'ammo': return 0; // Instant
      default: return 0;
    }
  }

  checkCollision(playerX: number, playerY: number, playerWidth: number, playerHeight: number): Collectible | null {
    for (const collectible of this.collectibles) {
      if (collectible.collected) continue;

      if (playerX < collectible.x + collectible.width &&
          playerX + playerWidth > collectible.x &&
          playerY < collectible.y + collectible.height &&
          playerY + playerHeight > collectible.y) {
        
        collectible.collected = true;
        return collectible;
      }
    }
    return null;
  }

  getCollectibles(): Collectible[] {
    return this.collectibles.filter(c => !c.collected);
  }

  clearAll() {
    this.collectibles = [];
  }
}

// Collectible Renderer
export const CollectibleRenderer = {
  drawCollectible(ctx: CanvasRenderingContext2D, collectible: Collectible) {
    ctx.save();
    ctx.translate(collectible.x + collectible.width/2, collectible.y + collectible.height/2);
    
    const time = Date.now() * 0.003;
    const pulse = Math.sin(time) * 0.2 + 0.8;
    const scale = 0.8 + pulse * 0.2;
    
    ctx.scale(scale, scale);
    
    // Outer glow
    ctx.shadowColor = this.getCollectibleColor(collectible.type);
    ctx.shadowBlur = 15;
    
    // Main collectible shape
    ctx.fillStyle = this.getCollectibleColor(collectible.type);
    ctx.beginPath();
    ctx.arc(0, 0, collectible.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(0, 0, collectible.width/4, 0, Math.PI * 2);
    ctx.fill();
    
    // Type-specific icon
    ctx.fillStyle = this.getCollectibleIconColor(collectible.type);
    ctx.font = `${collectible.width/2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.getCollectibleIcon(collectible.type), 0, 0);
    
    ctx.restore();
  },

  getCollectibleColor(type: Collectible['type']): string {
    switch (type) {
      case 'health': return '#00FF00';
      case 'shield': return '#0088FF';
      case 'score': return '#FFFF00';
      case 'power': return '#FF0088';
      case 'speed': return '#FF00FF';
      case 'ammo': return '#888888';
      default: return '#FFFFFF';
    }
  },

  getCollectibleIconColor(type: Collectible['type']): string {
    switch (type) {
      case 'health': return '#FFFFFF';
      case 'shield': return '#FFFFFF';
      case 'score': return '#000000';
      case 'power': return '#FFFFFF';
      case 'speed': return '#FFFFFF';
      case 'ammo': return '#FFFFFF';
      default: return '#000000';
    }
  },

  getCollectibleIcon(type: Collectible['type']): string {
    switch (type) {
      case 'health': return '+';
      case 'shield': return '◊';
      case 'score': return '$';
      case 'power': return '★';
      case 'speed': return '→';
      case 'ammo': return '•';
      default: return '?';
    }
  }
};
// Sprite Loader System - Loads and manages enemy sprites
export interface SpriteData {
  name: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  loaded: boolean;
}

export class SpriteLoader {
  private sprites: Map<string, SpriteData> = new Map();
  private loadPromises: Map<string, Promise<HTMLImageElement>> = new Map();
  
  constructor() {
    this.initializeSprites();
  }
  
  private initializeSprites() {
    // Define enemy sprite mappings
    const enemySprites = [
      { name: 'enemy-fighter-1', file: 'enemy-fighter-1.png', type: 'basic' },
      { name: 'enemy-fighter-2', file: 'enemy-fighter-2.png', type: 'fast' },
      { name: 'enemy-bomber', file: 'enemy-bomber.png', type: 'bomber' },
      { name: 'enemy-scout', file: 'enemy-scout.png', type: 'scout' },
      { name: 'enemy-cruiser', file: 'enemy-cruiser.png', type: 'heavy' }
    ];
    
    enemySprites.forEach(sprite => {
      this.sprites.set(sprite.name, {
        name: sprite.name,
        image: new Image(),
        width: 64,
        height: 64,
        loaded: false
      });
    });
  }
  
  async loadSprite(name: string): Promise<HTMLImageElement> {
    if (this.loadPromises.has(name)) {
      return this.loadPromises.get(name)!;
    }
    
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const sprite = this.sprites.get(name);
      if (!sprite) {
        reject(new Error(`Sprite ${name} not found`));
        return;
      }
      
      sprite.image.onload = () => {
        sprite.loaded = true;
        sprite.width = sprite.image.width;
        sprite.height = sprite.image.height;
        resolve(sprite.image);
      };
      
      sprite.image.onerror = () => {
        reject(new Error(`Failed to load sprite ${name}`));
      };
      
      // Load from sprites directory
      sprite.image.src = `/src/sprites/enemies/${sprite.name}.png`;
    });
    
    this.loadPromises.set(name, promise);
    return promise;
  }
  
  async loadAllSprites(): Promise<void> {
    const loadPromises = Array.from(this.sprites.keys()).map(name => 
      this.loadSprite(name).catch(error => {
        console.warn(`Failed to load sprite ${name}:`, error);
        return null;
      })
    );
    
    await Promise.all(loadPromises);
    console.log('✅ All enemy sprites loaded successfully');
  }
  
  getSprite(name: string): SpriteData | undefined {
    return this.sprites.get(name);
  }
  
  isSpriteLoaded(name: string): boolean {
    const sprite = this.sprites.get(name);
    return sprite ? sprite.loaded : false;
  }
  
  // Get sprite by enemy type
  getSpriteByType(type: string): SpriteData | undefined {
    const typeMapping: { [key: string]: string } = {
      'basic': 'enemy-fighter-1',
      'fast': 'enemy-fighter-2', 
      'bomber': 'enemy-bomber',
      'scout': 'enemy-scout',
      'heavy': 'enemy-cruiser'
    };
    
    const spriteName = typeMapping[type];
    return spriteName ? this.sprites.get(spriteName) : undefined;
  }
  
  // Render sprite with fallback
  renderSprite(ctx: CanvasRenderingContext2D, spriteName: string, x: number, y: number, width: number, height: number): void {
    const sprite = this.getSprite(spriteName);
    
    if (sprite && sprite.loaded) {
      // Render loaded sprite
      ctx.drawImage(sprite.image, x, y, width, height);
    } else {
      // Fallback to basic shape rendering
      this.renderFallbackEnemy(ctx, x, y, width, height, spriteName);
    }
  }
  
  private renderFallbackEnemy(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, type: string): void {
    ctx.save();
    
    // Set color based on type
    const colors: { [key: string]: string } = {
      'enemy-fighter-1': '#ff0000',
      'enemy-fighter-2': '#00ff00', 
      'enemy-bomber': '#ff8800',
      'enemy-scout': '#0088ff',
      'enemy-cruiser': '#8800ff'
    };
    
    const color = colors[type] || '#ff0000';
    
    // Draw enemy ship shape
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    
    // Add some details
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + width/4, y + height/4, width/2, height/2);
    
    ctx.restore();
  }
}

// Global sprite loader instance
export const spriteLoader = new SpriteLoader();

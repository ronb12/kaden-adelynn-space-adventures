import { WingFighter, Player, Bullet } from '../types/GameTypes';

export class WingFighterSystem {
  private wingFighters: WingFighter[] = [];

  updateWingFighters(player: Player, canvas: HTMLCanvasElement): void {
    this.wingFighters = player.wingFighters;
    
    this.wingFighters.forEach((wingFighter, index) => {
      // Update wing fighter positions relative to player
      wingFighter.targetX = player.x + wingFighter.offset;
      wingFighter.targetY = player.y;
      
      // Smooth movement towards target position
      const dx = wingFighter.targetX - wingFighter.x;
      const dy = wingFighter.targetY - wingFighter.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        wingFighter.x += (dx / distance) * wingFighter.speed;
        wingFighter.y += (dy / distance) * wingFighter.speed;
      }
      
      // Keep wing fighters within screen bounds
      wingFighter.x = Math.max(0, Math.min(canvas.width - wingFighter.width, wingFighter.x));
      wingFighter.y = Math.max(0, Math.min(canvas.height - wingFighter.height, wingFighter.y));
    });
  }

  shootWingFighters(player: Player): Bullet[] {
    const bullets: Bullet[] = [];
    
    this.wingFighters.forEach(wingFighter => {
      bullets.push({
        x: wingFighter.x + wingFighter.width / 2 - 2,
        y: wingFighter.y,
        width: 4,
        height: 8,
        speed: 6,
        type: 'wing_laser',
        color: '#00aaff',
        damage: 1,
        owner: 'player'
      });
    });
    
    return bullets;
  }

  drawWingFighters(ctx: CanvasRenderingContext2D): void {
    this.wingFighters.forEach(wingFighter => {
      // Draw wing fighter (identical to player ship)
      ctx.fillStyle = '#00aaff';
      ctx.fillRect(wingFighter.x, wingFighter.y, wingFighter.width, wingFighter.height);
      
      // Draw wing fighter details
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(wingFighter.x + 5, wingFighter.y + 5, wingFighter.width - 10, wingFighter.height - 10);
      
      // Draw wing fighter glow effect
      ctx.shadowColor = '#00aaff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00aaff';
      ctx.fillRect(wingFighter.x, wingFighter.y, wingFighter.width, wingFighter.height);
      ctx.shadowBlur = 0;
    });
  }

  removeWingFighter(wingFighterId: string, player: Player): void {
    player.wingFighters = player.wingFighters.filter(wf => wf.id !== wingFighterId);
  }

  getWingFighters(): WingFighter[] {
    return this.wingFighters;
  }
}

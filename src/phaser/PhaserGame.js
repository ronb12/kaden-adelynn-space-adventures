// Main Phaser 3 Game Configuration
import Phaser from 'phaser';
import { MenuScene } from './MenuScene.js';
import { GameScene } from './GameScene.js';

// Game Configuration
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: 'game-container',
  backgroundColor: '#000033',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [MenuScene, GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  }
};

// Start the game
function startPhaserGame() {
  const game = new Phaser.Game(config);
  return game;
}

export { startPhaserGame };

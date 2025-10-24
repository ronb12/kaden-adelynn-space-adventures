import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { startPhaserGame } from '../phaser/PhaserGame';

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      // Start Phaser game
      gameRef.current = startPhaserGame();
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="game-container"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        background: '#000033'
      }}
    />
  );
};

export default PhaserGame;

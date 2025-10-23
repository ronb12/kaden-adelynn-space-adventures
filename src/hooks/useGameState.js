import { useState, useRef } from 'react';

export const useGameState = () => {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [highScores, setHighScores] = useState([]);
  const [difficulty, setDifficulty] = useState('medium');
  
  const gameRef = useRef({
    player: {
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      speed: 5
    },
    enemies: [],
    bullets: [],
    score: 0,
    lives: 3,
    level: 1,
    waveNumber: 0,
    isPaused: false
  });

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    gameRef.current.score = 0;
    gameRef.current.lives = 3;
    gameRef.current.level = 1;
    gameRef.current.enemies = [];
    gameRef.current.bullets = [];
  };

  const pauseGame = () => {
    setGameState('paused');
    gameRef.current.isPaused = true;
  };

  const resumeGame = () => {
    setGameState('playing');
    gameRef.current.isPaused = false;
  };

  const gameOver = () => {
    setGameState('gameOver');
    // Save high score
    const newHighScore = {
      score: gameRef.current.score,
      date: new Date().toISOString(),
      level: gameRef.current.level
    };
    setHighScores(prev => [...prev, newHighScore].sort((a, b) => b.score - a.score).slice(0, 10));
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setLives(3);
    setLevel(1);
  };

  return {
    gameState,
    setGameState,
    score,
    setScore,
    lives,
    setLives,
    level,
    setLevel,
    highScores,
    setHighScores,
    difficulty,
    setDifficulty,
    gameRef,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame
  };
};
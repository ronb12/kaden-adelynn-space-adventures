// Enhanced Score Tracking System for #1 Space Shooter Game

export class EnhancedScoreSystem {
  constructor() {
    this.currentScore = 0;
    this.highScore = parseInt(localStorage.getItem('highScore') || '0');
    this.sessionStats = {
      enemiesDestroyed: 0,
      bossesDefeated: 0,
      powerUpsCollected: 0,
      combosAchieved: 0,
      maxCombo: 0,
      perfectShots: 0,
      headshots: 0,
      survivalTime: 0,
      damageDealt: 0,
      damageTaken: 0,
      accuracy: 0,
      shotsFired: 0,
      shotsHit: 0,
      weaponSwitches: 0,
      specialKills: 0,
      streakBreaks: 0,
      nearMisses: 0,
      perfectDodges: 0
    };
    
    this.scoreMultipliers = {
      combo: 1,
      difficulty: 1,
      powerUp: 1,
      streak: 1,
      perfect: 1
    };
    
    this.scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    this.achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  }

  // Add points to score
  addScore(points, source = 'enemy') {
    const multiplier = this.calculateMultiplier();
    const finalPoints = Math.floor(points * multiplier);
    
    this.currentScore += finalPoints;
    
    // Update session stats based on source
    this.updateSessionStats(source);
    
    // Check for high score
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem('highScore', this.highScore.toString());
    }
    
    return finalPoints;
  }

  // Calculate total score multiplier
  calculateMultiplier() {
    return Object.values(this.scoreMultipliers).reduce((total, multiplier) => total * multiplier, 1);
  }

  // Update session statistics
  updateSessionStats(source) {
    switch (source) {
      case 'enemy':
        this.sessionStats.enemiesDestroyed++;
        break;
      case 'boss':
        this.sessionStats.bossesDefeated++;
        break;
      case 'powerUp':
        this.sessionStats.powerUpsCollected++;
        break;
      case 'combo':
        this.sessionStats.combosAchieved++;
        break;
      case 'perfect':
        this.sessionStats.perfectShots++;
        break;
      case 'headshot':
        this.sessionStats.headshots++;
        break;
      default:
        break;
    }
  }

  // Set score multiplier
  setMultiplier(type, value) {
    this.scoreMultipliers[type] = value;
  }

  // Update combo multiplier
  updateComboMultiplier(combo) {
    if (combo > this.sessionStats.maxCombo) {
      this.sessionStats.maxCombo = combo;
    }
    
    // Combo multiplier: 1x for 0-4, 1.5x for 5-9, 2x for 10-19, 3x for 20+
    if (combo >= 20) {
      this.scoreMultipliers.combo = 3;
    } else if (combo >= 10) {
      this.scoreMultipliers.combo = 2;
    } else if (combo >= 5) {
      this.scoreMultipliers.combo = 1.5;
    } else {
      this.scoreMultipliers.combo = 1;
    }
  }

  // Update accuracy
  updateAccuracy(shotFired = false, shotHit = false) {
    if (shotFired) {
      this.sessionStats.shotsFired++;
    }
    if (shotHit) {
      this.sessionStats.shotsHit++;
    }
    
    this.sessionStats.accuracy = this.sessionStats.shotsFired > 0 
      ? (this.sessionStats.shotsHit / this.sessionStats.shotsFired) * 100 
      : 0;
  }

  // Update survival time
  updateSurvivalTime(deltaTime) {
    this.sessionStats.survivalTime += deltaTime;
  }

  // Add damage tracking
  addDamageDealt(damage) {
    this.sessionStats.damageDealt += damage;
  }

  addDamageTaken(damage) {
    this.sessionStats.damageTaken += damage;
  }

  // Record perfect dodge
  recordPerfectDodge() {
    this.sessionStats.perfectDodges++;
    this.addScore(50, 'perfect');
  }

  // Record near miss
  recordNearMiss() {
    this.sessionStats.nearMisses++;
    this.addScore(25, 'nearMiss');
  }

  // Record weapon switch
  recordWeaponSwitch() {
    this.sessionStats.weaponSwitches++;
  }

  // Record special kill
  recordSpecialKill(type) {
    this.sessionStats.specialKills++;
    this.addScore(100, 'special');
  }

  // Record streak break
  recordStreakBreak() {
    this.sessionStats.streakBreaks++;
  }

  // Save score to history
  saveScore() {
    const scoreEntry = {
      score: this.currentScore,
      date: new Date().toISOString(),
      stats: { ...this.sessionStats },
      multipliers: { ...this.scoreMultipliers }
    };
    
    this.scoreHistory.push(scoreEntry);
    
    // Keep only last 50 scores
    if (this.scoreHistory.length > 50) {
      this.scoreHistory = this.scoreHistory.slice(-50);
    }
    
    localStorage.setItem('scoreHistory', JSON.stringify(this.scoreHistory));
  }

  // Update leaderboard
  updateLeaderboard(playerName = 'Anonymous') {
    const entry = {
      name: playerName,
      score: this.currentScore,
      date: new Date().toISOString(),
      stats: { ...this.sessionStats }
    };
    
    this.leaderboard.push(entry);
    
    // Sort by score and keep top 10
    this.leaderboard.sort((a, b) => b.score - a.score);
    this.leaderboard = this.leaderboard.slice(0, 10);
    
    localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
  }

  // Check for achievements
  checkAchievements() {
    const newAchievements = [];
    
    // Score achievements
    if (this.currentScore >= 10000 && !this.achievements.includes('score_10k')) {
      newAchievements.push({
        id: 'score_10k',
        name: 'Score Master',
        description: 'Reach 10,000 points',
        icon: '🏆'
      });
    }
    
    if (this.currentScore >= 50000 && !this.achievements.includes('score_50k')) {
      newAchievements.push({
        id: 'score_50k',
        name: 'Score Legend',
        description: 'Reach 50,000 points',
        icon: '👑'
      });
    }
    
    // Combo achievements
    if (this.sessionStats.maxCombo >= 20 && !this.achievements.includes('combo_20')) {
      newAchievements.push({
        id: 'combo_20',
        name: 'Combo Master',
        description: 'Achieve 20x combo',
        icon: '🔥'
      });
    }
    
    // Accuracy achievements
    if (this.sessionStats.accuracy >= 90 && this.sessionStats.shotsFired >= 100 && !this.achievements.includes('accuracy_90')) {
      newAchievements.push({
        id: 'accuracy_90',
        name: 'Sharpshooter',
        description: '90% accuracy with 100+ shots',
        icon: '🎯'
      });
    }
    
    // Survival achievements
    if (this.sessionStats.survivalTime >= 300000 && !this.achievements.includes('survive_5min')) {
      newAchievements.push({
        id: 'survive_5min',
        name: 'Survivor',
        description: 'Survive for 5 minutes',
        icon: '⏰'
      });
    }
    
    // Add new achievements
    newAchievements.forEach(achievement => {
      this.achievements.push(achievement.id);
    });
    
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
    
    return newAchievements;
  }

  // Get detailed score breakdown
  getScoreBreakdown() {
    return {
      currentScore: this.currentScore,
      highScore: this.highScore,
      multiplier: this.calculateMultiplier(),
      multipliers: { ...this.scoreMultipliers },
      stats: { ...this.sessionStats },
      accuracy: this.sessionStats.accuracy,
      rank: this.getRank()
    };
  }

  // Get player rank based on score
  getRank() {
    if (this.currentScore >= 100000) return 'Legendary';
    if (this.currentScore >= 50000) return 'Elite';
    if (this.currentScore >= 25000) return 'Expert';
    if (this.currentScore >= 10000) return 'Advanced';
    if (this.currentScore >= 5000) return 'Skilled';
    if (this.currentScore >= 1000) return 'Novice';
    return 'Rookie';
  }

  // Reset session
  resetSession() {
    this.currentScore = 0;
    this.sessionStats = {
      enemiesDestroyed: 0,
      bossesDefeated: 0,
      powerUpsCollected: 0,
      combosAchieved: 0,
      maxCombo: 0,
      perfectShots: 0,
      headshots: 0,
      survivalTime: 0,
      damageDealt: 0,
      damageTaken: 0,
      accuracy: 0,
      shotsFired: 0,
      shotsHit: 0,
      weaponSwitches: 0,
      specialKills: 0,
      streakBreaks: 0,
      nearMisses: 0,
      perfectDodges: 0
    };
    
    this.scoreMultipliers = {
      combo: 1,
      difficulty: 1,
      powerUp: 1,
      streak: 1,
      perfect: 1
    };
  }

  // Draw score display
  drawScore(ctx, canvas) {
    const x = 20;
    const y = 40;
    
    // Main score
    ctx.fillStyle = '#00aaff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${this.currentScore.toLocaleString()}`, x, y);
    
    // High score
    ctx.fillStyle = '#ffff00';
    ctx.font = '18px Arial';
    ctx.fillText(`High: ${this.highScore.toLocaleString()}`, x, y + 30);
    
    // Multiplier
    const multiplier = this.calculateMultiplier();
    if (multiplier > 1) {
      ctx.fillStyle = '#ff6600';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`x${multiplier.toFixed(1)}`, x, y + 55);
    }
    
    // Rank
    const rank = this.getRank();
    ctx.fillStyle = '#ff00ff';
    ctx.font = '14px Arial';
    ctx.fillText(`Rank: ${rank}`, x, y + 75);
  }

  // Draw detailed stats
  drawStats(ctx, canvas) {
    const x = canvas.width - 250;
    const y = 20;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText(`Enemies: ${this.sessionStats.enemiesDestroyed}`, x, y);
    ctx.fillText(`Bosses: ${this.sessionStats.bossesDefeated}`, x, y + 15);
    ctx.fillText(`Combo: ${this.sessionStats.maxCombo}x`, x, y + 30);
    ctx.fillText(`Accuracy: ${this.sessionStats.accuracy.toFixed(1)}%`, x, y + 45);
    ctx.fillText(`Time: ${Math.floor(this.sessionStats.survivalTime / 1000)}s`, x, y + 60);
  }
}

export default EnhancedScoreSystem;

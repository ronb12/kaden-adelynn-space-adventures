// Game Rating System - Rate against top 3 players
export interface TopPlayer {
  id: string;
  name: string;
  score: number;
  level: number;
  achievements: number;
  playTime: number;
  accuracy: number;
  rank: number;
}

export interface PlayerRating {
  rank: number;
  percentile: number;
  rating: 'S' | 'A' | 'B' | 'C' | 'D';
  feedback: string;
  improvements: string[];
  achievements: string[];
  comparison: {
    vsTop1: number;
    vsTop2: number;
    vsTop3: number;
  };
}

export class GameRatingSystem {
  private topPlayers: TopPlayer[] = [];
  private currentPlayer: any = null;

  constructor() {
    this.initializeTopPlayers();
  }

  private initializeTopPlayers() {
    // Initialize with top 3 players
    this.topPlayers = [
      {
        id: 'top1',
        name: 'Space Commander',
        score: 50000,
        level: 25,
        achievements: 10,
        playTime: 3600,
        accuracy: 95,
        rank: 1
      },
      {
        id: 'top2',
        name: 'Galaxy Warrior',
        score: 35000,
        level: 20,
        achievements: 8,
        playTime: 2800,
        accuracy: 88,
        rank: 2
      },
      {
        id: 'top3',
        name: 'Cosmic Pilot',
        score: 25000,
        level: 18,
        achievements: 6,
        playTime: 2200,
        accuracy: 82,
        rank: 3
      }
    ];
  }

  // Rate current player against top 3
  ratePlayer(playerStats: any): PlayerRating {
    this.currentPlayer = playerStats;
    
    const score = playerStats.score || 0;
    const level = playerStats.level || 1;
    const achievements = playerStats.achievementsUnlocked || 0;
    const playTime = playerStats.survivalTime || 0;
    const accuracy = playerStats.accuracy || 0;

    // Calculate rank against top 3
    let rank = 4; // Default rank (below top 3)
    if (score >= this.topPlayers[0].score) rank = 1;
    else if (score >= this.topPlayers[1].score) rank = 2;
    else if (score >= this.topPlayers[2].score) rank = 3;

    // Calculate percentile
    const percentile = Math.max(0, Math.min(100, (score / this.topPlayers[0].score) * 100));

    // Determine rating
    let rating: 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
    if (score >= this.topPlayers[0].score * 0.9) rating = 'S';
    else if (score >= this.topPlayers[1].score * 0.8) rating = 'A';
    else if (score >= this.topPlayers[2].score * 0.7) rating = 'B';
    else if (score >= this.topPlayers[2].score * 0.5) rating = 'C';

    // Generate feedback
    const feedback = this.generateFeedback(score, level, achievements, accuracy, rank);
    const improvements = this.generateImprovements(score, level, achievements, accuracy);
    const achievementsList = this.generateAchievements(score, level, achievements);

    // Calculate comparisons
    const comparison = {
      vsTop1: ((score / this.topPlayers[0].score) * 100),
      vsTop2: ((score / this.topPlayers[1].score) * 100),
      vsTop3: ((score / this.topPlayers[2].score) * 100)
    };

    return {
      rank,
      percentile,
      rating,
      feedback,
      improvements,
      achievements: achievementsList,
      comparison
    };
  }

  private generateFeedback(score: number, level: number, achievements: number, accuracy: number, rank: number): string {
    if (rank === 1) {
      return "🏆 LEGENDARY! You've surpassed the top player! You are the new Space Commander!";
    } else if (rank === 2) {
      return "🥈 EXCELLENT! You've beaten the 2nd place player! Galaxy Warrior status achieved!";
    } else if (rank === 3) {
      return "🥉 GREAT! You've beaten the 3rd place player! Cosmic Pilot level reached!";
    } else if (score >= this.topPlayers[2].score * 0.8) {
      return "🔥 IMPRESSIVE! You're close to breaking into the top 3! Keep pushing!";
    } else if (score >= this.topPlayers[2].score * 0.6) {
      return "💪 GOOD PROGRESS! You're making solid progress toward the top 3!";
    } else if (score >= this.topPlayers[2].score * 0.4) {
      return "📈 GETTING BETTER! You're improving and moving up the ranks!";
    } else {
      return "🚀 KEEP PRACTICING! Every game makes you better! Focus on survival and accuracy!";
    }
  }

  private generateImprovements(score: number, level: number, achievements: number, accuracy: number): string[] {
    const improvements: string[] = [];

    if (score < this.topPlayers[2].score * 0.5) {
      improvements.push("🎯 Focus on accuracy - aim for 80%+ hit rate");
      improvements.push("⏱️ Survive longer - each second adds to your score");
      improvements.push("💥 Collect more power-ups for better performance");
    }

    if (achievements < 5) {
      improvements.push("🏆 Unlock more achievements for bonus points");
      improvements.push("🔥 Build longer kill streaks");
      improvements.push("👹 Defeat more bosses for big score bonuses");
    }

    if (accuracy < 70) {
      improvements.push("🎯 Practice aiming - accuracy is key to high scores");
      improvements.push("⚡ Use rapid fire power-ups to improve hit rate");
    }

    if (level < 10) {
      improvements.push("📈 Level up faster by surviving longer");
      improvements.push("💪 Collect health power-ups to extend survival");
    }

    return improvements;
  }

  private generateAchievements(score: number, level: number, achievements: number): string[] {
    const achievementsList: string[] = [];

    if (score >= this.topPlayers[0].score) {
      achievementsList.push("🏆 New #1 Player!");
    }
    if (score >= this.topPlayers[1].score) {
      achievementsList.push("🥈 Beat #2 Player!");
    }
    if (score >= this.topPlayers[2].score) {
      achievementsList.push("🥉 Beat #3 Player!");
    }
    if (achievements >= 8) {
      achievementsList.push("🏆 Achievement Master!");
    }
    if (level >= 20) {
      achievementsList.push("📈 High Level Player!");
    }

    return achievementsList;
  }

  // Get top 3 players
  getTopPlayers(): TopPlayer[] {
    return this.topPlayers;
  }

  // Update top players (for future leaderboard integration)
  updateTopPlayers(newTopPlayers: TopPlayer[]) {
    this.topPlayers = newTopPlayers.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  // Get performance comparison
  getPerformanceComparison(playerStats: any) {
    const rating = this.ratePlayer(playerStats);
    
    return {
      currentScore: playerStats.score || 0,
      top1Score: this.topPlayers[0].score,
      top2Score: this.topPlayers[1].score,
      top3Score: this.topPlayers[2].score,
      rank: rating.rank,
      percentile: rating.percentile,
      rating: rating.rating,
      feedback: rating.feedback,
      improvements: rating.improvements,
      achievements: rating.achievements
    };
  }

  // Draw rating display
  drawRatingDisplay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, playerStats: any) {
    const rating = this.ratePlayer(playerStats);
    const x = canvas.width - 350;
    const y = canvas.height - 200;
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(x - 10, y - 10, 340, 190);
    
    // Border
    ctx.strokeStyle = rating.rating === 'S' ? '#ffd700' : 
                     rating.rating === 'A' ? '#00ff00' : 
                     rating.rating === 'B' ? '#00aaff' : 
                     rating.rating === 'C' ? '#ffaa00' : '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 10, y - 10, 340, 190);
    
    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`🏆 RATING: ${rating.rating}`, x, y + 20);
    
    // Rank
    ctx.fillStyle = rating.rank <= 3 ? '#ffd700' : '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Rank: #${rating.rank}`, x, y + 45);
    
    // Percentile
    ctx.fillStyle = '#00aaff';
    ctx.fillText(`Top ${100 - rating.percentile}%`, x, y + 65);
    
    // Feedback
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    const words = rating.feedback.split(' ');
    let line = '';
    let lineY = y + 85;
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 320) {
        ctx.fillText(line, x, lineY);
        line = word + ' ';
        lineY += 15;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, x, lineY);
    
    // Top 3 comparison
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('vs Top 3:', x, lineY + 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`#1: ${rating.comparison.vsTop1.toFixed(1)}%`, x, lineY + 50);
    ctx.fillText(`#2: ${rating.comparison.vsTop2.toFixed(1)}%`, x, lineY + 65);
    ctx.fillText(`#3: ${rating.comparison.vsTop3.toFixed(1)}%`, x, lineY + 80);
  }
}

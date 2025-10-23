// Game Rating System - Rate against top 3 players

export class GameRatingSystem {
  constructor() {
    this.ratings = {
      terrible: { name: 'Terrible', icon: '😞', color: '#ff0000', minScore: 0, maxScore: 999 },
      poor: { name: 'Poor', icon: '😐', color: '#ff6600', minScore: 1000, maxScore: 4999 },
      average: { name: 'Average', icon: '😊', color: '#ffff00', minScore: 5000, maxScore: 14999 },
      good: { name: 'Good', icon: '😄', color: '#00ff00', minScore: 15000, maxScore: 49999 },
      excellent: { name: 'Excellent', icon: '🤩', color: '#00aaff', minScore: 50000, maxScore: 99999 },
      legendary: { name: 'Legendary', icon: '👑', color: '#ff00ff', minScore: 100000, maxScore: 249999 },
      godlike: { name: 'Godlike', icon: '⚡', color: '#ffffff', minScore: 250000, maxScore: Infinity }
    };
    
    this.topPlayers = JSON.parse(localStorage.getItem('topPlayers') || '[]');
    this.playerRatings = JSON.parse(localStorage.getItem('playerRatings') || '[]');
    this.ratingHistory = JSON.parse(localStorage.getItem('ratingHistory') || '[]');
  }

  // Calculate rating based on score
  calculateRating(score) {
    for (const [key, rating] of Object.entries(this.ratings)) {
      if (score >= rating.minScore && score <= rating.maxScore) {
        return { key, ...rating };
      }
    }
    return { key: 'terrible', ...this.ratings.terrible };
  }

  // Compare against top 3 players
  compareToTop3(score) {
    const sortedTop3 = [...this.topPlayers]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    let rank = 4; // Default rank if not in top 3
    
    for (let i = 0; i < sortedTop3.length; i++) {
      if (score > sortedTop3[i].score) {
        rank = i + 1;
        break;
      }
    }
    
    return {
      rank,
      isTop3: rank <= 3,
      top3: sortedTop3,
      percentile: this.calculatePercentile(score)
    };
  }

  // Calculate percentile
  calculatePercentile(score) {
    const allScores = this.topPlayers.map(p => p.score).sort((a, b) => b - a);
    const betterScores = allScores.filter(s => s > score).length;
    return Math.round((1 - betterScores / allScores.length) * 100);
  }

  // Add player to leaderboard
  addPlayer(name, score, stats = {}) {
    const player = {
      name,
      score,
      date: new Date().toISOString(),
      stats,
      rating: this.calculateRating(score)
    };
    
    this.topPlayers.push(player);
    
    // Keep only top 100 players
    this.topPlayers.sort((a, b) => b.score - a.score);
    this.topPlayers = this.topPlayers.slice(0, 100);
    
    localStorage.setItem('topPlayers', JSON.stringify(this.topPlayers));
    
    return player;
  }

  // Rate current performance
  ratePerformance(score, stats) {
    const rating = this.calculateRating(score);
    const comparison = this.compareToTop3(score);
    
    const performance = {
      score,
      rating,
      rank: comparison.rank,
      isTop3: comparison.isTop3,
      percentile: comparison.percentile,
      timestamp: new Date().toISOString(),
      stats
    };
    
    this.playerRatings.push(performance);
    localStorage.setItem('playerRatings', JSON.stringify(this.playerRatings));
    
    return performance;
  }

  // Get performance feedback
  getPerformanceFeedback(performance) {
    const { rating, rank, isTop3, percentile } = performance;
    
    let feedback = {
      title: `${rating.icon} ${rating.name} Performance!`,
      message: '',
      color: rating.color,
      achievements: []
    };
    
    if (isTop3) {
      feedback.message = `🏆 INCREDIBLE! You're in the TOP ${rank}!`;
      feedback.achievements.push('Top 3 Player');
    } else if (percentile >= 90) {
      feedback.message = `🌟 EXCELLENT! You're in the top ${100 - percentile}%!`;
      feedback.achievements.push('Top 10% Player');
    } else if (percentile >= 75) {
      feedback.message = `⭐ GREAT! You're in the top ${100 - percentile}%!`;
      feedback.achievements.push('Top 25% Player');
    } else if (percentile >= 50) {
      feedback.message = `👍 GOOD! You're above average!`;
      feedback.achievements.push('Above Average');
    } else {
      feedback.message = `💪 Keep practicing! You can do better!`;
    }
    
    // Add specific achievements
    if (performance.stats.combo >= 20) {
      feedback.achievements.push('Combo Master');
    }
    if (performance.stats.accuracy >= 90) {
      feedback.achievements.push('Sharpshooter');
    }
    if (performance.stats.survivalTime >= 300000) {
      feedback.achievements.push('Survivor');
    }
    
    return feedback;
  }

  // Get leaderboard
  getLeaderboard(limit = 10) {
    return this.topPlayers.slice(0, limit);
  }

  // Get player statistics
  getPlayerStats() {
    if (this.playerRatings.length === 0) return null;
    
    const totalGames = this.playerRatings.length;
    const bestScore = Math.max(...this.playerRatings.map(p => p.score));
    const averageScore = this.playerRatings.reduce((sum, p) => sum + p.score, 0) / totalGames;
    const top3Count = this.playerRatings.filter(p => p.isTop3).length;
    const averagePercentile = this.playerRatings.reduce((sum, p) => sum + p.percentile, 0) / totalGames;
    
    return {
      totalGames,
      bestScore,
      averageScore: Math.round(averageScore),
      top3Count,
      averagePercentile: Math.round(averagePercentile),
      bestRating: this.playerRatings.reduce((best, p) => 
        p.score > best.score ? p : best
      )
    };
  }

  // Draw rating display
  drawRatingDisplay(ctx, canvas, performance) {
    const x = canvas.width - 300;
    const y = canvas.height - 150;
    
    const feedback = this.getPerformanceFeedback(performance);
    
    // Rating title
    ctx.fillStyle = feedback.color;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(feedback.title, x, y);
    
    // Feedback message
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(feedback.message, x, y + 25);
    
    // Achievements
    if (feedback.achievements.length > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px Arial';
      feedback.achievements.forEach((achievement, index) => {
        ctx.fillText(`🏆 ${achievement}`, x, y + 50 + (index * 20));
      });
    }
    
    // Rank and percentile
    ctx.fillStyle = '#00aaff';
    ctx.font = '14px Arial';
    ctx.fillText(`Rank: #${performance.rank}`, x, y + 100);
    ctx.fillText(`Top ${100 - performance.percentile}%`, x, y + 120);
  }

  // Reset all data
  resetData() {
    this.topPlayers = [];
    this.playerRatings = [];
    this.ratingHistory = [];
    localStorage.removeItem('topPlayers');
    localStorage.removeItem('playerRatings');
    localStorage.removeItem('ratingHistory');
  }
}

export default GameRatingSystem;

// Leaderboard System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class LeaderboardSystem {
  constructor(scene) {
    this.scene = scene;
    this.leaderboards = {
      high_scores: [],
      survival_times: [],
      enemies_killed: [],
      bosses_defeated: [],
      combos: [],
      perfect_games: []
    };
    this.maxEntries = 10;
    this.initializeLeaderboards();
  }

  initializeLeaderboards() {
    // Load leaderboards from localStorage
    const savedLeaderboards = localStorage.getItem('kaden_adelynn_leaderboards');
    if (savedLeaderboards) {
      try {
        this.leaderboards = JSON.parse(savedLeaderboards);
      } catch (e) {
        console.error('Failed to load leaderboards:', e);
      }
    }
  }

  saveLeaderboards() {
    try {
      localStorage.setItem('kaden_adelynn_leaderboards', JSON.stringify(this.leaderboards));
    } catch (e) {
      console.error('Failed to save leaderboards:', e);
    }
  }

  addScore(category, score, playerName = 'Anonymous') {
    const entry = {
      score: score,
      player: playerName,
      date: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    this.leaderboards[category].push(entry);
    this.leaderboards[category].sort((a, b) => b.score - a.score);
    this.leaderboards[category] = this.leaderboards[category].slice(0, this.maxEntries);
    
    this.saveLeaderboards();
    return this.getRank(category, score);
  }

  addHighScore(score, playerName = 'Anonymous') {
    return this.addScore('high_scores', score, playerName);
  }

  addSurvivalTime(time, playerName = 'Anonymous') {
    return this.addScore('survival_times', time, playerName);
  }

  addEnemiesKilled(count, playerName = 'Anonymous') {
    return this.addScore('enemies_killed', count, playerName);
  }

  addBossesDefeated(count, playerName = 'Anonymous') {
    return this.addScore('bosses_defeated', count, playerName);
  }

  addCombo(combo, playerName = 'Anonymous') {
    return this.addScore('combos', combo, playerName);
  }

  addPerfectGame(score, playerName = 'Anonymous') {
    return this.addScore('perfect_games', score, playerName);
  }

  getRank(category, score) {
    const leaderboard = this.leaderboards[category];
    for (let i = 0; i < leaderboard.length; i++) {
      if (score >= leaderboard[i].score) {
        return i + 1;
      }
    }
    return leaderboard.length + 1;
  }

  getLeaderboard(category) {
    return this.leaderboards[category] || [];
  }

  getHighScores() {
    return this.getLeaderboard('high_scores');
  }

  getSurvivalTimes() {
    return this.getLeaderboard('survival_times');
  }

  getEnemiesKilled() {
    return this.getLeaderboard('enemies_killed');
  }

  getBossesDefeated() {
    return this.getLeaderboard('bosses_defeated');
  }

  getCombos() {
    return this.getLeaderboard('combos');
  }

  getPerfectGames() {
    return this.getLeaderboard('perfect_games');
  }

  getAllLeaderboards() {
    return {
      high_scores: this.getHighScores(),
      survival_times: this.getSurvivalTimes(),
      enemies_killed: this.getEnemiesKilled(),
      bosses_defeated: this.getBossesDefeated(),
      combos: this.getCombos(),
      perfect_games: this.getPerfectGames()
    };
  }

  showLeaderboard(category = 'high_scores') {
    const leaderboard = this.getLeaderboard(category);
    const categoryNames = {
      high_scores: 'High Scores',
      survival_times: 'Survival Times',
      enemies_killed: 'Enemies Killed',
      bosses_defeated: 'Bosses Defeated',
      combos: 'Best Combos',
      perfect_games: 'Perfect Games'
    };
    
    const leaderboardContainer = this.scene.add.container(this.scene.scale.width / 2, this.scene.scale.height / 2);
    leaderboardContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(0, 0, 500, 400, 0x000000, 0.9);
    background.setStrokeStyle(3, 0x00aaff);
    leaderboardContainer.add(background);
    
    // Title
    const title = this.scene.add.text(0, -150, categoryNames[category], {
      fontSize: '28px',
      fill: '#00aaff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    });
    title.setOrigin(0.5);
    leaderboardContainer.add(title);
    
    // Leaderboard entries
    if (leaderboard.length === 0) {
      const noEntries = this.scene.add.text(0, 0, 'No entries yet', {
        fontSize: '20px',
        fill: '#ffffff'
      });
      noEntries.setOrigin(0.5);
      leaderboardContainer.add(noEntries);
    } else {
      leaderboard.forEach((entry, index) => {
        const rank = index + 1;
        const entryText = this.scene.add.text(0, -100 + (index * 30), 
          `${rank}. ${entry.player} - ${this.formatScore(category, entry.score)}`, {
          fontSize: '16px',
          fill: rank <= 3 ? '#ffff00' : '#ffffff'
        });
        entryText.setOrigin(0.5);
        leaderboardContainer.add(entryText);
      });
    }
    
    // Close prompt
    const closePrompt = this.scene.add.text(0, 150, 'Press ESC to close', {
      fontSize: '16px',
      fill: '#ffff00'
    });
    closePrompt.setOrigin(0.5);
    leaderboardContainer.add(closePrompt);
    
    // Animate leaderboard
    leaderboardContainer.setAlpha(0);
    leaderboardContainer.setScale(0.5);
    
    this.scene.tweens.add({
      targets: leaderboardContainer,
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 1000,
      ease: 'Back.easeOut'
    });
    
    // Handle close input
    const closeKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    const closeHandler = () => {
      closeKey.off('down', closeHandler);
      this.scene.tweens.add({
        targets: leaderboardContainer,
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 500,
        onComplete: () => leaderboardContainer.destroy()
      });
    };
    closeKey.on('down', closeHandler);
  }

  formatScore(category, score) {
    switch (category) {
      case 'high_scores':
      case 'perfect_games':
        return score.toLocaleString();
      case 'survival_times':
        return this.formatTime(score);
      case 'enemies_killed':
      case 'bosses_defeated':
      case 'combos':
        return score.toString();
      default:
        return score.toString();
    }
  }

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getPlayerStats(playerName) {
    const stats = {
      high_scores: 0,
      survival_times: 0,
      enemies_killed: 0,
      bosses_defeated: 0,
      combos: 0,
      perfect_games: 0,
      total_entries: 0
    };
    
    Object.keys(this.leaderboards).forEach(category => {
      const entries = this.leaderboards[category].filter(entry => entry.player === playerName);
      stats[category] = entries.length;
      stats.total_entries += entries.length;
    });
    
    return stats;
  }

  getTopPlayer() {
    const playerStats = {};
    
    Object.keys(this.leaderboards).forEach(category => {
      this.leaderboards[category].forEach(entry => {
        if (!playerStats[entry.player]) {
          playerStats[entry.player] = 0;
        }
        playerStats[entry.player]++;
      });
    });
    
    let topPlayer = null;
    let maxEntries = 0;
    
    Object.keys(playerStats).forEach(player => {
      if (playerStats[player] > maxEntries) {
        maxEntries = playerStats[player];
        topPlayer = player;
      }
    });
    
    return { player: topPlayer, entries: maxEntries };
  }

  clearLeaderboards() {
    Object.keys(this.leaderboards).forEach(category => {
      this.leaderboards[category] = [];
    });
    this.saveLeaderboards();
  }

  exportLeaderboards() {
    return JSON.stringify(this.leaderboards, null, 2);
  }

  importLeaderboards(data) {
    try {
      const imported = JSON.parse(data);
      Object.keys(imported).forEach(category => {
        if (this.leaderboards[category]) {
          this.leaderboards[category] = imported[category];
        }
      });
      this.saveLeaderboards();
      return true;
    } catch (e) {
      console.error('Failed to import leaderboards:', e);
      return false;
    }
  }

  getLeaderboardStats() {
    const stats = {
      total_entries: 0,
      categories: {},
      top_players: []
    };
    
    Object.keys(this.leaderboards).forEach(category => {
      const entries = this.leaderboards[category];
      stats.total_entries += entries.length;
      stats.categories[category] = entries.length;
    });
    
    // Get top 5 players
    const playerStats = {};
    Object.keys(this.leaderboards).forEach(category => {
      this.leaderboards[category].forEach(entry => {
        if (!playerStats[entry.player]) {
          playerStats[entry.player] = 0;
        }
        playerStats[entry.player]++;
      });
    });
    
    stats.top_players = Object.keys(playerStats)
      .map(player => ({ player, entries: playerStats[player] }))
      .sort((a, b) => b.entries - a.entries)
      .slice(0, 5);
    
    return stats;
  }

  isNewRecord(category, score) {
    const leaderboard = this.getLeaderboard(category);
    if (leaderboard.length < this.maxEntries) return true;
    return score > leaderboard[leaderboard.length - 1].score;
  }

  getRecordInfo(category, score) {
    const rank = this.getRank(category, score);
    const isNewRecord = this.isNewRecord(category, score);
    
    return {
      rank,
      isNewRecord,
      isTopTen: rank <= 10,
      isTopThree: rank <= 3,
      isFirst: rank === 1
    };
  }
}

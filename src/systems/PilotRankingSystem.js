// Pilot Ranking System - Make the game extremely addicting!

export class PilotRankingSystem {
  constructor() {
    this.ranks = {
      rookie: {
        name: 'Rookie Pilot',
        icon: '🛸',
        color: '#888888',
        minScore: 0,
        maxScore: 999,
        perks: ['Basic ship', 'Standard weapons'],
        description: 'Just starting your space journey'
      },
      cadet: {
        name: 'Space Cadet',
        icon: '🚀',
        color: '#00aaff',
        minScore: 1000,
        maxScore: 4999,
        perks: ['Improved ship', 'Rapid fire', 'Shield boost'],
        description: 'Learning the ropes of space combat'
      },
      lieutenant: {
        name: 'Lieutenant',
        icon: '⭐',
        color: '#00ff00',
        minScore: 5000,
        maxScore: 14999,
        perks: ['Advanced weapons', 'Wing fighters', 'Power-up boost'],
        description: 'Proven combat skills'
      },
      captain: {
        name: 'Captain',
        icon: '👑',
        color: '#ff6600',
        minScore: 15000,
        maxScore: 49999,
        perks: ['Elite ship', 'Multi-weapon systems', 'Boss damage boost'],
        description: 'Experienced space commander'
      },
      commander: {
        name: 'Commander',
        icon: '🏆',
        color: '#ff00ff',
        minScore: 50000,
        maxScore: 99999,
        perks: ['Flagship', 'Ultimate weapons', 'Invincibility frames'],
        description: 'Elite space warrior'
      },
      admiral: {
        name: 'Admiral',
        icon: '🌟',
        color: '#ffff00',
        minScore: 100000,
        maxScore: 249999,
        perks: ['Legendary ship', 'God-mode weapons', 'Unlimited power-ups'],
        description: 'Legendary space hero'
      },
      legend: {
        name: 'Space Legend',
        icon: '💫',
        color: '#ff0000',
        minScore: 250000,
        maxScore: 999999,
        perks: ['Mythical ship', 'Reality-bending weapons', 'Time control'],
        description: 'Mythical space legend'
      },
      god: {
        name: 'Space God',
        icon: '⚡',
        color: '#ffffff',
        minScore: 1000000,
        maxScore: Infinity,
        perks: ['Divine ship', 'Universe-destroying weapons', 'Omnipotence'],
        description: 'Transcendent space deity'
      }
    };
    
    this.currentRank = 'rookie';
    this.rankProgress = 0;
    this.totalXP = parseInt(localStorage.getItem('pilotXP') || '0');
    this.rankHistory = JSON.parse(localStorage.getItem('rankHistory') || '[]');
    this.achievements = JSON.parse(localStorage.getItem('pilotAchievements') || '[]');
  }

  // Calculate rank based on total XP
  calculateRank(xp) {
    for (const [rankKey, rank] of Object.entries(this.ranks)) {
      if (xp >= rank.minScore && xp <= rank.maxScore) {
        return rankKey;
      }
    }
    return 'rookie';
  }

  // Add XP and check for rank up
  addXP(amount, source = 'combat') {
    const oldRank = this.currentRank;
    this.totalXP += amount;
    this.currentRank = this.calculateRank(this.totalXP);
    
    // Save XP
    localStorage.setItem('pilotXP', this.totalXP.toString());
    
    // Check for rank up
    if (this.currentRank !== oldRank) {
      this.rankUp(oldRank, this.currentRank);
    }
    
    // Update progress
    this.updateRankProgress();
    
    return {
      rankUp: this.currentRank !== oldRank,
      newRank: this.currentRank,
      oldRank: oldRank,
      xpGained: amount
    };
  }

  // Handle rank up
  rankUp(oldRank, newRank) {
    const rankUpData = {
      oldRank,
      newRank,
      timestamp: new Date().toISOString(),
      xp: this.totalXP
    };
    
    this.rankHistory.push(rankUpData);
    localStorage.setItem('rankHistory', JSON.stringify(this.rankHistory));
    
    // Unlock new perks
    this.unlockPerks(newRank);
    
    return rankUpData;
  }

  // Unlock perks for new rank
  unlockPerks(rank) {
    const rankData = this.ranks[rank];
    const newPerks = rankData.perks;
    
    // Add to achievements
    this.achievements.push({
      id: `rank_${rank}`,
      name: `Achieved ${rankData.name}`,
      description: rankData.description,
      icon: rankData.icon,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('pilotAchievements', JSON.stringify(this.achievements));
    
    return newPerks;
  }

  // Update rank progress
  updateRankProgress() {
    const currentRank = this.ranks[this.currentRank];
    const nextRank = this.getNextRank();
    
    if (nextRank) {
      const progress = (this.totalXP - currentRank.minScore) / 
                      (nextRank.minScore - currentRank.minScore);
      this.rankProgress = Math.min(1, Math.max(0, progress));
    } else {
      this.rankProgress = 1; // Max rank
    }
  }

  // Get next rank
  getNextRank() {
    const rankKeys = Object.keys(this.ranks);
    const currentIndex = rankKeys.indexOf(this.currentRank);
    
    if (currentIndex < rankKeys.length - 1) {
      return this.ranks[rankKeys[currentIndex + 1]];
    }
    return null;
  }

  // Get current rank info
  getCurrentRankInfo() {
    const rank = this.ranks[this.currentRank];
    const nextRank = this.getNextRank();
    
    return {
      current: {
        name: rank.name,
        icon: rank.icon,
        color: rank.color,
        description: rank.description,
        perks: rank.perks
      },
      next: nextRank ? {
        name: nextRank.name,
        icon: nextRank.icon,
        color: nextRank.color,
        requiredXP: nextRank.minScore - this.totalXP
      } : null,
      progress: this.rankProgress,
      totalXP: this.totalXP,
      xpToNext: nextRank ? nextRank.minScore - this.totalXP : 0
    };
  }

  // Get rank benefits
  getRankBenefits(rank) {
    const rankData = this.ranks[rank];
    return {
      damageMultiplier: this.getDamageMultiplier(rank),
      speedMultiplier: this.getSpeedMultiplier(rank),
      healthMultiplier: this.getHealthMultiplier(rank),
      weaponUnlocks: this.getWeaponUnlocks(rank),
      specialAbilities: this.getSpecialAbilities(rank)
    };
  }

  // Get damage multiplier based on rank
  getDamageMultiplier(rank) {
    const multipliers = {
      rookie: 1.0,
      cadet: 1.2,
      lieutenant: 1.5,
      captain: 2.0,
      commander: 2.5,
      admiral: 3.0,
      legend: 4.0,
      god: 5.0
    };
    return multipliers[rank] || 1.0;
  }

  // Get speed multiplier based on rank
  getSpeedMultiplier(rank) {
    const multipliers = {
      rookie: 1.0,
      cadet: 1.1,
      lieutenant: 1.2,
      captain: 1.3,
      commander: 1.4,
      admiral: 1.5,
      legend: 1.6,
      god: 2.0
    };
    return multipliers[rank] || 1.0;
  }

  // Get health multiplier based on rank
  getHealthMultiplier(rank) {
    const multipliers = {
      rookie: 1.0,
      cadet: 1.1,
      lieutenant: 1.2,
      captain: 1.3,
      commander: 1.4,
      admiral: 1.5,
      legend: 1.6,
      god: 2.0
    };
    return multipliers[rank] || 1.0;
  }

  // Get weapon unlocks for rank
  getWeaponUnlocks(rank) {
    const unlocks = {
      rookie: ['basic_laser'],
      cadet: ['basic_laser', 'rapid_fire'],
      lieutenant: ['basic_laser', 'rapid_fire', 'spread_shot'],
      captain: ['basic_laser', 'rapid_fire', 'spread_shot', 'homing_missiles'],
      commander: ['basic_laser', 'rapid_fire', 'spread_shot', 'homing_missiles', 'plasma_cannon'],
      admiral: ['basic_laser', 'rapid_fire', 'spread_shot', 'homing_missiles', 'plasma_cannon', 'laser_beam'],
      legend: ['basic_laser', 'rapid_fire', 'spread_shot', 'homing_missiles', 'plasma_cannon', 'laser_beam', 'multi_shot'],
      god: ['all_weapons', 'god_mode']
    };
    return unlocks[rank] || ['basic_laser'];
  }

  // Get special abilities for rank
  getSpecialAbilities(rank) {
    const abilities = {
      rookie: [],
      cadet: ['shield_boost'],
      lieutenant: ['wing_fighters', 'power_up_boost'],
      captain: ['multi_weapon', 'boss_damage_boost'],
      commander: ['invincibility_frames', 'time_slow'],
      admiral: ['unlimited_power_ups', 'god_mode_weapons'],
      legend: ['time_control', 'reality_bend'],
      god: ['omnipotence', 'universe_destroy']
    };
    return abilities[rank] || [];
  }

  // Draw rank display
  drawRankDisplay(ctx, canvas) {
    const info = this.getCurrentRankInfo();
    const x = canvas.width - 300;
    const y = 20;
    
    // Rank icon and name
    ctx.fillStyle = info.current.color;
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${info.current.icon} ${info.current.name}`, x, y);
    
    // XP progress
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(`XP: ${this.totalXP.toLocaleString()}`, x, y + 25);
    
    // Progress bar
    if (info.next) {
      const barWidth = 200;
      const barHeight = 10;
      const barX = x;
      const barY = y + 35;
      
      // Background
      ctx.fillStyle = '#333333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      
      // Progress
      ctx.fillStyle = info.current.color;
      ctx.fillRect(barX, barY, barWidth * info.progress, barHeight);
      
      // Next rank info
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(`Next: ${info.next.name}`, x, y + 55);
      ctx.fillText(`${info.xpToNext.toLocaleString()} XP needed`, x, y + 70);
    } else {
      ctx.fillStyle = '#ffff00';
      ctx.font = '14px Arial';
      ctx.fillText('MAX RANK ACHIEVED!', x, y + 40);
    }
  }

  // Get leaderboard data
  getLeaderboard() {
    return this.rankHistory
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 10)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
        rankName: this.ranks[entry.newRank].name
      }));
  }

  // Reset pilot data (for new game+)
  resetPilot() {
    this.totalXP = 0;
    this.currentRank = 'rookie';
    this.rankProgress = 0;
    localStorage.setItem('pilotXP', '0');
    localStorage.setItem('rankHistory', '[]');
    localStorage.setItem('pilotAchievements', '[]');
  }
}

export default PilotRankingSystem;

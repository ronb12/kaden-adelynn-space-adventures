// Advanced Multiplayer System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedMultiplayerSystem {
  constructor(scene) {
    this.scene = scene;
    this.players = new Map();
    this.maxPlayers = 4;
    this.gameMode = 'coop';
    this.teamMode = false;
    this.spectatorMode = false;
    
    this.multiplayerFeatures = {
      // 10 New Multiplayer Features
      TEAM_BATTLE: {
        name: 'Team Battle',
        description: 'Players are divided into teams',
        maxTeams: 2,
        playersPerTeam: 2,
        friendlyFire: false,
        teamColors: [0x00ff00, 0xff0000]
      },
      COOPERATIVE_MODE: {
        name: 'Cooperative Mode',
        description: 'Players work together against AI enemies',
        maxPlayers: 4,
        sharedScore: true,
        sharedLives: true,
        reviveSystem: true
      },
      COMPETITIVE_MODE: {
        name: 'Competitive Mode',
        description: 'Players compete against each other',
        maxPlayers: 4,
        sharedScore: false,
        sharedLives: false,
        killSystem: true
      },
      SPECTATOR_MODE: {
        name: 'Spectator Mode',
        description: 'Watch other players without participating',
        maxSpectators: 8,
        cameraControl: true,
        chatSystem: true,
        replaySystem: true
      },
      TOURNAMENT_MODE: {
        name: 'Tournament Mode',
        description: 'Organized competitive matches',
        maxPlayers: 8,
        bracketSystem: true,
        rankingSystem: true,
        prizeSystem: true
      },
      CUSTOM_GAMES: {
        name: 'Custom Games',
        description: 'Create custom game modes',
        maxPlayers: 8,
        customRules: true,
        mapEditor: true,
        modSupport: true
      },
      VOICE_CHAT: {
        name: 'Voice Chat',
        description: 'Communicate with other players',
        maxChannels: 4,
        proximityChat: true,
        teamChat: true,
        muteSystem: true
      },
      REPLAY_SYSTEM: {
        name: 'Replay System',
        description: 'Record and playback matches',
        maxReplays: 100,
        playbackSpeed: [0.25, 0.5, 1, 2, 4],
        cameraControl: true,
        exportSystem: true
      },
      LEADERBOARDS: {
        name: 'Leaderboards',
        description: 'Global and local rankings',
        categories: ['score', 'kills', 'wins', 'time'],
        timeframes: ['daily', 'weekly', 'monthly', 'all-time'],
        regional: true,
        social: true
      },
      ACHIEVEMENTS: {
        name: 'Achievements',
        description: 'Unlock achievements in multiplayer',
        maxAchievements: 100,
        categories: ['team', 'competitive', 'cooperative', 'social'],
        rewards: true,
        sharing: true
      }
    };
  }

  initializeMultiplayer() {
    this.players.clear();
    this.gameMode = 'coop';
    this.teamMode = false;
    this.spectatorMode = false;
  }

  addPlayer(playerId, character, team = null) {
    if (this.players.size >= this.maxPlayers) {
      return false;
    }

    const player = {
      id: playerId,
      character: character,
      team: team,
      score: 0,
      kills: 0,
      deaths: 0,
      health: 100,
      shield: 0,
      position: { x: 0, y: 0 },
      active: true,
      spectator: false
    };

    this.players.set(playerId, player);
    return true;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
  }

  updatePlayerPosition(playerId, x, y) {
    const player = this.players.get(playerId);
    if (player) {
      player.position.x = x;
      player.position.y = y;
    }
  }

  updatePlayerHealth(playerId, health) {
    const player = this.players.get(playerId);
    if (player) {
      player.health = health;
    }
  }

  updatePlayerShield(playerId, shield) {
    const player = this.players.get(playerId);
    if (player) {
      player.shield = shield;
    }
  }

  addScore(playerId, points) {
    const player = this.players.get(playerId);
    if (player) {
      player.score += points;
    }
  }

  addKill(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.kills += 1;
    }
  }

  addDeath(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.deaths += 1;
    }
  }

  setGameMode(mode) {
    this.gameMode = mode;
    
    switch (mode) {
      case 'team':
        this.teamMode = true;
        this.spectatorMode = false;
        break;
      case 'coop':
        this.teamMode = false;
        this.spectatorMode = false;
        break;
      case 'competitive':
        this.teamMode = false;
        this.spectatorMode = false;
        break;
      case 'spectator':
        this.teamMode = false;
        this.spectatorMode = true;
        break;
    }
  }

  createTeamBattle() {
    const feature = this.multiplayerFeatures.TEAM_BATTLE;
    this.setGameMode('team');
    
    // Divide players into teams
    const playerIds = Array.from(this.players.keys());
    const teamSize = Math.ceil(playerIds.length / feature.maxTeams);
    
    for (let i = 0; i < playerIds.length; i++) {
      const playerId = playerIds[i];
      const team = Math.floor(i / teamSize);
      const player = this.players.get(playerId);
      if (player) {
        player.team = team;
        player.teamColor = feature.teamColors[team];
      }
    }
  }

  createCooperativeMode() {
    const feature = this.multiplayerFeatures.COOPERATIVE_MODE;
    this.setGameMode('coop');
    
    // Set up cooperative features
    this.players.forEach(player => {
      player.sharedScore = feature.sharedScore;
      player.sharedLives = feature.sharedLives;
      player.reviveSystem = feature.reviveSystem;
    });
  }

  createCompetitiveMode() {
    const feature = this.multiplayerFeatures.COMPETITIVE_MODE;
    this.setGameMode('competitive');
    
    // Set up competitive features
    this.players.forEach(player => {
      player.sharedScore = feature.sharedScore;
      player.sharedLives = feature.sharedLives;
      player.killSystem = feature.killSystem;
    });
  }

  createSpectatorMode() {
    const feature = this.multiplayerFeatures.SPECTATOR_MODE;
    this.setGameMode('spectator');
    
    // Set up spectator features
    this.players.forEach(player => {
      player.spectator = true;
      player.cameraControl = feature.cameraControl;
      player.chatSystem = feature.chatSystem;
      player.replaySystem = feature.replaySystem;
    });
  }

  createTournamentMode() {
    const feature = this.multiplayerFeatures.TOURNAMENT_MODE;
    this.setGameMode('tournament');
    
    // Set up tournament features
    this.players.forEach(player => {
      player.bracketSystem = feature.bracketSystem;
      player.rankingSystem = feature.rankingSystem;
      player.prizeSystem = feature.prizeSystem;
    });
  }

  createCustomGames() {
    const feature = this.multiplayerFeatures.CUSTOM_GAMES;
    this.setGameMode('custom');
    
    // Set up custom game features
    this.players.forEach(player => {
      player.customRules = feature.customRules;
      player.mapEditor = feature.mapEditor;
      player.modSupport = feature.modSupport;
    });
  }

  enableVoiceChat() {
    const feature = this.multiplayerFeatures.VOICE_CHAT;
    
    // Set up voice chat features
    this.players.forEach(player => {
      player.voiceChat = true;
      player.proximityChat = feature.proximityChat;
      player.teamChat = feature.teamChat;
      player.muteSystem = feature.muteSystem;
    });
  }

  enableReplaySystem() {
    const feature = this.multiplayerFeatures.REPLAY_SYSTEM;
    
    // Set up replay features
    this.players.forEach(player => {
      player.replaySystem = true;
      player.playbackSpeed = feature.playbackSpeed;
      player.cameraControl = feature.cameraControl;
      player.exportSystem = feature.exportSystem;
    });
  }

  enableLeaderboards() {
    const feature = this.multiplayerFeatures.LEADERBOARDS;
    
    // Set up leaderboard features
    this.players.forEach(player => {
      player.leaderboards = true;
      player.categories = feature.categories;
      player.timeframes = feature.timeframes;
      player.regional = feature.regional;
      player.social = feature.social;
    });
  }

  enableAchievements() {
    const feature = this.multiplayerFeatures.ACHIEVEMENTS;
    
    // Set up achievement features
    this.players.forEach(player => {
      player.achievements = true;
      player.maxAchievements = feature.maxAchievements;
      player.categories = feature.categories;
      player.rewards = feature.rewards;
      player.sharing = feature.sharing;
    });
  }

  // Team management
  assignPlayerToTeam(playerId, team) {
    const player = this.players.get(playerId);
    if (player) {
      player.team = team;
      player.teamColor = this.multiplayerFeatures.TEAM_BATTLE.teamColors[team];
    }
  }

  getTeamMembers(team) {
    const teamMembers = [];
    this.players.forEach(player => {
      if (player.team === team) {
        teamMembers.push(player);
      }
    });
    return teamMembers;
  }

  getTeamScore(team) {
    let teamScore = 0;
    this.players.forEach(player => {
      if (player.team === team) {
        teamScore += player.score;
      }
    });
    return teamScore;
  }

  // Communication systems
  sendMessage(playerId, message) {
    const player = this.players.get(playerId);
    if (player && player.chatSystem) {
      // Send message to all players
      this.players.forEach(p => {
        if (p.chatSystem) {
          this.displayMessage(p.id, `${player.character}: ${message}`);
        }
      });
    }
  }

  sendTeamMessage(playerId, message) {
    const player = this.players.get(playerId);
    if (player && player.teamChat) {
      // Send message to team members only
      this.players.forEach(p => {
        if (p.team === player.team && p.teamChat) {
          this.displayMessage(p.id, `[TEAM] ${player.character}: ${message}`);
        }
      });
    }
  }

  displayMessage(playerId, message) {
    // Display message to specific player
    const player = this.players.get(playerId);
    if (player) {
      // Create message display
      const messageText = this.scene.add.text(
        this.scene.scale.width / 2, 100,
        message,
        {
          fontSize: '16px',
          fill: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2
        }
      );
      messageText.setOrigin(0.5);
      
      // Animate message
      this.scene.tweens.add({
        targets: messageText,
        alpha: 0,
        y: 50,
        duration: 3000,
        onComplete: () => {
          if (messageText.active) messageText.destroy();
        }
      });
    }
  }

  // Voice chat
  startVoiceChat(playerId) {
    const player = this.players.get(playerId);
    if (player && player.voiceChat) {
      player.voiceActive = true;
      // Start voice chat for player
    }
  }

  stopVoiceChat(playerId) {
    const player = this.players.get(playerId);
    if (player) {
      player.voiceActive = false;
      // Stop voice chat for player
    }
  }

  mutePlayer(playerId, targetPlayerId) {
    const player = this.players.get(playerId);
    const targetPlayer = this.players.get(targetPlayerId);
    
    if (player && targetPlayer && player.muteSystem) {
      if (!player.mutedPlayers) {
        player.mutedPlayers = new Set();
      }
      player.mutedPlayers.add(targetPlayerId);
    }
  }

  unmutePlayer(playerId, targetPlayerId) {
    const player = this.players.get(playerId);
    
    if (player && player.mutedPlayers) {
      player.mutedPlayers.delete(targetPlayerId);
    }
  }

  // Replay system
  startRecording(playerId) {
    const player = this.players.get(playerId);
    if (player && player.replaySystem) {
      player.recording = true;
      player.recordingData = [];
    }
  }

  stopRecording(playerId) {
    const player = this.players.get(playerId);
    if (player && player.recording) {
      player.recording = false;
      // Save recording data
      this.saveReplay(playerId, player.recordingData);
    }
  }

  saveReplay(playerId, data) {
    const player = this.players.get(playerId);
    if (player && player.replaySystem) {
      const replay = {
        playerId: playerId,
        timestamp: Date.now(),
        data: data,
        duration: data.length
      };
      
      // Save replay to storage
      this.scene.setData(`replay_${playerId}_${Date.now()}`, replay);
    }
  }

  playReplay(playerId, replayId) {
    const player = this.players.get(playerId);
    if (player && player.replaySystem) {
      const replay = this.scene.getData(`replay_${playerId}_${replayId}`);
      if (replay) {
        player.playback = true;
        player.playbackData = replay.data;
        player.playbackIndex = 0;
      }
    }
  }

  // Leaderboards
  updateLeaderboard(category, playerId, value) {
    const player = this.players.get(playerId);
    if (player && player.leaderboards) {
      if (!player.leaderboardData) {
        player.leaderboardData = {};
      }
      player.leaderboardData[category] = value;
    }
  }

  getLeaderboard(category, timeframe = 'all-time') {
    const leaderboard = [];
    
    this.players.forEach(player => {
      if (player.leaderboardData && player.leaderboardData[category]) {
        leaderboard.push({
          playerId: player.id,
          character: player.character,
          value: player.leaderboardData[category],
          team: player.team
        });
      }
    });
    
    // Sort by value (descending)
    leaderboard.sort((a, b) => b.value - a.value);
    
    return leaderboard;
  }

  // Achievements
  unlockAchievement(playerId, achievementId) {
    const player = this.players.get(playerId);
    if (player && player.achievements) {
      if (!player.unlockedAchievements) {
        player.unlockedAchievements = new Set();
      }
      player.unlockedAchievements.add(achievementId);
      
      // Notify other players
      this.players.forEach(p => {
        if (p.id !== playerId && p.achievements) {
          this.displayMessage(p.id, `${player.character} unlocked achievement: ${achievementId}`);
        }
      });
    }
  }

  getPlayerAchievements(playerId) {
    const player = this.players.get(playerId);
    if (player && player.achievements) {
      return Array.from(player.unlockedAchievements || []);
    }
    return [];
  }

  // Utility methods
  getPlayerCount() {
    return this.players.size;
  }

  getActivePlayers() {
    const activePlayers = [];
    this.players.forEach(player => {
      if (player.active && !player.spectator) {
        activePlayers.push(player);
      }
    });
    return activePlayers;
  }

  getSpectators() {
    const spectators = [];
    this.players.forEach(player => {
      if (player.spectator) {
        spectators.push(player);
      }
    });
    return spectators;
  }

  getPlayerById(playerId) {
    return this.players.get(playerId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  getGameMode() {
    return this.gameMode;
  }

  isTeamMode() {
    return this.teamMode;
  }

  isSpectatorMode() {
    return this.spectatorMode;
  }

  // Cleanup
  cleanup() {
    this.players.clear();
    this.gameMode = 'coop';
    this.teamMode = false;
    this.spectatorMode = false;
  }
}

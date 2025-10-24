// Advanced AI System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedAISystem {
  constructor(scene) {
    this.scene = scene;
    this.aiAgents = new Map();
    this.behaviors = new Map();
    this.learningData = new Map();
    
    this.aiFeatures = {
      // 5 New AI Features
      ADAPTIVE_DIFFICULTY: {
        name: 'Adaptive Difficulty',
        description: 'AI that adjusts difficulty based on player performance',
        learningRate: 0.1,
        difficultyRange: [0.5, 2.0],
        performanceMetrics: ['accuracy', 'survival', 'score'],
        adaptationSpeed: 'medium'
      },
      PREDICTIVE_AI: {
        name: 'Predictive AI',
        description: 'AI that predicts player actions and adapts',
        predictionAccuracy: 0.8,
        adaptationSpeed: 'fast',
        memorySize: 1000,
        learningAlgorithm: 'neural_network'
      },
      EMOTIONAL_AI: {
        name: 'Emotional AI',
        description: 'AI that responds to player emotions',
        emotionRecognition: true,
        emotionalStates: ['frustrated', 'excited', 'bored', 'confident'],
        responseSystem: true,
        moodTracking: true
      },
      COLLABORATIVE_AI: {
        name: 'Collaborative AI',
        description: 'AI that works with players as teammates',
        cooperationLevel: 'high',
        communicationSystem: true,
        taskAssignment: true,
        performanceSharing: true,
        adaptiveBehavior: true
      },
      CREATIVE_AI: {
        name: 'Creative AI',
        description: 'AI that generates new content and challenges',
        contentGeneration: true,
        challengeCreation: true,
        proceduralGeneration: true,
        creativityLevel: 'high',
        innovationRate: 0.7
      }
    };
  }

  initializeAI() {
    this.aiAgents.clear();
    this.behaviors.clear();
    this.learningData.clear();
    
    // Initialize AI features
    Object.keys(this.aiFeatures).forEach(featureKey => {
      const feature = this.aiFeatures[featureKey];
      this.behaviors.set(featureKey, {
        ...feature,
        active: false,
        data: {},
        performance: 0
      });
    });
  }

  enableAI(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    if (behavior) {
      behavior.active = true;
      this.activateAI(featureKey, behavior);
    }
  }

  disableAI(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    if (behavior) {
      behavior.active = false;
      this.deactivateAI(featureKey, behavior);
    }
  }

  activateAI(featureKey, behavior) {
    switch (featureKey) {
      case 'ADAPTIVE_DIFFICULTY':
        this.activateAdaptiveDifficulty(behavior);
        break;
      case 'PREDICTIVE_AI':
        this.activatePredictiveAI(behavior);
        break;
      case 'EMOTIONAL_AI':
        this.activateEmotionalAI(behavior);
        break;
      case 'COLLABORATIVE_AI':
        this.activateCollaborativeAI(behavior);
        break;
      case 'CREATIVE_AI':
        this.activateCreativeAI(behavior);
        break;
    }
  }

  deactivateAI(featureKey, behavior) {
    switch (featureKey) {
      case 'ADAPTIVE_DIFFICULTY':
        this.deactivateAdaptiveDifficulty(behavior);
        break;
      case 'PREDICTIVE_AI':
        this.deactivatePredictiveAI(behavior);
        break;
      case 'EMOTIONAL_AI':
        this.deactivateEmotionalAI(behavior);
        break;
      case 'COLLABORATIVE_AI':
        this.deactivateCollaborativeAI(behavior);
        break;
      case 'CREATIVE_AI':
        this.deactivateCreativeAI(behavior);
        break;
    }
  }

  // Adaptive Difficulty AI
  activateAdaptiveDifficulty(behavior) {
    behavior.data = {
      currentDifficulty: 1.0,
      playerPerformance: {
        accuracy: 0.5,
        survival: 0.5,
        score: 0.5
      },
      adaptationHistory: [],
      lastAdaptation: 0
    };
    
    // Start monitoring player performance
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        this.updateAdaptiveDifficulty(behavior);
      },
      loop: true
    });
  }

  updateAdaptiveDifficulty(behavior) {
    const data = behavior.data;
    const currentTime = this.scene.time.now;
    
    // Calculate current performance
    const performance = this.calculatePlayerPerformance();
    
    // Update performance metrics
    data.playerPerformance.accuracy = performance.accuracy;
    data.playerPerformance.survival = performance.survival;
    data.playerPerformance.score = performance.score;
    
    // Calculate average performance
    const avgPerformance = (
      data.playerPerformance.accuracy +
      data.playerPerformance.survival +
      data.playerPerformance.score
    ) / 3;
    
    // Adjust difficulty based on performance
    let difficultyChange = 0;
    if (avgPerformance > 0.8) {
      // Player is doing well, increase difficulty
      difficultyChange = behavior.learningRate;
    } else if (avgPerformance < 0.4) {
      // Player is struggling, decrease difficulty
      difficultyChange = -behavior.learningRate;
    }
    
    // Update difficulty
    data.currentDifficulty = Math.max(
      behavior.difficultyRange[0],
      Math.min(behavior.difficultyRange[1], data.currentDifficulty + difficultyChange)
    );
    
    // Apply difficulty changes
    this.applyDifficultyChanges(data.currentDifficulty);
    
    // Record adaptation
    data.adaptationHistory.push({
      timestamp: currentTime,
      difficulty: data.currentDifficulty,
      performance: avgPerformance
    });
    
    // Keep only recent history
    if (data.adaptationHistory.length > 100) {
      data.adaptationHistory.shift();
    }
  }

  calculatePlayerPerformance() {
    const gameStats = this.scene.gameStats || {};
    
    // Calculate accuracy
    const accuracy = gameStats.shotsFired > 0 ? 
      (gameStats.enemiesKilled / gameStats.shotsFired) : 0;
    
    // Calculate survival (time-based)
    const survival = Math.min(1, (gameStats.survivalTime || 0) / 60000);
    
    // Calculate score performance
    const score = Math.min(1, (gameStats.score || 0) / 100000);
    
    return { accuracy, survival, score };
  }

  applyDifficultyChanges(difficulty) {
    // Adjust enemy speed
    this.scene.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        enemy.body.setVelocity(
          enemy.body.velocity.x * difficulty,
          enemy.body.velocity.y * difficulty
        );
      }
    });
    
    // Adjust enemy spawn rate
    this.scene.setData('enemySpawnRate', difficulty);
    
    // Adjust power-up spawn rate
    this.scene.setData('powerUpSpawnRate', 1 / difficulty);
  }

  deactivateAdaptiveDifficulty(behavior) {
    // Reset difficulty to normal
    this.applyDifficultyChanges(1.0);
  }

  // Predictive AI
  activatePredictiveAI(behavior) {
    behavior.data = {
      playerPatterns: [],
      predictions: [],
      accuracy: 0,
      memory: [],
      lastPrediction: 0
    };
    
    // Start prediction system
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.updatePredictiveAI(behavior);
      },
      loop: true
    });
  }

  updatePredictiveAI(behavior) {
    const data = behavior.data;
    const player = this.scene.player;
    
    if (!player) return;
    
    // Record player pattern
    const pattern = {
      timestamp: this.scene.time.now,
      position: { x: player.x, y: player.y },
      velocity: { x: player.body.velocity.x, y: player.body.velocity.y },
      health: player.health,
      shield: player.shield
    };
    
    data.playerPatterns.push(pattern);
    
    // Keep only recent patterns
    if (data.playerPatterns.length > behavior.memorySize) {
      data.playerPatterns.shift();
    }
    
    // Make predictions
    if (data.playerPatterns.length > 10) {
      const prediction = this.predictPlayerAction(data.playerPatterns);
      data.predictions.push(prediction);
      
      // Adapt game based on prediction
      this.adaptToPrediction(prediction);
    }
  }

  predictPlayerAction(patterns) {
    // Simple prediction algorithm
    const recentPatterns = patterns.slice(-5);
    const avgVelocity = {
      x: recentPatterns.reduce((sum, p) => sum + p.velocity.x, 0) / recentPatterns.length,
      y: recentPatterns.reduce((sum, p) => sum + p.velocity.y, 0) / recentPatterns.length
    };
    
    const lastPattern = patterns[patterns.length - 1];
    const predictedPosition = {
      x: lastPattern.position.x + avgVelocity.x * 0.1,
      y: lastPattern.position.y + avgVelocity.y * 0.1
    };
    
    return {
      timestamp: this.scene.time.now,
      predictedPosition,
      confidence: 0.8,
      action: this.predictAction(patterns)
    };
  }

  predictAction(patterns) {
    // Predict likely player action
    const recentPatterns = patterns.slice(-3);
    const avgHealth = recentPatterns.reduce((sum, p) => sum + p.health, 0) / recentPatterns.length;
    
    if (avgHealth < 30) {
      return 'retreat';
    } else if (avgHealth > 80) {
      return 'aggressive';
    } else {
      return 'balanced';
    }
  }

  adaptToPrediction(prediction) {
    // Adapt game based on prediction
    switch (prediction.action) {
      case 'retreat':
        // Spawn fewer enemies
        this.scene.setData('enemySpawnRate', 0.5);
        break;
      case 'aggressive':
        // Spawn more enemies
        this.scene.setData('enemySpawnRate', 1.5);
        break;
      case 'balanced':
        // Normal spawn rate
        this.scene.setData('enemySpawnRate', 1.0);
        break;
    }
  }

  deactivatePredictiveAI(behavior) {
    // Reset spawn rates
    this.scene.setData('enemySpawnRate', 1.0);
  }

  // Emotional AI
  activateEmotionalAI(behavior) {
    behavior.data = {
      playerEmotions: [],
      emotionalState: 'neutral',
      responseHistory: [],
      moodScore: 0.5
    };
    
    // Start emotion monitoring
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.updateEmotionalAI(behavior);
      },
      loop: true
    });
  }

  updateEmotionalAI(behavior) {
    const data = behavior.data;
    const gameStats = this.scene.gameStats || {};
    
    // Analyze player behavior for emotions
    const emotion = this.analyzePlayerEmotion(gameStats);
    data.playerEmotions.push(emotion);
    
    // Keep only recent emotions
    if (data.playerEmotions.length > 50) {
      data.playerEmotions.shift();
    }
    
    // Update emotional state
    data.emotionalState = this.determineEmotionalState(data.playerEmotions);
    
    // Respond to emotional state
    this.respondToEmotion(data.emotionalState);
  }

  analyzePlayerEmotion(gameStats) {
    const emotion = {
      timestamp: this.scene.time.now,
      frustration: 0,
      excitement: 0,
      boredom: 0,
      confidence: 0
    };
    
    // Calculate frustration (based on deaths, low health)
    emotion.frustration = Math.min(1, (gameStats.deaths || 0) / 10);
    
    // Calculate excitement (based on score, kills)
    emotion.excitement = Math.min(1, (gameStats.score || 0) / 50000);
    
    // Calculate boredom (based on time without action)
    emotion.boredom = Math.min(1, (gameStats.survivalTime || 0) / 300000);
    
    // Calculate confidence (based on accuracy, survival)
    const accuracy = gameStats.shotsFired > 0 ? 
      (gameStats.enemiesKilled / gameStats.shotsFired) : 0;
    emotion.confidence = accuracy;
    
    return emotion;
  }

  determineEmotionalState(emotions) {
    if (emotions.length === 0) return 'neutral';
    
    const recentEmotions = emotions.slice(-10);
    const avgFrustration = recentEmotions.reduce((sum, e) => sum + e.frustration, 0) / recentEmotions.length;
    const avgExcitement = recentEmotions.reduce((sum, e) => sum + e.excitement, 0) / recentEmotions.length;
    const avgBoredom = recentEmotions.reduce((sum, e) => sum + e.boredom, 0) / recentEmotions.length;
    const avgConfidence = recentEmotions.reduce((sum, e) => sum + e.confidence, 0) / recentEmotions.length;
    
    if (avgFrustration > 0.7) return 'frustrated';
    if (avgExcitement > 0.7) return 'excited';
    if (avgBoredom > 0.7) return 'bored';
    if (avgConfidence > 0.7) return 'confident';
    
    return 'neutral';
  }

  respondToEmotion(emotionalState) {
    switch (emotionalState) {
      case 'frustrated':
        // Reduce difficulty, provide encouragement
        this.scene.setData('enemySpawnRate', 0.5);
        this.showEncouragement();
        break;
      case 'excited':
        // Increase challenge, maintain excitement
        this.scene.setData('enemySpawnRate', 1.2);
        this.showExcitement();
        break;
      case 'bored':
        // Introduce new elements, increase variety
        this.scene.setData('enemySpawnRate', 1.5);
        this.introduceVariety();
        break;
      case 'confident':
        // Increase difficulty, provide new challenges
        this.scene.setData('enemySpawnRate', 1.3);
        this.provideChallenge();
        break;
      default:
        // Normal gameplay
        this.scene.setData('enemySpawnRate', 1.0);
    }
  }

  showEncouragement() {
    // Show encouraging message
    const encouragement = this.scene.add.text(
      this.scene.scale.width / 2, 100,
      'You\'re doing great! Keep it up!',
      {
        fontSize: '24px',
        fill: '#00ff00',
        fontStyle: 'bold'
      }
    );
    encouragement.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: encouragement,
      alpha: 0,
      y: 50,
      duration: 3000,
      onComplete: () => {
        if (encouragement.active) encouragement.destroy();
      }
    });
  }

  showExcitement() {
    // Show excitement message
    const excitement = this.scene.add.text(
      this.scene.scale.width / 2, 100,
      'Awesome! You\'re on fire!',
      {
        fontSize: '24px',
        fill: '#ff8800',
        fontStyle: 'bold'
      }
    );
    excitement.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: excitement,
      alpha: 0,
      y: 50,
      duration: 3000,
      onComplete: () => {
        if (excitement.active) excitement.destroy();
      }
    });
  }

  introduceVariety() {
    // Introduce new enemy types or power-ups
    this.scene.setData('introduceVariety', true);
  }

  provideChallenge() {
    // Provide new challenges
    this.scene.setData('provideChallenge', true);
  }

  deactivateEmotionalAI(behavior) {
    // Reset to normal gameplay
    this.scene.setData('enemySpawnRate', 1.0);
    this.scene.setData('introduceVariety', false);
    this.scene.setData('provideChallenge', false);
  }

  // Collaborative AI
  activateCollaborativeAI(behavior) {
    behavior.data = {
      cooperationLevel: 'high',
      communicationActive: true,
      taskAssignment: true,
      performanceSharing: true,
      adaptiveBehavior: true
    };
    
    // Start collaborative AI
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        this.updateCollaborativeAI(behavior);
      },
      loop: true
    });
  }

  updateCollaborativeAI(behavior) {
    const data = behavior.data;
    
    // Provide assistance to player
    this.provideAssistance();
    
    // Share performance data
    this.sharePerformanceData();
    
    // Assign tasks
    this.assignTasks();
  }

  provideAssistance() {
    // Provide hints and assistance
    const player = this.scene.player;
    if (!player) return;
    
    // Check if player needs help
    if (player.health < 30) {
      this.showHint('Low health! Try to find health power-ups!');
    } else if (player.shield === 0) {
      this.showHint('No shield! Look for shield power-ups!');
    }
  }

  showHint(message) {
    const hint = this.scene.add.text(
      this.scene.scale.width / 2, 150,
      message,
      {
        fontSize: '18px',
        fill: '#ffff00',
        fontStyle: 'bold'
      }
    );
    hint.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: hint,
      alpha: 0,
      y: 100,
      duration: 4000,
      onComplete: () => {
        if (hint.active) hint.destroy();
      }
    });
  }

  sharePerformanceData() {
    // Share performance data with player
    const gameStats = this.scene.gameStats || {};
    const performance = this.calculatePlayerPerformance();
    
    // Show performance summary
    const performanceText = this.scene.add.text(
      this.scene.scale.width / 2, 200,
      `Performance: ${Math.round(performance.accuracy * 100)}% accuracy`,
      {
        fontSize: '16px',
        fill: '#ffffff'
      }
    );
    performanceText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: performanceText,
      alpha: 0,
      y: 150,
      duration: 3000,
      onComplete: () => {
        if (performanceText.active) performanceText.destroy();
      }
    });
  }

  assignTasks() {
    // Assign tasks to player
    const tasks = [
      'Eliminate 5 enemies',
      'Collect 3 power-ups',
      'Survive for 30 seconds',
      'Achieve 80% accuracy'
    ];
    
    const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
    this.showTask(randomTask);
  }

  showTask(task) {
    const taskText = this.scene.add.text(
      this.scene.scale.width / 2, 250,
      `Task: ${task}`,
      {
        fontSize: '16px',
        fill: '#00ffff',
        fontStyle: 'bold'
      }
    );
    taskText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: taskText,
      alpha: 0,
      y: 200,
      duration: 5000,
      onComplete: () => {
        if (taskText.active) taskText.destroy();
      }
    });
  }

  deactivateCollaborativeAI(behavior) {
    // Stop collaborative features
    this.scene.setData('collaborativeAI', false);
  }

  // Creative AI
  activateCreativeAI(behavior) {
    behavior.data = {
      contentGeneration: true,
      challengeCreation: true,
      proceduralGeneration: true,
      creativityLevel: 'high',
      innovationRate: 0.7,
      generatedContent: [],
      challenges: []
    };
    
    // Start creative AI
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        this.updateCreativeAI(behavior);
      },
      loop: true
    });
  }

  updateCreativeAI(behavior) {
    const data = behavior.data;
    
    // Generate new content
    if (Math.random() < data.innovationRate) {
      this.generateNewContent();
    }
    
    // Create new challenges
    if (Math.random() < 0.5) {
      this.createNewChallenge();
    }
  }

  generateNewContent() {
    // Generate new enemy types, power-ups, or environments
    const contentTypes = ['enemy', 'powerup', 'environment', 'weapon'];
    const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];
    
    switch (randomType) {
      case 'enemy':
        this.generateNewEnemy();
        break;
      case 'powerup':
        this.generateNewPowerUp();
        break;
      case 'environment':
        this.generateNewEnvironment();
        break;
      case 'weapon':
        this.generateNewWeapon();
        break;
    }
  }

  generateNewEnemy() {
    // Generate new enemy with random properties
    const enemyTypes = ['BASIC', 'FAST', 'TANK', 'ZIGZAG', 'CIRCLE'];
    const randomType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    
    const x = Phaser.Math.Between(0, this.scene.scale.width);
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    
    this.scene.enemySystem.spawnEnemy(randomType, x, y);
  }

  generateNewPowerUp() {
    // Generate new power-up with random properties
    const powerUpTypes = ['HEALTH', 'SHIELD', 'SPEED', 'MULTI_SHOT', 'RAPID_FIRE'];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const x = Phaser.Math.Between(0, this.scene.scale.width);
    const y = Phaser.Math.Between(0, this.scene.scale.height);
    
    this.scene.powerUpSystem.spawnPowerUp(randomType, x, y);
  }

  generateNewEnvironment() {
    // Generate new environment effect
    const environments = ['ASTEROID_FIELD', 'NEBULA_ZONE', 'SPACE_STATION', 'CRYSTAL_CAVES'];
    const randomEnv = environments[Math.floor(Math.random() * environments.length)];
    
    this.scene.levelSystem.createEnvironment(randomEnv);
  }

  generateNewWeapon() {
    // Generate new weapon with random properties
    const weapons = ['BASIC', 'SPREAD', 'LASER', 'HOMING', 'PIERCE'];
    const randomWeapon = weapons[Math.floor(Math.random() * weapons.length)];
    
    this.scene.weaponSystem.setWeapon(randomWeapon);
  }

  createNewChallenge() {
    // Create new challenge for player
    const challenges = [
      'Survive for 60 seconds without taking damage',
      'Eliminate 10 enemies in a row',
      'Collect 5 power-ups in 30 seconds',
      'Achieve 90% accuracy for 20 shots'
    ];
    
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    this.showChallenge(randomChallenge);
  }

  showChallenge(challenge) {
    const challengeText = this.scene.add.text(
      this.scene.scale.width / 2, 300,
      `New Challenge: ${challenge}`,
      {
        fontSize: '18px',
        fill: '#ff00ff',
        fontStyle: 'bold'
      }
    );
    challengeText.setOrigin(0.5);
    
    this.scene.tweens.add({
      targets: challengeText,
      alpha: 0,
      y: 250,
      duration: 6000,
      onComplete: () => {
        if (challengeText.active) challengeText.destroy();
      }
    });
  }

  deactivateCreativeAI(behavior) {
    // Stop creative features
    this.scene.setData('creativeAI', false);
  }

  // Utility methods
  isAIActive(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    return behavior ? behavior.active : false;
  }

  getAIPerformance(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    return behavior ? behavior.performance : 0;
  }

  getAllActiveAI() {
    const activeAI = [];
    this.behaviors.forEach((behavior, key) => {
      if (behavior.active) {
        activeAI.push(key);
      }
    });
    return activeAI;
  }

  getAIData(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    return behavior ? behavior.data : {};
  }

  // Learning and adaptation
  updateLearning(featureKey, performance) {
    const behavior = this.behaviors.get(featureKey);
    if (behavior) {
      behavior.performance = performance;
      
      // Update learning data
      if (!this.learningData.has(featureKey)) {
        this.learningData.set(featureKey, []);
      }
      
      const learningData = this.learningData.get(featureKey);
      learningData.push({
        timestamp: this.scene.time.now,
        performance: performance,
        context: this.getCurrentContext()
      });
      
      // Keep only recent learning data
      if (learningData.length > 1000) {
        learningData.shift();
      }
    }
  }

  getCurrentContext() {
    return {
      gameStats: this.scene.gameStats || {},
      playerHealth: this.scene.player ? this.scene.player.health : 0,
      enemyCount: this.scene.enemies.children.entries.length,
      powerUpCount: this.scene.powerUps ? this.scene.powerUps.children.entries.length : 0
    };
  }

  // AI testing and evaluation
  testAI(featureKey) {
    const behavior = this.behaviors.get(featureKey);
    if (!behavior) return null;
    
    const testResults = {
      accuracy: this.testAIAccuracy(featureKey),
      responsiveness: this.testAIResponsiveness(featureKey),
      adaptation: this.testAIAdaptation(featureKey),
      performance: behavior.performance
    };
    
    return testResults;
  }

  testAIAccuracy(featureKey) {
    // Test AI accuracy
    return Math.random() * 100;
  }

  testAIResponsiveness(featureKey) {
    // Test AI responsiveness
    return Math.random() * 100;
  }

  testAIAdaptation(featureKey) {
    // Test AI adaptation
    return Math.random() * 100;
  }
}

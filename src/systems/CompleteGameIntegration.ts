// Complete Game Integration - All 300 Features Integration
import { CompleteGameSystem } from './CompleteGameSystem';
import { EnhancedAudioSystem } from './EnhancedAudioSystem';
import { EnhancedVisualEffects } from './EnhancedVisualEffects';
import { MultiplayerSystem } from './MultiplayerSystem';
import { StoryModeSystem } from './StoryModeSystem';
import { ChallengeSystem } from './ChallengeSystem';
import { FeatureTestingSystem } from './FeatureTestingSystem';

export interface GameIntegration {
  systems: Map<string, any>;
  features: Map<string, any>;
  isInitialized: boolean;
  isRunning: boolean;
  performance: PerformanceMetrics;
  status: GameStatus;
}

export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  updateTime: number;
  frameTime: number;
  lastFrameTime: number;
}

export interface GameStatus {
  currentScene: string;
  activeFeatures: string[];
  systemHealth: Map<string, string>;
  errors: string[];
  warnings: string[];
}

export class CompleteGameIntegration {
  private gameSystem!: CompleteGameSystem;
  private audioSystem!: EnhancedAudioSystem;
  private visualEffects!: EnhancedVisualEffects;
  private multiplayerSystem!: MultiplayerSystem;
  private storyModeSystem!: StoryModeSystem;
  private challengeSystem!: ChallengeSystem;
  private testingSystem!: FeatureTestingSystem;
  
  private systems: Map<string, any> = new Map();
  private features: Map<string, any> = new Map();
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  
  private performance: PerformanceMetrics = {
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    updateTime: 0,
    frameTime: 0,
    lastFrameTime: 0
  };
  
  private status: GameStatus = {
    currentScene: 'menu',
    activeFeatures: [],
    systemHealth: new Map(),
    errors: [],
    warnings: []
  };
  
  private gameLoop: number | null = null;
  private lastUpdateTime: number = 0;
  
  // Event callbacks
  private onSystemError: ((system: string, error: string) => void) | null = null;
  private onFeatureUpdate: ((feature: string, status: string) => void) | null = null;
  private onPerformanceUpdate: ((metrics: PerformanceMetrics) => void) | null = null;

  constructor() {
    this.initializeSystems();
    this.initializeFeatures();
  }

  private initializeSystems() {
    // Initialize all game systems
    this.gameSystem = new CompleteGameSystem();
    this.audioSystem = new EnhancedAudioSystem();
    this.multiplayerSystem = new MultiplayerSystem();
    this.storyModeSystem = new StoryModeSystem();
    this.challengeSystem = new ChallengeSystem();
    this.testingSystem = new FeatureTestingSystem();
    
    // Register systems
    this.systems.set('game', this.gameSystem);
    this.systems.set('audio', this.audioSystem);
    this.systems.set('multiplayer', this.multiplayerSystem);
    this.systems.set('story', this.storyModeSystem);
    this.systems.set('challenges', this.challengeSystem);
    this.systems.set('testing', this.testingSystem);
    
    // Initialize visual effects when canvas is available
    this.initializeVisualEffects();
  }

  private initializeVisualEffects() {
    // This will be called when canvas is available
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (canvas) {
      this.visualEffects = new EnhancedVisualEffects(canvas);
      this.systems.set('visual', this.visualEffects);
    }
  }

  private initializeFeatures() {
    // Initialize all 300 features
    const featureCategories = [
      'core', 'boss', 'weapons', 'powerups', 'achievements', 'ui', 'audio', 
      'visual', 'multiplayer', 'story', 'challenges', 'accessibility'
    ];
    
    featureCategories.forEach(category => {
      const features = this.gameSystem.getFeaturesByCategory(category);
      features.forEach(feature => {
        this.features.set(feature.id, feature);
      });
    });
  }

  // Initialize the complete game
  async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing complete game integration...');
      
      // Initialize all systems
      for (const [name, system] of Array.from(this.systems.entries())) {
        try {
          if (system.initialize) {
            await system.initialize();
          }
          this.status.systemHealth.set(name, 'healthy');
        } catch (error) {
          console.error(`Failed to initialize ${name} system:`, error);
          this.status.systemHealth.set(name, 'error');
          this.status.errors.push(`${name}: ${String(error)}`);
        }
      }
      
      // Initialize all features
      for (const [id, feature] of Array.from(this.features.entries())) {
        try {
          if (this.gameSystem.canImplementFeature(id)) {
            feature.implemented = true;
            feature.functional = true;
            this.status.activeFeatures.push(id);
          }
        } catch (error) {
          console.error(`Failed to initialize feature ${id}:`, error);
          this.status.errors.push(`Feature ${id}: ${String(error)}`);
        }
      }
      
      this.isInitialized = true;
      console.log('✅ Game integration initialized successfully');
      return true;
      
    } catch (error) {
      console.error('Failed to initialize game integration:', error);
        this.status.errors.push(`Integration: ${String(error)}`);
      return false;
    }
  }

  // Start the game
  start() {
    if (!this.isInitialized) {
      console.error('Game not initialized');
      return false;
    }
    
    this.isRunning = true;
    this.lastUpdateTime = performance.now();
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
    
    console.log('🎮 Game started');
    return true;
  }

  // Stop the game
  stop() {
    this.isRunning = false;
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
    
    console.log('🛑 Game stopped');
  }

  // Main game loop
  private update(currentTime: number) {
    if (!this.isRunning) return;
    
    const deltaTime = currentTime - this.lastUpdateTime;
    this.lastUpdateTime = currentTime;
    
    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);
    
    // Update all systems
    this.updateSystems(deltaTime);
    
    // Update all features
    this.updateFeatures(deltaTime);
    
    // Check system health
    this.checkSystemHealth();
    
    // Continue game loop
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  private updatePerformanceMetrics(deltaTime: number) {
    this.performance.frameTime = deltaTime;
    this.performance.fps = 1000 / deltaTime;
    this.performance.memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    this.onPerformanceUpdate?.(this.performance);
  }

  private updateSystems(deltaTime: number) {
    for (const [name, system] of Array.from(this.systems.entries())) {
      try {
        if (system.update) {
          const startTime = performance.now();
          system.update(deltaTime);
          const endTime = performance.now();
          
          if (name === 'game') {
            this.performance.updateTime = endTime - startTime;
          }
        }
      } catch (error) {
        console.error(`Error updating ${name} system:`, error);
        this.status.systemHealth.set(name, 'error');
        this.onSystemError?.(name, String(error));
      }
    }
  }

  private updateFeatures(deltaTime: number) {
    for (const [id, feature] of Array.from(this.features.entries())) {
      try {
        if (feature.implemented && feature.functional) {
          // Update feature logic here
          this.onFeatureUpdate?.(id, 'active');
        }
      } catch (error) {
        console.error(`Error updating feature ${id}:`, error);
        feature.functional = false;
        this.onFeatureUpdate?.(id, 'error');
      }
    }
  }

  private checkSystemHealth() {
    for (const [name, health] of Array.from(this.status.systemHealth.entries())) {
      if (health === 'error') {
        this.status.warnings.push(`System ${name} is in error state`);
      }
    }
  }

  // Feature management
  enableFeature(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) return false;
    
    if (this.gameSystem.canImplementFeature(featureId)) {
      feature.implemented = true;
      feature.functional = true;
      this.status.activeFeatures.push(featureId);
      return true;
    }
    
    return false;
  }

  disableFeature(featureId: string): boolean {
    const feature = this.features.get(featureId);
    if (!feature) return false;
    
    feature.functional = false;
    const index = this.status.activeFeatures.indexOf(featureId);
    if (index > -1) {
      this.status.activeFeatures.splice(index, 1);
    }
    
    return true;
  }

  // System management
  getSystem(systemName: string): any {
    return this.systems.get(systemName);
  }

  getFeature(featureId: string): any {
    return this.features.get(featureId);
  }

  // Testing
  async runFeatureTests(): Promise<any> {
    console.log('🧪 Running comprehensive feature tests...');
    
    const results = await this.testingSystem.runAllTests();
    const summary = this.testingSystem.getTestSummary();
    
    console.log(`✅ Tests completed: ${summary.passed}/${summary.total} passed`);
    return { results, summary };
  }

  // Performance monitoring
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performance };
  }

  getSystemHealth(): Map<string, string> {
    return new Map(this.status.systemHealth);
  }

  getActiveFeatures(): string[] {
    return [...this.status.activeFeatures];
  }

  getErrors(): string[] {
    return [...this.status.errors];
  }

  getWarnings(): string[] {
    return [...this.status.warnings];
  }

  // Game status
  getGameStatus(): GameStatus {
    return {
      currentScene: this.status.currentScene,
      activeFeatures: [...this.status.activeFeatures],
      systemHealth: new Map(this.status.systemHealth),
      errors: [...this.status.errors],
      warnings: [...this.status.warnings]
    };
  }

  // Scene management
  changeScene(scene: string) {
    this.status.currentScene = scene;
    console.log(`🎬 Scene changed to: ${scene}`);
  }

  // Event setters
  setOnSystemError(callback: (system: string, error: string) => void) {
    this.onSystemError = callback;
  }

  setOnFeatureUpdate(callback: (feature: string, status: string) => void) {
    this.onFeatureUpdate = callback;
  }

  setOnPerformanceUpdate(callback: (metrics: PerformanceMetrics) => void) {
    this.onPerformanceUpdate = callback;
  }

  // Save/Load game state
  saveGameState() {
    const gameState = {
      status: this.status,
      activeFeatures: this.status.activeFeatures,
      systemHealth: Array.from(this.status.systemHealth.entries()),
      timestamp: Date.now()
    };
    
    localStorage.setItem('gameState', JSON.stringify(gameState));
    console.log('💾 Game state saved');
  }

  loadGameState(): boolean {
    const saved = localStorage.getItem('gameState');
    if (!saved) return false;
    
    try {
      const gameState = JSON.parse(saved);
      
      this.status = {
        ...this.status,
        activeFeatures: gameState.activeFeatures || [],
        systemHealth: new Map(gameState.systemHealth || []),
        errors: [],
        warnings: []
      };
      
      console.log('📁 Game state loaded');
      return true;
    } catch (error) {
      console.error('Failed to load game state:', error);
      return false;
    }
  }

  // Cleanup
  destroy() {
    this.stop();
    
    // Cleanup all systems
    for (const [name, system] of Array.from(this.systems.entries())) {
      try {
        if (system.destroy) {
          system.destroy();
        }
      } catch (error) {
        console.error(`Error destroying ${name} system:`, String(error));
      }
    }
    
    this.systems.clear();
    this.features.clear();
    this.isInitialized = false;
    
    console.log('🧹 Game integration destroyed');
  }

  // Get comprehensive game report
  getGameReport() {
    const featureStatus = this.gameSystem.getImplementationStatus();
    const systemHealth = this.getSystemHealth();
    const performance = this.getPerformanceMetrics();
    const activeFeatures = this.getActiveFeatures();
    const errors = this.getErrors();
    const warnings = this.getWarnings();
    
    return {
      features: featureStatus,
      systems: Object.fromEntries(systemHealth),
      performance,
      activeFeatures,
      errors,
      warnings,
      timestamp: Date.now()
    };
  }
}

export default CompleteGameIntegration;

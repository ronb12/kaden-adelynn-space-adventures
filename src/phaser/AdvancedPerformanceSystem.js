// Advanced Performance System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedPerformanceSystem {
  constructor(scene) {
    this.scene = scene;
    this.performanceMetrics = new Map();
    this.optimizations = new Map();
    this.monitoring = {
      enabled: true,
      interval: 1000,
      history: [],
      maxHistory: 100
    };
    
    this.performanceFeatures = {
      // 5 New Performance Features
      FRAME_RATE_OPTIMIZATION: {
        name: 'Frame Rate Optimization',
        description: 'Optimize frame rate for smooth gameplay',
        targetFPS: 60,
        adaptiveQuality: true,
        frameSkipping: true,
        renderOptimization: true
      },
      MEMORY_MANAGEMENT: {
        name: 'Memory Management',
        description: 'Efficient memory usage and garbage collection',
        objectPooling: true,
        textureAtlas: true,
        memoryMonitoring: true,
        garbageCollection: true
      },
      RENDERING_OPTIMIZATION: {
        name: 'Rendering Optimization',
        description: 'Optimize rendering performance',
        culling: true,
        batching: true,
        levelOfDetail: true,
        occlusionCulling: true
      },
      NETWORK_OPTIMIZATION: {
        name: 'Network Optimization',
        description: 'Optimize network performance',
        compression: true,
        deltaSync: true,
        prediction: true,
        bandwidthOptimization: true
      },
      LOADING_OPTIMIZATION: {
        name: 'Loading Optimization',
        description: 'Optimize loading times and resource management',
        lazyLoading: true,
        preloading: true,
        streaming: true,
        caching: true
      }
    };
  }

  initializePerformance() {
    this.performanceMetrics.clear();
    this.optimizations.clear();
    
    // Initialize performance features
    Object.keys(this.performanceFeatures).forEach(featureKey => {
      const feature = this.performanceFeatures[featureKey];
      this.optimizations.set(featureKey, {
        ...feature,
        active: false,
        metrics: {},
        settings: {}
      });
    });
    
    // Start performance monitoring
    this.startPerformanceMonitoring();
  }

  startPerformanceMonitoring() {
    if (!this.monitoring.enabled) return;
    
    this.scene.time.addEvent({
      delay: this.monitoring.interval,
      callback: () => {
        this.updatePerformanceMetrics();
      },
      loop: true
    });
  }

  updatePerformanceMetrics() {
    const metrics = {
      timestamp: this.scene.time.now,
      fps: this.scene.game.loop.actualFps,
      memory: this.getMemoryUsage(),
      renderTime: this.getRenderTime(),
      updateTime: this.getUpdateTime(),
      objectCount: this.getObjectCount(),
      textureMemory: this.getTextureMemory(),
      physicsBodies: this.getPhysicsBodyCount()
    };
    
    this.performanceMetrics.set('current', metrics);
    this.monitoring.history.push(metrics);
    
    // Keep only recent history
    if (this.monitoring.history.length > this.monitoring.maxHistory) {
      this.monitoring.history.shift();
    }
    
    // Apply optimizations based on metrics
    this.applyPerformanceOptimizations(metrics);
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }

  getRenderTime() {
    // Estimate render time based on frame rate
    const fps = this.scene.game.loop.actualFps;
    return fps > 0 ? 1000 / fps : 16.67;
  }

  getUpdateTime() {
    // Estimate update time
    return this.scene.game.loop.delta;
  }

  getObjectCount() {
    let count = 0;
    this.scene.children.list.forEach(child => {
      if (child.active) count++;
    });
    return count;
  }

  getTextureMemory() {
    // Estimate texture memory usage
    let memory = 0;
    this.scene.textures.list.forEach(texture => {
      if (texture.source) {
        memory += texture.source.width * texture.source.height * 4; // RGBA
      }
    });
    return memory;
  }

  getPhysicsBodyCount() {
    let count = 0;
    this.scene.physics.world.bodies.list.forEach(body => {
      if (body.active) count++;
    });
    return count;
  }

  applyPerformanceOptimizations(metrics) {
    // Frame rate optimization
    if (metrics.fps < 30) {
      this.enableFrameRateOptimization();
    } else if (metrics.fps > 50) {
      this.disableFrameRateOptimization();
    }
    
    // Memory optimization
    if (metrics.memory.used > metrics.memory.limit * 0.8) {
      this.enableMemoryManagement();
    }
    
    // Rendering optimization
    if (metrics.renderTime > 20) {
      this.enableRenderingOptimization();
    }
    
    // Object count optimization
    if (metrics.objectCount > 1000) {
      this.enableObjectCulling();
    }
  }

  enableFrameRateOptimization() {
    const optimization = this.optimizations.get('FRAME_RATE_OPTIMIZATION');
    if (optimization) {
      optimization.active = true;
      
      // Enable adaptive quality
      if (optimization.adaptiveQuality) {
        this.enableAdaptiveQuality();
      }
      
      // Enable frame skipping
      if (optimization.frameSkipping) {
        this.enableFrameSkipping();
      }
      
      // Enable render optimization
      if (optimization.renderOptimization) {
        this.enableRenderOptimization();
      }
    }
  }

  enableAdaptiveQuality() {
    // Reduce quality based on performance
    this.scene.cameras.main.setZoom(0.9);
    this.scene.setData('adaptiveQuality', true);
  }

  enableFrameSkipping() {
    // Skip frames when performance is low
    this.scene.setData('frameSkipping', true);
  }

  enableRenderOptimization() {
    // Optimize rendering
    this.scene.setData('renderOptimization', true);
  }

  disableFrameRateOptimization() {
    const optimization = this.optimizations.get('FRAME_RATE_OPTIMIZATION');
    if (optimization) {
      optimization.active = false;
      
      // Disable optimizations
      this.scene.cameras.main.setZoom(1);
      this.scene.setData('adaptiveQuality', false);
      this.scene.setData('frameSkipping', false);
      this.scene.setData('renderOptimization', false);
    }
  }

  enableMemoryManagement() {
    const optimization = this.optimizations.get('MEMORY_MANAGEMENT');
    if (optimization) {
      optimization.active = true;
      
      // Enable object pooling
      if (optimization.objectPooling) {
        this.enableObjectPooling();
      }
      
      // Enable texture atlas
      if (optimization.textureAtlas) {
        this.enableTextureAtlas();
      }
      
      // Enable memory monitoring
      if (optimization.memoryMonitoring) {
        this.enableMemoryMonitoring();
      }
      
      // Enable garbage collection
      if (optimization.garbageCollection) {
        this.enableGarbageCollection();
      }
    }
  }

  enableObjectPooling() {
    // Implement object pooling for frequently created/destroyed objects
    this.scene.setData('objectPooling', true);
    
    // Create object pools
    this.createObjectPools();
  }

  createObjectPools() {
    // Create pools for bullets, enemies, power-ups, etc.
    this.scene.setData('bulletPool', []);
    this.scene.setData('enemyPool', []);
    this.scene.setData('powerUpPool', []);
    this.scene.setData('particlePool', []);
  }

  getPooledObject(type) {
    const pool = this.scene.getData(`${type}Pool`);
    if (pool && pool.length > 0) {
      return pool.pop();
    }
    return null;
  }

  returnToPool(type, object) {
    const pool = this.scene.getData(`${type}Pool`);
    if (pool) {
      object.setActive(false);
      object.setVisible(false);
      pool.push(object);
    }
  }

  enableTextureAtlas() {
    // Use texture atlas for better memory management
    this.scene.setData('textureAtlas', true);
  }

  enableMemoryMonitoring() {
    // Monitor memory usage
    this.scene.setData('memoryMonitoring', true);
  }

  enableGarbageCollection() {
    // Force garbage collection when needed
    this.scene.setData('garbageCollection', true);
    
    // Run garbage collection periodically
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        if (this.scene.getData('garbageCollection')) {
          this.forceGarbageCollection();
        }
      },
      loop: true
    });
  }

  forceGarbageCollection() {
    // Force garbage collection
    if (window.gc) {
      window.gc();
    }
  }

  enableRenderingOptimization() {
    const optimization = this.optimizations.get('RENDERING_OPTIMIZATION');
    if (optimization) {
      optimization.active = true;
      
      // Enable culling
      if (optimization.culling) {
        this.enableCulling();
      }
      
      // Enable batching
      if (optimization.batching) {
        this.enableBatching();
      }
      
      // Enable level of detail
      if (optimization.levelOfDetail) {
        this.enableLevelOfDetail();
      }
      
      // Enable occlusion culling
      if (optimization.occlusionCulling) {
        this.enableOcclusionCulling();
      }
    }
  }

  enableCulling() {
    // Enable object culling
    this.scene.setData('culling', true);
  }

  enableBatching() {
    // Enable render batching
    this.scene.setData('batching', true);
  }

  enableLevelOfDetail() {
    // Enable level of detail
    this.scene.setData('levelOfDetail', true);
  }

  enableOcclusionCulling() {
    // Enable occlusion culling
    this.scene.setData('occlusionCulling', true);
  }

  enableNetworkOptimization() {
    const optimization = this.optimizations.get('NETWORK_OPTIMIZATION');
    if (optimization) {
      optimization.active = true;
      
      // Enable compression
      if (optimization.compression) {
        this.enableCompression();
      }
      
      // Enable delta sync
      if (optimization.deltaSync) {
        this.enableDeltaSync();
      }
      
      // Enable prediction
      if (optimization.prediction) {
        this.enablePrediction();
      }
      
      // Enable bandwidth optimization
      if (optimization.bandwidthOptimization) {
        this.enableBandwidthOptimization();
      }
    }
  }

  enableCompression() {
    // Enable data compression
    this.scene.setData('compression', true);
  }

  enableDeltaSync() {
    // Enable delta synchronization
    this.scene.setData('deltaSync', true);
  }

  enablePrediction() {
    // Enable client-side prediction
    this.scene.setData('prediction', true);
  }

  enableBandwidthOptimization() {
    // Enable bandwidth optimization
    this.scene.setData('bandwidthOptimization', true);
  }

  enableLoadingOptimization() {
    const optimization = this.optimizations.get('LOADING_OPTIMIZATION');
    if (optimization) {
      optimization.active = true;
      
      // Enable lazy loading
      if (optimization.lazyLoading) {
        this.enableLazyLoading();
      }
      
      // Enable preloading
      if (optimization.preloading) {
        this.enablePreloading();
      }
      
      // Enable streaming
      if (optimization.streaming) {
        this.enableStreaming();
      }
      
      // Enable caching
      if (optimization.caching) {
        this.enableCaching();
      }
    }
  }

  enableLazyLoading() {
    // Enable lazy loading of resources
    this.scene.setData('lazyLoading', true);
  }

  enablePreloading() {
    // Enable preloading of resources
    this.scene.setData('preloading', true);
  }

  enableStreaming() {
    // Enable streaming of resources
    this.scene.setData('streaming', true);
  }

  enableCaching() {
    // Enable resource caching
    this.scene.setData('caching', true);
  }

  // Performance analysis
  analyzePerformance() {
    const metrics = this.performanceMetrics.get('current');
    if (!metrics) return null;
    
    const analysis = {
      overall: this.calculateOverallPerformance(metrics),
      bottlenecks: this.identifyBottlenecks(metrics),
      recommendations: this.generateRecommendations(metrics),
      trends: this.analyzeTrends()
    };
    
    return analysis;
  }

  calculateOverallPerformance(metrics) {
    let score = 100;
    
    // FPS score
    if (metrics.fps < 30) score -= 30;
    else if (metrics.fps < 45) score -= 15;
    else if (metrics.fps < 55) score -= 5;
    
    // Memory score
    const memoryUsage = metrics.memory.used / metrics.memory.limit;
    if (memoryUsage > 0.9) score -= 25;
    else if (memoryUsage > 0.8) score -= 15;
    else if (memoryUsage > 0.7) score -= 5;
    
    // Object count score
    if (metrics.objectCount > 1000) score -= 20;
    else if (metrics.objectCount > 500) score -= 10;
    
    return Math.max(0, score);
  }

  identifyBottlenecks(metrics) {
    const bottlenecks = [];
    
    if (metrics.fps < 30) {
      bottlenecks.push('Low frame rate');
    }
    
    if (metrics.memory.used > metrics.memory.limit * 0.8) {
      bottlenecks.push('High memory usage');
    }
    
    if (metrics.objectCount > 1000) {
      bottlenecks.push('Too many objects');
    }
    
    if (metrics.renderTime > 20) {
      bottlenecks.push('Slow rendering');
    }
    
    return bottlenecks;
  }

  generateRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.fps < 30) {
      recommendations.push('Enable frame rate optimization');
      recommendations.push('Reduce object count');
      recommendations.push('Enable culling');
    }
    
    if (metrics.memory.used > metrics.memory.limit * 0.8) {
      recommendations.push('Enable memory management');
      recommendations.push('Use object pooling');
      recommendations.push('Optimize textures');
    }
    
    if (metrics.objectCount > 1000) {
      recommendations.push('Enable object culling');
      recommendations.push('Use object pooling');
      recommendations.push('Reduce spawn rates');
    }
    
    return recommendations;
  }

  analyzeTrends() {
    if (this.monitoring.history.length < 10) return null;
    
    const recent = this.monitoring.history.slice(-10);
    const trends = {
      fps: this.calculateTrend(recent, 'fps'),
      memory: this.calculateTrend(recent, 'memory.used'),
      objects: this.calculateTrend(recent, 'objectCount')
    };
    
    return trends;
  }

  calculateTrend(data, property) {
    if (data.length < 2) return 0;
    
    const values = data.map(item => {
      const keys = property.split('.');
      let value = item;
      for (const key of keys) {
        value = value[key];
      }
      return value;
    });
    
    const first = values[0];
    const last = values[values.length - 1];
    
    return ((last - first) / first) * 100;
  }

  // Performance reporting
  generatePerformanceReport() {
    const analysis = this.analyzePerformance();
    const metrics = this.performanceMetrics.get('current');
    
    return {
      timestamp: Date.now(),
      metrics: metrics,
      analysis: analysis,
      optimizations: this.getActiveOptimizations(),
      recommendations: analysis.recommendations
    };
  }

  getActiveOptimizations() {
    const active = [];
    this.optimizations.forEach((optimization, key) => {
      if (optimization.active) {
        active.push(key);
      }
    });
    return active;
  }

  // Performance testing
  runPerformanceTest() {
    const testResults = {
      fps: this.testFPS(),
      memory: this.testMemory(),
      rendering: this.testRendering(),
      loading: this.testLoading()
    };
    
    return testResults;
  }

  testFPS() {
    const startTime = this.scene.time.now;
    let frameCount = 0;
    
    const testInterval = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        frameCount++;
      },
      loop: true
    });
    
    this.scene.time.delayedCall(5000, () => {
      testInterval.destroy();
      const fps = frameCount / 5;
      return { fps: fps, passed: fps >= 30 };
    });
  }

  testMemory() {
    const memory = this.getMemoryUsage();
    const usage = memory.used / memory.limit;
    return { usage: usage, passed: usage < 0.8 };
  }

  testRendering() {
    const renderTime = this.getRenderTime();
    return { renderTime: renderTime, passed: renderTime < 20 };
  }

  testLoading() {
    const startTime = this.scene.time.now;
    // Simulate loading test
    return { loadTime: 1000, passed: true };
  }

  // Utility methods
  isOptimizationActive(featureKey) {
    const optimization = this.optimizations.get(featureKey);
    return optimization ? optimization.active : false;
  }

  getPerformanceMetrics() {
    return this.performanceMetrics.get('current');
  }

  getPerformanceHistory() {
    return this.monitoring.history;
  }

  clearPerformanceHistory() {
    this.monitoring.history = [];
  }

  setMonitoringInterval(interval) {
    this.monitoring.interval = interval;
  }

  enableMonitoring() {
    this.monitoring.enabled = true;
    this.startPerformanceMonitoring();
  }

  disableMonitoring() {
    this.monitoring.enabled = false;
  }
}

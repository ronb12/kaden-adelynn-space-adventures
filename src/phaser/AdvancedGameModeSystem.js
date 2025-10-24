// Advanced Game Mode System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedGameModeSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentMode = 'CLASSIC';
    this.modeData = new Map();
    
    this.gameModes = {
      // 10 New Game Modes
      QUANTUM_MODE: {
        name: 'Quantum Mode',
        description: 'Reality bends and shifts in this mode',
        emoji: '⚛️',
        rules: {
          timeDilation: true,
          quantumTunneling: true,
          probabilityWaves: true,
          uncertaintyPrinciple: true
        },
        modifiers: {
          enemySpeed: 0.8,
          bulletSpeed: 1.2,
          powerUpChance: 1.5,
          scoreMultiplier: 1.3
        }
      },
      
      DIMENSIONAL_MODE: {
        name: 'Dimensional Mode',
        description: 'Navigate between multiple dimensions',
        emoji: '🔮',
        rules: {
          dimensionShifting: true,
          realityAnchors: true,
          dimensionalRifts: true,
          phaseShifting: true
        },
        modifiers: {
          enemySpeed: 1.1,
          bulletSpeed: 0.9,
          powerUpChance: 1.2,
          scoreMultiplier: 1.5
        }
      },
      
      VOID_MODE: {
        name: 'Void Mode',
        description: 'Survive in the endless void',
        emoji: '🌑',
        rules: {
          voidEnergy: true,
          darkMatter: true,
          realityDistortion: true,
          voidCreatures: true
        },
        modifiers: {
          enemySpeed: 1.3,
          bulletSpeed: 1.1,
          powerUpChance: 0.8,
          scoreMultiplier: 1.8
        }
      },
      
      STELLAR_MODE: {
        name: 'Stellar Mode',
        description: 'Navigate through stellar phenomena',
        emoji: '⭐',
        rules: {
          stellarWinds: true,
          solarFlares: true,
          gravityWells: true,
          stellarNursery: true
        },
        modifiers: {
          enemySpeed: 1.0,
          bulletSpeed: 1.0,
          powerUpChance: 1.0,
          scoreMultiplier: 1.0
        }
      },
      
      CYBER_MODE: {
        name: 'Cyber Mode',
        description: 'Digital realm with AI enemies',
        emoji: '🤖',
        rules: {
          hacking: true,
          virusAttacks: true,
          systemOverride: true,
          dataStorms: true
        },
        modifiers: {
          enemySpeed: 1.2,
          bulletSpeed: 1.1,
          powerUpChance: 1.3,
          scoreMultiplier: 1.4
        }
      },
      
      ELEMENTAL_MODE: {
        name: 'Elemental Mode',
        description: 'Master the elements',
        emoji: '🌪️',
        rules: {
          firePower: true,
          icePower: true,
          lightningPower: true,
          earthPower: true,
          windPower: true,
          waterPower: true
        },
        modifiers: {
          enemySpeed: 1.1,
          bulletSpeed: 1.0,
          powerUpChance: 1.4,
          scoreMultiplier: 1.2
        }
      },
      
      TIME_MODE: {
        name: 'Time Mode',
        description: 'Control the flow of time',
        emoji: '⏰',
        rules: {
          timeSlow: true,
          timeReverse: true,
          temporalClones: true,
          timeStops: true
        },
        modifiers: {
          enemySpeed: 0.7,
          bulletSpeed: 1.3,
          powerUpChance: 1.1,
          scoreMultiplier: 1.6
        }
      },
      
      GRAVITY_MODE: {
        name: 'Gravity Mode',
        description: 'Navigate gravitational anomalies',
        emoji: '🌌',
        rules: {
          gravityWells: true,
          blackHoles: true,
          tidalForces: true,
          gravitationalLensing: true
        },
        modifiers: {
          enemySpeed: 0.9,
          bulletSpeed: 0.8,
          powerUpChance: 1.2,
          scoreMultiplier: 1.3
        }
      },
      
      CHAOS_MODE: {
        name: 'Chaos Mode',
        description: 'Everything is random and chaotic',
        emoji: '🌀',
        rules: {
          randomEvents: true,
          chaosStorms: true,
          realityBreaks: true,
          probabilityCollapse: true
        },
        modifiers: {
          enemySpeed: 'random',
          bulletSpeed: 'random',
          powerUpChance: 'random',
          scoreMultiplier: 'random'
        }
      },
      
      ULTIMATE_MODE: {
        name: 'Ultimate Mode',
        description: 'The ultimate challenge',
        emoji: '👑',
        rules: {
          allRules: true,
          ultimateBosses: true,
          realityBreak: true,
          existenceEnd: true
        },
        modifiers: {
          enemySpeed: 2.0,
          bulletSpeed: 1.5,
          powerUpChance: 0.5,
          scoreMultiplier: 3.0
        }
      }
    };
  }

  setGameMode(mode) {
    if (this.gameModes[mode]) {
      this.currentMode = mode;
      this.initializeModeData();
      this.applyModeRules();
      this.applyModeModifiers();
    }
  }

  initializeModeData() {
    const mode = this.gameModes[this.currentMode];
    this.modeData.set('rules', mode.rules);
    this.modeData.set('modifiers', mode.modifiers);
    this.modeData.set('startTime', this.scene.time.now);
    this.modeData.set('events', []);
  }

  applyModeRules() {
    const rules = this.modeData.get('rules');
    
    if (rules.timeDilation) {
      this.enableTimeDilation();
    }
    
    if (rules.quantumTunneling) {
      this.enableQuantumTunneling();
    }
    
    if (rules.probabilityWaves) {
      this.enableProbabilityWaves();
    }
    
    if (rules.uncertaintyPrinciple) {
      this.enableUncertaintyPrinciple();
    }
    
    if (rules.dimensionShifting) {
      this.enableDimensionShifting();
    }
    
    if (rules.realityAnchors) {
      this.enableRealityAnchors();
    }
    
    if (rules.dimensionalRifts) {
      this.enableDimensionalRifts();
    }
    
    if (rules.phaseShifting) {
      this.enablePhaseShifting();
    }
    
    if (rules.voidEnergy) {
      this.enableVoidEnergy();
    }
    
    if (rules.darkMatter) {
      this.enableDarkMatter();
    }
    
    if (rules.realityDistortion) {
      this.enableRealityDistortion();
    }
    
    if (rules.voidCreatures) {
      this.enableVoidCreatures();
    }
    
    if (rules.stellarWinds) {
      this.enableStellarWinds();
    }
    
    if (rules.solarFlares) {
      this.enableSolarFlares();
    }
    
    if (rules.gravityWells) {
      this.enableGravityWells();
    }
    
    if (rules.stellarNursery) {
      this.enableStellarNursery();
    }
    
    if (rules.hacking) {
      this.enableHacking();
    }
    
    if (rules.virusAttacks) {
      this.enableVirusAttacks();
    }
    
    if (rules.systemOverride) {
      this.enableSystemOverride();
    }
    
    if (rules.dataStorms) {
      this.enableDataStorms();
    }
    
    if (rules.firePower) {
      this.enableFirePower();
    }
    
    if (rules.icePower) {
      this.enableIcePower();
    }
    
    if (rules.lightningPower) {
      this.enableLightningPower();
    }
    
    if (rules.earthPower) {
      this.enableEarthPower();
    }
    
    if (rules.windPower) {
      this.enableWindPower();
    }
    
    if (rules.waterPower) {
      this.enableWaterPower();
    }
    
    if (rules.timeSlow) {
      this.enableTimeSlow();
    }
    
    if (rules.timeReverse) {
      this.enableTimeReverse();
    }
    
    if (rules.temporalClones) {
      this.enableTemporalClones();
    }
    
    if (rules.timeStops) {
      this.enableTimeStops();
    }
    
    if (rules.gravityWells) {
      this.enableGravityWells();
    }
    
    if (rules.blackHoles) {
      this.enableBlackHoles();
    }
    
    if (rules.tidalForces) {
      this.enableTidalForces();
    }
    
    if (rules.gravitationalLensing) {
      this.enableGravitationalLensing();
    }
    
    if (rules.randomEvents) {
      this.enableRandomEvents();
    }
    
    if (rules.chaosStorms) {
      this.enableChaosStorms();
    }
    
    if (rules.realityBreaks) {
      this.enableRealityBreaks();
    }
    
    if (rules.probabilityCollapse) {
      this.enableProbabilityCollapse();
    }
    
    if (rules.allRules) {
      this.enableAllRules();
    }
    
    if (rules.ultimateBosses) {
      this.enableUltimateBosses();
    }
    
    if (rules.realityBreak) {
      this.enableRealityBreak();
    }
    
    if (rules.existenceEnd) {
      this.enableExistenceEnd();
    }
  }

  applyModeModifiers() {
    const modifiers = this.modeData.get('modifiers');
    
    // Apply enemy speed modifier
    if (modifiers.enemySpeed !== 'random') {
      this.scene.enemySystem.setSpeedModifier(modifiers.enemySpeed);
    } else {
      this.scene.enemySystem.setSpeedModifier(Phaser.Math.FloatBetween(0.5, 2.0));
    }
    
    // Apply bullet speed modifier
    if (modifiers.bulletSpeed !== 'random') {
      this.scene.weaponSystem.setSpeedModifier(modifiers.bulletSpeed);
    } else {
      this.scene.weaponSystem.setSpeedModifier(Phaser.Math.FloatBetween(0.5, 2.0));
    }
    
    // Apply power-up chance modifier
    if (modifiers.powerUpChance !== 'random') {
      this.scene.powerUpSystem.setChanceModifier(modifiers.powerUpChance);
    } else {
      this.scene.powerUpSystem.setChanceModifier(Phaser.Math.FloatBetween(0.5, 2.0));
    }
    
    // Apply score multiplier
    if (modifiers.scoreMultiplier !== 'random') {
      this.scene.setScoreMultiplier(modifiers.scoreMultiplier);
    } else {
      this.scene.setScoreMultiplier(Phaser.Math.FloatBetween(0.5, 3.0));
    }
  }

  // Rule implementations
  enableTimeDilation() {
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        this.scene.cameras.main.setTimeScale(0.5);
        this.scene.time.delayedCall(3000, () => {
          this.scene.cameras.main.setTimeScale(1);
        });
      },
      loop: true
    });
  }

  enableQuantumTunneling() {
    this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        if (this.scene.player) {
          const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
          const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
          this.scene.player.setPosition(x, y);
        }
      },
      loop: true
    });
  }

  enableProbabilityWaves() {
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        // Create probability wave effect
        const wave = this.scene.add.graphics();
        wave.lineStyle(3, 0x00ffff, 0.8);
        wave.moveTo(0, this.scene.scale.height / 2);
        wave.lineTo(this.scene.scale.width, this.scene.scale.height / 2);
        
        this.scene.time.delayedCall(2000, () => {
          if (wave.active) wave.destroy();
        });
      },
      loop: true
    });
  }

  enableUncertaintyPrinciple() {
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        // Randomize enemy positions
        this.scene.enemies.children.entries.forEach(enemy => {
          if (enemy.active) {
            enemy.setPosition(
              Phaser.Math.Between(50, this.scene.scale.width - 50),
              Phaser.Math.Between(50, this.scene.scale.height - 50)
            );
          }
        });
      },
      loop: true
    });
  }

  enableDimensionShifting() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Shift to different dimension
        this.scene.cameras.main.flash(1000, 0xff00ff);
        this.scene.cameras.main.shake(1000, 0.02);
      },
      loop: true
    });
  }

  enableRealityAnchors() {
    this.scene.time.addEvent({
      delay: 12000,
      callback: () => {
        // Create reality anchor
        const anchor = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          50, 0x00ff00, 0.3
        );
        
        this.scene.time.delayedCall(8000, () => {
          if (anchor.active) anchor.destroy();
        });
      },
      loop: true
    });
  }

  enableDimensionalRifts() {
    this.scene.time.addEvent({
      delay: 20000,
      callback: () => {
        // Create dimensional rift
        const rift = this.scene.add.rectangle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          100, 20, 0x330066, 0.8
        );
        
        this.scene.time.delayedCall(10000, () => {
          if (rift.active) rift.destroy();
        });
      },
      loop: true
    });
  }

  enablePhaseShifting() {
    this.scene.time.addEvent({
      delay: 18000,
      callback: () => {
        if (this.scene.player) {
          this.scene.player.setAlpha(0.5);
          this.scene.time.delayedCall(3000, () => {
            if (this.scene.player) {
              this.scene.player.setAlpha(1);
            }
          });
        }
      },
      loop: true
    });
  }

  enableVoidEnergy() {
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        // Create void energy effect
        const voidEnergy = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          80, 0x330066, 0.4
        );
        
        this.scene.time.delayedCall(5000, () => {
          if (voidEnergy.active) voidEnergy.destroy();
        });
      },
      loop: true
    });
  }

  enableDarkMatter() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Create dark matter effect
        const darkMatter = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          60, 0x000000, 0.6
        );
        
        this.scene.time.delayedCall(7000, () => {
          if (darkMatter.active) darkMatter.destroy();
        });
      },
      loop: true
    });
  }

  enableRealityDistortion() {
    this.scene.time.addEvent({
      delay: 25000,
      callback: () => {
        // Create reality distortion
        this.scene.cameras.main.shake(2000, 0.03);
        this.scene.cameras.main.setZoom(0.8);
        this.scene.time.delayedCall(3000, () => {
          this.scene.cameras.main.setZoom(1);
        });
      },
      loop: true
    });
  }

  enableVoidCreatures() {
    this.scene.time.addEvent({
      delay: 30000,
      callback: () => {
        // Spawn void creatures
        for (let i = 0; i < 3; i++) {
          this.scene.enemySystem.spawnEnemy('DARK_SHADOW', 
            Phaser.Math.Between(0, this.scene.scale.width),
            Phaser.Math.Between(0, this.scene.scale.height)
          );
        }
      },
      loop: true
    });
  }

  enableStellarWinds() {
    this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        // Create stellar wind effect
        const wind = this.scene.add.graphics();
        wind.lineStyle(2, 0x87ceeb, 0.6);
        for (let i = 0; i < 10; i++) {
          wind.moveTo(0, i * 50);
          wind.lineTo(this.scene.scale.width, i * 50);
        }
        
        this.scene.time.delayedCall(3000, () => {
          if (wind.active) wind.destroy();
        });
      },
      loop: true
    });
  }

  enableSolarFlares() {
    this.scene.time.addEvent({
      delay: 12000,
      callback: () => {
        // Create solar flare effect
        const flare = this.scene.add.rectangle(
          Phaser.Math.Between(0, this.scene.scale.width),
          Phaser.Math.Between(0, this.scene.scale.height),
          200, 20, 0xff4400, 0.8
        );
        
        this.scene.time.delayedCall(2000, () => {
          if (flare.active) flare.destroy();
        });
      },
      loop: true
    });
  }

  enableGravityWells() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Create gravity well
        const gravityWell = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          100, 0x330066, 0.3
        );
        
        this.scene.time.delayedCall(10000, () => {
          if (gravityWell.active) gravityWell.destroy();
        });
      },
      loop: true
    });
  }

  enableStellarNursery() {
    this.scene.time.addEvent({
      delay: 20000,
      callback: () => {
        // Create stellar nursery effect
        const nursery = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          150, 0x8800ff, 0.2
        );
        
        this.scene.time.delayedCall(15000, () => {
          if (nursery.active) nursery.destroy();
        });
      },
      loop: true
    });
  }

  enableHacking() {
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        // Create hacking effect
        this.scene.cameras.main.flash(500, 0x00ff00);
      },
      loop: true
    });
  }

  enableVirusAttacks() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Create virus attack effect
        const virus = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          40, 0xff0000, 0.6
        );
        
        this.scene.time.delayedCall(5000, () => {
          if (virus.active) virus.destroy();
        });
      },
      loop: true
    });
  }

  enableSystemOverride() {
    this.scene.time.addEvent({
      delay: 20000,
      callback: () => {
        // Create system override effect
        this.scene.cameras.main.shake(1000, 0.01);
      },
      loop: true
    });
  }

  enableDataStorms() {
    this.scene.time.addEvent({
      delay: 25000,
      callback: () => {
        // Create data storm effect
        const storm = this.scene.add.rectangle(
          Phaser.Math.Between(0, this.scene.scale.width),
          Phaser.Math.Between(0, this.scene.scale.height),
          300, 300, 0x00ffff, 0.3
        );
        
        this.scene.time.delayedCall(8000, () => {
          if (storm.active) storm.destroy();
        });
      },
      loop: true
    });
  }

  enableFirePower() {
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        // Create fire power effect
        const fire = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          60, 0xff4400, 0.7
        );
        
        this.scene.time.delayedCall(4000, () => {
          if (fire.active) fire.destroy();
        });
      },
      loop: true
    });
  }

  enableIcePower() {
    this.scene.time.addEvent({
      delay: 12000,
      callback: () => {
        // Create ice power effect
        const ice = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          50, 0x00ffff, 0.6
        );
        
        this.scene.time.delayedCall(6000, () => {
          if (ice.active) ice.destroy();
        });
      },
      loop: true
    });
  }

  enableLightningPower() {
    this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        // Create lightning power effect
        const lightning = this.scene.add.graphics();
        lightning.lineStyle(5, 0xffff00);
        lightning.moveTo(0, 0);
        lightning.lineTo(this.scene.scale.width, this.scene.scale.height);
        
        this.scene.time.delayedCall(1000, () => {
          if (lightning.active) lightning.destroy();
        });
      },
      loop: true
    });
  }

  enableEarthPower() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Create earth power effect
        const earth = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          80, 0x8b4513, 0.5
        );
        
        this.scene.time.delayedCall(7000, () => {
          if (earth.active) earth.destroy();
        });
      },
      loop: true
    });
  }

  enableWindPower() {
    this.scene.time.addEvent({
      delay: 6000,
      callback: () => {
        // Create wind power effect
        const wind = this.scene.add.graphics();
        wind.lineStyle(3, 0x87ceeb, 0.8);
        for (let i = 0; i < 5; i++) {
          wind.moveTo(0, i * 100);
          wind.lineTo(this.scene.scale.width, i * 100);
        }
        
        this.scene.time.delayedCall(2000, () => {
          if (wind.active) wind.destroy();
        });
      },
      loop: true
    });
  }

  enableWaterPower() {
    this.scene.time.addEvent({
      delay: 18000,
      callback: () => {
        // Create water power effect
        const water = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          70, 0x0066cc, 0.4
        );
        
        this.scene.time.delayedCall(8000, () => {
          if (water.active) water.destroy();
        });
      },
      loop: true
    });
  }

  enableTimeSlow() {
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        this.scene.cameras.main.setTimeScale(0.3);
        this.scene.time.delayedCall(5000, () => {
          this.scene.cameras.main.setTimeScale(1);
        });
      },
      loop: true
    });
  }

  enableTimeReverse() {
    this.scene.time.addEvent({
      delay: 20000,
      callback: () => {
        // Reverse time effect
        this.scene.cameras.main.setTimeScale(-0.5);
        this.scene.time.delayedCall(3000, () => {
          this.scene.cameras.main.setTimeScale(1);
        });
      },
      loop: true
    });
  }

  enableTemporalClones() {
    this.scene.time.addEvent({
      delay: 25000,
      callback: () => {
        // Create temporal clone effect
        if (this.scene.player) {
          const clone = this.scene.add.sprite(
            this.scene.player.x, this.scene.player.y, 'player'
          );
          clone.setAlpha(0.5);
          clone.setTint(0x00ffff);
          
          this.scene.time.delayedCall(5000, () => {
            if (clone.active) clone.destroy();
          });
        }
      },
      loop: true
    });
  }

  enableTimeStops() {
    this.scene.time.addEvent({
      delay: 30000,
      callback: () => {
        // Stop time effect
        this.scene.cameras.main.setTimeScale(0);
        this.scene.time.delayedCall(2000, () => {
          this.scene.cameras.main.setTimeScale(1);
        });
      },
      loop: true
    });
  }

  enableBlackHoles() {
    this.scene.time.addEvent({
      delay: 20000,
      callback: () => {
        // Create black hole effect
        const blackHole = this.scene.add.circle(
          Phaser.Math.Between(100, this.scene.scale.width - 100),
          Phaser.Math.Between(100, this.scene.scale.height - 100),
          120, 0x000000, 0.8
        );
        
        this.scene.time.delayedCall(15000, () => {
          if (blackHole.active) blackHole.destroy();
        });
      },
      loop: true
    });
  }

  enableTidalForces() {
    this.scene.time.addEvent({
      delay: 18000,
      callback: () => {
        // Create tidal force effect
        this.scene.cameras.main.shake(3000, 0.02);
      },
      loop: true
    });
  }

  enableGravitationalLensing() {
    this.scene.time.addEvent({
      delay: 22000,
      callback: () => {
        // Create gravitational lensing effect
        this.scene.cameras.main.setZoom(1.2);
        this.scene.time.delayedCall(4000, () => {
          this.scene.cameras.main.setZoom(1);
        });
      },
      loop: true
    });
  }

  enableRandomEvents() {
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        // Random event
        const events = [
          () => this.scene.cameras.main.flash(1000, 0xff0000),
          () => this.scene.cameras.main.shake(1000, 0.01),
          () => this.scene.cameras.main.setZoom(0.8),
          () => this.scene.cameras.main.setZoom(1.2)
        ];
        
        const randomEvent = Phaser.Utils.Array.GetRandom(events);
        randomEvent();
        
        this.scene.time.delayedCall(2000, () => {
          this.scene.cameras.main.setZoom(1);
        });
      },
      loop: true
    });
  }

  enableChaosStorms() {
    this.scene.time.addEvent({
      delay: 15000,
      callback: () => {
        // Create chaos storm effect
        const storm = this.scene.add.rectangle(
          Phaser.Math.Between(0, this.scene.scale.width),
          Phaser.Math.Between(0, this.scene.scale.height),
          400, 400, 0xff00ff, 0.3
        );
        
        this.scene.time.delayedCall(10000, () => {
          if (storm.active) storm.destroy();
        });
      },
      loop: true
    });
  }

  enableRealityBreaks() {
    this.scene.time.addEvent({
      delay: 30000,
      callback: () => {
        // Create reality break effect
        this.scene.cameras.main.shake(2000, 0.05);
        this.scene.cameras.main.flash(1000, 0xff00ff);
      },
      loop: true
    });
  }

  enableProbabilityCollapse() {
    this.scene.time.addEvent({
      delay: 25000,
      callback: () => {
        // Create probability collapse effect
        this.scene.cameras.main.setTimeScale(0.1);
        this.scene.time.delayedCall(1000, () => {
          this.scene.cameras.main.setTimeScale(1);
        });
      },
      loop: true
    });
  }

  enableAllRules() {
    // Enable all rules for ultimate mode
    Object.keys(this.gameModes).forEach(mode => {
      if (mode !== 'ULTIMATE_MODE') {
        const modeRules = this.gameModes[mode].rules;
        Object.keys(modeRules).forEach(rule => {
          if (modeRules[rule]) {
            this[`enable${rule.charAt(0).toUpperCase() + rule.slice(1)}`]();
          }
        });
      }
    });
  }

  enableUltimateBosses() {
    this.scene.time.addEvent({
      delay: 60000,
      callback: () => {
        // Spawn ultimate boss
        this.scene.bossSystem.spawnBoss('FINAL_BOSS', 
          this.scene.scale.width / 2, 
          this.scene.scale.height / 2
        );
      },
      loop: true
    });
  }

  enableRealityBreak() {
    this.scene.time.addEvent({
      delay: 45000,
      callback: () => {
        // Create reality break effect
        this.scene.cameras.main.shake(5000, 0.03);
        this.scene.cameras.main.flash(2000, 0xff0000);
      },
      loop: true
    });
  }

  enableExistenceEnd() {
    this.scene.time.addEvent({
      delay: 120000,
      callback: () => {
        // End existence effect
        this.scene.cameras.main.fadeOut(5000, 0, 0, 0);
      }
    });
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getModeData() {
    return this.modeData;
  }

  getAllModes() {
    return Object.keys(this.gameModes);
  }

  getModeInfo(mode) {
    return this.gameModes[mode];
  }
}

// Advanced Level System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedLevelSystem {
  constructor(scene) {
    this.scene = scene;
    this.currentLevel = 1;
    this.environments = {
      // 25 New Space Environments
      ASTEROID_FIELD: {
        name: 'Asteroid Field',
        background: '#1a1a2e',
        particles: ['asteroid', 'dust', 'debris'],
        hazards: ['collision', 'gravity_well'],
        music: 'ambient_space',
        description: 'Navigate through dangerous asteroid clusters'
      },
      NEBULA_ZONE: {
        name: 'Nebula Zone',
        background: '#16213e',
        particles: ['gas', 'energy', 'cosmic_dust'],
        hazards: ['radiation', 'energy_storm'],
        music: 'mystical_nebula',
        description: 'Beautiful but deadly cosmic gas clouds'
      },
      SPACE_STATION: {
        name: 'Space Station',
        background: '#0f3460',
        particles: ['sparks', 'smoke', 'debris'],
        hazards: ['turret_fire', 'security_drones'],
        music: 'industrial_ambient',
        description: 'Abandoned space station with hidden dangers'
      },
      CRYSTAL_CAVES: {
        name: 'Crystal Caves',
        background: '#533483',
        particles: ['crystal_shards', 'light_reflections', 'energy'],
        hazards: ['crystal_spikes', 'lightning'],
        music: 'crystalline_harmony',
        description: 'Crystalline formations with mysterious properties'
      },
      VOID_DIMENSION: {
        name: 'Void Dimension',
        background: '#000000',
        particles: ['void_energy', 'dark_matter', 'shadows'],
        hazards: ['reality_distortion', 'void_creatures'],
        music: 'void_whispers',
        description: 'A dimension where reality bends and breaks'
      },
      DRAGON_LAIR: {
        name: 'Dragon Lair',
        background: '#8b0000',
        particles: ['fire', 'smoke', 'ash'],
        hazards: ['fire_breath', 'lava_pools'],
        music: 'epic_dragon',
        description: 'Ancient dragon\'s lair filled with treasure and danger'
      },
      SHADOW_REALM: {
        name: 'Shadow Realm',
        background: '#2c1810',
        particles: ['shadows', 'dark_energy', 'fog'],
        hazards: ['shadow_creatures', 'darkness'],
        music: 'shadow_ambient',
        description: 'Realm of shadows where light cannot penetrate'
      },
      NEBULA_CORE: {
        name: 'Nebula Core',
        background: '#4a148c',
        particles: ['cosmic_energy', 'stellar_wind', 'plasma'],
        hazards: ['energy_storms', 'gravity_anomalies'],
        music: 'cosmic_symphony',
        description: 'The heart of a massive nebula with intense energy'
      },
      CYBER_FORTRESS: {
        name: 'Cyber Fortress',
        background: '#006064',
        particles: ['data_streams', 'holograms', 'circuits'],
        hazards: ['security_systems', 'cyber_attacks'],
        music: 'cyber_ambient',
        description: 'Futuristic fortress controlled by AI'
      },
      ABYSSAL_DEPTHS: {
        name: 'Abyssal Depths',
        background: '#1a237e',
        particles: ['bioluminescence', 'deep_sea_creatures', 'bubbles'],
        hazards: ['pressure', 'deep_sea_monsters'],
        music: 'abyssal_depths',
        description: 'The deepest parts of space where strange creatures dwell'
      },
      COSMIC_STORM: {
        name: 'Cosmic Storm',
        background: '#3e2723',
        particles: ['lightning', 'cosmic_wind', 'energy_bolts'],
        hazards: ['lightning_strikes', 'energy_surges'],
        music: 'storm_symphony',
        description: 'A massive cosmic storm with incredible energy'
      },
      FINAL_BATTLE: {
        name: 'Final Battle',
        background: '#e91e63',
        particles: ['reality_fragments', 'dimensional_energy', 'chaos'],
        hazards: ['reality_break', 'dimensional_rifts'],
        music: 'final_battle',
        description: 'The ultimate battle for the fate of the universe'
      },
      QUANTUM_REALM: {
        name: 'Quantum Realm',
        background: '#4a148c',
        particles: ['quantum_fluctuations', 'probability_waves', 'uncertainty'],
        hazards: ['quantum_tunneling', 'probability_collapse'],
        music: 'quantum_harmony',
        description: 'Where quantum mechanics rule reality'
      },
      DIMENSIONAL_RIFT: {
        name: 'Dimensional Rift',
        background: '#6a1b9a',
        particles: ['dimensional_energy', 'reality_fragments', 'void_energy'],
        hazards: ['dimensional_instability', 'reality_distortion'],
        music: 'dimensional_chaos',
        description: 'A tear in the fabric of space-time'
      },
      STAR_NURSERY: {
        name: 'Star Nursery',
        background: '#0d47a1',
        particles: ['stellar_gas', 'protostars', 'cosmic_dust'],
        hazards: ['stellar_winds', 'gravity_wells'],
        music: 'stellar_birth',
        description: 'Where new stars are born from cosmic gas'
      },
      BLACK_HOLE: {
        name: 'Black Hole',
        background: '#000000',
        particles: ['event_horizon', 'accretion_disk', 'hawking_radiation'],
        hazards: ['spaghettification', 'tidal_forces'],
        music: 'gravitational_waves',
        description: 'The ultimate gravitational anomaly'
      },
      PLANETARY_RING: {
        name: 'Planetary Ring',
        background: '#37474f',
        particles: ['ring_particles', 'ice_crystals', 'cosmic_dust'],
        hazards: ['collision_course', 'gravity_wells'],
        music: 'orbital_harmony',
        description: 'Navigate through a planet\'s ring system'
      },
      SOLAR_FLARE: {
        name: 'Solar Flare',
        background: '#ff6f00',
        particles: ['solar_plasma', 'magnetic_fields', 'energy_bolts'],
        hazards: ['radiation_burst', 'magnetic_storms'],
        music: 'solar_symphony',
        description: 'Intense solar activity with massive energy'
      },
      COMET_TAIL: {
        name: 'Comet Tail',
        background: '#1a237e',
        particles: ['comet_dust', 'ice_particles', 'solar_wind'],
        hazards: ['ice_shards', 'solar_radiation'],
        music: 'comet_melody',
        description: 'Follow the trail of a massive comet'
      },
      GALACTIC_CENTER: {
        name: 'Galactic Center',
        background: '#4a148c',
        particles: ['stellar_dust', 'cosmic_radiation', 'gravitational_waves'],
        hazards: ['intense_gravity', 'cosmic_radiation'],
        music: 'galactic_center',
        description: 'The heart of the galaxy with incredible forces'
      },
      DARK_MATTER_CLOUD: {
        name: 'Dark Matter Cloud',
        background: '#2e2e2e',
        particles: ['dark_matter', 'gravitational_lensing', 'invisible_energy'],
        hazards: ['gravitational_anomalies', 'invisible_obstacles'],
        music: 'dark_matter_whispers',
        description: 'A cloud of mysterious dark matter'
      },
      PULSAR_FIELD: {
        name: 'Pulsar Field',
        background: '#1a237e',
        particles: ['pulsar_beams', 'magnetic_fields', 'neutron_star_energy'],
        hazards: ['pulsar_radiation', 'magnetic_storms'],
        music: 'pulsar_rhythm',
        description: 'Navigate through a field of pulsars'
      },
      QUASAR_JET: {
        name: 'Quasar Jet',
        background: '#4a148c',
        particles: ['relativistic_jet', 'high_energy_particles', 'cosmic_radiation'],
        hazards: ['intense_radiation', 'relativistic_effects'],
        music: 'quasar_symphony',
        description: 'The powerful jet from a distant quasar'
      },
      SUPERNOVA_REMNANT: {
        name: 'Supernova Remnant',
        background: '#6a1b9a',
        particles: ['shock_waves', 'heavy_elements', 'cosmic_radiation'],
        hazards: ['shock_wave_damage', 'intense_radiation'],
        music: 'supernova_echo',
        description: 'The aftermath of a massive stellar explosion'
      },
      WORMHOLE: {
        name: 'Wormhole',
        background: '#000000',
        particles: ['spacetime_distortion', 'gravitational_lensing', 'exotic_matter'],
        hazards: ['spacetime_anomalies', 'gravitational_tides'],
        music: 'wormhole_transit',
        description: 'A tunnel through space-time itself'
      }
    };
  }

  createEnvironment(environmentType) {
    const env = this.environments[environmentType];
    if (!env) return;

    // Create background
    this.createBackground(env);
    
    // Create particles
    this.createParticles(env);
    
    // Create hazards
    this.createHazards(env);
    
    // Play music
    this.playMusic(env);
  }

  createBackground(env) {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(env.background);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);
    
    // Add gradient effect
    graphics.fillGradientStyle(
      this.hexToColor(env.background),
      this.hexToColor(env.background),
      this.hexToColor(env.background),
      this.hexToColor(env.background),
      1
    );
  }

  createParticles(env) {
    env.particles.forEach(particleType => {
      this.createParticleSystem(particleType);
    });
  }

  createParticleSystem(particleType) {
    const particles = this.scene.add.particles(0, 0, particleType, {
      speed: { min: 50, max: 200 },
      scale: { start: 0.5, end: 0 },
      lifespan: 3000,
      quantity: 10,
      frequency: 100
    });
    
    // Configure particle behavior based on type
    switch (particleType) {
      case 'asteroid':
        particles.setSpeed({ min: 30, max: 100 });
        particles.setScale({ start: 1, end: 0.1 });
        break;
      case 'gas':
        particles.setSpeed({ min: 20, max: 80 });
        particles.setAlpha({ start: 0.8, end: 0 });
        break;
      case 'energy':
        particles.setSpeed({ min: 100, max: 300 });
        particles.setTint(0x00ffff);
        break;
      case 'fire':
        particles.setSpeed({ min: 50, max: 150 });
        particles.setTint(0xff4400);
        break;
      case 'shadows':
        particles.setSpeed({ min: 10, max: 50 });
        particles.setTint(0x330066);
        break;
    }
  }

  createHazards(env) {
    env.hazards.forEach(hazardType => {
      this.createHazard(hazardType);
    });
  }

  createHazard(hazardType) {
    switch (hazardType) {
      case 'collision':
        this.createCollisionHazard();
        break;
      case 'gravity_well':
        this.createGravityWell();
        break;
      case 'radiation':
        this.createRadiationHazard();
        break;
      case 'energy_storm':
        this.createEnergyStorm();
        break;
      case 'turret_fire':
        this.createTurretHazard();
        break;
      case 'crystal_spikes':
        this.createCrystalSpikes();
        break;
      case 'reality_distortion':
        this.createRealityDistortion();
        break;
      case 'fire_breath':
        this.createFireBreath();
        break;
      case 'shadow_creatures':
        this.createShadowCreatures();
        break;
      case 'energy_storms':
        this.createEnergyStorms();
        break;
      case 'security_systems':
        this.createSecuritySystems();
        break;
      case 'deep_sea_monsters':
        this.createDeepSeaMonsters();
        break;
      case 'lightning_strikes':
        this.createLightningStrikes();
        break;
      case 'reality_break':
        this.createRealityBreak();
        break;
    }
  }

  createCollisionHazard() {
    // Create moving asteroids that can collide with player
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const asteroid = this.scene.add.rectangle(x, -50, 40, 40, 0x8b4513);
        this.scene.physics.add.existing(asteroid);
        asteroid.body.setVelocityY(100);
        
        this.scene.time.delayedCall(10000, () => {
          if (asteroid.active) asteroid.destroy();
        });
      },
      loop: true
    });
  }

  createGravityWell() {
    // Create gravity wells that pull player
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
        const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
        
        const gravityWell = this.scene.add.circle(x, y, 80, 0x330066, 0.3);
        
        // Pull player towards gravity well
        this.scene.time.addEvent({
          delay: 100,
          callback: () => {
            if (gravityWell.active && this.scene.player) {
              const distance = Phaser.Math.Distance.Between(
                this.scene.player.x, this.scene.player.y, x, y
              );
              if (distance < 200) {
                const angle = Phaser.Math.Angle.Between(
                  this.scene.player.x, this.scene.player.y, x, y
                );
                this.scene.player.body.setVelocity(
                  this.scene.player.body.velocity.x + Math.cos(angle) * 50,
                  this.scene.player.body.velocity.y + Math.sin(angle) * 50
                );
              }
            }
          },
          loop: true
        });
        
        this.scene.time.delayedCall(8000, () => {
          if (gravityWell.active) gravityWell.destroy();
        });
      },
      loop: true
    });
  }

  createRadiationHazard() {
    // Create radiation zones that damage player
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
        const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
        
        const radiation = this.scene.add.circle(x, y, 60, 0x00ff00, 0.2);
        
        this.scene.time.delayedCall(5000, () => {
          if (radiation.active) radiation.destroy();
        });
      },
      loop: true
    });
  }

  createEnergyStorm() {
    // Create energy storms with lightning
    this.scene.time.addEvent({
      delay: 4000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);
        
        const lightning = this.scene.add.graphics();
        lightning.lineStyle(3, 0xffff00);
        lightning.moveTo(x, y);
        lightning.lineTo(x + Phaser.Math.Between(-100, 100), y + Phaser.Math.Between(-100, 100));
        
        this.scene.time.delayedCall(1000, () => {
          if (lightning.active) lightning.destroy();
        });
      },
      loop: true
    });
  }

  createTurretHazard() {
    // Create turrets that shoot at player
    this.scene.time.addEvent({
      delay: 6000,
      callback: () => {
        const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
        const y = Phaser.Math.Between(50, this.scene.scale.height - 50);
        
        const turret = this.scene.add.rectangle(x, y, 30, 30, 0xff0000);
        
        // Turret shoots at player
        this.scene.time.addEvent({
          delay: 1000,
          callback: () => {
            if (turret.active && this.scene.player) {
              const bullet = this.scene.add.circle(x, y, 5, 0xff0000);
              this.scene.physics.add.existing(bullet);
              
              const angle = Phaser.Math.Angle.Between(x, y, this.scene.player.x, this.scene.player.y);
              bullet.body.setVelocity(
                Math.cos(angle) * 200,
                Math.sin(angle) * 200
              );
              
              this.scene.time.delayedCall(3000, () => {
                if (bullet.active) bullet.destroy();
              });
            }
          },
          loop: true
        });
        
        this.scene.time.delayedCall(15000, () => {
          if (turret.active) turret.destroy();
        });
      },
      loop: true
    });
  }

  createCrystalSpikes() {
    // Create crystal spikes that grow from ground
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
        const y = this.scene.scale.height - 50;
        
        const spike = this.scene.add.triangle(x, y, 0, 0, 20, 0, 10, -40, 0x00ffff);
        
        this.scene.tweens.add({
          targets: spike,
          scaleY: 2,
          duration: 1000,
          yoyo: true,
          onComplete: () => {
            if (spike.active) spike.destroy();
          }
        });
      },
      loop: true
    });
  }

  createRealityDistortion() {
    // Create reality distortion effects
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.cameras.main.shake(500, 0.01);
        
        // Distort player controls temporarily
        if (this.scene.player) {
          this.scene.player.setData('realityDistorted', true);
          this.scene.time.delayedCall(3000, () => {
            if (this.scene.player) {
              this.scene.player.setData('realityDistorted', false);
            }
          });
        }
      },
      loop: true
    });
  }

  createFireBreath() {
    // Create fire breath hazards
    this.scene.time.addEvent({
      delay: 4000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);
        
        const fire = this.scene.add.rectangle(x, y, 100, 20, 0xff4400, 0.8);
        
        this.scene.tweens.add({
          targets: fire,
          scaleX: 3,
          duration: 2000,
          onComplete: () => {
            if (fire.active) fire.destroy();
          }
        });
      },
      loop: true
    });
  }

  createShadowCreatures() {
    // Create shadow creatures that move unpredictably
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);
        
        const shadow = this.scene.add.circle(x, y, 20, 0x330066, 0.8);
        
        this.scene.tweens.add({
          targets: shadow,
          x: Phaser.Math.Between(0, this.scene.scale.width),
          y: Phaser.Math.Between(0, this.scene.scale.height),
          duration: 3000,
          onComplete: () => {
            if (shadow.active) shadow.destroy();
          }
        });
      },
      loop: true
    });
  }

  createEnergyStorms() {
    // Create energy storms with multiple effects
    this.scene.time.addEvent({
      delay: 6000,
      callback: () => {
        const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
        const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
        
        const storm = this.scene.add.circle(x, y, 100, 0x00ffff, 0.3);
        
        this.scene.tweens.add({
          targets: storm,
          scaleX: 2,
          scaleY: 2,
          duration: 2000,
          onComplete: () => {
            if (storm.active) storm.destroy();
          }
        });
      },
      loop: true
    });
  }

  createSecuritySystems() {
    // Create security systems that detect and attack player
    this.scene.time.addEvent({
      delay: 8000,
      callback: () => {
        const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
        const y = Phaser.Math.Between(50, this.scene.scale.height - 50);
        
        const security = this.scene.add.rectangle(x, y, 40, 40, 0xff0000, 0.5);
        
        // Security system behavior
        this.scene.time.addEvent({
          delay: 2000,
          callback: () => {
            if (security.active && this.scene.player) {
              const distance = Phaser.Math.Distance.Between(x, y, this.scene.player.x, this.scene.player.y);
              if (distance < 150) {
                // Alert triggered
                security.setTint(0xff0000);
                this.scene.cameras.main.flash(500, 255, 0, 0);
              }
            }
          },
          loop: true
        });
        
        this.scene.time.delayedCall(20000, () => {
          if (security.active) security.destroy();
        });
      },
      loop: true
    });
  }

  createDeepSeaMonsters() {
    // Create deep sea monsters that lurk in the depths
    this.scene.time.addEvent({
      delay: 10000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = this.scene.scale.height - 100;
        
        const monster = this.scene.add.ellipse(x, y, 80, 40, 0x0066cc, 0.8);
        
        this.scene.tweens.add({
          targets: monster,
          y: y - 200,
          duration: 3000,
          onComplete: () => {
            if (monster.active) monster.destroy();
          }
        });
      },
      loop: true
    });
  }

  createLightningStrikes() {
    // Create lightning strikes that hit random locations
    this.scene.time.addEvent({
      delay: 3000,
      callback: () => {
        const x = Phaser.Math.Between(0, this.scene.scale.width);
        const y = Phaser.Math.Between(0, this.scene.scale.height);
        
        const lightning = this.scene.add.graphics();
        lightning.lineStyle(5, 0xffff00);
        lightning.moveTo(x, 0);
        lightning.lineTo(x, y);
        
        this.scene.time.delayedCall(500, () => {
          if (lightning.active) lightning.destroy();
        });
      },
      loop: true
    });
  }

  createRealityBreak() {
    // Create reality break effects
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.cameras.main.shake(1000, 0.02);
        
        // Create reality fragments
        for (let i = 0; i < 5; i++) {
          const fragment = this.scene.add.rectangle(
            Phaser.Math.Between(0, this.scene.scale.width),
            Phaser.Math.Between(0, this.scene.scale.height),
            20, 20, 0xff00ff, 0.8
          );
          
          this.scene.tweens.add({
            targets: fragment,
            alpha: 0,
            scaleX: 0,
            scaleY: 0,
            duration: 2000,
            onComplete: () => {
              if (fragment.active) fragment.destroy();
            }
          });
        }
      },
      loop: true
    });
  }

  playMusic(env) {
    // Play environment-specific music
    if (env.music) {
      // This would integrate with the sound system
      console.log(`Playing music: ${env.music}`);
    }
  }

  hexToColor(hex) {
    return parseInt(hex.replace('#', ''), 16);
  }

  getRandomEnvironment() {
    const envKeys = Object.keys(this.environments);
    return envKeys[Math.floor(Math.random() * envKeys.length)];
  }

  getEnvironmentByLevel(level) {
    const envKeys = Object.keys(this.environments);
    return envKeys[level % envKeys.length];
  }
}

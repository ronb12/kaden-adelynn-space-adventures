// Advanced Game Mechanics System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedGameMechanicsSystem {
  constructor(scene) {
    this.scene = scene;
    this.mechanics = new Map();
    this.activeMechanics = new Set();
    
    this.gameMechanics = {
      // 15 New Game Mechanics
      GRAVITY_WELLS: {
        name: 'Gravity Wells',
        description: 'Create gravitational anomalies that affect movement',
        type: 'environmental',
        duration: 10000,
        cooldown: 15000,
        effect: 'gravity_well'
      },
      TIME_DILATION: {
        name: 'Time Dilation',
        description: 'Slow down time in specific areas',
        type: 'temporal',
        duration: 8000,
        cooldown: 20000,
        effect: 'time_slow'
      },
      DIMENSIONAL_RIFTS: {
        name: 'Dimensional Rifts',
        description: 'Create portals between different dimensions',
        type: 'spatial',
        duration: 12000,
        cooldown: 25000,
        effect: 'dimensional_rift'
      },
      QUANTUM_TUNNELING: {
        name: 'Quantum Tunneling',
        description: 'Allow passage through solid objects',
        type: 'quantum',
        duration: 5000,
        cooldown: 30000,
        effect: 'quantum_tunnel'
      },
      REALITY_ANCHORS: {
        name: 'Reality Anchors',
        description: 'Stabilize reality in chaotic areas',
        type: 'reality',
        duration: 15000,
        cooldown: 35000,
        effect: 'reality_anchor'
      },
      ENERGY_VORTEX: {
        name: 'Energy Vortex',
        description: 'Create spinning energy fields that damage enemies',
        type: 'energy',
        duration: 10000,
        cooldown: 18000,
        effect: 'energy_vortex'
      },
      SPACE_WARP: {
        name: 'Space Warp',
        description: 'Bend space to create shortcuts',
        type: 'spatial',
        duration: 8000,
        cooldown: 22000,
        effect: 'space_warp'
      },
      TEMPORAL_CLONE: {
        name: 'Temporal Clone',
        description: 'Create a clone from the past',
        type: 'temporal',
        duration: 12000,
        cooldown: 40000,
        effect: 'temporal_clone'
      },
      VOID_ENERGY: {
        name: 'Void Energy',
        description: 'Harness the power of the void',
        type: 'void',
        duration: 15000,
        cooldown: 45000,
        effect: 'void_energy'
      },
      STELLAR_WIND: {
        name: 'Stellar Wind',
        description: 'Create powerful stellar winds',
        type: 'stellar',
        duration: 10000,
        cooldown: 20000,
        effect: 'stellar_wind'
      },
      GRAVITATIONAL_LENSING: {
        name: 'Gravitational Lensing',
        description: 'Bend light and projectiles around massive objects',
        type: 'gravitational',
        duration: 12000,
        cooldown: 25000,
        effect: 'gravitational_lensing'
      },
      PROBABILITY_WAVES: {
        name: 'Probability Waves',
        description: 'Manipulate probability to affect outcomes',
        type: 'quantum',
        duration: 8000,
        cooldown: 30000,
        effect: 'probability_waves'
      },
      DARK_MATTER: {
        name: 'Dark Matter',
        description: 'Create invisible matter that affects movement',
        type: 'cosmic',
        duration: 15000,
        cooldown: 35000,
        effect: 'dark_matter'
      },
      COSMIC_RADIATION: {
        name: 'Cosmic Radiation',
        description: 'Emit harmful radiation that damages enemies',
        type: 'cosmic',
        duration: 10000,
        cooldown: 20000,
        effect: 'cosmic_radiation'
      },
      REALITY_DISTORTION: {
        name: 'Reality Distortion',
        description: 'Distort reality to create impossible effects',
        type: 'reality',
        duration: 12000,
        cooldown: 40000,
        effect: 'reality_distortion'
      }
    };
  }

  initializeMechanics() {
    Object.keys(this.gameMechanics).forEach(mechanicKey => {
      const mechanic = this.gameMechanics[mechanicKey];
      this.mechanics.set(mechanicKey, {
        ...mechanic,
        lastUsed: 0,
        active: false
      });
    });
  }

  canUseMechanic(mechanicKey) {
    const mechanic = this.mechanics.get(mechanicKey);
    if (!mechanic) return false;
    
    const currentTime = this.scene.time.now;
    return currentTime - mechanic.lastUsed >= mechanic.cooldown;
  }

  useMechanic(mechanicKey) {
    if (!this.canUseMechanic(mechanicKey)) {
      return false;
    }

    const mechanic = this.mechanics.get(mechanicKey);
    if (!mechanic) return false;

    // Set last used time
    mechanic.lastUsed = this.scene.time.now;
    mechanic.active = true;

    // Activate mechanic
    this.activateMechanic(mechanicKey, mechanic);

    // Deactivate after duration
    this.scene.time.delayedCall(mechanic.duration, () => {
      this.deactivateMechanic(mechanicKey);
    });

    return true;
  }

  activateMechanic(mechanicKey, mechanic) {
    this.activeMechanics.add(mechanicKey);

    switch (mechanicKey) {
      case 'GRAVITY_WELLS':
        this.activateGravityWells(mechanic);
        break;
      case 'TIME_DILATION':
        this.activateTimeDilation(mechanic);
        break;
      case 'DIMENSIONAL_RIFTS':
        this.activateDimensionalRifts(mechanic);
        break;
      case 'QUANTUM_TUNNELING':
        this.activateQuantumTunneling(mechanic);
        break;
      case 'REALITY_ANCHORS':
        this.activateRealityAnchors(mechanic);
        break;
      case 'ENERGY_VORTEX':
        this.activateEnergyVortex(mechanic);
        break;
      case 'SPACE_WARP':
        this.activateSpaceWarp(mechanic);
        break;
      case 'TEMPORAL_CLONE':
        this.activateTemporalClone(mechanic);
        break;
      case 'VOID_ENERGY':
        this.activateVoidEnergy(mechanic);
        break;
      case 'STELLAR_WIND':
        this.activateStellarWind(mechanic);
        break;
      case 'GRAVITATIONAL_LENSING':
        this.activateGravitationalLensing(mechanic);
        break;
      case 'PROBABILITY_WAVES':
        this.activateProbabilityWaves(mechanic);
        break;
      case 'DARK_MATTER':
        this.activateDarkMatter(mechanic);
        break;
      case 'COSMIC_RADIATION':
        this.activateCosmicRadiation(mechanic);
        break;
      case 'REALITY_DISTORTION':
        this.activateRealityDistortion(mechanic);
        break;
    }
  }

  deactivateMechanic(mechanicKey) {
    this.activeMechanics.delete(mechanicKey);
    const mechanic = this.mechanics.get(mechanicKey);
    if (mechanic) {
      mechanic.active = false;
    }

    switch (mechanicKey) {
      case 'GRAVITY_WELLS':
        this.deactivateGravityWells();
        break;
      case 'TIME_DILATION':
        this.deactivateTimeDilation();
        break;
      case 'DIMENSIONAL_RIFTS':
        this.deactivateDimensionalRifts();
        break;
      case 'QUANTUM_TUNNELING':
        this.deactivateQuantumTunneling();
        break;
      case 'REALITY_ANCHORS':
        this.deactivateRealityAnchors();
        break;
      case 'ENERGY_VORTEX':
        this.deactivateEnergyVortex();
        break;
      case 'SPACE_WARP':
        this.deactivateSpaceWarp();
        break;
      case 'TEMPORAL_CLONE':
        this.deactivateTemporalClone();
        break;
      case 'VOID_ENERGY':
        this.deactivateVoidEnergy();
        break;
      case 'STELLAR_WIND':
        this.deactivateStellarWind();
        break;
      case 'GRAVITATIONAL_LENSING':
        this.deactivateGravitationalLensing();
        break;
      case 'PROBABILITY_WAVES':
        this.deactivateProbabilityWaves();
        break;
      case 'DARK_MATTER':
        this.deactivateDarkMatter();
        break;
      case 'COSMIC_RADIATION':
        this.deactivateCosmicRadiation();
        break;
      case 'REALITY_DISTORTION':
        this.deactivateRealityDistortion();
        break;
    }
  }

  // Mechanic implementations
  activateGravityWells(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Create gravity wells
    for (let i = 0; i < 3; i++) {
      const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
      
      const gravityWell = this.scene.add.circle(x, y, 80, 0x330066, 0.4);
      gravityWell.setStrokeStyle(3, 0x330066);
      
      // Store gravity well reference
      this.scene.setData(`gravityWell_${i}`, gravityWell);
      
      // Create gravity effect
      this.scene.time.addEvent({
        delay: 100,
        callback: () => {
          if (gravityWell.active) {
            // Pull enemies towards gravity well
            this.scene.enemies.children.entries.forEach(enemy => {
              if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                if (distance < 150) {
                  const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, x, y);
                  enemy.body.setVelocity(
                    enemy.body.velocity.x + Math.cos(angle) * 50,
                    enemy.body.velocity.y + Math.sin(angle) * 50
                  );
                }
              }
            });
          }
        },
        loop: true
      });
    }
  }

  deactivateGravityWells() {
    for (let i = 0; i < 3; i++) {
      const gravityWell = this.scene.getData(`gravityWell_${i}`);
      if (gravityWell && gravityWell.active) {
        gravityWell.destroy();
      }
    }
  }

  activateTimeDilation(mechanic) {
    // Slow down time in specific areas
    this.scene.cameras.main.setTimeScale(0.3);
    
    // Create time dilation effect
    const timeDilation = this.scene.add.rectangle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      this.scene.scale.width, this.scene.scale.height,
      0x00ffff, 0.1
    );
    
    this.scene.setData('timeDilation', timeDilation);
  }

  deactivateTimeDilation() {
    this.scene.cameras.main.setTimeScale(1);
    
    const timeDilation = this.scene.getData('timeDilation');
    if (timeDilation && timeDilation.active) {
      timeDilation.destroy();
    }
  }

  activateDimensionalRifts(mechanic) {
    // Create dimensional rifts
    for (let i = 0; i < 2; i++) {
      const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
      
      const rift = this.scene.add.rectangle(x, y, 100, 20, 0x330066, 0.8);
      rift.setStrokeStyle(3, 0x330066);
      
      this.scene.setData(`dimensionalRift_${i}`, rift);
      
      // Create rift effect
      this.scene.time.addEvent({
        delay: 1000,
        callback: () => {
          if (rift.active) {
            // Damage enemies near rift
            this.scene.enemies.children.entries.forEach(enemy => {
              if (enemy.active) {
                const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                if (distance < 80) {
                  this.scene.enemySystem.damageEnemy(enemy, 10);
                }
              }
            });
          }
        },
        loop: true
      });
    }
  }

  deactivateDimensionalRifts() {
    for (let i = 0; i < 2; i++) {
      const rift = this.scene.getData(`dimensionalRift_${i}`);
      if (rift && rift.active) {
        rift.destroy();
      }
    }
  }

  activateQuantumTunneling(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Enable quantum tunneling
    player.setData('quantumTunneling', true);
    player.setAlpha(0.7);
    
    // Create quantum effect
    const quantumEffect = this.scene.add.particles(player.x, player.y, 'sparkle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      lifespan: 1000,
      quantity: 20,
      tint: 0x00ffff,
      blendMode: 'ADD'
    });
    
    this.scene.setData('quantumEffect', quantumEffect);
  }

  deactivateQuantumTunneling() {
    const player = this.scene.player;
    if (player) {
      player.setData('quantumTunneling', false);
      player.setAlpha(1);
    }
    
    const quantumEffect = this.scene.getData('quantumEffect');
    if (quantumEffect && quantumEffect.active) {
      quantumEffect.destroy();
    }
  }

  activateRealityAnchors(mechanic) {
    // Create reality anchors
    for (let i = 0; i < 4; i++) {
      const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
      const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
      
      const anchor = this.scene.add.circle(x, y, 40, 0x00ff00, 0.3);
      anchor.setStrokeStyle(3, 0x00ff00);
      
      this.scene.setData(`realityAnchor_${i}`, anchor);
    }
  }

  deactivateRealityAnchors() {
    for (let i = 0; i < 4; i++) {
      const anchor = this.scene.getData(`realityAnchor_${i}`);
      if (anchor && anchor.active) {
        anchor.destroy();
      }
    }
  }

  activateEnergyVortex(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Create energy vortex
    const vortex = this.scene.add.circle(player.x, player.y, 100, 0x00ffff, 0.3);
    vortex.setStrokeStyle(3, 0x00ffff);
    
    this.scene.setData('energyVortex', vortex);
    
    // Create vortex effect
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (vortex.active) {
          // Damage enemies in vortex
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(vortex.x, vortex.y, enemy.x, enemy.y);
              if (distance < 100) {
                this.scene.enemySystem.damageEnemy(enemy, 5);
                
                // Spin enemy
                const angle = Phaser.Math.Angle.Between(vortex.x, vortex.y, enemy.x, enemy.y);
                enemy.body.setVelocity(
                  Math.cos(angle + 0.1) * 100,
                  Math.sin(angle + 0.1) * 100
                );
              }
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateEnergyVortex() {
    const vortex = this.scene.getData('energyVortex');
    if (vortex && vortex.active) {
      vortex.destroy();
    }
  }

  activateSpaceWarp(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Create space warp
    const warp = this.scene.add.rectangle(
      player.x, player.y, 200, 20, 0x8800ff, 0.6
    );
    warp.setStrokeStyle(3, 0x8800ff);
    
    this.scene.setData('spaceWarp', warp);
    
    // Create warp effect
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (warp.active) {
          // Teleport enemies that touch warp
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(warp.x, warp.y, enemy.x, enemy.y);
              if (distance < 100) {
                const newX = Phaser.Math.Between(100, this.scene.scale.width - 100);
                const newY = Phaser.Math.Between(100, this.scene.scale.height - 100);
                enemy.setPosition(newX, newY);
              }
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateSpaceWarp() {
    const warp = this.scene.getData('spaceWarp');
    if (warp && warp.active) {
      warp.destroy();
    }
  }

  activateTemporalClone(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Create temporal clone
    const clone = this.scene.add.sprite(player.x, player.y, 'player');
    clone.setAlpha(0.7);
    clone.setTint(0x00ffff);
    clone.setScale(0.8);
    
    this.scene.setData('temporalClone', clone);
    
    // Make clone follow player with delay
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (clone.active && player.active) {
          clone.setPosition(player.x, player.y);
        }
      },
      loop: true
    });
  }

  deactivateTemporalClone() {
    const clone = this.scene.getData('temporalClone');
    if (clone && clone.active) {
      clone.destroy();
    }
  }

  activateVoidEnergy(mechanic) {
    const player = this.scene.player;
    if (!player) return;

    // Create void energy
    const voidEnergy = this.scene.add.circle(player.x, player.y, 120, 0x330066, 0.4);
    voidEnergy.setStrokeStyle(3, 0x330066);
    
    this.scene.setData('voidEnergy', voidEnergy);
    
    // Create void effect
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (voidEnergy.active) {
          // Damage enemies in void
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(voidEnergy.x, voidEnergy.y, enemy.x, enemy.y);
              if (distance < 120) {
                this.scene.enemySystem.damageEnemy(enemy, 8);
                
                // Slow enemy
                enemy.setData('voidSlowed', true);
                enemy.body.setVelocity(
                  enemy.body.velocity.x * 0.5,
                  enemy.body.velocity.y * 0.5
                );
              }
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateVoidEnergy() {
    const voidEnergy = this.scene.getData('voidEnergy');
    if (voidEnergy && voidEnergy.active) {
      voidEnergy.destroy();
    }
  }

  activateStellarWind(mechanic) {
    // Create stellar wind
    const wind = this.scene.add.graphics();
    wind.lineStyle(3, 0x87ceeb, 0.6);
    
    for (let i = 0; i < 10; i++) {
      wind.moveTo(0, i * 50);
      wind.lineTo(this.scene.scale.width, i * 50);
    }
    
    this.scene.setData('stellarWind', wind);
    
    // Create wind effect
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (wind.active) {
          // Push enemies with wind
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              enemy.body.setVelocity(
                enemy.body.velocity.x + 50,
                enemy.body.velocity.y
              );
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateStellarWind() {
    const wind = this.scene.getData('stellarWind');
    if (wind && wind.active) {
      wind.destroy();
    }
  }

  activateGravitationalLensing(mechanic) {
    // Create gravitational lensing effect
    this.scene.cameras.main.setZoom(1.2);
    
    // Create lensing effect
    const lensing = this.scene.add.circle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      200, 0x000000, 0.3
    );
    
    this.scene.setData('gravitationalLensing', lensing);
  }

  deactivateGravitationalLensing() {
    this.scene.cameras.main.setZoom(1);
    
    const lensing = this.scene.getData('gravitationalLensing');
    if (lensing && lensing.active) {
      lensing.destroy();
    }
  }

  activateProbabilityWaves(mechanic) {
    // Create probability waves
    const waves = this.scene.add.graphics();
    waves.lineStyle(2, 0x00ffff, 0.8);
    
    for (let i = 0; i < 5; i++) {
      waves.moveTo(0, i * 100);
      waves.lineTo(this.scene.scale.width, i * 100);
    }
    
    this.scene.setData('probabilityWaves', waves);
    
    // Create wave effect
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (waves.active) {
          // Randomize enemy positions
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const randomX = Phaser.Math.Between(50, this.scene.scale.width - 50);
              const randomY = Phaser.Math.Between(50, this.scene.scale.height - 50);
              enemy.setPosition(randomX, randomY);
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateProbabilityWaves() {
    const waves = this.scene.getData('probabilityWaves');
    if (waves && waves.active) {
      waves.destroy();
    }
  }

  activateDarkMatter(mechanic) {
    // Create dark matter
    const darkMatter = this.scene.add.circle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      150, 0x000000, 0.6
    );
    
    this.scene.setData('darkMatter', darkMatter);
    
    // Create dark matter effect
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (darkMatter.active) {
          // Slow enemies in dark matter
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(
                darkMatter.x, darkMatter.y, enemy.x, enemy.y
              );
              if (distance < 150) {
                enemy.body.setVelocity(
                  enemy.body.velocity.x * 0.3,
                  enemy.body.velocity.y * 0.3
                );
              }
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateDarkMatter() {
    const darkMatter = this.scene.getData('darkMatter');
    if (darkMatter && darkMatter.active) {
      darkMatter.destroy();
    }
  }

  activateCosmicRadiation(mechanic) {
    // Create cosmic radiation
    const radiation = this.scene.add.rectangle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      this.scene.scale.width, this.scene.scale.height,
      0x00ff00, 0.1
    );
    
    this.scene.setData('cosmicRadiation', radiation);
    
    // Create radiation effect
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (radiation.active) {
          // Damage all enemies
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              this.scene.enemySystem.damageEnemy(enemy, 3);
            }
          });
        }
      },
      loop: true
    });
  }

  deactivateCosmicRadiation() {
    const radiation = this.scene.getData('cosmicRadiation');
    if (radiation && radiation.active) {
      radiation.destroy();
    }
  }

  activateRealityDistortion(mechanic) {
    // Create reality distortion
    this.scene.cameras.main.shake(2000, 0.02);
    this.scene.cameras.main.setZoom(0.8);
    
    // Create distortion effect
    const distortion = this.scene.add.rectangle(
      this.scene.scale.width / 2, this.scene.scale.height / 2,
      this.scene.scale.width, this.scene.scale.height,
      0xff00ff, 0.1
    );
    
    this.scene.setData('realityDistortion', distortion);
  }

  deactivateRealityDistortion() {
    this.scene.cameras.main.setZoom(1);
    
    const distortion = this.scene.getData('realityDistortion');
    if (distortion && distortion.active) {
      distortion.destroy();
    }
  }

  // Utility methods
  getMechanicCooldown(mechanicKey) {
    const mechanic = this.mechanics.get(mechanicKey);
    if (!mechanic) return 0;
    
    const currentTime = this.scene.time.now;
    return Math.max(0, mechanic.cooldown - (currentTime - mechanic.lastUsed));
  }

  getMechanicCooldownPercentage(mechanicKey) {
    const mechanic = this.mechanics.get(mechanicKey);
    if (!mechanic) return 0;
    
    const cooldown = this.getMechanicCooldown(mechanicKey);
    return 1 - (cooldown / mechanic.cooldown);
  }

  isMechanicActive(mechanicKey) {
    return this.activeMechanics.has(mechanicKey);
  }

  getAllMechanics() {
    return Object.keys(this.gameMechanics);
  }

  getMechanicInfo(mechanicKey) {
    return this.gameMechanics[mechanicKey];
  }

  getActiveMechanics() {
    return Array.from(this.activeMechanics);
  }
}

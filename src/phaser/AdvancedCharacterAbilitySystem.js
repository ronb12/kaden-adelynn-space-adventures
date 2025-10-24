// Advanced Character Ability System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class AdvancedCharacterAbilitySystem {
  constructor(scene) {
    this.scene = scene;
    this.abilities = new Map();
    this.activeAbilities = new Set();
    this.abilityCooldowns = new Map();
    
    this.characterAbilities = {
      KADEN: {
        // 5 New Abilities for Kaden
        THUNDER_STRIKE: {
          name: 'Thunder Strike',
          description: 'Lightning attack that chains between enemies',
          emoji: '⚡',
          cooldown: 10000,
          duration: 2000,
          damage: 50,
          range: 200,
          effect: 'lightning_chain'
        },
        SPEED_BURST: {
          name: 'Speed Burst',
          description: 'Temporary speed boost with invincibility',
          emoji: '💨',
          cooldown: 15000,
          duration: 3000,
          speedMultiplier: 2.0,
          invincibility: true,
          effect: 'speed_boost'
        },
        ENERGY_SHIELD: {
          name: 'Energy Shield',
          description: 'Absorbs damage and reflects it back',
          emoji: '🛡️',
          cooldown: 20000,
          duration: 5000,
          absorption: 100,
          reflection: true,
          effect: 'energy_shield'
        },
        PLASMA_BURST: {
          name: 'Plasma Burst',
          description: 'Explosive plasma attack in all directions',
          emoji: '💥',
          cooldown: 25000,
          duration: 1000,
          damage: 75,
          radius: 150,
          effect: 'plasma_explosion'
        },
        QUANTUM_LEAP: {
          name: 'Quantum Leap',
          description: 'Teleport to any location on screen',
          emoji: '✨',
          cooldown: 30000,
          duration: 0,
          range: 'screen',
          effect: 'teleport'
        }
      },
      
      ADELYNN: {
        // 5 New Abilities for Adelynn
        STARLIGHT_BEAM: {
          name: 'Starlight Beam',
          description: 'Powerful beam of starlight energy',
          emoji: '⭐',
          cooldown: 12000,
          duration: 3000,
          damage: 60,
          range: 300,
          effect: 'starlight_beam'
        },
        COSMIC_WIND: {
          name: 'Cosmic Wind',
          description: 'Pushes enemies away and slows them',
          emoji: '🌪️',
          cooldown: 18000,
          duration: 4000,
          pushForce: 200,
          slowFactor: 0.5,
          effect: 'cosmic_wind'
        },
        NEBULA_CLOAK: {
          name: 'Nebula Cloak',
          description: 'Become invisible and gain damage boost',
          emoji: '👻',
          cooldown: 22000,
          duration: 6000,
          invisibility: true,
          damageMultiplier: 1.5,
          effect: 'nebula_cloak'
        },
        GRAVITY_WELL: {
          name: 'Gravity Well',
          description: 'Creates a gravity well that pulls enemies',
          emoji: '🌌',
          cooldown: 28000,
          duration: 8000,
          pullForce: 150,
          radius: 200,
          effect: 'gravity_well'
        },
        DIMENSIONAL_RIFT: {
          name: 'Dimensional Rift',
          description: 'Opens a rift that damages enemies over time',
          emoji: '🌀',
          cooldown: 35000,
          duration: 10000,
          damage: 25,
          radius: 180,
          effect: 'dimensional_rift'
        }
      }
    };
  }

  initializeAbilities(character) {
    const abilities = this.characterAbilities[character];
    if (abilities) {
      Object.keys(abilities).forEach(abilityName => {
        this.abilities.set(abilityName, abilities[abilityName]);
        this.abilityCooldowns.set(abilityName, 0);
      });
    }
  }

  canUseAbility(abilityName) {
    const cooldown = this.abilityCooldowns.get(abilityName);
    const currentTime = this.scene.time.now;
    return cooldown <= currentTime;
  }

  useAbility(abilityName) {
    if (!this.canUseAbility(abilityName)) {
      return false;
    }

    const ability = this.abilities.get(abilityName);
    if (!ability) {
      return false;
    }

    // Set cooldown
    this.abilityCooldowns.set(abilityName, this.scene.time.now + ability.cooldown);

    // Activate ability
    this.activateAbility(abilityName, ability);

    return true;
  }

  activateAbility(abilityName, ability) {
    this.activeAbilities.add(abilityName);

    switch (abilityName) {
      case 'THUNDER_STRIKE':
        this.activateThunderStrike(ability);
        break;
      case 'SPEED_BURST':
        this.activateSpeedBurst(ability);
        break;
      case 'ENERGY_SHIELD':
        this.activateEnergyShield(ability);
        break;
      case 'PLASMA_BURST':
        this.activatePlasmaBurst(ability);
        break;
      case 'QUANTUM_LEAP':
        this.activateQuantumLeap(ability);
        break;
      case 'STARLIGHT_BEAM':
        this.activateStarlightBeam(ability);
        break;
      case 'COSMIC_WIND':
        this.activateCosmicWind(ability);
        break;
      case 'NEBULA_CLOAK':
        this.activateNebulaCloak(ability);
        break;
      case 'GRAVITY_WELL':
        this.activateGravityWell(ability);
        break;
      case 'DIMENSIONAL_RIFT':
        this.activateDimensionalRift(ability);
        break;
    }

    // Remove ability after duration
    if (ability.duration > 0) {
      this.scene.time.delayedCall(ability.duration, () => {
        this.deactivateAbility(abilityName);
      });
    }
  }

  deactivateAbility(abilityName) {
    this.activeAbilities.delete(abilityName);

    switch (abilityName) {
      case 'SPEED_BURST':
        this.deactivateSpeedBurst();
        break;
      case 'ENERGY_SHIELD':
        this.deactivateEnergyShield();
        break;
      case 'NEBULA_CLOAK':
        this.deactivateNebulaCloak();
        break;
      case 'GRAVITY_WELL':
        this.deactivateGravityWell();
        break;
      case 'DIMENSIONAL_RIFT':
        this.deactivateDimensionalRift();
        break;
    }
  }

  // Kaden's Abilities
  activateThunderStrike(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create lightning effect
    const lightning = this.scene.add.graphics();
    lightning.lineStyle(5, 0xffff00);
    
    // Find nearest enemy
    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    this.scene.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        const distance = Phaser.Math.Distance.Between(
          player.x, player.y, enemy.x, enemy.y
        );
        if (distance < ability.range && distance < nearestDistance) {
          nearestDistance = distance;
          nearestEnemy = enemy;
        }
      }
    });

    if (nearestEnemy) {
      // Draw lightning to nearest enemy
      lightning.moveTo(player.x, player.y);
      lightning.lineTo(nearestEnemy.x, nearestEnemy.y);
      
      // Damage enemy
      this.scene.enemySystem.damageEnemy(nearestEnemy, ability.damage);
      
      // Chain lightning to nearby enemies
      this.chainLightning(nearestEnemy, ability, 3);
    }

    // Remove lightning after duration
    this.scene.time.delayedCall(ability.duration, () => {
      if (lightning.active) lightning.destroy();
    });
  }

  chainLightning(sourceEnemy, ability, chainsLeft) {
    if (chainsLeft <= 0) return;

    let nearestEnemy = null;
    let nearestDistance = Infinity;
    
    this.scene.enemies.children.entries.forEach(enemy => {
      if (enemy.active && enemy !== sourceEnemy) {
        const distance = Phaser.Math.Distance.Between(
          sourceEnemy.x, sourceEnemy.y, enemy.x, enemy.y
        );
        if (distance < ability.range && distance < nearestDistance) {
          nearestDistance = distance;
          nearestEnemy = enemy;
        }
      }
    });

    if (nearestEnemy) {
      // Create chained lightning
      const lightning = this.scene.add.graphics();
      lightning.lineStyle(3, 0xffff00);
      lightning.moveTo(sourceEnemy.x, sourceEnemy.y);
      lightning.lineTo(nearestEnemy.x, nearestEnemy.y);
      
      // Damage enemy
      this.scene.enemySystem.damageEnemy(nearestEnemy, ability.damage * 0.8);
      
      // Continue chain
      this.chainLightning(nearestEnemy, ability, chainsLeft - 1);
      
      // Remove lightning
      this.scene.time.delayedCall(500, () => {
        if (lightning.active) lightning.destroy();
      });
    }
  }

  activateSpeedBurst(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Store original speed
    const originalSpeed = player.getData('originalSpeed') || 200;
    player.setData('originalSpeed', originalSpeed);

    // Apply speed boost
    player.setData('speedBoost', ability.speedMultiplier);
    
    // Apply invincibility
    if (ability.invincibility) {
      player.setData('invincible', true);
      player.setAlpha(0.7);
    }

    // Create speed effect
    this.createSpeedEffect(player);
  }

  deactivateSpeedBurst() {
    const player = this.scene.player;
    if (!player) return;

    // Restore original speed
    const originalSpeed = player.getData('originalSpeed') || 200;
    player.setData('speedBoost', 1);
    
    // Remove invincibility
    player.setData('invincible', false);
    player.setAlpha(1);
  }

  activateEnergyShield(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create energy shield
    const shield = this.scene.add.circle(player.x, player.y, 60, 0x00aaff, 0.3);
    shield.setStrokeStyle(3, 0x00aaff);
    
    // Store shield reference
    player.setData('energyShield', shield);
    player.setData('shieldAbsorption', ability.absorption);
    player.setData('shieldReflection', ability.reflection);

    // Make shield follow player
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (shield.active && player.active) {
          shield.setPosition(player.x, player.y);
        }
      },
      loop: true
    });

    // Remove shield after duration
    this.scene.time.delayedCall(ability.duration, () => {
      if (shield.active) shield.destroy();
      player.setData('energyShield', null);
    });
  }

  deactivateEnergyShield() {
    const player = this.scene.player;
    if (!player) return;

    const shield = player.getData('energyShield');
    if (shield && shield.active) {
      shield.destroy();
    }
    player.setData('energyShield', null);
    player.setData('shieldAbsorption', 0);
    player.setData('shieldReflection', false);
  }

  activatePlasmaBurst(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create plasma burst in all directions
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45) * Math.PI / 180;
      const x = player.x + Math.cos(angle) * ability.radius;
      const y = player.y + Math.sin(angle) * ability.radius;
      
      const plasma = this.scene.add.circle(x, y, 20, 0xff00ff, 0.8);
      
      // Animate plasma
      this.scene.tweens.add({
        targets: plasma,
        scaleX: 3,
        scaleY: 3,
        alpha: 0,
        duration: ability.duration,
        onComplete: () => {
          if (plasma.active) plasma.destroy();
        }
      });

      // Damage enemies in radius
      this.scene.enemies.children.entries.forEach(enemy => {
        if (enemy.active) {
          const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
          if (distance < ability.radius) {
            this.scene.enemySystem.damageEnemy(enemy, ability.damage);
          }
        }
      });
    }
  }

  activateQuantumLeap(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Get mouse position or random location
    const x = Phaser.Math.Between(100, this.scene.scale.width - 100);
    const y = Phaser.Math.Between(100, this.scene.scale.height - 100);
    
    // Create teleport effect
    this.createTeleportEffect(player.x, player.y);
    
    // Teleport player
    player.setPosition(x, y);
    
    // Create arrival effect
    this.createTeleportEffect(x, y);
  }

  // Adelynn's Abilities
  activateStarlightBeam(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create starlight beam
    const beam = this.scene.add.rectangle(
      player.x, player.y, 
      ability.range, 20, 
      0xffff00, 0.8
    );
    
    // Animate beam
    this.scene.tweens.add({
      targets: beam,
      scaleX: 1.5,
      duration: ability.duration,
      onComplete: () => {
        if (beam.active) beam.destroy();
      }
    });

    // Damage enemies in beam
    this.scene.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        const distance = Phaser.Math.Distance.Between(
          player.x, player.y, enemy.x, enemy.y
        );
        if (distance < ability.range) {
          this.scene.enemySystem.damageEnemy(enemy, ability.damage);
        }
      }
    });
  }

  activateCosmicWind(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create cosmic wind effect
    const wind = this.scene.add.graphics();
    wind.lineStyle(3, 0x87ceeb, 0.6);
    
    // Push enemies away
    this.scene.enemies.children.entries.forEach(enemy => {
      if (enemy.active) {
        const distance = Phaser.Math.Distance.Between(
          player.x, player.y, enemy.x, enemy.y
        );
        if (distance < ability.range) {
          const angle = Phaser.Math.Angle.Between(
            player.x, player.y, enemy.x, enemy.y
          );
          
          // Push enemy away
          enemy.body.setVelocity(
            enemy.body.velocity.x + Math.cos(angle) * ability.pushForce,
            enemy.body.velocity.y + Math.sin(angle) * ability.pushForce
          );
          
          // Slow enemy
          enemy.setData('slowed', true);
          enemy.setData('slowFactor', ability.slowFactor);
        }
      }
    });

    // Remove wind effect
    this.scene.time.delayedCall(ability.duration, () => {
      if (wind.active) wind.destroy();
    });
  }

  activateNebulaCloak(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Apply invisibility
    player.setData('invisible', true);
    player.setAlpha(0.3);
    
    // Apply damage boost
    player.setData('damageBoost', ability.damageMultiplier);

    // Create nebula effect
    this.createNebulaEffect(player);
  }

  deactivateNebulaCloak() {
    const player = this.scene.player;
    if (!player) return;

    player.setData('invisible', false);
    player.setAlpha(1);
    player.setData('damageBoost', 1);
  }

  activateGravityWell(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create gravity well
    const gravityWell = this.scene.add.circle(
      player.x, player.y, 
      ability.radius, 0x330066, 0.3
    );
    
    // Store gravity well reference
    player.setData('gravityWell', gravityWell);

    // Pull enemies towards gravity well
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        if (gravityWell.active) {
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(
                gravityWell.x, gravityWell.y, enemy.x, enemy.y
              );
              if (distance < ability.radius) {
                const angle = Phaser.Math.Angle.Between(
                  enemy.x, enemy.y, gravityWell.x, gravityWell.y
                );
                
                // Pull enemy towards gravity well
                enemy.body.setVelocity(
                  enemy.body.velocity.x + Math.cos(angle) * ability.pullForce,
                  enemy.body.velocity.y + Math.sin(angle) * ability.pullForce
                );
              }
            }
          });
        }
      },
      loop: true
    });

    // Remove gravity well after duration
    this.scene.time.delayedCall(ability.duration, () => {
      if (gravityWell.active) gravityWell.destroy();
      player.setData('gravityWell', null);
    });
  }

  deactivateGravityWell() {
    const player = this.scene.player;
    if (!player) return;

    const gravityWell = player.getData('gravityWell');
    if (gravityWell && gravityWell.active) {
      gravityWell.destroy();
    }
    player.setData('gravityWell', null);
  }

  activateDimensionalRift(ability) {
    const player = this.scene.player;
    if (!player) return;

    // Create dimensional rift
    const rift = this.scene.add.circle(
      player.x, player.y, 
      ability.radius, 0x330066, 0.4
    );
    
    // Store rift reference
    player.setData('dimensionalRift', rift);

    // Damage enemies in rift over time
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        if (rift.active) {
          this.scene.enemies.children.entries.forEach(enemy => {
            if (enemy.active) {
              const distance = Phaser.Math.Distance.Between(
                rift.x, rift.y, enemy.x, enemy.y
              );
              if (distance < ability.radius) {
                this.scene.enemySystem.damageEnemy(enemy, ability.damage);
              }
            }
          });
        }
      },
      loop: true
    });

    // Remove rift after duration
    this.scene.time.delayedCall(ability.duration, () => {
      if (rift.active) rift.destroy();
      player.setData('dimensionalRift', null);
    });
  }

  deactivateDimensionalRift() {
    const player = this.scene.player;
    if (!player) return;

    const rift = player.getData('dimensionalRift');
    if (rift && rift.active) {
      rift.destroy();
    }
    player.setData('dimensionalRift', null);
  }

  // Effect creation methods
  createSpeedEffect(player) {
    const particles = this.scene.add.particles(player.x, player.y, 'sparkle', {
      speed: { min: 100, max: 300 },
      scale: { start: 0.5, end: 0 },
      lifespan: 1000,
      quantity: 10,
      tint: 0x00ffff,
      blendMode: 'ADD'
    });
    
    this.scene.time.delayedCall(3000, () => {
      if (particles.active) particles.destroy();
    });
  }

  createTeleportEffect(x, y) {
    const effect = this.scene.add.circle(x, y, 50, 0xff00ff, 0.8);
    
    this.scene.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        if (effect.active) effect.destroy();
      }
    });
  }

  createNebulaEffect(player) {
    const particles = this.scene.add.particles(player.x, player.y, 'gas', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.3, end: 0 },
      lifespan: 2000,
      quantity: 5,
      tint: 0x8800ff,
      blendMode: 'ADD'
    });
    
    this.scene.time.delayedCall(6000, () => {
      if (particles.active) particles.destroy();
    });
  }

  // Utility methods
  getAbilityCooldown(abilityName) {
    const cooldown = this.abilityCooldowns.get(abilityName);
    const currentTime = this.scene.time.now;
    return Math.max(0, cooldown - currentTime);
  }

  getAbilityCooldownPercentage(abilityName) {
    const ability = this.abilities.get(abilityName);
    if (!ability) return 0;
    
    const cooldown = this.getAbilityCooldown(abilityName);
    return 1 - (cooldown / ability.cooldown);
  }

  isAbilityActive(abilityName) {
    return this.activeAbilities.has(abilityName);
  }

  getAllAbilities(character) {
    return this.characterAbilities[character] || {};
  }

  getActiveAbilities() {
    return Array.from(this.activeAbilities);
  }
}

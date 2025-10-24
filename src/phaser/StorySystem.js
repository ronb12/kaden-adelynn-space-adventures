// Story System for Kaden & Adelynn Space Adventures
import Phaser from 'phaser';

export class StorySystem {
  constructor(scene) {
    this.scene = scene;
    this.currentChapter = 1;
    this.currentCutscene = 0;
    this.isInCutscene = false;
    this.cutsceneData = {
      1: {
        name: 'The Beginning',
        emoji: '🚀',
        description: 'Kaden and Adelynn begin their space adventure',
        cutscenes: [
          {
            id: 'intro',
            title: 'The Call to Adventure',
            text: 'In the year 2157, Earth faces its greatest threat yet. Alien forces have invaded our solar system, and only two brave pilots can save humanity.',
            character: 'narrator',
            emoji: '🌍',
            background: 'earth',
            duration: 5000
          },
          {
            id: 'meeting',
            title: 'The Heroes Meet',
            text: 'Kaden, a skilled fighter pilot, and Adelynn, a brilliant engineer, are chosen for this dangerous mission.',
            character: 'kaden',
            emoji: '👦',
            background: 'space_station',
            duration: 4000
          },
          {
            id: 'mission',
            title: 'The Mission',
            text: 'Their mission: Defend Earth and push back the alien invasion. The fate of humanity rests in their hands.',
            character: 'adelynn',
            emoji: '👧',
            background: 'space',
            duration: 4000
          }
        ]
      },
      2: {
        name: 'First Contact',
        emoji: '👽',
        description: 'The heroes encounter their first alien enemies',
        cutscenes: [
          {
            id: 'alien_sighting',
            title: 'Alien Sighting',
            text: 'As they venture into space, Kaden and Adelynn spot their first alien ships. The battle begins!',
            character: 'kaden',
            emoji: '👦',
            background: 'asteroid_field',
            duration: 4000
          },
          {
            id: 'first_battle',
            title: 'First Battle',
            text: 'The aliens are more dangerous than expected. Kaden and Adelynn must work together to survive.',
            character: 'adelynn',
            emoji: '👧',
            background: 'battle',
            duration: 4000
          }
        ]
      },
      3: {
        name: 'The Space Station',
        emoji: '🛰️',
        description: 'The heroes assault an enemy space station',
        cutscenes: [
          {
            id: 'station_approach',
            title: 'Approaching the Station',
            text: 'Kaden and Adelynn approach the massive alien space station. This will be their biggest challenge yet.',
            character: 'narrator',
            emoji: '🛰️',
            background: 'space_station',
            duration: 5000
          },
          {
            id: 'station_battle',
            title: 'Station Assault',
            text: 'The station is heavily defended. They must fight their way through waves of alien fighters.',
            character: 'kaden',
            emoji: '👦',
            background: 'battle',
            duration: 4000
          }
        ]
      },
      4: {
        name: 'The Crystal Caves',
        emoji: '💎',
        description: 'Exploring mysterious crystal formations',
        cutscenes: [
          {
            id: 'crystal_discovery',
            title: 'Crystal Discovery',
            text: 'Deep in space, they discover a cave system made of mysterious crystals. What secrets do they hold?',
            character: 'adelynn',
            emoji: '👧',
            background: 'crystal_caves',
            duration: 5000
          },
          {
            id: 'crystal_guardian',
            title: 'Crystal Guardian',
            text: 'A massive crystal golem awakens to defend the caves. Kaden and Adelynn must defeat it.',
            character: 'narrator',
            emoji: '💎',
            background: 'crystal_caves',
            duration: 4000
          }
        ]
      },
      5: {
        name: 'The Void Dimension',
        emoji: '👽',
        description: 'Entering a mysterious dimension',
        cutscenes: [
          {
            id: 'void_entry',
            title: 'Entering the Void',
            text: 'A mysterious portal opens, leading to a dimension between dimensions. The laws of physics don\'t apply here.',
            character: 'narrator',
            emoji: '👽',
            background: 'void_dimension',
            duration: 5000
          },
          {
            id: 'void_lord',
            title: 'The Void Lord',
            text: 'A powerful entity from the void appears. This is their most dangerous enemy yet.',
            character: 'kaden',
            emoji: '👦',
            background: 'void_dimension',
            duration: 4000
          }
        ]
      },
      6: {
        name: 'The Dragon\'s Lair',
        emoji: '🐉',
        description: 'Facing the ancient space dragon',
        cutscenes: [
          {
            id: 'dragon_lair',
            title: 'The Dragon\'s Lair',
            text: 'Legend speaks of an ancient space dragon that guards the galaxy\'s secrets. Kaden and Adelynn must face it.',
            character: 'narrator',
            emoji: '🐉',
            background: 'dragons_lair',
            duration: 5000
          },
          {
            id: 'dragon_battle',
            title: 'Dragon Battle',
            text: 'The dragon is massive and powerful. Only the bravest pilots can hope to defeat it.',
            character: 'adelynn',
            emoji: '👧',
            background: 'dragons_lair',
            duration: 4000
          }
        ]
      },
      7: {
        name: 'The Shadow Realm',
        emoji: '👻',
        description: 'Battling in the ethereal shadow realm',
        cutscenes: [
          {
            id: 'shadow_entry',
            title: 'Entering the Shadow Realm',
            text: 'The shadow realm is a place where light cannot penetrate. Only the strongest will survive.',
            character: 'narrator',
            emoji: '👻',
            background: 'shadow_realm',
            duration: 5000
          },
          {
            id: 'shadow_wraith',
            title: 'The Shadow Wraith',
            text: 'A powerful shadow wraith appears. It can phase through reality itself.',
            character: 'kaden',
            emoji: '👦',
            background: 'shadow_realm',
            duration: 4000
          }
        ]
      },
      8: {
        name: 'The Nebula Core',
        emoji: '🌌',
        description: 'Reaching the heart of the nebula',
        cutscenes: [
          {
            id: 'nebula_core',
            title: 'The Nebula Core',
            text: 'At the heart of the nebula lies a living entity of pure energy. It must be defeated.',
            character: 'narrator',
            emoji: '🌌',
            background: 'nebula_core',
            duration: 5000
          },
          {
            id: 'nebula_beast',
            title: 'The Nebula Beast',
            text: 'The nebula beast is a creature of pure cosmic energy. It\'s their most powerful enemy yet.',
            character: 'adelynn',
            emoji: '👧',
            background: 'nebula_core',
            duration: 4000
          }
        ]
      },
      9: {
        name: 'The Cyber Fortress',
        emoji: '🤖',
        description: 'Infiltrating the robotic fortress',
        cutscenes: [
          {
            id: 'cyber_fortress',
            title: 'The Cyber Fortress',
            text: 'A massive robotic fortress controlled by an AI. It\'s the aliens\' most advanced technology.',
            character: 'narrator',
            emoji: '🤖',
            background: 'cyber_fortress',
            duration: 5000
          },
          {
            id: 'cyber_titan',
            title: 'The Cyber Titan',
            text: 'The fortress is guarded by a massive cyber titan. It\'s a machine of pure destruction.',
            character: 'kaden',
            emoji: '👦',
            background: 'cyber_fortress',
            duration: 4000
          }
        ]
      },
      10: {
        name: 'The Abyssal Depths',
        emoji: '🐋',
        description: 'Diving into the deepest space abyss',
        cutscenes: [
          {
            id: 'abyssal_depths',
            title: 'The Abyssal Depths',
            text: 'In the deepest parts of space, they encounter a massive mechanical leviathan.',
            character: 'narrator',
            emoji: '🐋',
            background: 'abyssal_depths',
            duration: 5000
          },
          {
            id: 'mechanical_leviathan',
            title: 'The Mechanical Leviathan',
            text: 'The leviathan is a creature of pure mechanical destruction. It\'s their biggest challenge yet.',
            character: 'adelynn',
            emoji: '👧',
            background: 'abyssal_depths',
            duration: 4000
          }
        ]
      },
      11: {
        name: 'The Cosmic Storm',
        emoji: '⚡',
        description: 'Surviving the ultimate cosmic storm',
        cutscenes: [
          {
            id: 'cosmic_storm',
            title: 'The Cosmic Storm',
            text: 'A massive cosmic storm rages across the galaxy. Only the strongest can survive.',
            character: 'narrator',
            emoji: '⚡',
            background: 'cosmic_storm',
            duration: 5000
          },
          {
            id: 'storm_survival',
            title: 'Storm Survival',
            text: 'Kaden and Adelynn must navigate through the storm to reach their final destination.',
            character: 'kaden',
            emoji: '👦',
            background: 'cosmic_storm',
            duration: 4000
          }
        ]
      },
      12: {
        name: 'The Final Confrontation',
        emoji: '👑',
        description: 'The ultimate battle for the galaxy',
        cutscenes: [
          {
            id: 'final_battle',
            title: 'The Final Battle',
            text: 'The time has come for the final confrontation. The fate of the galaxy rests in their hands.',
            character: 'narrator',
            emoji: '👑',
            background: 'final_battle',
            duration: 5000
          },
          {
            id: 'alien_queen',
            title: 'The Alien Queen',
            text: 'The Alien Queen is the most powerful enemy they have ever faced. This is their final test.',
            character: 'adelynn',
            emoji: '👧',
            background: 'final_battle',
            duration: 4000
          },
          {
            id: 'victory',
            title: 'Victory',
            text: 'With the Alien Queen defeated, peace is restored to the galaxy. Kaden and Adelynn are heroes.',
            character: 'narrator',
            emoji: '🏆',
            background: 'victory',
            duration: 5000
          }
        ]
      }
    };
  }

  startCutscene(chapter, cutsceneIndex = 0) {
    const chapterData = this.cutsceneData[chapter];
    if (!chapterData || !chapterData.cutscenes[cutsceneIndex]) return;
    
    this.currentChapter = chapter;
    this.currentCutscene = cutsceneIndex;
    this.isInCutscene = true;
    
    const cutscene = chapterData.cutscenes[cutsceneIndex];
    this.showCutscene(cutscene);
  }

  showCutscene(cutscene) {
    // Create cutscene container
    const cutsceneContainer = this.scene.add.container(0, 0);
    cutsceneContainer.setDepth(1000);
    
    // Background
    const background = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      0x000000,
      0.8
    );
    cutsceneContainer.add(background);
    
    // Character portrait
    const characterPortrait = this.scene.add.text(
      this.scene.scale.width / 2 - 200,
      this.scene.scale.height / 2 - 100,
      cutscene.emoji,
      {
        fontSize: '64px'
      }
    );
    characterPortrait.setOrigin(0.5);
    cutsceneContainer.add(characterPortrait);
    
    // Character name
    const characterName = this.scene.add.text(
      this.scene.scale.width / 2 - 200,
      this.scene.scale.height / 2 - 20,
      cutscene.character.toUpperCase(),
      {
        fontSize: '24px',
        fill: '#00aaff',
        fontStyle: 'bold'
      }
    );
    characterName.setOrigin(0.5);
    cutsceneContainer.add(characterName);
    
    // Cutscene title
    const cutsceneTitle = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 - 150,
      cutscene.title,
      {
        fontSize: '32px',
        fill: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    cutsceneTitle.setOrigin(0.5);
    cutsceneContainer.add(cutsceneTitle);
    
    // Cutscene text
    const cutsceneText = this.scene.add.text(
      this.scene.scale.width / 2 + 100,
      this.scene.scale.height / 2 - 50,
      cutscene.text,
      {
        fontSize: '20px',
        fill: '#ffffff',
        wordWrap: { width: 400 },
        align: 'left'
      }
    );
    cutsceneText.setOrigin(0, 0.5);
    cutsceneContainer.add(cutsceneText);
    
    // Continue prompt
    const continuePrompt = this.scene.add.text(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 + 150,
      'Press SPACE to continue',
      {
        fontSize: '18px',
        fill: '#ffff00',
        fontStyle: 'bold'
      }
    );
    continuePrompt.setOrigin(0.5);
    cutsceneContainer.add(continuePrompt);
    
    // Animate cutscene entrance
    cutsceneContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: cutsceneContainer,
      alpha: 1,
      duration: 1000,
      ease: 'Power2.easeOut'
    });
    
    // Handle continue input
    const continueKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    const continueHandler = () => {
      continueKey.off('down', continueHandler);
      this.nextCutscene();
      cutsceneContainer.destroy();
    };
    continueKey.on('down', continueHandler);
    
    // Auto-advance after duration
    this.scene.time.delayedCall(cutscene.duration, () => {
      if (cutsceneContainer.active) {
        continueHandler();
      }
    });
  }

  nextCutscene() {
    const chapterData = this.cutsceneData[this.currentChapter];
    if (this.currentCutscene < chapterData.cutscenes.length - 1) {
      this.currentCutscene++;
      this.startCutscene(this.currentChapter, this.currentCutscene);
    } else {
      this.endCutscene();
    }
  }

  endCutscene() {
    this.isInCutscene = false;
    this.scene.soundSystem.playSound('BUTTON_CLICK');
  }

  getCurrentChapter() {
    return this.cutsceneData[this.currentChapter];
  }

  getChapterData(chapter) {
    return this.cutsceneData[chapter];
  }

  getAllChapters() {
    return Object.keys(this.cutsceneData).map(chapter => ({
      chapter: parseInt(chapter),
      ...this.cutsceneData[chapter]
    }));
  }

  getStoryProgress() {
    return {
      currentChapter: this.currentChapter,
      totalChapters: Object.keys(this.cutsceneData).length,
      progress: (this.currentChapter / Object.keys(this.cutsceneData).length) * 100
    };
  }

  isStoryComplete() {
    return this.currentChapter >= Object.keys(this.cutsceneData).length;
  }

  resetStory() {
    this.currentChapter = 1;
    this.currentCutscene = 0;
    this.isInCutscene = false;
  }

  startStoryMode() {
    this.resetStory();
    this.startCutscene(1, 0);
  }

  getStorySummary() {
    const chapters = this.getAllChapters();
    return {
      totalChapters: chapters.length,
      currentChapter: this.currentChapter,
      chapters: chapters.map(chapter => ({
        chapter: chapter.chapter,
        name: chapter.name,
        emoji: chapter.emoji,
        description: chapter.description,
        completed: chapter.chapter < this.currentChapter
      }))
    };
  }
}

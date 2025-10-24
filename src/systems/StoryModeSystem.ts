// Story Mode System - Complete Story Implementation
export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  objectives: StoryObjective[];
  cutscenes: Cutscene[];
  rewards: StoryReward[];
  nextChapter?: string;
}

export interface StoryObjective {
  id: string;
  description: string;
  type: 'kill' | 'survive' | 'collect' | 'reach' | 'defeat_boss' | 'complete_time';
  target: number;
  current: number;
  completed: boolean;
  reward: StoryReward;
}

export interface Cutscene {
  id: string;
  title: string;
  text: string;
  character: 'kaden' | 'adelynn' | 'narrator';
  emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'worried';
  background: string;
  music: string;
  duration: number;
}

export interface StoryReward {
  type: 'xp' | 'weapon' | 'powerup' | 'achievement' | 'unlock';
  value: any;
  description: string;
}

export interface CharacterDevelopment {
  character: 'kaden' | 'adelynn';
  level: number;
  xp: number;
  maxXp: number;
  skills: CharacterSkill[];
  backstory: string;
  personality: string[];
  relationships: CharacterRelationship[];
}

export interface CharacterSkill {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  unlocked: boolean;
}

export interface CharacterRelationship {
  character: string;
  relationship: 'friend' | 'rival' | 'mentor' | 'family' | 'romantic';
  level: number;
  description: string;
}

export class StoryModeSystem {
  private chapters: Map<string, StoryChapter> = new Map();
  private currentChapter: string | null = null;
  private characterDevelopment: Map<string, CharacterDevelopment> = new Map();
  private storyProgress: number = 0;
  private totalChapters: number = 0;
  private completedChapters: number = 0;
  
  // Event callbacks
  private onChapterStart: ((chapter: StoryChapter) => void) | null = null;
  private onChapterComplete: ((chapter: StoryChapter) => void) | null = null;
  private onObjectiveComplete: ((objective: StoryObjective) => void) | null = null;
  private onCutsceneStart: ((cutscene: Cutscene) => void) | null = null;
  private onRewardEarned: ((reward: StoryReward) => void) | null = null;
  private onCharacterLevelUp: ((character: string, level: number) => void) | null = null;

  constructor() {
    this.initializeStoryChapters();
    this.initializeCharacterDevelopment();
  }

  private initializeStoryChapters() {
    const chapters: StoryChapter[] = [
      {
        id: 'chapter_1',
        title: 'The Awakening',
        description: 'Kaden and Adelynn discover their destiny as space pilots',
        unlocked: true,
        completed: false,
        objectives: [
          {
            id: 'obj_1_1',
            description: 'Complete the training mission',
            type: 'survive',
            target: 60,
            current: 0,
            completed: false,
            reward: { type: 'xp', value: 100, description: '100 XP' }
          },
          {
            id: 'obj_1_2',
            description: 'Destroy 10 enemy ships',
            type: 'kill',
            target: 10,
            current: 0,
            completed: false,
            reward: { type: 'weapon', value: 'rapid_fire', description: 'Rapid Fire Weapon' }
          }
        ],
        cutscenes: [
          {
            id: 'cutscene_1_1',
            title: 'The Discovery',
            text: 'Kaden and Adelynn find themselves in a mysterious space station, unaware of the adventure that awaits them.',
            character: 'narrator',
            emotion: 'neutral',
            background: 'space_station',
            music: 'mysterious',
            duration: 5000
          }
        ],
        rewards: [
          { type: 'xp', value: 200, description: '200 XP' },
          { type: 'achievement', value: 'first_steps', description: 'First Steps Achievement' }
        ]
      },
      {
        id: 'chapter_2',
        title: 'First Mission',
        description: 'Their first real space combat mission',
        unlocked: false,
        completed: false,
        objectives: [
          {
            id: 'obj_2_1',
            description: 'Survive for 3 minutes',
            type: 'survive',
            target: 180,
            current: 0,
            completed: false,
            reward: { type: 'xp', value: 150, description: '150 XP' }
          },
          {
            id: 'obj_2_2',
            description: 'Defeat the first boss',
            type: 'defeat_boss',
            target: 1,
            current: 0,
            completed: false,
            reward: { type: 'weapon', value: 'plasma_cannon', description: 'Plasma Cannon' }
          }
        ],
        cutscenes: [
          {
            id: 'cutscene_2_1',
            title: 'Mission Briefing',
            text: 'Commander: "This is your first real mission. Stay alert and work together."',
            character: 'narrator',
            emotion: 'worried',
            background: 'command_center',
            music: 'tense',
            duration: 4000
          }
        ],
        rewards: [
          { type: 'xp', value: 300, description: '300 XP' },
          { type: 'unlock', value: 'chapter_3', description: 'Unlock Chapter 3' }
        ],
        nextChapter: 'chapter_3'
      },
      {
        id: 'chapter_3',
        title: 'The Ancient Threat',
        description: 'Discovering an ancient cosmic danger',
        unlocked: false,
        completed: false,
        objectives: [
          {
            id: 'obj_3_1',
            description: 'Collect 5 power-ups',
            type: 'collect',
            target: 5,
            current: 0,
            completed: false,
            reward: { type: 'xp', value: 100, description: '100 XP' }
          },
          {
            id: 'obj_3_2',
            description: 'Reach the ancient temple',
            type: 'reach',
            target: 1,
            current: 0,
            completed: false,
            reward: { type: 'achievement', value: 'explorer', description: 'Explorer Achievement' }
          }
        ],
        cutscenes: [
          {
            id: 'cutscene_3_1',
            title: 'Ancient Discovery',
            text: 'Kaden: "What is this place? It feels... ancient."',
            character: 'kaden',
            emotion: 'excited',
            background: 'ancient_temple',
            music: 'mysterious',
            duration: 6000
          }
        ],
        rewards: [
          { type: 'xp', value: 400, description: '400 XP' },
          { type: 'unlock', value: 'chapter_4', description: 'Unlock Chapter 4' }
        ],
        nextChapter: 'chapter_4'
      }
    ];

    chapters.forEach(chapter => {
      this.chapters.set(chapter.id, chapter);
    });

    this.totalChapters = chapters.length;
  }

  private initializeCharacterDevelopment() {
    // Kaden's development
    const kaden: CharacterDevelopment = {
      character: 'kaden',
      level: 1,
      xp: 0,
      maxXp: 100,
      skills: [
        {
          id: 'pilot_skill',
          name: 'Pilot Skill',
          description: 'Improves ship maneuverability',
          level: 1,
          maxLevel: 5,
          unlocked: true
        },
        {
          id: 'combat_skill',
          name: 'Combat Skill',
          description: 'Improves weapon accuracy and damage',
          level: 1,
          maxLevel: 5,
          unlocked: true
        },
        {
          id: 'leadership',
          name: 'Leadership',
          description: 'Boosts team performance',
          level: 1,
          maxLevel: 3,
          unlocked: false
        }
      ],
      backstory: 'A brave and determined space pilot with lightning reflexes and a strong sense of justice.',
      personality: ['brave', 'determined', 'protective', 'optimistic'],
      relationships: [
        {
          character: 'adelynn',
          relationship: 'friend',
          level: 3,
          description: 'Close friends and trusted partners'
        }
      ]
    };

    // Adelynn's development
    const adelynn: CharacterDevelopment = {
      character: 'adelynn',
      level: 1,
      xp: 0,
      maxXp: 100,
      skills: [
        {
          id: 'navigation',
          name: 'Navigation',
          description: 'Improves ship speed and efficiency',
          level: 1,
          maxLevel: 5,
          unlocked: true
        },
        {
          id: 'tactics',
          name: 'Tactics',
          description: 'Improves strategic decision making',
          level: 1,
          maxLevel: 5,
          unlocked: true
        },
        {
          id: 'engineering',
          name: 'Engineering',
          description: 'Improves ship systems and repairs',
          level: 1,
          maxLevel: 3,
          unlocked: false
        }
      ],
      backstory: 'A skilled navigator with tactical expertise and a calm, analytical mind.',
      personality: ['analytical', 'calm', 'intelligent', 'loyal'],
      relationships: [
        {
          character: 'kaden',
          relationship: 'friend',
          level: 3,
          description: 'Close friends and trusted partners'
        }
      ]
    };

    this.characterDevelopment.set('kaden', kaden);
    this.characterDevelopment.set('adelynn', adelynn);
  }

  // Chapter management
  startChapter(chapterId: string) {
    const chapter = this.chapters.get(chapterId);
    if (!chapter || !chapter.unlocked) return false;

    this.currentChapter = chapterId;
    this.onChapterStart?.(chapter);
    return true;
  }

  completeChapter(chapterId: string) {
    const chapter = this.chapters.get(chapterId);
    if (!chapter) return false;

    chapter.completed = true;
    this.completedChapters++;
    this.storyProgress = (this.completedChapters / this.totalChapters) * 100;

    // Unlock next chapter
    if (chapter.nextChapter) {
      const nextChapter = this.chapters.get(chapter.nextChapter);
      if (nextChapter) {
        nextChapter.unlocked = true;
      }
    }

    // Award rewards
    chapter.rewards.forEach(reward => {
      this.awardReward(reward);
    });

    this.onChapterComplete?.(chapter);
    return true;
  }

  // Objective management
  updateObjective(objectiveId: string, progress: number) {
    const chapter = this.getCurrentChapter();
    if (!chapter) return false;

    const objective = chapter.objectives.find(obj => obj.id === objectiveId);
    if (!objective) return false;

    objective.current = Math.min(objective.current + progress, objective.target);
    
    if (objective.current >= objective.target && !objective.completed) {
      objective.completed = true;
      this.awardReward(objective.reward);
      this.onObjectiveComplete?.(objective);
    }

    return true;
  }

  // Cutscene management
  playCutscene(cutsceneId: string) {
    const chapter = this.getCurrentChapter();
    if (!chapter) return false;

    const cutscene = chapter.cutscenes.find(cs => cs.id === cutsceneId);
    if (!cutscene) return false;

    this.onCutsceneStart?.(cutscene);
    return true;
  }

  // Character development
  addCharacterXP(character: string, xp: number) {
    const charDev = this.characterDevelopment.get(character);
    if (!charDev) return false;

    charDev.xp += xp;
    
    // Check for level up
    while (charDev.xp >= charDev.maxXp) {
      charDev.xp -= charDev.maxXp;
      charDev.level++;
      charDev.maxXp = Math.floor(charDev.maxXp * 1.5);
      
      this.onCharacterLevelUp?.(character, charDev.level);
    }

    return true;
  }

  unlockSkill(character: string, skillId: string) {
    const charDev = this.characterDevelopment.get(character);
    if (!charDev) return false;

    const skill = charDev.skills.find(s => s.id === skillId);
    if (!skill) return false;

    skill.unlocked = true;
    return true;
  }

  upgradeSkill(character: string, skillId: string) {
    const charDev = this.characterDevelopment.get(character);
    if (!charDev) return false;

    const skill = charDev.skills.find(s => s.id === skillId);
    if (!skill || !skill.unlocked || skill.level >= skill.maxLevel) return false;

    skill.level++;
    return true;
  }

  // Reward system
  private awardReward(reward: StoryReward) {
    switch (reward.type) {
      case 'xp':
        // Award XP to current character
        this.addCharacterXP('kaden', reward.value);
        this.addCharacterXP('adelynn', reward.value);
        break;
      case 'weapon':
        // Unlock weapon
        console.log(`Weapon unlocked: ${reward.value}`);
        break;
      case 'powerup':
        // Unlock power-up
        console.log(`Power-up unlocked: ${reward.value}`);
        break;
      case 'achievement':
        // Unlock achievement
        console.log(`Achievement unlocked: ${reward.value}`);
        break;
      case 'unlock':
        // Unlock content
        console.log(`Content unlocked: ${reward.value}`);
        break;
    }

    this.onRewardEarned?.(reward);
  }

  // Getters
  getCurrentChapter(): StoryChapter | null {
    if (!this.currentChapter) return null;
    return this.chapters.get(this.currentChapter) || null;
  }

  getChapter(chapterId: string): StoryChapter | null {
    return this.chapters.get(chapterId) || null;
  }

  getAllChapters(): StoryChapter[] {
    return Array.from(this.chapters.values());
  }

  getUnlockedChapters(): StoryChapter[] {
    return Array.from(this.chapters.values()).filter(chapter => chapter.unlocked);
  }

  getCompletedChapters(): StoryChapter[] {
    return Array.from(this.chapters.values()).filter(chapter => chapter.completed);
  }

  getCharacterDevelopment(character: string): CharacterDevelopment | null {
    return this.characterDevelopment.get(character) || null;
  }

  getStoryProgress(): number {
    return this.storyProgress;
  }

  getTotalChapters(): number {
    return this.totalChapters;
  }

  getCompletedChaptersCount(): number {
    return this.completedChapters;
  }

  // Event setters
  setOnChapterStart(callback: (chapter: StoryChapter) => void) {
    this.onChapterStart = callback;
  }

  setOnChapterComplete(callback: (chapter: StoryChapter) => void) {
    this.onChapterComplete = callback;
  }

  setOnObjectiveComplete(callback: (objective: StoryObjective) => void) {
    this.onObjectiveComplete = callback;
  }

  setOnCutsceneStart(callback: (cutscene: Cutscene) => void) {
    this.onCutsceneStart = callback;
  }

  setOnRewardEarned(callback: (reward: StoryReward) => void) {
    this.onRewardEarned = callback;
  }

  setOnCharacterLevelUp(callback: (character: string, level: number) => void) {
    this.onCharacterLevelUp = callback;
  }

  // Update method
  update(deltaTime: number) {
    // Update any ongoing story elements
    // This could include cutscene timing, objective tracking, etc.
  }

  // Save/Load
  saveProgress() {
    const progress = {
      chapters: Array.from(this.chapters.entries()),
      characterDevelopment: Array.from(this.characterDevelopment.entries()),
      storyProgress: this.storyProgress,
      completedChapters: this.completedChapters,
      currentChapter: this.currentChapter
    };
    
    localStorage.setItem('storyProgress', JSON.stringify(progress));
  }

  loadProgress() {
    const saved = localStorage.getItem('storyProgress');
    if (!saved) return;

    try {
      const progress = JSON.parse(saved);
      
      // Restore chapters
      this.chapters.clear();
      progress.chapters.forEach(([id, chapter]: [string, StoryChapter]) => {
        this.chapters.set(id, chapter);
      });
      
      // Restore character development
      this.characterDevelopment.clear();
      progress.characterDevelopment.forEach(([character, dev]: [string, CharacterDevelopment]) => {
        this.characterDevelopment.set(character, dev);
      });
      
      this.storyProgress = progress.storyProgress;
      this.completedChapters = progress.completedChapters;
      this.currentChapter = progress.currentChapter;
    } catch (error) {
      console.error('Failed to load story progress:', error);
    }
  }
}

export default StoryModeSystem;

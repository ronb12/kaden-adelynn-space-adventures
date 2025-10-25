import React, { useState, useEffect } from 'react';
import { MissionObjective } from '../systems/AdvancedMultiplayerSystem';

interface Mission {
  id: string;
  type: 'eliminate' | 'escort' | 'defend' | 'explore' | 'collect' | 'survive' | 'race';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  duration: number; // in minutes
  rewards: {
    experience: number;
    credits: number;
    items: string[];
    reputation: number;
  };
  requirements: {
    level: number;
    ships: string[];
    abilities: string[];
  };
  objectives: MissionObjective[];
  environment: {
    hazards: string[];
    weather: string;
    gravity: number;
  };
  enemies: {
    types: string[];
    count: number;
    difficulty: number;
  };
  allies: {
    types: string[];
    count: number;
  };
}

interface MissionVarietySystemProps {
  playerLevel: number;
  unlockedShips: string[];
  unlockedAbilities: string[];
  onMissionStart: (mission: Mission) => void;
  onMissionComplete: (mission: Mission, success: boolean) => void;
}

export const MissionVarietySystem: React.FC<MissionVarietySystemProps> = ({
  playerLevel,
  unlockedShips,
  unlockedAbilities,
  onMissionStart,
  onMissionComplete
}) => {
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionFilter, setMissionFilter] = useState<'all' | 'available' | 'completed'>('available');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard' | 'expert'>('all');

  useEffect(() => {
    generateAvailableMissions();
  }, [playerLevel, unlockedShips, unlockedAbilities]);

  const generateAvailableMissions = () => {
    const missions: Mission[] = [
      // Elimination Missions
      {
        id: 'eliminate_pirates',
        type: 'eliminate',
        title: 'Pirate Elimination',
        description: 'Clear the asteroid field of pirate ships that have been harassing trade routes.',
        difficulty: 'easy',
        duration: 15,
        rewards: { experience: 500, credits: 200, items: ['pirate_bounty'], reputation: 25 },
        requirements: { level: 1, ships: ['basic_fighter'], abilities: ['basic_maneuver'] },
        objectives: [
          {
            id: 'eliminate_pirates',
            type: 'eliminate',
            description: 'Eliminate all pirate ships',
            progress: 0,
            maxProgress: 5,
            priority: 'high',
            rewards: { experience: 500, credits: 200, items: [], reputation: 25 }
          }
        ],
        environment: {
          hazards: ['asteroids', 'debris'],
          weather: 'clear',
          gravity: 1
        },
        enemies: { types: ['pirate_fighter'], count: 5, difficulty: 1 },
        allies: { types: [], count: 0 }
      },
      {
        id: 'eliminate_boss',
        type: 'eliminate',
        title: 'Boss Battle: Crimson Destroyer',
        description: 'Face off against the legendary Crimson Destroyer, a massive enemy battleship.',
        difficulty: 'expert',
        duration: 30,
        rewards: { experience: 2000, credits: 1000, items: ['boss_trophy', 'rare_weapon'], reputation: 100 },
        requirements: { level: 15, ships: ['advanced_fighter', 'heavy_cruiser'], abilities: ['evasive_maneuver', 'rapid_fire'] },
        objectives: [
          {
            id: 'eliminate_boss',
            type: 'eliminate',
            description: 'Destroy the Crimson Destroyer',
            progress: 0,
            maxProgress: 1,
            priority: 'critical',
            rewards: { experience: 2000, credits: 1000, items: ['boss_trophy'], reputation: 100 }
          }
        ],
        environment: {
          hazards: ['solar_storm', 'gravity_well'],
          weather: 'storm',
          gravity: 1.2
        },
        enemies: { types: ['boss_destroyer'], count: 1, difficulty: 5 },
        allies: { types: [], count: 0 }
      },

      // Escort Missions
      {
        id: 'escort_merchant',
        type: 'escort',
        title: 'Merchant Convoy Protection',
        description: 'Protect a convoy of merchant ships through dangerous space.',
        difficulty: 'medium',
        duration: 20,
        rewards: { experience: 800, credits: 400, items: ['merchant_badge'], reputation: 50 },
        requirements: { level: 5, ships: ['basic_fighter'], abilities: ['target_lock'] },
        objectives: [
          {
            id: 'escort_merchant',
            type: 'escort',
            description: 'Keep all merchant ships alive',
            progress: 0,
            maxProgress: 3,
            priority: 'high',
            rewards: { experience: 800, credits: 400, items: ['merchant_badge'], reputation: 50 }
          }
        ],
        environment: {
          hazards: ['asteroids', 'pirates'],
          weather: 'clear',
          gravity: 1
        },
        enemies: { types: ['pirate_fighter', 'pirate_bomber'], count: 8, difficulty: 2 },
        allies: { types: ['merchant_ship'], count: 3 }
      },

      // Defense Missions
      {
        id: 'defend_station',
        type: 'defend',
        title: 'Space Station Defense',
        description: 'Defend a critical space station from enemy attack.',
        difficulty: 'hard',
        duration: 25,
        rewards: { experience: 1200, credits: 600, items: ['defense_medal'], reputation: 75 },
        requirements: { level: 10, ships: ['advanced_fighter'], abilities: ['shield_boost', 'repair'] },
        objectives: [
          {
            id: 'defend_station',
            type: 'defend',
            description: 'Keep the station operational',
            progress: 0,
            maxProgress: 100,
            priority: 'critical',
            rewards: { experience: 1200, credits: 600, items: ['defense_medal'], reputation: 75 }
          }
        ],
        environment: {
          hazards: ['enemy_fire', 'explosions'],
          weather: 'clear',
          gravity: 1
        },
        enemies: { types: ['enemy_fighter', 'enemy_bomber', 'enemy_cruiser'], count: 12, difficulty: 3 },
        allies: { types: ['station_turret'], count: 4 }
      },

      // Exploration Missions
      {
        id: 'explore_anomaly',
        type: 'explore',
        title: 'Mysterious Anomaly',
        description: 'Investigate a strange energy anomaly in deep space.',
        difficulty: 'medium',
        duration: 30,
        rewards: { experience: 1000, credits: 500, items: ['anomaly_data'], reputation: 40 },
        requirements: { level: 8, ships: ['advanced_fighter'], abilities: ['scan'] },
        objectives: [
          {
            id: 'explore_anomaly',
            type: 'explore',
            description: 'Scan the anomaly and collect data',
            progress: 0,
            maxProgress: 5,
            priority: 'medium',
            rewards: { experience: 1000, credits: 500, items: ['anomaly_data'], reputation: 40 }
          }
        ],
        environment: {
          hazards: ['radiation', 'gravity_well'],
          weather: 'storm',
          gravity: 0.8
        },
        enemies: { types: ['anomaly_creature'], count: 3, difficulty: 2 },
        allies: { types: ['research_probe'], count: 2 }
      },

      // Collection Missions
      {
        id: 'collect_resources',
        type: 'collect',
        title: 'Resource Gathering',
        description: 'Collect valuable resources from asteroid fields.',
        difficulty: 'easy',
        duration: 20,
        rewards: { experience: 600, credits: 300, items: ['rare_minerals'], reputation: 20 },
        requirements: { level: 3, ships: ['basic_fighter'], abilities: ['basic_maneuver'] },
        objectives: [
          {
            id: 'collect_resources',
            type: 'collect',
            description: 'Collect 10 resource containers',
            progress: 0,
            maxProgress: 10,
            priority: 'medium',
            rewards: { experience: 600, credits: 300, items: ['rare_minerals'], reputation: 20 }
          }
        ],
        environment: {
          hazards: ['asteroids', 'debris'],
          weather: 'clear',
          gravity: 1
        },
        enemies: { types: ['space_pirate'], count: 4, difficulty: 1 },
        allies: { types: ['mining_drone'], count: 2 }
      },

      // Survival Missions
      {
        id: 'survive_wave',
        type: 'survive',
        title: 'Endless Waves',
        description: 'Survive as long as possible against endless waves of enemies.',
        difficulty: 'hard',
        duration: 45,
        rewards: { experience: 1500, credits: 750, items: ['survival_badge'], reputation: 60 },
        requirements: { level: 12, ships: ['advanced_fighter'], abilities: ['evasive_maneuver', 'rapid_fire'] },
        objectives: [
          {
            id: 'survive_wave',
            type: 'survive',
            description: 'Survive 10 waves of enemies',
            progress: 0,
            maxProgress: 10,
            priority: 'high',
            rewards: { experience: 1500, credits: 750, items: ['survival_badge'], reputation: 60 }
          }
        ],
        environment: {
          hazards: ['enemy_fire', 'explosions'],
          weather: 'storm',
          gravity: 1
        },
        enemies: { types: ['wave_fighter', 'wave_bomber'], count: 20, difficulty: 4 },
        allies: { types: [], count: 0 }
      },

      // Race Missions
      {
        id: 'race_circuit',
        type: 'race',
        title: 'Speed Circuit',
        description: 'Complete a high-speed race through an obstacle course.',
        difficulty: 'medium',
        duration: 15,
        rewards: { experience: 700, credits: 350, items: ['racing_trophy'], reputation: 30 },
        requirements: { level: 6, ships: ['interceptor'], abilities: ['boost'] },
        objectives: [
          {
            id: 'race_circuit',
            type: 'race',
            description: 'Complete the race in under 15 minutes',
            progress: 0,
            maxProgress: 1,
            priority: 'medium',
            rewards: { experience: 700, credits: 350, items: ['racing_trophy'], reputation: 30 }
          }
        ],
        environment: {
          hazards: ['asteroids', 'energy_gates'],
          weather: 'clear',
          gravity: 1
        },
        enemies: { types: ['racing_opponent'], count: 3, difficulty: 2 },
        allies: { types: ['racing_marshal'], count: 1 }
      }
    ];

    // Filter missions based on requirements
    const filteredMissions = missions.filter(mission => {
      return mission.requirements.level <= playerLevel &&
             mission.requirements.ships.every(ship => unlockedShips.includes(ship)) &&
             mission.requirements.abilities.every(ability => unlockedAbilities.includes(ability));
    });

    setAvailableMissions(filteredMissions);
  };

  const getFilteredMissions = () => {
    let filtered = availableMissions;

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(mission => mission.difficulty === difficultyFilter);
    }

    return filtered;
  };

  const startMission = (mission: Mission) => {
    setSelectedMission(mission);
    onMissionStart(mission);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#00ff00';
      case 'medium': return '#ffaa00';
      case 'hard': return '#ff6600';
      case 'expert': return '#ff0000';
      default: return '#ffffff';
    }
  };

  const getMissionIcon = (type: string) => {
    switch (type) {
      case 'eliminate': return '⚔️';
      case 'escort': return '🛡️';
      case 'defend': return '🏰';
      case 'explore': return '🔍';
      case 'collect': return '📦';
      case 'survive': return '💀';
      case 'race': return '🏁';
      default: return '🎯';
    }
  };

  return (
    <div className="mission-variety-system">
      <div className="mission-header">
        <h2>🎯 Mission Selection</h2>
        <div className="mission-filters">
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div className="missions-grid">
        {getFilteredMissions().map(mission => (
          <div key={mission.id} className="mission-card">
            <div className="mission-header">
              <div className="mission-icon">{getMissionIcon(mission.type)}</div>
              <div className="mission-title">
                <h3>{mission.title}</h3>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(mission.difficulty) }}
                >
                  {mission.difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mission-description">
              <p>{mission.description}</p>
            </div>

            <div className="mission-details">
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">{mission.duration} min</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Level:</span>
                <span className="detail-value">{mission.requirements.level}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Enemies:</span>
                <span className="detail-value">{mission.enemies.count}</span>
              </div>
            </div>

            <div className="mission-objectives">
              <h4>Objectives:</h4>
              <ul>
                {mission.objectives.map(objective => (
                  <li key={objective.id}>{objective.description}</li>
                ))}
              </ul>
            </div>

            <div className="mission-rewards">
              <h4>Rewards:</h4>
              <div className="rewards-grid">
                <div className="reward-item">
                  <span className="reward-icon">⭐</span>
                  <span>{mission.rewards.experience} XP</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">💰</span>
                  <span>{mission.rewards.credits} Credits</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">🤝</span>
                  <span>{mission.rewards.reputation} Rep</span>
                </div>
                {mission.rewards.items.map((item, index) => (
                  <div key={index} className="reward-item">
                    <span className="reward-icon">🎁</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mission-environment">
              <h4>Environment:</h4>
              <div className="environment-tags">
                {mission.environment.hazards.map((hazard, index) => (
                  <span key={index} className="environment-tag hazard">
                    ⚠️ {hazard}
                  </span>
                ))}
                <span className="environment-tag weather">
                  🌤️ {mission.environment.weather}
                </span>
              </div>
            </div>

            <div className="mission-actions">
              <button 
                className="start-mission-btn"
                onClick={() => startMission(mission)}
              >
                🚀 Start Mission
              </button>
            </div>
          </div>
        ))}
      </div>

      {getFilteredMissions().length === 0 && (
        <div className="no-missions">
          <h3>No missions available</h3>
          <p>Complete more missions or level up to unlock new missions!</p>
        </div>
      )}
    </div>
  );
};

export default MissionVarietySystem;

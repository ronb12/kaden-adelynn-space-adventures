import React, { useState, useEffect } from 'react';
import { AdvancedMultiplayerSystem, SquadLeader, TacticalData, MissionObjective, TargetLock, PlayerRole, EnvironmentalHazard } from '../systems/AdvancedMultiplayerSystem';

interface AdvancedMultiplayerUIProps {
  multiplayerSystem: AdvancedMultiplayerSystem;
  isSquadLeader: boolean;
  playerRole: PlayerRole | null;
  onRoleChange: (role: PlayerRole['type']) => void;
}

export const AdvancedMultiplayerUI: React.FC<AdvancedMultiplayerUIProps> = ({
  multiplayerSystem,
  isSquadLeader,
  playerRole,
  onRoleChange
}) => {
  const [squad, setSquad] = useState<SquadLeader | null>(null);
  const [tacticalData, setTacticalData] = useState<TacticalData | null>(null);
  const [missionObjectives, setMissionObjectives] = useState<MissionObjective[]>([]);
  const [targetLocks, setTargetLocks] = useState<Map<string, TargetLock>>(new Map());
  const [environmentalHazards, setEnvironmentalHazards] = useState<EnvironmentalHazard[]>([]);
  const [showTacticalOverlay, setShowTacticalOverlay] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    // Set up event listeners
    multiplayerSystem.setOnSquadUpdate(setSquad);
    multiplayerSystem.setOnTacticalUpdate(setTacticalData);
    multiplayerSystem.setOnMissionUpdate(setMissionObjectives);
    multiplayerSystem.setOnEnvironmentalUpdate(setEnvironmentalHazards);

    // Initialize squad if leader
    if (isSquadLeader && !squad) {
      const newSquad = multiplayerSystem.createSquad('current_player', 'democratic');
      setSquad(newSquad);
    }
  }, [multiplayerSystem, isSquadLeader, squad]);

  const handleRoleSelection = (roleType: PlayerRole['type']) => {
    const role = multiplayerSystem.assignRole('current_player', roleType);
    onRoleChange(roleType);
    setShowRoleSelection(false);
  };

  const issueCommand = (commandType: string, target?: string) => {
    if (isSquadLeader && squad) {
      multiplayerSystem.issueCommand({
        type: commandType as any,
        target,
        priority: 'medium'
      });
    }
  };

  const lockTarget = (targetId: string, targetType: 'enemy' | 'ally' | 'objective') => {
    const targetLock = multiplayerSystem.lockTarget(targetId, targetType);
    setTargetLocks(new Map(targetLocks.set(targetId, targetLock)));
  };

  return (
    <div className="advanced-multiplayer-ui">
      {/* Squad Leader Controls */}
      {isSquadLeader && (
        <div className="squad-leader-controls">
          <div className="squad-commands">
            <h3>🎯 Squad Commands</h3>
            <div className="command-buttons">
              <button onClick={() => issueCommand('attack')}>⚔️ Attack</button>
              <button onClick={() => issueCommand('defend')}>🛡️ Defend</button>
              <button onClick={() => issueCommand('move')}>🚀 Move</button>
              <button onClick={() => issueCommand('support')}>🔧 Support</button>
              <button onClick={() => issueCommand('retreat')}>🏃 Retreat</button>
              <button onClick={() => issueCommand('regroup')}>👥 Regroup</button>
            </div>
          </div>

          <div className="tactical-overlay-toggle">
            <button 
              onClick={() => setShowTacticalOverlay(!showTacticalOverlay)}
              className={showTacticalOverlay ? 'active' : ''}
            >
              📡 Tactical Overlay
            </button>
          </div>
        </div>
      )}

      {/* Role Selection */}
      {!playerRole && (
        <div className="role-selection-modal">
          <div className="role-selection-content">
            <h2>🎭 Select Your Role</h2>
            <div className="role-options">
              <div className="role-card" onClick={() => handleRoleSelection('pilot')}>
                <div className="role-icon">✈️</div>
                <h3>Pilot</h3>
                <p>Ship control, navigation, and evasive maneuvers</p>
                <div className="role-abilities">
                  <span>Evasive Maneuver</span>
                  <span>Engine Boost</span>
                  <span>Barrel Roll</span>
                </div>
              </div>

              <div className="role-card" onClick={() => handleRoleSelection('gunner')}>
                <div className="role-icon">🎯</div>
                <h3>Gunner</h3>
                <p>Weapon systems, target acquisition, and combat tactics</p>
                <div className="role-abilities">
                  <span>Target Lock</span>
                  <span>Rapid Fire</span>
                  <span>Precision Shot</span>
                </div>
              </div>

              <div className="role-card" onClick={() => handleRoleSelection('engineer')}>
                <div className="role-icon">🔧</div>
                <h3>Engineer</h3>
                <p>Ship maintenance, energy management, and repairs</p>
                <div className="role-abilities">
                  <span>Emergency Repair</span>
                  <span>Shield Boost</span>
                  <span>Energy Transfer</span>
                </div>
              </div>

              <div className="role-card" onClick={() => handleRoleSelection('navigator')}>
                <div className="role-icon">🧭</div>
                <h3>Navigator</h3>
                <p>Route planning, sensor operations, and communication</p>
                <div className="role-abilities">
                  <span>Long Range Scan</span>
                  <span>Warp Jump</span>
                  <span>Gravity Well</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tactical Overlay */}
      {showTacticalOverlay && tacticalData && (
        <div className="tactical-overlay">
          <div className="tactical-header">
            <h3>📡 Tactical Overlay</h3>
            <button onClick={() => setShowTacticalOverlay(false)}>✕</button>
          </div>

          <div className="tactical-content">
            {/* Team Status */}
            <div className="team-status">
              <h4>👥 Team Status</h4>
              <div className="team-members">
                {tacticalData.teamPositions.map((member, index) => (
                  <div key={member.playerId} className="team-member">
                    <div className="member-info">
                      <span className="member-name">Player {index + 1}</span>
                      <span className="member-role">{member.role}</span>
                    </div>
                    <div className="member-status">
                      <div className="health-bar">
                        <div 
                          className="health-fill" 
                          style={{ width: `${member.health}%` }}
                        ></div>
                      </div>
                      <div className="shield-bar">
                        <div 
                          className="shield-fill" 
                          style={{ width: `${member.shield}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div className="threats">
              <h4>⚠️ Threats</h4>
              <div className="threat-list">
                {tacticalData.threats.map((threat, index) => (
                  <div key={threat.id} className={`threat-item ${threat.threatLevel}`}>
                    <span className="threat-type">{threat.type}</span>
                    <span className="threat-distance">{threat.distance}m</span>
                    <span className="threat-level">{threat.threatLevel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div className="resources">
              <h4>📊 Resources</h4>
              <div className="resource-grid">
                <div className="resource-item">
                  <span>Health</span>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill health" 
                      style={{ width: `${tacticalData.resources.teamHealth}%` }}
                    ></div>
                  </div>
                </div>
                <div className="resource-item">
                  <span>Shield</span>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill shield" 
                      style={{ width: `${tacticalData.resources.teamShield}%` }}
                    ></div>
                  </div>
                </div>
                <div className="resource-item">
                  <span>Energy</span>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill energy" 
                      style={{ width: `${tacticalData.resources.teamEnergy}%` }}
                    ></div>
                  </div>
                </div>
                <div className="resource-item">
                  <span>Ammo</span>
                  <div className="resource-bar">
                    <div 
                      className="resource-fill ammo" 
                      style={{ width: `${tacticalData.resources.ammunition}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mission Objectives */}
      {missionObjectives.length > 0 && (
        <div className="mission-objectives">
          <h3>🎯 Mission Objectives</h3>
          <div className="objectives-list">
            {missionObjectives.map((objective) => (
              <div key={objective.id} className={`objective-item ${objective.priority}`}>
                <div className="objective-header">
                  <span className="objective-type">{objective.type}</span>
                  <span className="objective-priority">{objective.priority}</span>
                </div>
                <div className="objective-description">{objective.description}</div>
                <div className="objective-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${(objective.progress / objective.maxProgress) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {objective.progress}/{objective.maxProgress}
                  </span>
                </div>
                {objective.timeLimit && (
                  <div className="objective-timer">
                    ⏰ {Math.max(0, objective.timeLimit - Date.now())}s
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Target Locking System */}
      <div className="target-locking">
        <h3>🎯 Target Locking</h3>
        <div className="target-list">
          {Array.from(targetLocks.values()).map((target) => (
            <div key={target.targetId} className="target-item">
              <div className="target-info">
                <span className="target-id">{target.targetId}</span>
                <span className="target-type">{target.targetType}</span>
              </div>
              <div className="target-status">
                <span className="lock-strength">{target.lockStrength}%</span>
                <span className="distance">{target.distance}m</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Hazards */}
      {environmentalHazards.length > 0 && (
        <div className="environmental-hazards">
          <h3>⚠️ Environmental Hazards</h3>
          <div className="hazards-list">
            {environmentalHazards.map((hazard, index) => (
              <div key={index} className={`hazard-item ${hazard.type}`}>
                <div className="hazard-icon">
                  {hazard.type === 'asteroid' && '🪨'}
                  {hazard.type === 'solar_storm' && '⚡'}
                  {hazard.type === 'gravity_well' && '🌀'}
                  {hazard.type === 'radiation' && '☢️'}
                  {hazard.type === 'debris' && '💥'}
                </div>
                <div className="hazard-info">
                  <span className="hazard-type">{hazard.type.replace('_', ' ')}</span>
                  <span className="hazard-intensity">Intensity: {hazard.intensity}</span>
                </div>
                <div className="hazard-timer">
                  {hazard.duration}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Player Role Display */}
      {playerRole && (
        <div className="player-role-display">
          <div className="role-info">
            <div className="role-icon">
              {playerRole.type === 'pilot' && '✈️'}
              {playerRole.type === 'gunner' && '🎯'}
              {playerRole.type === 'engineer' && '🔧'}
              {playerRole.type === 'navigator' && '🧭'}
            </div>
            <div className="role-details">
              <h4>{playerRole.type.charAt(0).toUpperCase() + playerRole.type.slice(1)}</h4>
              <div className="role-abilities">
                {playerRole.abilities.map((ability) => (
                  <div key={ability.id} className="ability-item">
                    <span className="ability-name">{ability.name}</span>
                    <span className="ability-cooldown">{ability.cooldown}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMultiplayerUI;

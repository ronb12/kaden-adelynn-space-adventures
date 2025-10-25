import React from 'react';
import { SaveLoadSystem, GameSaveData } from '../systems/SaveLoadSystem';

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  saveLoadSystem: SaveLoadSystem;
  onLoad: (saveData: GameSaveData) => void;
  onSave: (saveData: Partial<GameSaveData>) => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
  currentGameData?: Partial<GameSaveData>;
}

export const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  saveLoadSystem,
  onLoad,
  onSave,
  onToast,
  currentGameData
}) => {
  const [activeTab, setActiveTab] = React.useState<'save' | 'load'>('load');
  const [saves, setSaves] = React.useState<Array<{ timestamp: number; score: number; level: number }>>([]);
  const [isExporting, setIsExporting] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      loadSavesList();
    }
  }, [isOpen]);

  const loadSavesList = () => {
    const savesList = [];
    const saveCount = saveLoadSystem.getSaveCount();
    
    for (let i = 0; i < saveCount; i++) {
      const saveInfo = saveLoadSystem.getSaveInfo(i);
      if (saveInfo) {
        savesList.push(saveInfo);
      }
    }
    
    setSaves(savesList);
  };

  const handleSave = (slotIndex: number) => {
    if (!currentGameData) {
      onToast?.('No game data to save!', 'error');
      return;
    }

    const success = saveLoadSystem.saveGame(currentGameData);
    if (success) {
      onToast?.('Game saved successfully!', 'success');
      loadSavesList();
    } else {
      onToast?.('Failed to save game!', 'error');
    }
  };

  const handleLoad = (slotIndex: number) => {
    const saveData = saveLoadSystem.loadGame(slotIndex);
    if (saveData) {
      onLoad(saveData);
      onToast?.('Game loaded successfully!', 'success');
      onClose();
    } else {
      onToast?.('Failed to load game!', 'error');
    }
  };

  const handleDelete = (slotIndex: number) => {
    const success = saveLoadSystem.deleteSave(slotIndex);
    if (success) {
      onToast?.('Save deleted successfully!', 'success');
      loadSavesList();
    } else {
      onToast?.('Failed to delete save!', 'error');
    }
  };

  const handleExport = (slotIndex: number) => {
    const saveData = saveLoadSystem.exportSave(slotIndex);
    if (saveData) {
      const blob = new Blob([saveData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kaden-adelynn-save-${slotIndex + 1}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onToast?.('Save exported successfully!', 'success');
    } else {
      onToast?.('Failed to export save!', 'error');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const saveData = e.target?.result as string;
        const success = saveLoadSystem.importSave(saveData);
        if (success) {
          onToast?.('Save imported successfully!', 'success');
          loadSavesList();
        } else {
          onToast?.('Invalid save file!', 'error');
        }
      } catch (error) {
        onToast?.('Failed to import save!', 'error');
      }
    };
    reader.readAsText(file);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="save-load-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💾 Save & Load</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="save-load-content">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-btn ${activeTab === 'load' ? 'active' : ''}`}
              onClick={() => setActiveTab('load')}
            >
              📂 Load Game
            </button>
            <button
              className={`tab-btn ${activeTab === 'save' ? 'active' : ''}`}
              onClick={() => setActiveTab('save')}
            >
              💾 Save Game
            </button>
          </div>

          {/* Load Tab */}
          {activeTab === 'load' && (
            <div className="load-tab">
              <div className="saves-list">
                {saves.length === 0 ? (
                  <div className="no-saves">
                    <p>No saved games found</p>
                    <p>Start playing to create your first save!</p>
                  </div>
                ) : (
                  saves.map((save, index) => (
                    <div key={index} className="save-slot">
                      <div className="save-info">
                        <div className="save-header">
                          <h3>Save Slot {index + 1}</h3>
                          <span className="save-date">{formatDate(save.timestamp)}</span>
                        </div>
                        <div className="save-stats">
                          <div className="stat">
                            <span className="stat-label">Score:</span>
                            <span className="stat-value">{save.score.toLocaleString()}</span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Level:</span>
                            <span className="stat-value">{save.level}</span>
                          </div>
                        </div>
                      </div>
                      <div className="save-actions">
                        <button
                          className="action-btn load-btn"
                          onClick={() => handleLoad(index)}
                        >
                          Load
                        </button>
                        <button
                          className="action-btn export-btn"
                          onClick={() => handleExport(index)}
                        >
                          Export
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Import Section */}
              <div className="import-section">
                <h3>Import Save File</h3>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="import-input"
                />
                <p className="import-help">
                  Select a previously exported save file to import
                </p>
              </div>
            </div>
          )}

          {/* Save Tab */}
          {activeTab === 'save' && (
            <div className="save-tab">
              <div className="save-info">
                <h3>Current Game Progress</h3>
                {currentGameData ? (
                  <div className="current-stats">
                    <div className="stat">
                      <span className="stat-label">Score:</span>
                      <span className="stat-value">{currentGameData.playerStats?.score?.toLocaleString() || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Level:</span>
                      <span className="stat-value">{currentGameData.playerStats?.level || 1}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Enemies Killed:</span>
                      <span className="stat-value">{currentGameData.playerStats?.enemiesKilled || 0}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Bosses Killed:</span>
                      <span className="stat-value">{currentGameData.playerStats?.bossesKilled || 0}</span>
                    </div>
                  </div>
                ) : (
                  <p>No game data available to save</p>
                )}
              </div>

              <div className="save-slots">
                <h3>Save Slots</h3>
                <div className="slots-grid">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="save-slot">
                      <div className="slot-info">
                        <h4>Slot {index + 1}</h4>
                        {saves[index] ? (
                          <div className="existing-save">
                            <p>Score: {saves[index].score.toLocaleString()}</p>
                            <p>Level: {saves[index].level}</p>
                            <p>{formatDate(saves[index].timestamp)}</p>
                          </div>
                        ) : (
                          <p className="empty-slot">Empty</p>
                        )}
                      </div>
                      <button
                        className="save-btn"
                        onClick={() => handleSave(index)}
                        disabled={!currentGameData}
                      >
                        {saves[index] ? 'Overwrite' : 'Save'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


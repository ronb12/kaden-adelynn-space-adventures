import React, { useState, useEffect } from 'react';
import { KadenSprite, KadenSpriteRenderer } from '../graphics/KadenSprite';
import { AdelynnSprite, AdelynnSpriteRenderer } from '../graphics/AdelynnSprite';
import './SettingsPanel.css';

const SettingsPanel = ({ isOpen, onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState({
    // Audio Settings
    masterVolume: 0.7,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    
    // Graphics Settings
    particleEffects: true,
    screenShake: true,
    visualEffects: true,
    highQuality: true,
    
    // Gameplay Settings
    difficulty: 'medium',
    autoShoot: false,
    showFPS: false,
    showHitboxes: false,
    
    // Controls Settings
    keyboardControls: true,
    touchControls: true,
    gamepadSupport: true,
    
    // Character Settings
    selectedCharacter: 'kaden',
    
    // Display Settings
    fullscreen: false,
    vsync: true,
    frameRate: 60
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    onSettingsChange?.(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      masterVolume: 0.7,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      particleEffects: true,
      screenShake: true,
      visualEffects: true,
      highQuality: true,
      difficulty: 'medium',
      autoShoot: false,
      showFPS: false,
      showHitboxes: false,
      keyboardControls: true,
      touchControls: true,
      gamepadSupport: true,
      selectedCharacter: 'kaden',
      fullscreen: false,
      vsync: true,
      frameRate: 60
    };
    setSettings(defaultSettings);
    localStorage.setItem('gameSettings', JSON.stringify(defaultSettings));
    onSettingsChange?.(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <h2 className="settings-title">⚙️ Game Settings</h2>
        
        {/* Audio Settings */}
        <div className="settings-section">
          <h3 className="settings-section-title">🔊 Audio</h3>
          
          <div className="settings-group">
            <label className="settings-label">
              Master Volume: {Math.round(settings.masterVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.masterVolume}
              onChange={(e) => handleSettingChange('masterVolume', parseFloat(e.target.value))}
              className="settings-slider"
            />
          </div>
          
          <div className="settings-group">
            <label className="settings-label">
              Music Volume: {Math.round(settings.musicVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.musicVolume}
              onChange={(e) => handleSettingChange('musicVolume', parseFloat(e.target.value))}
              className="settings-slider"
            />
          </div>
          
          <div className="settings-group">
            <label className="settings-label">
              SFX Volume: {Math.round(settings.sfxVolume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.sfxVolume}
              onChange={(e) => handleSettingChange('sfxVolume', parseFloat(e.target.value))}
              className="settings-slider"
            />
          </div>
        </div>

        {/* Graphics Settings */}
        <div className="settings-section">
          <h3 className="settings-section-title">🎨 Graphics</h3>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.particleEffects}
                onChange={(e) => handleSettingChange('particleEffects', e.target.checked)}
                className="settings-checkbox"
              />
              Particle Effects
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.screenShake}
                onChange={(e) => handleSettingChange('screenShake', e.target.checked)}
                className="settings-checkbox"
              />
              Screen Shake
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.visualEffects}
                onChange={(e) => handleSettingChange('visualEffects', e.target.checked)}
                className="settings-checkbox"
              />
              Visual Effects
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.highQuality}
                onChange={(e) => handleSettingChange('highQuality', e.target.checked)}
                className="settings-checkbox"
              />
              High Quality Graphics
            </label>
          </div>
        </div>

        {/* Gameplay Settings */}
        <div className="settings-section">
          <h3 className="settings-section-title">🎮 Gameplay</h3>
          
          <div className="settings-group">
            <label className="settings-label">Difficulty:</label>
            <select
              value={settings.difficulty}
              onChange={(e) => handleSettingChange('difficulty', e.target.value)}
              className="settings-select"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.autoShoot}
                onChange={(e) => handleSettingChange('autoShoot', e.target.checked)}
                className="settings-checkbox"
              />
              Auto Shoot
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.showFPS}
                onChange={(e) => handleSettingChange('showFPS', e.target.checked)}
                className="settings-checkbox"
              />
              Show FPS
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.showHitboxes}
                onChange={(e) => handleSettingChange('showHitboxes', e.target.checked)}
                className="settings-checkbox"
              />
              Show Hitboxes (Debug)
            </label>
          </div>
        </div>

        {/* Character Selection */}
        <div className="settings-section">
          <h3 className="settings-section-title">👥 Character</h3>
          
          <div className="character-selection-grid">
            <div 
              className={`character-option ${settings.selectedCharacter === 'kaden' ? 'selected' : ''}`}
              onClick={() => handleSettingChange('selectedCharacter', 'kaden')}
            >
              <div className="character-icon">
                <canvas 
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      canvas.width = 32;
                      canvas.height = 32;
                      const kadenRenderer = new KadenSpriteRenderer();
                      kadenRenderer.renderKaden(ctx, 16, 16, 'idle', Date.now());
                    }
                  }}
                  width="32" 
                  height="32"
                  className="character-mini-sprite"
                />
              </div>
              <div className="character-name">Kaden</div>
              <div className="character-description">Thunderbolt Fighter</div>
            </div>
            
            <div 
              className={`character-option ${settings.selectedCharacter === 'adelynn' ? 'selected' : ''}`}
              onClick={() => handleSettingChange('selectedCharacter', 'adelynn')}
            >
              <div className="character-icon">
                <canvas 
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      canvas.width = 32;
                      canvas.height = 32;
                      const adelynnRenderer = new AdelynnSpriteRenderer();
                      adelynnRenderer.renderAdelynn(ctx, 16, 16, 'idle', Date.now());
                    }
                  }}
                  width="32" 
                  height="32"
                  className="character-mini-sprite"
                />
              </div>
              <div className="character-name">Adelynn</div>
              <div className="character-description">Starlight Defender</div>
            </div>
          </div>
        </div>

        {/* Controls Settings */}
        <div className="settings-section">
          <h3 className="settings-section-title">🎯 Controls</h3>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.keyboardControls}
                onChange={(e) => handleSettingChange('keyboardControls', e.target.checked)}
                className="settings-checkbox"
              />
              Keyboard Controls
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.touchControls}
                onChange={(e) => handleSettingChange('touchControls', e.target.checked)}
                className="settings-checkbox"
              />
              Touch Controls
            </label>
          </div>
          
          <div className="settings-group">
            <label className="settings-checkbox-label">
              <input
                type="checkbox"
                checked={settings.gamepadSupport}
                onChange={(e) => handleSettingChange('gamepadSupport', e.target.checked)}
                className="settings-checkbox"
              />
              Gamepad Support
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-buttons">
          <button className="settings-button" onClick={resetSettings}>
            🔄 Reset to Default
          </button>
          <button className="settings-button" onClick={onClose}>
            ✅ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

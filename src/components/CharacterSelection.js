import React, { useState } from 'react';
import { Storyline } from '../story/Storyline';
import { KadenSprite, KadenSpriteRenderer } from '../graphics/KadenSprite';
import { AdelynnSprite, AdelynnSpriteRenderer } from '../graphics/AdelynnSprite';
import './CharacterSelection.css';

const CharacterSelection = ({ isOpen, onClose, onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState('kaden');

  const handleCharacterSelect = (characterKey) => {
    setSelectedCharacter(characterKey);
  };

  const handleConfirm = () => {
    onCharacterSelect(selectedCharacter);
    onClose();
  };

  if (!isOpen) return null;

  const characters = Storyline.characters;

  return (
    <div className="character-selection-overlay">
      <div className="character-selection-panel">
        <h2 className="character-selection-title">👥 Choose Your Pilot</h2>
        <p className="character-selection-subtitle">
          Select your character to begin the adventure!
        </p>
        
        <div className="character-grid">
          {Object.entries(characters).map(([key, character]) => (
            <div
              key={key}
              className={`character-card ${selectedCharacter === key ? 'selected' : ''}`}
              onClick={() => handleCharacterSelect(key)}
            >
              <div className="character-avatar">
                <canvas 
                  ref={(canvas) => {
                    if (canvas) {
                      const ctx = canvas.getContext('2d');
                      canvas.width = 64;
                      canvas.height = 64;
                      
                      if (key === 'kaden') {
                        const kadenRenderer = new KadenSpriteRenderer();
                        kadenRenderer.renderKaden(ctx, 32, 32, 'idle', Date.now());
                      } else if (key === 'adelynn') {
                        const adelynnRenderer = new AdelynnSpriteRenderer();
                        adelynnRenderer.renderAdelynn(ctx, 32, 32, 'idle', Date.now());
                      }
                    }
                  }}
                  width="64" 
                  height="64"
                  className="character-sprite-canvas"
                />
              </div>
              
              <div className="character-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-age">{character.age} years old</p>
                <p className="character-ship">{character.ship}</p>
                
                <div className="character-description">
                  <p>{character.description}</p>
                </div>
                
                <div className="character-abilities">
                  <h4>Special Abilities:</h4>
                  <ul>
                    {character.abilities.map((ability, index) => (
                      <li key={index}>{ability}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="character-backstory">
                  <h4>Backstory:</h4>
                  <p>{character.backstory}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="character-selection-buttons">
          <button className="character-button secondary" onClick={onClose}>
            ← Back to Menu
          </button>
          <button className="character-button primary" onClick={handleConfirm}>
            Start Adventure →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;

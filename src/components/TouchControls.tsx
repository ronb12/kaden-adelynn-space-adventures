import React, { useState, useEffect, useRef } from 'react';
import './TouchControls.css';

interface TouchControlsProps {
  onMovement: (x: number, y: number) => void;
  onShoot: () => void;
  onWeaponSwitch: (weapon: number) => void;
  onPause: () => void;
  isVisible: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isActive: boolean;
}

const TouchControls: React.FC<TouchControlsProps> = ({
  onMovement,
  onShoot,
  onWeaponSwitch,
  onPause,
  isVisible
}) => {
  const [touchState, setTouchState] = useState<TouchState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isActive: false
  });
  
  const [isShooting, setIsShooting] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(0);
  
  const joystickRef = useRef<HTMLDivElement>(null);
  const shootButtonRef = useRef<HTMLButtonElement>(null);
  const weaponButtonsRef = useRef<HTMLDivElement>(null);
  
  // Handle touch start on joystick
  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setTouchState({
      startX: touch.clientX - rect.left,
      startY: touch.clientY - rect.top,
      currentX: touch.clientX - rect.left,
      currentY: touch.clientY - rect.top,
      isActive: true
    });
  };
  
  // Handle touch move on joystick
  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!touchState.isActive) return;
    
    const touch = e.touches[0];
    const rect = joystickRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const newX = touch.clientX - rect.left;
    const newY = touch.clientY - rect.top;
    
    setTouchState(prev => ({
      ...prev,
      currentX: newX,
      currentY: newY
    }));
    
    // Calculate movement delta
    const deltaX = newX - touchState.startX;
    const deltaY = newY - touchState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50; // Joystick radius
    
    if (distance > 0) {
      const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
      const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance));
      onMovement(normalizedX, normalizedY);
    }
  };
  
  // Handle touch end on joystick
  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setTouchState(prev => ({ ...prev, isActive: false }));
    onMovement(0, 0);
  };
  
  // Handle shoot button
  const handleShootTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsShooting(true);
    onShoot();
  };
  
  const handleShootTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsShooting(false);
  };
  
  // Handle weapon switching
  const handleWeaponTouch = (weapon: number) => {
    setSelectedWeapon(weapon);
    onWeaponSwitch(weapon);
  };
  
  // Handle pause button
  const handlePauseTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    onPause();
  };
  
  // Continuous shooting while button is pressed
  useEffect(() => {
    if (isShooting) {
      const interval = setInterval(() => {
        onShoot();
      }, 100); // Shoot every 100ms
      
      return () => clearInterval(interval);
    }
  }, [isShooting, onShoot]);
  
  if (!isVisible) return null;
  
  return (
    <div className="touch-controls">
      {/* Virtual Joystick */}
      <div 
        ref={joystickRef}
        className="virtual-joystick"
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
      >
        <div className="joystick-base">
          <div 
            className="joystick-knob"
            style={{
              transform: touchState.isActive 
                ? `translate(${Math.max(-50, Math.min(50, touchState.currentX - touchState.startX))}px, ${Math.max(-50, Math.min(50, touchState.currentY - touchState.startY))}px)`
                : 'translate(0, 0)'
            }}
          />
        </div>
      </div>
      
      {/* Shoot Button */}
      <button
        ref={shootButtonRef}
        className={`shoot-button ${isShooting ? 'active' : ''}`}
        onTouchStart={handleShootTouchStart}
        onTouchEnd={handleShootTouchEnd}
      >
        🔫
      </button>
      
      {/* Weapon Selection */}
      <div ref={weaponButtonsRef} className="weapon-buttons">
        {[0, 1, 2, 3, 4, 5].map((weapon) => (
          <button
            key={weapon}
            className={`weapon-button ${selectedWeapon === weapon ? 'selected' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handleWeaponTouch(weapon);
            }}
          >
            {weapon + 1}
          </button>
        ))}
      </div>
      
      {/* Pause Button */}
      <button
        className="pause-button"
        onTouchStart={handlePauseTouch}
      >
        ⏸️
      </button>
      
      {/* Movement Instructions */}
      <div className="touch-instructions">
        <p>👆 Touch and drag to move</p>
        <p>🔫 Hold to shoot</p>
        <p>🔢 Tap numbers for weapons</p>
      </div>
    </div>
  );
};

export default TouchControls;

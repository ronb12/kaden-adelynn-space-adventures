import React, { useState, useEffect } from 'react';
import './ToastNotification.css';

interface ToastNotificationProps {
  id: string;
  type: 'achievement' | 'powerup' | 'combo' | 'boss' | 'warning' | 'success';
  title: string;
  message: string;
  icon: string;
  duration?: number;
  onClose: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  type,
  title,
  message,
  icon,
  duration = 4000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Slide in animation
    const slideInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Auto close timer
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(slideInTimer);
      clearTimeout(closeTimer);
    };
  }, [duration]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match CSS transition duration
  };

  const getToastClass = () => {
    const baseClass = 'toast-notification';
    const typeClass = `toast-${type}`;
    const visibilityClass = isVisible ? 'toast-visible' : 'toast-hidden';
    const exitClass = isExiting ? 'toast-exiting' : '';
    
    return `${baseClass} ${typeClass} ${visibilityClass} ${exitClass}`.trim();
  };

  const getTypeColor = () => {
    switch (type) {
      case 'achievement':
        return '#ffd700';
      case 'powerup':
        return '#00ff00';
      case 'combo':
        return '#ff6600';
      case 'boss':
        return '#ff0000';
      case 'warning':
        return '#ffaa00';
      case 'success':
        return '#00aaff';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className={getToastClass()} onClick={handleClose}>
      <div className="toast-content">
        <div className="toast-icon" style={{ color: getTypeColor() }}>
          {icon}
        </div>
        <div className="toast-text">
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
        <button className="toast-close" onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}>
          ×
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ 
            animationDuration: `${duration}ms`,
            backgroundColor: getTypeColor()
          }}
        />
      </div>
    </div>
  );
};

export default ToastNotification;

import React, { useState, useCallback } from 'react';
import ToastNotification from './ToastNotification';

interface Toast {
  id: string;
  type: 'achievement' | 'powerup' | 'combo' | 'boss' | 'warning' | 'success';
  title: string;
  message: string;
  icon: string;
  duration?: number;
}

interface ToastManagerProps {
  children: React.ReactNode;
}

export const ToastContext = React.createContext<{
  showToast: (toast: Omit<Toast, 'id'>) => void;
  showAchievement: (achievement: { name: string; description: string; icon: string }) => void;
  showPowerUp: (powerUp: { name: string; description: string; icon: string }) => void;
  showCombo: (combo: number) => void;
  showBoss: (boss: { name: string; description: string; icon: string }) => void;
  showWarning: (message: string) => void;
  showSuccess: (message: string) => void;
} | null>(null);

const ToastManager: React.FC<ToastManagerProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      id,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showAchievement = useCallback((achievement: { name: string; description: string; icon: string }) => {
    showToast({
      type: 'achievement',
      title: `🏆 ${achievement.name}`,
      message: achievement.description,
      icon: achievement.icon,
      duration: 5000
    });
  }, [showToast]);

  const showPowerUp = useCallback((powerUp: { name: string; description: string; icon: string }) => {
    showToast({
      type: 'powerup',
      title: `⚡ ${powerUp.name}`,
      message: powerUp.description,
      icon: powerUp.icon,
      duration: 3000
    });
  }, [showToast]);

  const showCombo = useCallback((combo: number) => {
    showToast({
      type: 'combo',
      title: `🔥 COMBO x${combo}`,
      message: `Amazing combo streak!`,
      icon: '🔥',
      duration: 2000
    });
  }, [showToast]);

  const showBoss = useCallback((boss: { name: string; description: string; icon: string }) => {
    showToast({
      type: 'boss',
      title: `👹 ${boss.name}`,
      message: boss.description,
      icon: boss.icon,
      duration: 4000
    });
  }, [showToast]);

  const showWarning = useCallback((message: string) => {
    showToast({
      type: 'warning',
      title: '⚠️ Warning',
      message,
      icon: '⚠️',
      duration: 3000
    });
  }, [showToast]);

  const showSuccess = useCallback((message: string) => {
    showToast({
      type: 'success',
      title: '✅ Success',
      message,
      icon: '✅',
      duration: 3000
    });
  }, [showToast]);

  const contextValue = {
    showToast,
    showAchievement,
    showPowerUp,
    showCombo,
    showBoss,
    showWarning,
    showSuccess
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast notifications container */}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              position: 'fixed',
              top: `${20 + (index * 100)}px`,
              zIndex: 10000 + index
            }}
          >
            <ToastNotification
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              icon={toast.icon}
              duration={toast.duration}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastManager;

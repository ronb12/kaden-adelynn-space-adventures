import React, { useState, useEffect } from 'react';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      console.log('📱 PWA install prompt available');
      
      // Store the event globally so it can be used by the install button
      window.deferredPrompt = e;
    };

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('🎉 PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install prompt after a delay if available
    const timer = setTimeout(() => {
      if (deferredPrompt && !isInstalled) {
        setShowInstallPrompt(true);
      }
    }, 3000); // Show after 3 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !window.deferredPrompt) return;

    const prompt = deferredPrompt || window.deferredPrompt;
    
    // Show the install prompt
    prompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await prompt.userChoice;
    
    console.log(`User response to the install prompt: ${outcome}`);
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      window.deferredPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="pwa-install-prompt">
      <div className="pwa-install-content">
        <div className="pwa-install-icon">📱</div>
        <div className="pwa-install-text">
          <h3>Install Kaden & Adelynn Space Adventures</h3>
          <p>Get quick access and play offline!</p>
        </div>
        <div className="pwa-install-buttons">
          <button className="pwa-install-button primary" onClick={handleInstallClick}>
            Install
          </button>
          <button className="pwa-install-button secondary" onClick={handleDismiss}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
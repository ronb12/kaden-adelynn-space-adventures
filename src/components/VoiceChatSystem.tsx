import React, { useState, useEffect, useRef } from 'react';

interface VoiceChatSystemProps {
  isEnabled: boolean;
  channel: string;
  participants: string[];
  onVoiceMessage: (message: string, playerId: string) => void;
  onToggleMute: (muted: boolean) => void;
  onToggleDeafen: (deafened: boolean) => void;
}

export const VoiceChatSystem: React.FC<VoiceChatSystemProps> = ({
  isEnabled,
  channel,
  participants,
  onVoiceMessage,
  onToggleMute,
  onToggleDeafen
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(50);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [isConnected, setIsConnected] = useState(false);
  
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (isEnabled) {
      initializeVoiceChat();
    } else {
      cleanupVoiceChat();
    }

    return () => {
      cleanupVoiceChat();
    };
  }, [isEnabled]);

  const initializeVoiceChat = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Create audio context for voice activity detection
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Start voice activity detection
      startVoiceActivityDetection();
      
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to initialize voice chat:', error);
      setIsConnected(false);
    }
  };

  const startVoiceActivityDetection = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectVoiceActivity = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      // Update speaking state
      const speaking = average > 20; // Threshold for voice activity
      setIsSpeaking(speaking);
      
      // Continue detection
      animationFrameRef.current = requestAnimationFrame(detectVoiceActivity);
    };

    detectVoiceActivity();
  };

  const cleanupVoiceChat = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
    setIsConnected(false);
  };

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    onToggleMute(newMuted);
    
    // Mute/unmute the microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMuted;
      });
    }
  };

  const handleDeafenToggle = () => {
    const newDeafened = !isDeafened;
    setIsDeafened(newDeafened);
    onToggleDeafen(newDeafened);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
  };

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuality = event.target.value as 'low' | 'medium' | 'high';
    setQuality(newQuality);
  };

  const sendQuickMessage = (message: string) => {
    onVoiceMessage(message, 'current_player');
  };

  if (!isEnabled) {
    return (
      <div className="voice-chat-disabled">
        <div className="voice-chat-status">
          <span className="status-icon">🔇</span>
          <span>Voice Chat Disabled</span>
        </div>
      </div>
    );
  }

  return (
    <div className="voice-chat-system">
      {/* Voice Chat Status */}
      <div className="voice-chat-status">
        <div className="status-indicators">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            <span className="indicator-dot"></span>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          
          <div className={`status-indicator ${isSpeaking ? 'speaking' : 'silent'}`}>
            <span className="indicator-dot"></span>
            <span>{isSpeaking ? 'Speaking' : 'Silent'}</span>
          </div>
        </div>

        <div className="channel-info">
          <span className="channel-name">#{channel}</span>
          <span className="participant-count">{participants.length} players</span>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="voice-controls">
        <div className="control-group">
          <button 
            className={`control-btn mute ${isMuted ? 'active' : ''}`}
            onClick={handleMuteToggle}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? '🔇' : '🎤'}
          </button>
          
          <button 
            className={`control-btn deafen ${isDeafened ? 'active' : ''}`}
            onClick={handleDeafenToggle}
            title={isDeafened ? 'Undeafen' : 'Deafen'}
          >
            {isDeafened ? '🔇' : '🔊'}
          </button>
        </div>

        <div className="volume-control">
          <label>Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <span className="volume-value">{volume}%</span>
        </div>

        <div className="quality-control">
          <label>Quality</label>
          <select value={quality} onChange={handleQualityChange} className="quality-select">
            <option value="low">Low (64kbps)</option>
            <option value="medium">Medium (128kbps)</option>
            <option value="high">High (256kbps)</option>
          </select>
        </div>
      </div>

      {/* Quick Messages */}
      <div className="quick-messages">
        <h4>Quick Commands</h4>
        <div className="quick-message-buttons">
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Enemy spotted!')}
          >
            ⚠️ Enemy Spotted
          </button>
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Need backup!')}
          >
            🆘 Need Backup
          </button>
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Form up!')}
          >
            👥 Form Up
          </button>
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Retreat!')}
          >
            🏃 Retreat
          </button>
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Good job!')}
          >
            👍 Good Job
          </button>
          <button 
            className="quick-btn"
            onClick={() => sendQuickMessage('Roger that!')}
          >
            ✅ Roger That
          </button>
        </div>
      </div>

      {/* Participants List */}
      <div className="participants-list">
        <h4>Participants</h4>
        <div className="participants">
          {participants.map((participant, index) => (
            <div key={participant} className="participant">
              <div className="participant-info">
                <span className="participant-name">Player {index + 1}</span>
                <div className="participant-status">
                  <span className="status-dot speaking"></span>
                  <span className="status-text">Speaking</span>
                </div>
              </div>
              <div className="participant-controls">
                <button className="mute-participant" title="Mute Player">
                  🔇
                </button>
                <button className="volume-participant" title="Adjust Volume">
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Activity Visualization */}
      <div className="voice-activity">
        <h4>Voice Activity</h4>
        <div className="activity-meter">
          <div 
            className="activity-bar"
            style={{ 
              width: `${isSpeaking ? Math.min(100, volume + 20) : 0}%`,
              backgroundColor: isSpeaking ? '#00ff00' : '#333333'
            }}
          ></div>
        </div>
        <div className="activity-info">
          <span>Input Level: {isSpeaking ? 'Active' : 'Silent'}</span>
          <span>Quality: {quality.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceChatSystem;

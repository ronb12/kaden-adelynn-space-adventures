import React, { useState, useEffect, useRef } from 'react';
import { RealMultiplayerSystem, RealPlayer, RealGameRoom } from '../systems/RealMultiplayerSystem';
import { MultiplayerDataPersistence, PlayerProgress, Achievement } from '../systems/MultiplayerDataPersistence';

interface RealMultiplayerGameProps {
  onClose: () => void;
  serverUrl?: string;
}

export const RealMultiplayerGame: React.FC<RealMultiplayerGameProps> = ({ 
  onClose, 
  serverUrl = 'ws://localhost:8080' 
}) => {
  const [multiplayerSystem] = useState(() => new RealMultiplayerSystem(serverUrl));
  const [dataPersistence] = useState(() => new MultiplayerDataPersistence());
  
  // Connection state
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  
  // Room state
  const [rooms, setRooms] = useState<RealGameRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<RealGameRoom | null>(null);
  const [players, setPlayers] = useState<Map<string, RealPlayer>>(new Map());
  
  // UI state
  const [showRoomList, setShowRoomList] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showGameView, setShowGameView] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{playerId: string, message: string, timestamp: number}>>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Game state
  const [gameState, setGameState] = useState<any>(null);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    initializeMultiplayer();
    loadPlayerData();
    
    return () => {
      multiplayerSystem.disconnect();
      dataPersistence.destroy();
    };
  }, []);

  const initializeMultiplayer = async () => {
    // Set up event handlers
    multiplayerSystem.setOnConnectionChange((connected) => {
      setIsConnected(connected);
      setConnectionStatus(connected ? 'Connected' : 'Disconnected');
    });

    multiplayerSystem.setOnPlayerJoin((player) => {
      setPlayers(prev => new Map(prev.set(player.id, player)));
    });

    multiplayerSystem.setOnPlayerLeave((playerId) => {
      setPlayers(prev => {
        const newPlayers = new Map(prev);
        newPlayers.delete(playerId);
        return newPlayers;
      });
    });

    multiplayerSystem.setOnPlayerMove((player) => {
      setPlayers(prev => new Map(prev.set(player.id, player)));
    });

    multiplayerSystem.setOnChatMessage((playerId, message, timestamp) => {
      setChatMessages(prev => [...prev, { playerId, message, timestamp }]);
    });

    multiplayerSystem.setOnGameStateUpdate((gameState) => {
      setGameState(gameState);
    });

    multiplayerSystem.setOnRoomsUpdate((rooms) => {
      setRooms(rooms);
    });

    // Connect to server
    try {
      await multiplayerSystem.connect();
      await loadRooms();
    } catch (error) {
      console.error('Failed to connect to multiplayer server:', error);
      setConnectionStatus('Connection Failed');
    }
  };

  const loadPlayerData = async () => {
    const playerId = multiplayerSystem.getPlayerId();
    const progress = await dataPersistence.loadPlayerProgress(playerId);
    const achievements = await dataPersistence.loadAchievements();
    
    setPlayerProgress(progress);
    setAchievements(achievements);
  };

  const loadRooms = async () => {
    const rooms = await multiplayerSystem.getRooms();
    setRooms(rooms);
  };

  const createRoom = async (name: string, maxPlayers: number, gameMode: string) => {
    const room = await multiplayerSystem.createRoom(name, maxPlayers, gameMode);
    if (room) {
      setRooms(prev => [...prev, room]);
      setShowCreateRoom(false);
    }
  };

  const joinRoom = (roomId: string) => {
    const success = multiplayerSystem.joinRoom(roomId);
    if (success) {
      setCurrentRoom(multiplayerSystem.getCurrentRoom());
      setPlayers(multiplayerSystem.getPlayers());
      setShowRoomList(false);
      setShowGameView(true);
      startGameLoop();
    }
  };

  const leaveRoom = () => {
    multiplayerSystem.leaveRoom();
    setCurrentRoom(null);
    setPlayers(new Map());
    setShowGameView(false);
    setShowRoomList(true);
    stopGameLoop();
  };

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      multiplayerSystem.sendChatMessage(chatInput);
      setChatInput('');
    }
  };

  const startGameLoop = () => {
    if (gameLoopRef.current) return;
    
    const gameLoop = () => {
      updateGame();
      renderGame();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop();
  };

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const updateGame = () => {
    // Update game logic here
    // This would include player movement, collision detection, etc.
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars background
    drawStars(ctx, canvas.width, canvas.height);
    
    // Draw players
    players.forEach((player, playerId) => {
      drawPlayer(ctx, player, playerId === multiplayerSystem.getPlayerId());
    });
    
    // Draw game objects (enemies, bullets, power-ups, etc.)
    if (gameState) {
      drawGameObjects(ctx, gameState);
    }
  };

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 7) % width;
      const y = (i * 11) % height;
      ctx.fillRect(x, y, 1, 1);
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, player: RealPlayer, isCurrentPlayer: boolean) => {
    ctx.save();
    ctx.translate(player.position.x, player.position.y);
    
    // Player ship
    ctx.fillStyle = isCurrentPlayer ? '#00ff00' : '#0066ff';
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(-10, 10);
    ctx.lineTo(0, 5);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();
    
    // Health bar
    if (player.health < 100) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(-15, -25, 30, 3);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(-15, -25, (player.health / 100) * 30, 3);
    }
    
    // Player name
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(player.name, 0, -30);
    
    ctx.restore();
  };

  const drawGameObjects = (ctx: CanvasRenderingContext2D, gameState: any) => {
    // Draw enemies, bullets, power-ups, etc.
    // This would be implemented based on the game state
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendChatMessage();
    }
  };

  if (showCreateRoom) {
    return (
      <div className="real-multiplayer-modal">
        <div className="modal-content">
          <h2>Create Room</h2>
          <div className="form-group">
            <label>Room Name:</label>
            <input type="text" id="roomName" placeholder="Enter room name" />
          </div>
          <div className="form-group">
            <label>Max Players:</label>
            <select id="maxPlayers">
              <option value="2">2 Players</option>
              <option value="4" selected>4 Players</option>
              <option value="8">8 Players</option>
            </select>
          </div>
          <div className="form-group">
            <label>Game Mode:</label>
            <select id="gameMode">
              <option value="cooperative" selected>Cooperative</option>
              <option value="competitive">Competitive</option>
              <option value="survival">Survival</option>
              <option value="boss_rush">Boss Rush</option>
            </select>
          </div>
          <div className="modal-actions">
            <button onClick={() => {
              const name = (document.getElementById('roomName') as HTMLInputElement)?.value;
              const maxPlayers = parseInt((document.getElementById('maxPlayers') as HTMLSelectElement)?.value || '4');
              const gameMode = (document.getElementById('gameMode') as HTMLSelectElement)?.value || 'cooperative';
              if (name) {
                createRoom(name, maxPlayers, gameMode);
              }
            }}>Create Room</button>
            <button onClick={() => setShowCreateRoom(false)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (showGameView) {
    return (
      <div className="real-multiplayer-game">
        <div className="game-header">
          <div className="connection-status">
            Status: {connectionStatus}
          </div>
          <div className="room-info">
            Room: {currentRoom?.name} ({players.size}/{currentRoom?.maxPlayers})
          </div>
          <button onClick={leaveRoom}>Leave Room</button>
        </div>
        
        <div className="game-content">
          <div className="game-canvas-container">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="game-canvas"
            />
          </div>
          
          <div className="game-sidebar">
            <div className="players-list">
              <h3>Players ({players.size})</h3>
              {Array.from(players.values()).map(player => (
                <div key={player.id} className="player-item">
                  <span className="player-name">{player.name}</span>
                  <span className="player-health">{player.health}%</span>
                  <span className="player-score">{player.score}</span>
                </div>
              ))}
            </div>
            
            <div className="chat-system">
              <h3>Chat</h3>
              <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="chat-message">
                    <span className="player-name">{msg.playerId}:</span>
                    <span className="message">{msg.message}</span>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                />
                <button onClick={sendChatMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="real-multiplayer-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>🚀 Real Multiplayer</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        <div className="connection-info">
          <div className="status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></span>
            {connectionStatus}
          </div>
          <div className="player-info">
            Player: {multiplayerSystem.getPlayerName()}
          </div>
        </div>
        
        <div className="rooms-section">
          <div className="section-header">
            <h3>Available Rooms</h3>
            <button onClick={() => setShowCreateRoom(true)}>Create Room</button>
            <button onClick={loadRooms}>Refresh</button>
          </div>
          
          <div className="rooms-list">
            {rooms.length === 0 ? (
              <div className="no-rooms">No rooms available</div>
            ) : (
              rooms.map(room => (
                <div key={room.id} className="room-item">
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>Mode: {room.gameMode}</p>
                    <p>Players: {room.players.length}/{room.maxPlayers}</p>
                  </div>
                  <button 
                    onClick={() => joinRoom(room.id)}
                    disabled={room.players.length >= room.maxPlayers}
                  >
                    {room.players.length >= room.maxPlayers ? 'Full' : 'Join'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {playerProgress && (
          <div className="player-progress">
            <h3>Your Progress</h3>
            <div className="progress-stats">
              <div>Level: {playerProgress.level}</div>
              <div>Experience: {playerProgress.experience}</div>
              <div>Games Played: {playerProgress.stats.gamesPlayed}</div>
              <div>Wins: {playerProgress.stats.wins}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

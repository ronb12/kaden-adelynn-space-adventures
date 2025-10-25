const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

class MultiplayerServer {
  constructor(port = 8080) {
    this.port = port;
    this.app = express();
    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });
    
    // Game state
    this.rooms = new Map();
    this.players = new Map();
    this.gameStates = new Map();
    
    // Data persistence
    this.dataFile = path.join(__dirname, 'data', 'multiplayer-data.json');
    this.ensureDataDirectory();
    this.loadPersistentData();
    
    this.setupRoutes();
    this.setupWebSocket();
    this.startPeriodicSave();
  }

  ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  loadPersistentData() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, 'utf8'));
        this.rooms = new Map(data.rooms || []);
        this.players = new Map(data.players || []);
        this.gameStates = new Map(data.gameStates || []);
        console.log('✅ Loaded persistent multiplayer data');
      }
    } catch (error) {
      console.log('⚠️ No existing data found, starting fresh');
    }
  }

  savePersistentData() {
    try {
      const data = {
        rooms: Array.from(this.rooms.entries()),
        players: Array.from(this.players.entries()),
        gameStates: Array.from(this.gameStates.entries()),
        timestamp: Date.now()
      };
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
      console.log('💾 Saved multiplayer data');
    } catch (error) {
      console.error('❌ Failed to save data:', error);
    }
  }

  startPeriodicSave() {
    // Save data every 30 seconds
    setInterval(() => {
      this.savePersistentData();
    }, 30000);
  }

  setupRoutes() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../build')));
    
    // API endpoints
    this.app.get('/api/rooms', (req, res) => {
      const roomsList = Array.from(this.rooms.values()).map(room => ({
        id: room.id,
        name: room.name,
        players: room.players.length,
        maxPlayers: room.maxPlayers,
        gameMode: room.gameMode,
        isActive: room.isActive
      }));
      res.json(roomsList);
    });

    this.app.post('/api/rooms', (req, res) => {
      const { name, maxPlayers = 4, gameMode = 'cooperative' } = req.body;
      const roomId = this.generateRoomId();
      const room = {
        id: roomId,
        name,
        maxPlayers,
        gameMode,
        players: [],
        isActive: false,
        createdAt: Date.now()
      };
      this.rooms.set(roomId, room);
      this.savePersistentData();
      res.json(room);
    });

    this.app.get('/api/players/:playerId', (req, res) => {
      const player = this.players.get(req.params.playerId);
      if (player) {
        res.json(player);
      } else {
        res.status(404).json({ error: 'Player not found' });
      }
    });

    this.app.post('/api/players', (req, res) => {
      const { name, avatar } = req.body;
      const playerId = this.generatePlayerId();
      const player = {
        id: playerId,
        name,
        avatar,
        level: 1,
        experience: 0,
        achievements: [],
        stats: {
          gamesPlayed: 0,
          wins: 0,
          kills: 0,
          deaths: 0
        },
        createdAt: Date.now()
      };
      this.players.set(playerId, player);
      this.savePersistentData();
      res.json(player);
    });
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      console.log('🔌 New WebSocket connection');
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('❌ Invalid message:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        this.handleDisconnection(ws);
      });

      ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error);
      });
    });
  }

  handleMessage(ws, message) {
    switch (message.type) {
      case 'join_room':
        this.handleJoinRoom(ws, message);
        break;
      case 'leave_room':
        this.handleLeaveRoom(ws, message);
        break;
      case 'player_move':
        this.handlePlayerMove(ws, message);
        break;
      case 'player_shoot':
        this.handlePlayerShoot(ws, message);
        break;
      case 'player_hit':
        this.handlePlayerHit(ws, message);
        break;
      case 'chat_message':
        this.handleChatMessage(ws, message);
        break;
      case 'game_state_update':
        this.handleGameStateUpdate(ws, message);
        break;
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
        break;
      default:
        console.log('❓ Unknown message type:', message.type);
    }
  }

  handleJoinRoom(ws, message) {
    const { roomId, playerId, playerName } = message;
    const room = this.rooms.get(roomId);
    
    if (!room) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
      return;
    }

    if (room.players.length >= room.maxPlayers) {
      ws.send(JSON.stringify({ type: 'error', message: 'Room is full' }));
      return;
    }

    // Add player to room
    const player = {
      id: playerId,
      name: playerName,
      ws: ws,
      position: { x: 100, y: 100 },
      health: 100,
      score: 0,
      isAlive: true
    };

    room.players.push(player);
    ws.playerId = playerId;
    ws.roomId = roomId;

    // Notify all players in room
    this.broadcastToRoom(roomId, {
      type: 'player_joined',
      player: { id: playerId, name: playerName }
    });

    // Send current room state to new player
    ws.send(JSON.stringify({
      type: 'room_state',
      room: {
        id: room.id,
        name: room.name,
        players: room.players.map(p => ({ id: p.id, name: p.name, position: p.position, health: p.health, score: p.score }))
      }
    }));

    console.log(`👥 Player ${playerName} joined room ${roomId}`);
  }

  handleLeaveRoom(ws, message) {
    const { roomId, playerId } = message;
    const room = this.rooms.get(roomId || ws.roomId);
    
    if (room) {
      room.players = room.players.filter(p => p.id !== (playerId || ws.playerId));
      
      this.broadcastToRoom(roomId || ws.roomId, {
        type: 'player_left',
        playerId: playerId || ws.playerId
      });

      console.log(`👋 Player left room ${roomId || ws.roomId}`);
    }
  }

  handlePlayerMove(ws, message) {
    const { roomId, playerId, position } = message;
    const room = this.rooms.get(roomId || ws.roomId);
    
    if (room) {
      const player = room.players.find(p => p.id === (playerId || ws.playerId));
      if (player) {
        player.position = position;
        
        // Broadcast to other players in room
        this.broadcastToRoom(roomId || ws.roomId, {
          type: 'player_moved',
          playerId: playerId || ws.playerId,
          position: position
        }, ws);
      }
    }
  }

  handlePlayerShoot(ws, message) {
    const { roomId, playerId, bullet } = message;
    
    this.broadcastToRoom(roomId || ws.roomId, {
      type: 'player_shot',
      playerId: playerId || ws.playerId,
      bullet: bullet
    }, ws);
  }

  handlePlayerHit(ws, message) {
    const { roomId, attackerId, targetId, damage } = message;
    
    this.broadcastToRoom(roomId || ws.roomId, {
      type: 'player_hit',
      attackerId,
      targetId,
      damage
    });
  }

  handleChatMessage(ws, message) {
    const { roomId, playerId, message: chatMessage } = message;
    
    this.broadcastToRoom(roomId || ws.roomId, {
      type: 'chat_message',
      playerId: playerId || ws.playerId,
      message: chatMessage,
      timestamp: Date.now()
    });
  }

  handleGameStateUpdate(ws, message) {
    const { roomId, gameState } = message;
    this.gameStates.set(roomId || ws.roomId, gameState);
    
    this.broadcastToRoom(roomId || ws.roomId, {
      type: 'game_state_updated',
      gameState: gameState
    }, ws);
  }

  handleDisconnection(ws) {
    if (ws.roomId && ws.playerId) {
      this.handleLeaveRoom(ws, { roomId: ws.roomId, playerId: ws.playerId });
    }
  }

  broadcastToRoom(roomId, message, excludeWs = null) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.players.forEach(player => {
        if (player.ws !== excludeWs && player.ws.readyState === WebSocket.OPEN) {
          player.ws.send(JSON.stringify(message));
        }
      });
    }
  }

  generateRoomId() {
    return 'room_' + Math.random().toString(36).substr(2, 9);
  }

  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`🚀 Multiplayer server running on port ${this.port}`);
      console.log(`📡 WebSocket server ready for connections`);
      console.log(`💾 Data persistence enabled`);
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new MultiplayerServer(process.env.PORT || 8080);
  server.start();
}

module.exports = MultiplayerServer;

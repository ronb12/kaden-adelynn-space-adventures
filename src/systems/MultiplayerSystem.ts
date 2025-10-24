// Multiplayer System - Complete Multiplayer Implementation
export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  health: number;
  score: number;
  weapon: string;
  isAlive: boolean;
  lastUpdate: number;
}

export interface GameRoom {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
  gameState: 'waiting' | 'playing' | 'finished';
  hostId: string;
  settings: RoomSettings;
}

export interface RoomSettings {
  gameMode: 'cooperative' | 'competitive' | 'survival' | 'boss_rush';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: number;
  scoreLimit: number;
  powerUps: boolean;
  friendlyFire: boolean;
  respawnEnabled: boolean;
}

export interface MultiplayerMessage {
  type: 'join' | 'leave' | 'move' | 'shoot' | 'hit' | 'death' | 'chat' | 'game_state';
  playerId: string;
  data: any;
  timestamp: number;
}

export class MultiplayerSystem {
  private socket: WebSocket | null = null;
  private playerId: string = '';
  private currentRoom: GameRoom | null = null;
  private players: Map<string, Player> = new Map();
  private rooms: Map<string, GameRoom> = new Map();
  private messageQueue: MultiplayerMessage[] = [];
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  // Event callbacks
  private onPlayerJoin: ((player: Player) => void) | null = null;
  private onPlayerLeave: ((playerId: string) => void) | null = null;
  private onPlayerMove: ((player: Player) => void) | null = null;
  private onPlayerShoot: ((playerId: string, bullet: any) => void) | null = null;
  private onPlayerHit: ((attackerId: string, targetId: string, damage: number) => void) | null = null;
  private onPlayerDeath: ((playerId: string) => void) | null = null;
  private onChatMessage: ((playerId: string, message: string) => void) | null = null;
  private onGameStateUpdate: ((gameState: any) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;

  constructor() {
    this.generatePlayerId();
  }

  private generatePlayerId() {
    this.playerId = 'player_' + Math.random().toString(36).substr(2, 9);
  }

  // Connection management
  connect(serverUrl: string = 'ws://localhost:8080') {
    try {
      this.socket = new WebSocket(serverUrl);
      
      this.socket.onopen = () => {
        console.log('Connected to multiplayer server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectionChange?.(true);
        this.processMessageQueue();
      };
      
      this.socket.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };
      
      this.socket.onclose = () => {
        console.log('Disconnected from multiplayer server');
        this.isConnected = false;
        this.onConnectionChange?.(false);
        this.attemptReconnect();
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        this.onConnectionChange?.(false);
      };
    } catch (error) {
      console.error('Failed to connect to multiplayer server:', error);
      this.isConnected = false;
      this.onConnectionChange?.(false);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, 2000 * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  // Message handling
  private handleMessage(message: MultiplayerMessage) {
    switch (message.type) {
      case 'join':
        this.handlePlayerJoin(message);
        break;
      case 'leave':
        this.handlePlayerLeave(message);
        break;
      case 'move':
        this.handlePlayerMove(message);
        break;
      case 'shoot':
        this.handlePlayerShoot(message);
        break;
      case 'hit':
        this.handlePlayerHit(message);
        break;
      case 'death':
        this.handlePlayerDeath(message);
        break;
      case 'chat':
        this.handleChatMessage(message);
        break;
      case 'game_state':
        this.handleGameStateUpdate(message);
        break;
    }
  }

  private handlePlayerJoin(message: MultiplayerMessage) {
    const player: Player = message.data;
    this.players.set(player.id, player);
    this.onPlayerJoin?.(player);
  }

  private handlePlayerLeave(message: MultiplayerMessage) {
    const playerId = message.data.playerId;
    this.players.delete(playerId);
    this.onPlayerLeave?.(playerId);
  }

  private handlePlayerMove(message: MultiplayerMessage) {
    const player: Player = message.data;
    this.players.set(player.id, player);
    this.onPlayerMove?.(player);
  }

  private handlePlayerShoot(message: MultiplayerMessage) {
    const { playerId, bullet } = message.data;
    this.onPlayerShoot?.(playerId, bullet);
  }

  private handlePlayerHit(message: MultiplayerMessage) {
    const { attackerId, targetId, damage } = message.data;
    this.onPlayerHit?.(attackerId, targetId, damage);
  }

  private handlePlayerDeath(message: MultiplayerMessage) {
    const playerId = message.data.playerId;
    this.onPlayerDeath?.(playerId);
  }

  private handleChatMessage(message: MultiplayerMessage) {
    const { playerId, message: chatMessage } = message.data;
    this.onChatMessage?.(playerId, chatMessage);
  }

  private handleGameStateUpdate(message: MultiplayerMessage) {
    const gameState = message.data;
    this.onGameStateUpdate?.(gameState);
  }

  // Message sending
  private sendMessage(message: MultiplayerMessage) {
    if (this.isConnected && this.socket) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  // Player actions
  joinRoom(roomId: string) {
    this.sendMessage({
      type: 'join',
      playerId: this.playerId,
      data: { roomId },
      timestamp: Date.now()
    });
  }

  leaveRoom() {
    this.sendMessage({
      type: 'leave',
      playerId: this.playerId,
      data: {},
      timestamp: Date.now()
    });
  }

  updatePlayerPosition(x: number, y: number) {
    this.sendMessage({
      type: 'move',
      playerId: this.playerId,
      data: { x, y },
      timestamp: Date.now()
    });
  }

  shootBullet(bullet: any) {
    this.sendMessage({
      type: 'shoot',
      playerId: this.playerId,
      data: { bullet },
      timestamp: Date.now()
    });
  }

  hitPlayer(targetId: string, damage: number) {
    this.sendMessage({
      type: 'hit',
      playerId: this.playerId,
      data: { targetId, damage },
      timestamp: Date.now()
    });
  }

  playerDied() {
    this.sendMessage({
      type: 'death',
      playerId: this.playerId,
      data: {},
      timestamp: Date.now()
    });
  }

  sendChatMessage(message: string) {
    this.sendMessage({
      type: 'chat',
      playerId: this.playerId,
      data: { message },
      timestamp: Date.now()
    });
  }

  // Room management
  createRoom(roomName: string, settings: RoomSettings): string {
    const roomId = 'room_' + Math.random().toString(36).substr(2, 9);
    const room: GameRoom = {
      id: roomId,
      name: roomName,
      players: [],
      maxPlayers: 4,
      gameState: 'waiting',
      hostId: this.playerId,
      settings
    };
    
    this.rooms.set(roomId, room);
    return roomId;
  }

  joinRoomById(roomId: string) {
    this.joinRoom(roomId);
  }

  getAvailableRooms(): GameRoom[] {
    return Array.from(this.rooms.values()).filter(room => 
      room.gameState === 'waiting' && room.players.length < room.maxPlayers
    );
  }

  // Game modes
  startCooperativeMode() {
    const settings: RoomSettings = {
      gameMode: 'cooperative',
      difficulty: 'medium',
      timeLimit: 0,
      scoreLimit: 0,
      powerUps: true,
      friendlyFire: false,
      respawnEnabled: true
    };
    
    return this.createRoom('Cooperative Game', settings);
  }

  startCompetitiveMode() {
    const settings: RoomSettings = {
      gameMode: 'competitive',
      difficulty: 'hard',
      timeLimit: 300,
      scoreLimit: 10000,
      powerUps: true,
      friendlyFire: true,
      respawnEnabled: false
    };
    
    return this.createRoom('Competitive Game', settings);
  }

  startSurvivalMode() {
    const settings: RoomSettings = {
      gameMode: 'survival',
      difficulty: 'expert',
      timeLimit: 0,
      scoreLimit: 0,
      powerUps: true,
      friendlyFire: false,
      respawnEnabled: false
    };
    
    return this.createRoom('Survival Mode', settings);
  }

  startBossRushMode() {
    const settings: RoomSettings = {
      gameMode: 'boss_rush',
      difficulty: 'expert',
      timeLimit: 600,
      scoreLimit: 0,
      powerUps: true,
      friendlyFire: false,
      respawnEnabled: true
    };
    
    return this.createRoom('Boss Rush', settings);
  }

  // Event setters
  setOnPlayerJoin(callback: (player: Player) => void) {
    this.onPlayerJoin = callback;
  }

  setOnPlayerLeave(callback: (playerId: string) => void) {
    this.onPlayerLeave = callback;
  }

  setOnPlayerMove(callback: (player: Player) => void) {
    this.onPlayerMove = callback;
  }

  setOnPlayerShoot(callback: (playerId: string, bullet: any) => void) {
    this.onPlayerShoot = callback;
  }

  setOnPlayerHit(callback: (attackerId: string, targetId: string, damage: number) => void) {
    this.onPlayerHit = callback;
  }

  setOnPlayerDeath(callback: (playerId: string) => void) {
    this.onPlayerDeath = callback;
  }

  setOnChatMessage(callback: (playerId: string, message: string) => void) {
    this.onChatMessage = callback;
  }

  setOnGameStateUpdate(callback: (gameState: any) => void) {
    this.onGameStateUpdate = callback;
  }

  setOnConnectionChange(callback: (connected: boolean) => void) {
    this.onConnectionChange = callback;
  }

  // Getters
  getPlayerId(): string {
    return this.playerId;
  }

  getCurrentRoom(): GameRoom | null {
    return this.currentRoom;
  }

  getPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  getPlayer(playerId: string): Player | null {
    return this.players.get(playerId) || null;
  }

  isPlayerConnected(): boolean {
    return this.isConnected;
  }

  // Update method
  update(deltaTime: number) {
    // Update player positions and handle timeouts
    const currentTime = Date.now();
    const timeout = 5000; // 5 seconds
    
    for (const [playerId, player] of Array.from(this.players.entries())) {
      if (currentTime - player.lastUpdate > timeout) {
        this.players.delete(playerId);
        this.onPlayerLeave?.(playerId);
      }
    }
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.isConnected = false;
    this.players.clear();
    this.rooms.clear();
    this.messageQueue = [];
    this.currentRoom = null;
  }

  destroy() {
    this.disconnect();
    this.onPlayerJoin = null;
    this.onPlayerLeave = null;
    this.onPlayerMove = null;
    this.onPlayerShoot = null;
    this.onPlayerHit = null;
    this.onPlayerDeath = null;
    this.onChatMessage = null;
    this.onGameStateUpdate = null;
    this.onConnectionChange = null;
  }
}

export default MultiplayerSystem;

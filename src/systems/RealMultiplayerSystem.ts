// Real Multiplayer System with WebSocket Integration
export interface RealPlayer {
  id: string;
  name: string;
  position: { x: number; y: number };
  health: number;
  maxHealth: number;
  score: number;
  isAlive: boolean;
  lastUpdate: number;
}

export interface RealGameRoom {
  id: string;
  name: string;
  maxPlayers: number;
  gameMode: 'cooperative' | 'competitive' | 'survival' | 'boss_rush';
  players: RealPlayer[];
  isActive: boolean;
  createdAt: number;
}

export interface RealMultiplayerMessage {
  type: 'join_room' | 'leave_room' | 'player_move' | 'player_shoot' | 'player_hit' | 'chat_message' | 'game_state_update' | 'ping' | 'pong' | 'room_state' | 'player_joined' | 'player_left' | 'player_moved' | 'player_shot' | 'game_state_updated' | 'error';
  roomId?: string;
  playerId?: string;
  playerName?: string;
  position?: { x: number; y: number };
  bullet?: any;
  attackerId?: string;
  targetId?: string;
  damage?: number;
  message?: string;
  gameState?: any;
  data?: any;
  timestamp: number;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  totalScore: number;
  playTime: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  level: number;
  experience: number;
  achievements: string[];
  stats: PlayerStats;
  createdAt: number;
  lastPlayed: number;
}

export class RealMultiplayerSystem {
  private socket: WebSocket | null = null;
  private playerId: string = '';
  private playerName: string = '';
  private currentRoom: RealGameRoom | null = null;
  private players: Map<string, RealPlayer> = new Map();
  private rooms: RealGameRoom[] = [];
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;
  private serverUrl: string = '';
  
  // Event callbacks
  private onConnectionChange: ((connected: boolean) => void) | null = null;
  private onPlayerJoin: ((player: RealPlayer) => void) | null = null;
  private onPlayerLeave: ((playerId: string) => void) | null = null;
  private onPlayerMove: ((player: RealPlayer) => void) | null = null;
  private onPlayerShoot: ((playerId: string, bullet: any) => void) | null = null;
  private onPlayerHit: ((attackerId: string, targetId: string, damage: number) => void) | null = null;
  private onChatMessage: ((playerId: string, message: string, timestamp: number) => void) | null = null;
  private onGameStateUpdate: ((gameState: any) => void) | null = null;
  private onRoomsUpdate: ((rooms: RealGameRoom[]) => void) | null = null;

  constructor(serverUrl: string = 'ws://localhost:8080') {
    this.serverUrl = serverUrl;
    this.loadPlayerProfile();
  }

  private loadPlayerProfile() {
    try {
      const saved = localStorage.getItem('multiplayer_player_profile');
      if (saved) {
        const profile = JSON.parse(saved);
        this.playerId = profile.id;
        this.playerName = profile.name;
      } else {
        this.generatePlayerProfile();
      }
    } catch (error) {
      console.error('Failed to load player profile:', error);
      this.generatePlayerProfile();
    }
  }

  private generatePlayerProfile() {
    this.playerId = 'player_' + Math.random().toString(36).substr(2, 9);
    this.playerName = 'Player_' + Math.floor(Math.random() * 1000);
    this.savePlayerProfile();
  }

  private savePlayerProfile() {
    const profile: PlayerProfile = {
      id: this.playerId,
      name: this.playerName,
      avatar: '🚀',
      level: 1,
      experience: 0,
      achievements: [],
      stats: {
        gamesPlayed: 0,
        wins: 0,
        kills: 0,
        deaths: 0,
        totalScore: 0,
        playTime: 0
      },
      createdAt: Date.now(),
      lastPlayed: Date.now()
    };
    localStorage.setItem('multiplayer_player_profile', JSON.stringify(profile));
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.serverUrl);
        
        this.socket.onopen = () => {
          console.log('🔌 Connected to multiplayer server');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.onConnectionChange?.(true);
          this.startPingInterval();
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.socket.onclose = () => {
          console.log('🔌 Disconnected from multiplayer server');
          this.isConnected = false;
          this.onConnectionChange?.(false);
          this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('❌ WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        console.error('❌ Failed to connect:', error);
        reject(error);
      }
    });
  }

  private handleMessage(data: string) {
    try {
      const message: RealMultiplayerMessage = JSON.parse(data);
      
      switch (message.type) {
        case 'room_state':
          this.handleRoomState(message.data);
          break;
        case 'player_joined':
          this.handlePlayerJoined(message.data);
          break;
        case 'player_left':
          this.handlePlayerLeft(message.data);
          break;
        case 'player_moved':
          this.handlePlayerMoved(message.data);
          break;
        case 'player_shot':
          this.handlePlayerShot(message.data);
          break;
        case 'player_hit':
          this.handlePlayerHit(message.data);
          break;
        case 'chat_message':
          this.handleChatMessage(message.data);
          break;
        case 'game_state_updated':
          this.handleGameStateUpdated(message.data);
          break;
        case 'pong':
          // Handle ping response
          break;
        case 'error':
          console.error('❌ Server error:', message.data);
          break;
        default:
          console.log('❓ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Failed to parse message:', error);
    }
  }

  private handleRoomState(data: any) {
    this.currentRoom = data.room;
    this.players.clear();
    data.room.players.forEach((player: RealPlayer) => {
      this.players.set(player.id, player);
    });
  }

  private handlePlayerJoined(data: any) {
    const player: RealPlayer = {
      id: data.player.id,
      name: data.player.name,
      position: data.player.position || { x: 100, y: 100 },
      health: data.player.health || 100,
      maxHealth: 100,
      score: data.player.score || 0,
      isAlive: true,
      lastUpdate: Date.now()
    };
    this.players.set(player.id, player);
    this.onPlayerJoin?.(player);
  }

  private handlePlayerLeft(data: any) {
    this.players.delete(data.playerId);
    this.onPlayerLeave?.(data.playerId);
  }

  private handlePlayerMoved(data: any) {
    const player = this.players.get(data.playerId);
    if (player) {
      player.position = data.position;
      player.lastUpdate = Date.now();
      this.onPlayerMove?.(player);
    }
  }

  private handlePlayerShot(data: any) {
    this.onPlayerShoot?.(data.playerId, data.bullet);
  }

  private handlePlayerHit(data: any) {
    this.onPlayerHit?.(data.attackerId, data.targetId, data.damage);
  }

  private handleChatMessage(data: any) {
    this.onChatMessage?.(data.playerId, data.message, data.timestamp);
  }

  private handleGameStateUpdated(data: any) {
    this.onGameStateUpdate?.(data.gameState);
  }

  private startPingInterval() {
    setInterval(() => {
      if (this.isConnected && this.socket) {
        this.sendMessage({
          type: 'ping',
          timestamp: Date.now()
        });
      }
    }, 30000); // Ping every 30 seconds
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect().catch(() => {
          // Reconnection failed, will try again
        });
      }, this.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  private sendMessage(message: RealMultiplayerMessage) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
    }
  }

  // Public API methods
  async getRooms(): Promise<RealGameRoom[]> {
    try {
      const response = await fetch(`${this.serverUrl.replace('ws://', 'http://').replace('wss://', 'https://')}/api/rooms`);
      const rooms = await response.json();
      this.rooms = rooms;
      this.onRoomsUpdate?.(rooms);
      return rooms;
    } catch (error) {
      console.error('❌ Failed to fetch rooms:', error);
      return [];
    }
  }

  async createRoom(name: string, maxPlayers: number = 4, gameMode: string = 'cooperative'): Promise<RealGameRoom | null> {
    try {
      const response = await fetch(`${this.serverUrl.replace('ws://', 'http://').replace('wss://', 'https://')}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, maxPlayers, gameMode })
      });
      const room = await response.json();
      return room;
    } catch (error) {
      console.error('❌ Failed to create room:', error);
      return null;
    }
  }

  joinRoom(roomId: string): boolean {
    if (!this.isConnected) {
      console.error('❌ Not connected to server');
      return false;
    }

    this.sendMessage({
      type: 'join_room',
      roomId,
      playerId: this.playerId,
      playerName: this.playerName,
      timestamp: Date.now()
    });

    return true;
  }

  leaveRoom(): boolean {
    if (!this.currentRoom) {
      return false;
    }

    this.sendMessage({
      type: 'leave_room',
      roomId: this.currentRoom.id,
      playerId: this.playerId,
      timestamp: Date.now()
    });

    this.currentRoom = null;
    this.players.clear();
    return true;
  }

  movePlayer(position: { x: number; y: number }): void {
    if (!this.currentRoom) return;

    this.sendMessage({
      type: 'player_move',
      roomId: this.currentRoom.id,
      playerId: this.playerId,
      position,
      timestamp: Date.now()
    });
  }

  shootPlayer(bullet: any): void {
    if (!this.currentRoom) return;

    this.sendMessage({
      type: 'player_shoot',
      roomId: this.currentRoom.id,
      playerId: this.playerId,
      bullet,
      timestamp: Date.now()
    });
  }

  hitPlayer(targetId: string, damage: number): void {
    if (!this.currentRoom) return;

    this.sendMessage({
      type: 'player_hit',
      roomId: this.currentRoom.id,
      attackerId: this.playerId,
      targetId,
      damage,
      timestamp: Date.now()
    });
  }

  sendChatMessage(message: string): void {
    if (!this.currentRoom) return;

    this.sendMessage({
      type: 'chat_message',
      roomId: this.currentRoom.id,
      playerId: this.playerId,
      message,
      timestamp: Date.now()
    });
  }

  updateGameState(gameState: any): void {
    if (!this.currentRoom) return;

    this.sendMessage({
      type: 'game_state_update',
      roomId: this.currentRoom.id,
      gameState,
      timestamp: Date.now()
    });
  }

  // Event setters
  setOnConnectionChange(callback: (connected: boolean) => void) {
    this.onConnectionChange = callback;
  }

  setOnPlayerJoin(callback: (player: RealPlayer) => void) {
    this.onPlayerJoin = callback;
  }

  setOnPlayerLeave(callback: (playerId: string) => void) {
    this.onPlayerLeave = callback;
  }

  setOnPlayerMove(callback: (player: RealPlayer) => void) {
    this.onPlayerMove = callback;
  }

  setOnPlayerShoot(callback: (playerId: string, bullet: any) => void) {
    this.onPlayerShoot = callback;
  }

  setOnPlayerHit(callback: (attackerId: string, targetId: string, damage: number) => void) {
    this.onPlayerHit = callback;
  }

  setOnChatMessage(callback: (playerId: string, message: string, timestamp: number) => void) {
    this.onChatMessage = callback;
  }

  setOnGameStateUpdate(callback: (gameState: any) => void) {
    this.onGameStateUpdate = callback;
  }

  setOnRoomsUpdate(callback: (rooms: RealGameRoom[]) => void) {
    this.onRoomsUpdate = callback;
  }

  // Getters
  getPlayerId(): string {
    return this.playerId;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  getCurrentRoom(): RealGameRoom | null {
    return this.currentRoom;
  }

  getPlayers(): Map<string, RealPlayer> {
    return this.players;
  }


  isConnectedToServer(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentRoom = null;
    this.players.clear();
  }

  destroy(): void {
    this.disconnect();
    this.onConnectionChange = null;
    this.onPlayerJoin = null;
    this.onPlayerLeave = null;
    this.onPlayerMove = null;
    this.onPlayerShoot = null;
    this.onPlayerHit = null;
    this.onChatMessage = null;
    this.onGameStateUpdate = null;
    this.onRoomsUpdate = null;
  }
}

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Desconectado do servidor:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Erro no socket:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event, data) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return;
    }
    this.socket.emit(event, data);
  }

  on(event, callback) {
    if (!this.socket) {
      console.error('Socket não conectado');
      return;
    }
    this.socket.on(event, callback);
    
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
    
    if (this.listeners.has(event)) {
      if (callback) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      } else {
        this.listeners.delete(event);
      }
    }
  }

  removeAllListeners(event) {
    if (!this.socket) return;
    
    if (event) {
      this.socket.removeAllListeners(event);
      this.listeners.delete(event);
    } else {
      this.socket.removeAllListeners();
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();

export const EVENTS = {
  CREATE_ROOM: 'create_room',
  JOIN_ROOM: 'join_room',
  MAKE_GUESS: 'make_guess',
  LEAVE_ROOM: 'leave_room',
  
  ROOM_CREATED: 'room_created',
  ROOM_JOINED: 'room_joined',
  GAME_STARTED: 'game_started',
  PLAYER_JOINED: 'player_joined',
  TURN_CHANGED: 'turn_changed',
  GUESS_RESULT: 'guess_result',
  ROUND_ENDED: 'round_ended',
  GAME_ENDED: 'game_ended',
  ERROR: 'error',
  ROOM_STATE: 'room_state',
};
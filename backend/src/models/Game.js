import { GAME_STATUS } from '../utils/constants.js';
import { Player } from './Player.js';

export class Game {
  constructor(roomId, config, hostId) {
    this.roomId = roomId;
    this.config = config;
    this.hostId = hostId;
    this.players = [];
    this.status = GAME_STATUS.WAITING;
    this.currentRound = 0;
    this.palavraSecreta = '';
    this.tentativaAtual = 0;
    this.jogadorAtualIndex = 0;
    this.palavrasDisponiveis = [];
    this.results = [];
    this.keyStates = {};
    this.lastWord = '';
    this.lastWinner = null;
    this.createdAt = new Date();
  }

  addPlayer(playerId, playerName, socketId) {
    if (this.players.length >= 2) {
      throw new Error('Sala cheia');
    }

    const player = new Player(playerId, playerName, socketId);
    this.players.push(player);
    return player;
  }

  removePlayer(playerId) {
    const index = this.players.findIndex(p => p.id === playerId);
    if (index !== -1) {
      this.players.splice(index, 1);
    }
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  getCurrentPlayer() {
    return this.players[this.jogadorAtualIndex];
  }

  canStart() {
    return this.players.length === 2 && this.status === GAME_STATUS.WAITING;
  }

  nextPlayer() {
    this.jogadorAtualIndex = (this.jogadorAtualIndex + 1) % this.players.length;
  }

  nextAttempt() {
    this.tentativaAtual++;
  }

  updatePlayerSocket(playerId, newSocketId) {
    const player = this.getPlayer(playerId);
    if (player) {
      player.socketId = newSocketId;
      player.connected = true;
    }
  }

  toJSON() {
    return {
      roomId: this.roomId,
      config: this.config,
      hostId: this.hostId,
      players: this.players.map(p => p.toJSON()),
      status: this.status,
      currentRound: this.currentRound,
      tentativaAtual: this.tentativaAtual,
      jogadorAtualIndex: this.jogadorAtualIndex,
      results: this.results,
      keyStates: this.keyStates,
      lastWord: this.lastWord,
      lastWinner: this.lastWinner,
    };
  }
}
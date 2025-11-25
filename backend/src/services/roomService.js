import { v4 as uuidv4 } from 'uuid';
import { Game } from '../models/Game.js';
import { GAME_STATUS, EVENTS } from '../utils/constants.js';
import { 
  validateGuess, 
  sortearPalavra, 
  calcularVencedor, 
  updateKeyStates 
} from './gameService.js';
import { PALAVRAS } from '../utils/palavras.js';

export class RoomService {
  constructor(io) {
    this.io = io;
    this.rooms = new Map();
  }

  /**
   * Cria uma nova sala
   */
  createRoom(config, hostId, hostName, socketId) {
    const roomId = uuidv4().substring(0, 6).toUpperCase();
    const game = new Game(roomId, config, hostId);
    
    // Adicionar host como primeiro jogador
    game.addPlayer(hostId, hostName, socketId);
    
    this.rooms.set(roomId, game);
    
    console.log(`🎮 Sala ${roomId} criada por ${hostName}`);
    return game;
  }

  /**
   * Jogador entra em uma sala
   */
  joinRoom(roomId, playerId, playerName, socketId) {
    const game = this.rooms.get(roomId);
    
    if (!game) {
      throw new Error('Sala não encontrada');
    }

    if (game.status !== GAME_STATUS.WAITING) {
      throw new Error('Jogo já iniciado');
    }

    if (game.players.length >= 2) {
      throw new Error('Sala cheia');
    }

    // Adicionar jogador
    const player = game.addPlayer(playerId, playerName, socketId);
    
    console.log(`👤 ${playerName} entrou na sala ${roomId}`);
    
    // Notificar todos na sala
    this.io.to(roomId).emit(EVENTS.PLAYER_JOINED, {
      player: player.toJSON(),
      game: game.toJSON(),
    });

    return game;
  }

  /**
   * Inicia o jogo
   */
  startGame(roomId) {
    const game = this.rooms.get(roomId);
    
    if (!game) {
      throw new Error('Sala não encontrada');
    }

    if (!game.canStart()) {
      throw new Error('Não é possível iniciar o jogo');
    }

    game.status = GAME_STATUS.IN_PROGRESS;
    this.startNewRound(roomId);
    
    console.log(`🎯 Jogo iniciado na sala ${roomId}`);
  }

  /**
   * Inicia uma nova rodada
   */
  startNewRound(roomId) {
    const game = this.rooms.get(roomId);
    
    if (!game) return;

    game.currentRound++;
    
    if (game.currentRound > game.config.numRounds) {
      this.endGame(roomId);
      return;
    }

    // Sortear palavra
    const palavrasDoTamanho = game.palavrasDisponiveis.length > 0
      ? game.palavrasDisponiveis
      : PALAVRAS.filter(p => p.length === game.config.wordLength);

    const { palavra, palavrasRestantes } = sortearPalavra(palavrasDoTamanho, game.config.wordLength);
    
    game.palavraSecreta = palavra;
    game.palavrasDisponiveis = palavrasRestantes;
    game.tentativaAtual = 0;
    game.results = [];
    game.keyStates = {};
    
    // Definir jogador inicial
    if (game.currentRound === 1) {
      game.jogadorAtualIndex = Math.floor(Math.random() * game.players.length);
    } else {
      game.nextPlayer();
    }

    // Resetar status dos jogadores
    game.players.forEach(p => p.resetRodada());

    console.log(`🔄 Rodada ${game.currentRound} iniciada na sala ${roomId}. Palavra: ${game.palavraSecreta}`);

    // Notificar todos
    this.io.to(roomId).emit(EVENTS.GAME_STARTED, {
      game: game.toJSON(),
      currentPlayer: game.getCurrentPlayer().toJSON(),
    });
  }

  /**
   * Processa um palpite
   */
  makeGuess(roomId, playerId, guess) {
    const game = this.rooms.get(roomId);
    
    if (!game) {
      throw new Error('Sala não encontrada');
    }

    const currentPlayer = game.getCurrentPlayer();
    
    if (currentPlayer.id !== playerId) {
      throw new Error('Não é sua vez');
    }

    if (guess.length !== game.config.wordLength) {
      throw new Error('Tamanho inválido');
    }

    // Validar palpite
    const result = validateGuess(guess, game.palavraSecreta);
    game.results[game.tentativaAtual] = result;
    
    // Atualizar teclado
    game.keyStates = updateKeyStates(game.keyStates, result);

    const won = guess.toUpperCase() === game.palavraSecreta;
    const lost = game.tentativaAtual >= game.config.numAttempts - 1;

    // Notificar resultado do palpite
    this.io.to(roomId).emit(EVENTS.GUESS_RESULT, {
      playerId,
      guess,
      result,
      tentativaAtual: game.tentativaAtual,
      keyStates: game.keyStates,
    });

    // Verificar vitória
    if (won) {
      currentPlayer.adicionarVitoria(game.palavraSecreta);
      game.lastWord = game.palavraSecreta;
      game.lastWinner = currentPlayer.nome;
      
      const vencedor = calcularVencedor(game.players, game.config.numRounds);
      
      setTimeout(() => {
        this.io.to(roomId).emit(EVENTS.ROUND_ENDED, {
          winner: currentPlayer.toJSON(),
          secretWord: game.palavraSecreta,
          game: game.toJSON(),
        });

        if (vencedor || game.currentRound >= game.config.numRounds) {
          setTimeout(() => this.endGame(roomId), 2000);
        } else {
          setTimeout(() => this.startNewRound(roomId), 3000);
        }
      }, 1500);
      
    } else if (lost) {
      game.lastWord = game.palavraSecreta;
      game.lastWinner = null;
      
      setTimeout(() => {
        this.io.to(roomId).emit(EVENTS.ROUND_ENDED, {
          winner: null,
          secretWord: game.palavraSecreta,
          game: game.toJSON(),
        });

        if (game.currentRound >= game.config.numRounds) {
          setTimeout(() => this.endGame(roomId), 2000);
        } else {
          setTimeout(() => this.startNewRound(roomId), 3000);
        }
      }, 1500);
      
    } else {
      // Próxima tentativa
      game.nextAttempt();
      game.nextPlayer();
      
      setTimeout(() => {
        this.io.to(roomId).emit(EVENTS.TURN_CHANGED, {
          currentPlayer: game.getCurrentPlayer().toJSON(),
          tentativaAtual: game.tentativaAtual,
        });
      }, 1500);
    }
  }

  /**
   * Finaliza o jogo
   */
  endGame(roomId) {
    const game = this.rooms.get(roomId);
    
    if (!game) return;

    game.status = GAME_STATUS.FINISHED;
    
    const sortedPlayers = [...game.players].sort((a, b) => b.pontos - a.pontos);
    
    console.log(`🏁 Jogo finalizado na sala ${roomId}`);

    this.io.to(roomId).emit(EVENTS.GAME_ENDED, {
      players: sortedPlayers.map(p => p.toJSON()),
      game: game.toJSON(),
    });
  }

  /**
   * Jogador sai da sala
   */
  leaveRoom(roomId, playerId) {
    const game = this.rooms.get(roomId);
    
    if (!game) return;

    game.removePlayer(playerId);
    
    if (game.players.length === 0) {
      this.rooms.delete(roomId);
      console.log(`🗑️ Sala ${roomId} removida (vazia)`);
    }
  }

  /**
   * Obtém o estado de uma sala
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }
}
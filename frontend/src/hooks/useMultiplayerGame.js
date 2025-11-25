import { useState, useCallback, useEffect } from 'react';
import { socketService, EVENTS } from '../services/socket';
import { useKeyboard } from './useKeyboard';

export const useMultiplayerGame = (playerId) => {
  const [gameState, setGameState] = useState(null);
  const [currentGuess, setCurrentGuess] = useState('');
  const [error, setError] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const updateTurnState = useCallback((game) => {
    if (!game || !game.players) return;
    
    const currentPlayer = game.players[game.jogadorAtualIndex];
    setIsMyTurn(currentPlayer?.id === playerId);
  }, [playerId]);

  const createRoom = useCallback((config, playerName) => {
    socketService.emit(EVENTS.CREATE_ROOM, {
      config,
      playerId,
      playerName,
    });
  }, [playerId]);

  const joinRoom = useCallback((roomCode, playerName) => {
    socketService.emit(EVENTS.JOIN_ROOM, {
      roomId: roomCode,
      playerId,
      playerName,
    });
  }, [playerId]);

  const makeGuess = useCallback((guess) => {
    if (!roomId || !isMyTurn) return;
    
    socketService.emit(EVENTS.MAKE_GUESS, {
      roomId,
      playerId,
      guess: guess.toUpperCase(),
    });
    
    setCurrentGuess('');
  }, [roomId, playerId, isMyTurn]);

  const handleKeyPress = useCallback((key) => {
    if (!isMyTurn || !gameState) return;

    if (key === 'ENTER') {
      if (currentGuess.length === gameState.config.wordLength) {
        makeGuess(currentGuess);
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < gameState.config.wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [isMyTurn, gameState, currentGuess, makeGuess]);

  useKeyboard(handleKeyPress, isMyTurn);

  useEffect(() => {
    const onRoomCreated = ({ roomId: newRoomId, game }) => {
      console.log('🎮 Sala criada:', newRoomId);
      setRoomId(newRoomId);
      setGameState(game);
      updateTurnState(game);
    };

    const onRoomJoined = ({ roomId: newRoomId, game }) => {
      console.log('🎮 Entrou na sala:', newRoomId);
      setRoomId(newRoomId);
      setGameState(game);
      updateTurnState(game);
    };

    const onPlayerJoined = ({ game }) => {
      console.log('👤 Jogador entrou');
      setGameState(game);
      updateTurnState(game);
    };

    const onGameStarted = ({ game }) => {
      console.log('🎯 Jogo iniciado!');
      setGameState(game);
      updateTurnState(game);
    };

    const onGuessResult = ({ result, tentativaAtual, keyStates }) => {
      console.log('📝 Palpite processado');
      setGameState(prev => ({
        ...prev,
        results: [...(prev.results || [])].concat([result]),
        tentativaAtual,
        keyStates,
      }));
    };

    const onTurnChanged = ({ currentPlayer, tentativaAtual }) => {
      console.log('Turno mudou para:', currentPlayer.nome);
      setGameState(prev => ({
        ...prev,
        tentativaAtual,
        jogadorAtualIndex: prev.players.findIndex(p => p.id === currentPlayer.id),
      }));
      setIsMyTurn(currentPlayer.id === playerId);
      setCurrentGuess('');
    };

    const onRoundEnded = ({ winner, secretWord, game }) => {
      console.log('Rodada terminou. Vencedor:', winner?.nome || 'Nenhum');
      setGameState(game);
      updateTurnState(game);
    };

    const onGameEnded = ({ players, game }) => {
      console.log('Jogo terminou!');
      setGameState(game);
    };

    const onError = ({ message }) => {
      console.error('Erro:', message);
      setError(message);
      setTimeout(() => setError(null), 5000);
    };

    socketService.on(EVENTS.ROOM_CREATED, onRoomCreated);
    socketService.on(EVENTS.ROOM_JOINED, onRoomJoined);
    socketService.on(EVENTS.PLAYER_JOINED, onPlayerJoined);
    socketService.on(EVENTS.GAME_STARTED, onGameStarted);
    socketService.on(EVENTS.GUESS_RESULT, onGuessResult);
    socketService.on(EVENTS.TURN_CHANGED, onTurnChanged);
    socketService.on(EVENTS.ROUND_ENDED, onRoundEnded);
    socketService.on(EVENTS.GAME_ENDED, onGameEnded);
    socketService.on(EVENTS.ERROR, onError);

    return () => {
      socketService.off(EVENTS.ROOM_CREATED, onRoomCreated);
      socketService.off(EVENTS.ROOM_JOINED, onRoomJoined);
      socketService.off(EVENTS.PLAYER_JOINED, onPlayerJoined);
      socketService.off(EVENTS.GAME_STARTED, onGameStarted);
      socketService.off(EVENTS.GUESS_RESULT, onGuessResult);
      socketService.off(EVENTS.TURN_CHANGED, onTurnChanged);
      socketService.off(EVENTS.ROUND_ENDED, onRoundEnded);
      socketService.off(EVENTS.GAME_ENDED, onGameEnded);
      socketService.off(EVENTS.ERROR, onError);
    };
  }, [playerId, updateTurnState]);

  return {
    gameState,
    currentGuess,
    setCurrentGuess,
    isMyTurn,
    roomId,
    error,
    createRoom,
    joinRoom,
    makeGuess,
    handleKeyPress,
  };
};
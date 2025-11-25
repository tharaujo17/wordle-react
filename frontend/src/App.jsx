import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ConfigScreen from './pages/ConfigScreen';
import WaitingRoom from './pages/WaitingRoom';
import GameScreen from './pages/GameScreen';
import { useSocket } from './hooks/useSocket';
import { useMultiplayerGame } from './hooks/useMultiplayerGame';

/**
 * Componente raiz da aplicação - versão multiplayer
 */
function App() {
  const [playerId] = useState(() => {
    // Recuperar ou criar ID do jogador
    let id = localStorage.getItem('termo_player_id');
    if (!id) {
      id = uuidv4();
      localStorage.setItem('termo_player_id', id);
    }
    return id;
  });

  const [screen, setScreen] = useState('config'); // 'config', 'waiting', 'game'
  
  // Conectar ao socket
  useSocket();

  // Hook do jogo multiplayer
  const {
    gameState,
    currentGuess,
    isMyTurn,
    roomId,
    error,
    createRoom,
    joinRoom,
    handleKeyPress,
  } = useMultiplayerGame(playerId);

  // Atualizar tela baseado no estado do jogo
  useEffect(() => {
    if (!gameState) {
      setScreen('config');
      return;
    }

    if (gameState.status === 'waiting') {
      setScreen('waiting');
    } else if (gameState.status === 'in_progress' || gameState.status === 'finished') {
      setScreen('game');
    }
  }, [gameState]);

  // Handlers
  const handleCreateRoom = (config, playerName) => {
    createRoom(config, playerName);
  };

  const handleJoinRoom = (roomCode, playerName) => {
    joinRoom(roomCode, playerName);
  };

  const handleBackToConfig = () => {
    setScreen('config');
    window.location.reload(); // Força reset completo
  };

  return (
    <>
      {/* Notificação de erro */}
      {error && (
        <div className="error-notification">
          ⚠️ {error}
        </div>
      )}

      {/* Renderizar tela apropriada */}
      {screen === 'config' && (
        <ConfigScreen
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {screen === 'waiting' && gameState && (
        <WaitingRoom
          roomId={roomId}
          players={gameState.players}
          onCancel={handleBackToConfig}
        />
      )}

      {screen === 'game' && gameState && (
        <GameScreen
          gameState={gameState}
          currentGuess={currentGuess}
          isMyTurn={isMyTurn}
          onKeyPress={handleKeyPress}
          onBackToConfig={handleBackToConfig}
          playerId={playerId}
        />
      )}
    </>
  );
}

export default App;
import React from 'react';
import GameBoard from '../components/game/GameBoard';
import Keyboard from '../components/game/Keyboard';
import RankingPanel from '../components/ranking/RankingPanel';
import RankingModal from '../components/ranking/RankingModal';

/**
 * Tela principal do jogo - versão multiplayer
 */
const GameScreen = ({ 
  gameState, 
  currentGuess, 
  isMyTurn, 
  onKeyPress, 
  onBackToConfig,
  playerId,
}) => {
  if (!gameState) {
    return (
      <div className="container">
        <p>Carregando jogo...</p>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.jogadorAtualIndex];
  const gameOver = gameState.status === 'finished';
  const myPlayer = gameState.players.find(p => p.id === playerId);

  return (
    <div className="container">
      <header>
        <h1>Jogo Termo - Multiplayer</h1>
        <div className="game-info">
          <div className="player-indicator">
            <span className={isMyTurn ? 'my-turn' : ''}>
              {isMyTurn ? '🎮 Sua vez!' : `Vez de: ${currentPlayer?.nome}`}
            </span>
          </div>
          {!isMyTurn && !gameOver && (
            <div className="waiting-opponent">
              <span className="spinner-small"></span>
              Aguardando {currentPlayer?.nome}...
            </div>
          )}
        </div>
      </header>

      <div className={`game-wrapper ${gameState.config.numRounds === 1 ? 'center-game' : ''}`}>
        {/* Área principal do jogo */}
        <div className="main-game-area">
          <GameBoard
            config={gameState.config}
            currentGuess={isMyTurn ? currentGuess : ''}
            results={gameState.results || []}
            currentAttempt={gameState.tentativaAtual}
          />
          
          <Keyboard 
            onKeyPress={onKeyPress} 
            keyStates={gameState.keyStates || {}}
            disabled={!isMyTurn || gameOver}
          />
        </div>

        {/* Painel lateral de ranking (apenas em múltiplas rodadas) */}
        {gameState.config.numRounds > 1 && (
          <RankingPanel
            players={gameState.players}
            roundNumber={gameState.currentRound}
            totalRounds={gameState.config.numRounds}
            lastWord={gameState.lastWord}
            lastWinner={gameState.lastWinner}
          />
        )}
      </div>

      {/* Modal de fim de jogo */}
      {gameOver && (
        <RankingModal
          players={gameState.players}
          onPlayAgain={onBackToConfig}
          config={gameState.config}
          secretWord={gameState.lastWord}
        />
      )}
    </div>
  );
};

export default GameScreen;
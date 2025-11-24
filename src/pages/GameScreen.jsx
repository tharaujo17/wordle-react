import React from 'react';
import GameBoard from '../components/game/GameBoard';
import Keyboard from '../components/game/Keyboard';
import RankingPanel from '../components/ranking/RankingPanel';
import RankingModal from '../components/ranking/RankingModal';
import { useGame } from '../hooks/useGame';
import { useKeyboard } from '../hooks/useKeyboard';

const GameScreen = ({ config, onBackToConfig }) => {
  const {
    players,
    currentRound,
    secretWord,
    currentAttempt,
    currentPlayerIndex,
    currentGuess,
    results,
    keyStates,
    gameOver,
    lastWord,
    lastWinner,
    handleKeyPress,
  } = useGame(config);

  useKeyboard(handleKeyPress, !gameOver);

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="container">
      <header>
        <h1>Jogo Termo</h1>
        <h3 id="turn-indicator">
          {gameOver ? 'Fim de Jogo!' : `Vez de: ${currentPlayer.nome}`}
        </h3>
      </header>

      <div className={`game-wrapper ${config.numRounds === 1 ? 'center-game' : ''}`}>
        {/* parte principal do jogo */}
        <div className="main-game-area">
          <GameBoard
            config={config}
            currentGuess={currentGuess}
            results={results}
            currentAttempt={currentAttempt}
          />
          
          <Keyboard 
            onKeyPress={handleKeyPress} 
            keyStates={keyStates} 
          />
        </div>

        {/* painel lateral de ranking */}
        {config.numRounds > 1 && (
          <RankingPanel
            players={players}
            roundNumber={currentRound}
            totalRounds={config.numRounds}
            lastWord={lastWord}
            lastWinner={lastWinner}
          />
        )}
      </div>

      {/* modal do fim de jogo */}
      {gameOver && (
        <RankingModal
          players={players}
          onPlayAgain={onBackToConfig}
          config={config}
          secretWord={secretWord}
        />
      )}
    </div>
  );
};

export default GameScreen;
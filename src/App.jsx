import React, { useState } from 'react';
import ConfigScreen from './pages/ConfigScreen';
import GameScreen from './pages/GameScreen';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [config, setConfig] = useState(null);

  const handleStartGame = (gameConfig) => {
    setConfig(gameConfig);
    setGameStarted(true);
  };

  const handleBackToConfig = () => {
    setGameStarted(false);
    setConfig(null);
  };

  return (
    <>
      {!gameStarted ? (
        <ConfigScreen onStartGame={handleStartGame} />
      ) : (
        <GameScreen config={config} onBackToConfig={handleBackToConfig} />
      )}
    </>
  );
}

export default App;
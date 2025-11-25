import React, { useState } from 'react';

/**
 * Tela de configuração inicial - versão multiplayer
 */
const ConfigScreen = ({ onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState('create'); // 'create' ou 'join'
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  
  // Configurações (apenas para criar sala)
  const [wordLength, setWordLength] = useState(5);
  const [numAttempts, setNumAttempts] = useState(6);
  const [numRounds, setNumRounds] = useState(1);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert('Por favor, insira seu nome.');
      return;
    }

    const config = {
      wordLength,
      numAttempts,
      numRounds,
    };

    onCreateRoom(config, playerName.trim());
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert('Por favor, insira seu nome.');
      return;
    }

    if (!roomCode.trim()) {
      alert('Por favor, insira o código da sala.');
      return;
    }

    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  return (
    <div className="container">
      <header>
        <h1>Jogo Termo - Multiplayer</h1>
        <p>Jogue com um amigo em tempo real!</p>
      </header>

      {/* Seletor de modo */}
      <div className="mode-selector">
        <button
          className={`mode-btn ${mode === 'create' ? 'active' : ''}`}
          onClick={() => setMode('create')}
        >
          Criar Sala
        </button>
        <button
          className={`mode-btn ${mode === 'join' ? 'active' : ''}`}
          onClick={() => setMode('join')}
        >
          Entrar em Sala
        </button>
      </div>

      <div className="config-form">
        {/* Nome do jogador */}
        <div className="form-group">
          <label htmlFor="player-name">Seu Nome:</label>
          <input
            type="text"
            id="player-name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Digite seu nome"
            maxLength={20}
          />
        </div>

        {mode === 'create' ? (
          <>
            {/* Configurações da sala */}
            <div className="form-group">
              <label htmlFor="word-length">Tamanho da Palavra:</label>
              <select
                id="word-length"
                value={wordLength}
                onChange={(e) => setWordLength(Number(e.target.value))}
              >
                <option value={5}>5 letras</option>
                <option value={6}>6 letras</option>
                <option value={7}>7 letras</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="num-attempts">Número de Tentativas:</label>
              <select
                id="num-attempts"
                value={numAttempts}
                onChange={(e) => setNumAttempts(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="num-rounds">Número de Rodadas:</label>
              <select
                id="num-rounds"
                value={numRounds}
                onChange={(e) => setNumRounds(Number(e.target.value))}
              >
                <option value={1}>1 Rodada</option>
                <option value={3}>Melhor de 3</option>
                <option value={5}>Melhor de 5</option>
              </select>
            </div>

            <button className="btn-start" onClick={handleCreateRoom}>
              Criar Sala
            </button>
          </>
        ) : (
          <>
            {/* Código da sala */}
            <div className="form-group">
              <label htmlFor="room-code">Código da Sala:</label>
              <input
                type="text"
                id="room-code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                maxLength={6}
                style={{ textTransform: 'uppercase' }}
              />
            </div>

            <button className="btn-start" onClick={handleJoinRoom}>
              Entrar na Sala
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigScreen;
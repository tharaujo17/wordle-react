import React from 'react';

const WaitingRoom = ({ roomId, players, onCancel }) => {
  return (
    <div className="container">
      <header>
        <h1>Aguardando Jogador</h1>
      </header>

      <div className="waiting-room">
        <div className="room-code-display">
          <p>Código da Sala:</p>
          <h2 className="room-code">{roomId}</h2>
          <p className="room-code-hint">Compartilhe este código com seu adversário</p>
        </div>

        <div className="players-list">
          <h3>Jogadores ({players.length}/2)</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id} className="player-item">
                <span className="player-icon">👤</span>
                <span className="player-name">{player.nome}</span>
                {player.connected && <span className="status-indicator">🟢</span>}
              </li>
            ))}
          </ul>
        </div>

        {players.length < 2 && (
          <div className="waiting-animation">
            <div className="spinner"></div>
            <p>Aguardando segundo jogador...</p>
          </div>
        )}

        <button className="btn-cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;
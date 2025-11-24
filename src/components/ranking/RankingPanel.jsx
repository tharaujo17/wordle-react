import React from 'react';
import { sortPlayersByScore } from '../../utils/helpers';

const RankingPanel = ({ players, roundNumber, totalRounds, lastWord, lastWinner }) => {
  const sortedPlayers = sortPlayersByScore(players);
  
  return (
    <aside id="ranking-panel">
      <h4>Placar da Partida</h4>
      
      {totalRounds > 1 && (
        <p id="round-progress">(Rodada {roundNumber} de {totalRounds})</p>
      )}
      
      <div id="last-word-info">
        {lastWord ? (
          <div>
            Palavra Anterior: <strong>{lastWord}</strong>
            <br />
            <small>
              {lastWinner ? `(${lastWinner} acertou)` : '(Não descoberta)'}
            </small>
          </div>
        ) : (
          roundNumber === 1 ? 'Aguardando 1ª rodada...' : ''
        )}
      </div>
      
      <table className="ranking-table">
        <thead>
          <tr>
            <th>Pos.</th>
            <th>Jogador</th>
            <th>Pontos</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player, index) => (
            <tr key={player.nome}>
              <td>{index + 1}º</td>
              <td>{player.nome}</td>
              <td>{player.pontos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
};

export default RankingPanel;
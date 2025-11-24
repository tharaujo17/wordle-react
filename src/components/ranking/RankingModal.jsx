import React from 'react';
import { sortPlayersByScore } from '../../utils/helpers';

const RankingModal = ({ players, onPlayAgain, config, secretWord }) => {
  const sortedPlayers = sortPlayersByScore(players);
  const winner = sortedPlayers[0];
  const second = sortedPlayers[1];
  
  // mensagem de vitória
  let message = '';
  let messageColor = '#538d4e';
  
  if (winner.pontos > second.pontos) {
    message = `O jogador ${winner.nome} venceu!!`;
  } else if (winner.pontos === 0) {
    message = 'A partida terminou em empate, sem vencedores.';
    messageColor = '#555';
  } else {
    message = 'A partida terminou em empate!';
    messageColor = '#555';
  }

  const showTable = config.numRounds > 1 || winner.acertou;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Fim de Jogo!</h2>
        
        <p className="winner-message" style={{ color: messageColor }}>
          {message}
        </p>
        
        {!showTable && config.numRounds === 1 && (
          <p>Ninguém acertou, a palavra era: <strong>{secretWord}</strong></p>
        )}
        
        {showTable && (
          <table className="modal-table">
            <thead>
              <tr>
                <th>Jogador</th>
                <th>Palavras Acertadas</th>
                <th>Quais Palavras</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map(player => (
                <tr key={player.nome}>
                  <td>{player.nome}</td>
                  <td>{player.pontos}</td>
                  <td>{player.palavrasAcertadas.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button className="btn-start" onClick={onPlayAgain}>
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default RankingModal;
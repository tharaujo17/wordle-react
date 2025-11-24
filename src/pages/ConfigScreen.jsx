import React, { useState } from 'react';
import { PALAVRAS } from '../data/palavras';
import { getWordsOfLength } from '../utils/helpers';

const ConfigScreen = ({ onStartGame }) => {
  const [player1, setPlayer1] = useState('Jogador 1');
  const [player2, setPlayer2] = useState('Jogador 2');
  const [wordLength, setWordLength] = useState(5);
  const [numAttempts, setNumAttempts] = useState(6);
  const [numRounds, setNumRounds] = useState(1);

  const handleSubmit = () => {
    // validar se tem palavras disponíveis para o tamanho escolhido
    const wordsOfLength = getWordsOfLength(PALAVRAS, wordLength);
    
    if (wordsOfLength.length === 0) {
      alert(`Não há palavras de ${wordLength} letras no banco de palavras.`);
      return;
    }

    // validar nomes dos jogadores
    if (!player1.trim() || !player2.trim()) {
      alert('Por favor, insira os nomes dos dois jogadores.');
      return;
    }

    // iniciar jogo
    onStartGame({ 
      player1: player1.trim(), 
      player2: player2.trim(), 
      wordLength, 
      numAttempts, 
      numRounds 
    });
  };

  return (
    <div className="container">
      <header>
        <h1>Jogo Termo</h1>
        <p>Bem-vindo! Configure a partida para começar.</p>
      </header>
      
      <div className="config-form">
        <div className="form-group">
          <label htmlFor="player1">Nome do Jogador 1:</label>
          <input
            type="text"
            id="player1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            placeholder="Digite o nome do jogador 1"
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label htmlFor="player2">Nome do Jogador 2:</label>
          <input
            type="text"
            id="player2"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            placeholder="Digite o nome do jogador 2"
            maxLength={20}
          />
        </div>

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

        <button className="btn-start" onClick={handleSubmit}>
          Iniciar Jogo
        </button>
      </div>
    </div>
  );
};

export default ConfigScreen;
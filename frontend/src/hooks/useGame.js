import { useState, useCallback, useEffect } from 'react';
import { 
  validateGuess, 
  calculateWinner, 
  updateKeyStates,
  removeWordAtIndex 
} from '../services/gameLogic';
import { PALAVRAS } from '../data/palavras';

export const useGame = (config) => {
  // estados dos jogadores
  const [players, setPlayers] = useState([
    { nome: config.player1, pontos: 0, palavrasAcertadas: [], acertou: false },
    { nome: config.player2, pontos: 0, palavrasAcertadas: [], acertou: false },
  ]);

  // estados da rodada atual
  const [currentRound, setCurrentRound] = useState(0);
  const [secretWord, setSecretWord] = useState('');
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  
  // estados do palpite
  const [currentGuess, setCurrentGuess] = useState('');
  const [results, setResults] = useState([]);
  const [keyStates, setKeyStates] = useState({});
  
  // estados de controle
  const [gameOver, setGameOver] = useState(false);
  const [availableWords, setAvailableWords] = useState([]);
  const [lastWord, setLastWord] = useState('');
  const [lastWinner, setLastWinner] = useState('');

  const startNewRound = useCallback(() => {
    if (currentRound >= config.numRounds) {
      setGameOver(true);
      return;
    }

    // pegar palavras do tamanho certo
    const wordsForLength = PALAVRAS.filter(p => p.length === config.wordLength);
    const availWords = currentRound === 0 ? wordsForLength : availableWords;
    
    if (availWords.length === 0) {
      alert('Não há mais palavras disponíveis!');
      setGameOver(true);
      return;
    }

    const index = Math.floor(Math.random() * availWords.length);
    const word = availWords[index].toUpperCase();
    const newAvailWords = removeWordAtIndex(availWords, index);

    setSecretWord(word);
    setAvailableWords(newAvailWords);
    setCurrentAttempt(0);
    setCurrentGuess('');
    setResults([]);
    setKeyStates({});
    setCurrentRound(prev => prev + 1);
    
    if (currentRound === 0) {
      setCurrentPlayerIndex(Math.floor(Math.random() * players.length));
    } else {
      setCurrentPlayerIndex(prev => (prev + 1) % players.length);
    }

    console.log('Palavra secreta:', word);
  }, [currentRound, config, availableWords, players.length]);

  const processGuess = useCallback((guess) => {
    const result = validateGuess(guess, secretWord);
    const newResults = [...results];
    newResults[currentAttempt] = result;
    setResults(newResults);

    const newKeyStates = updateKeyStates(keyStates, result);
    setKeyStates(newKeyStates);

    const won = guess.toUpperCase() === secretWord;
    const lost = currentAttempt >= config.numAttempts - 1;

    if (won) {
      const newPlayers = [...players];
      newPlayers[currentPlayerIndex].pontos++;
      newPlayers[currentPlayerIndex].palavrasAcertadas.push(secretWord);
      newPlayers[currentPlayerIndex].acertou = true;
      setPlayers(newPlayers);
    }

    if (won || lost) {
      setTimeout(() => {
        setLastWord(secretWord);
        setLastWinner(won ? players[currentPlayerIndex].nome : '');
        
        const gameWinner = calculateWinner(players, config.numRounds);

        if (gameWinner || currentRound >= config.numRounds) {
          setGameOver(true);
        } else {
          startNewRound();
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setCurrentAttempt(prev => prev + 1);
        setCurrentPlayerIndex(prev => (prev + 1) % players.length);
        setCurrentGuess('');
      }, 1500);
    }
  }, [
    secretWord, 
    results, 
    currentAttempt, 
    keyStates, 
    players, 
    currentPlayerIndex, 
    config, 
    currentRound, 
    startNewRound
  ]);

  const handleKeyPress = useCallback((key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === config.wordLength) {
        processGuess(currentGuess);
        setCurrentGuess('');
      }
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < config.wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, config.wordLength, gameOver, processGuess]);

  useEffect(() => {
    if (currentRound === 0) {
      startNewRound();
    }
  }, []);

  return {
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
    
    setCurrentGuess,
    startNewRound,
    processGuess,
    handleKeyPress,
  };
};
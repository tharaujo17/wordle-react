import { PALAVRAS } from '../utils/palavras.js';
import { TILE_STATES } from '../utils/constants.js';

export function validateGuess(guess, secretWord) {
  const resultado = [];
  const palavraArray = secretWord.split('');
  const palpiteArray = guess.toUpperCase().split('');

  for (let i = 0; i < palpiteArray.length; i++) {
    if (palpiteArray[i] === palavraArray[i]) {
      resultado[i] = { letra: palpiteArray[i], estado: TILE_STATES.CORRECT };
      palavraArray[i] = null;
    }
  }

  for (let i = 0; i < palpiteArray.length; i++) {
    if (resultado[i] === undefined) {
      if (palavraArray.includes(palpiteArray[i])) {
        resultado[i] = { letra: palpiteArray[i], estado: TILE_STATES.MISPLACED };
        palavraArray[palavraArray.indexOf(palpiteArray[i])] = null;
      } else {
        resultado[i] = { letra: palpiteArray[i], estado: TILE_STATES.WRONG };
      }
    }
  }

  return resultado;
}

export function sortearPalavra(palavrasDisponiveis, tamanho) {
  const palavrasFiltradas = palavrasDisponiveis.length > 0 
    ? palavrasDisponiveis 
    : PALAVRAS.filter(p => p.length === tamanho);

  if (palavrasFiltradas.length === 0) {
    throw new Error('Não há palavras disponíveis');
  }

  const index = Math.floor(Math.random() * palavrasFiltradas.length);
  const palavra = palavrasFiltradas[index];
  
  const novasPalavras = palavrasFiltradas.filter((_, i) => i !== index);
  
  return {
    palavra: palavra.toUpperCase(),
    palavrasRestantes: novasPalavras,
  };
}

export function calcularVencedor(players, numRounds) {
  const sorted = [...players].sort((a, b) => b.pontos - a.pontos);
  const pontosParaVencer = Math.ceil(numRounds / 2);
  return sorted[0].pontos >= pontosParaVencer ? sorted[0] : null;
}

export function updateKeyStates(currentStates, result) {
  const newStates = { ...currentStates };
  
  result.forEach(item => {
    const { letra, estado } = item;
    
    if (!newStates[letra] || estado === TILE_STATES.CORRECT) {
      newStates[letra] = estado;
    } else if (estado === TILE_STATES.MISPLACED && newStates[letra] !== TILE_STATES.CORRECT) {
      newStates[letra] = estado;
    }
  });
  
  return newStates;
}
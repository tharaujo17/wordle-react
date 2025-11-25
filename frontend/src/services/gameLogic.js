export const validateGuess = (guess, secretWord) => {
  const resultado = [];
  const palavraArray = secretWord.split('');
  const palpiteArray = guess.toUpperCase().split('');

  for (let i = 0; i < palpiteArray.length; i++) {
    if (palpiteArray[i] === palavraArray[i]) {
      resultado[i] = { letra: palpiteArray[i], estado: 'correct' };
      palavraArray[i] = null; // marca como usada
    }
  }

  for (let i = 0; i < palpiteArray.length; i++) {
    if (resultado[i] === undefined) {
      if (palavraArray.includes(palpiteArray[i])) {
        resultado[i] = { letra: palpiteArray[i], estado: 'misplaced' };
        palavraArray[palavraArray.indexOf(palpiteArray[i])] = null;
      } else {
        resultado[i] = { letra: palpiteArray[i], estado: 'wrong' };
      }
    }
  }

  return resultado;
};

export const getRandomWord = (words, length) => {
  const filtered = words.filter(w => w.length === length);
  if (filtered.length === 0) return null;
  const index = Math.floor(Math.random() * filtered.length);
  return filtered[index].toUpperCase();
};

export const calculateWinner = (players, numRounds) => {
  const sorted = [...players].sort((a, b) => b.pontos - a.pontos);
  const pointsToWin = Math.ceil(numRounds / 2);
  return sorted[0].pontos >= pointsToWin ? sorted[0] : null;
};

export const updateKeyStates = (currentStates, result) => {
  const newStates = { ...currentStates };
  
  result.forEach(item => {
    const { letra, estado } = item;
    
    if (!newStates[letra] || estado === 'correct') {
      newStates[letra] = estado;
    } else if (estado === 'misplaced' && newStates[letra] !== 'correct') {
      newStates[letra] = estado;
    }
  });
  
  return newStates;
};

export const removeWordAtIndex = (words, index) => {
  const newWords = [...words];
  newWords.splice(index, 1);
  return newWords;
};
export const getWordsOfLength = (words, length) => {
  return words.filter(word => word.length === length);
};

export const getRandomIndex = (max) => {
  return Math.floor(Math.random() * max);
};

export const sortPlayersByScore = (players) => {
  return [...players].sort((a, b) => b.pontos - a.pontos);
};
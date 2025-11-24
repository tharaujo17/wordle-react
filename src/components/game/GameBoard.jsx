import React from 'react';
import Tile from './Tile';

const GameBoard = ({ config, currentGuess, results, currentAttempt }) => {
  return (
    <table className="game-board">
      <tbody>
        {Array.from({ length: config.numAttempts }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: config.wordLength }).map((_, colIndex) => {
              const result = results[rowIndex]?.[colIndex];
              const isCurrent = rowIndex === currentAttempt;
              const letter = isCurrent ? currentGuess[colIndex] || '' : '';
              const shouldFlip = result !== undefined;
              
              return (
                <Tile
                  key={colIndex}
                  letter={shouldFlip ? result.letra : letter}
                  state={result?.estado}
                  isCurrent={isCurrent}
                  shouldFlip={shouldFlip}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GameBoard;
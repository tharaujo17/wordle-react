import React from 'react';

const Tile = ({ letter, state, isCurrent, shouldFlip }) => {
  return (
    <td className="tile-container">
      <div className={`tile ${shouldFlip ? 'flip' : ''}`}>
        <div className={`tile-front ${letter && !shouldFlip ? 'filled' : ''}`}>
          {!shouldFlip && letter}
        </div>
        <div className={`tile-back ${state || ''}`}>
          {state && letter}
        </div>
      </div>
    </td>
  );
};

export default Tile;

import React from 'react';
import { KEYBOARD_LAYOUT } from '../../utils/constants';

const Keyboard = ({ onKeyPress, keyStates }) => {
  return (
    <div>
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`${key === 'ENTER' || key === 'BACKSPACE' ? 'key-large' : ''} ${keyStates[key] || ''}`}
              onClick={() => onKeyPress(key)}
            >
              {key === 'BACKSPACE' ? '⌫' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;

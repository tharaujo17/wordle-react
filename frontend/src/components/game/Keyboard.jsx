import React from 'react';
import { KEYBOARD_LAYOUT } from '../../utils/constants';

/**
 * Componente do teclado virtual
 */
const Keyboard = ({ onKeyPress, keyStates, disabled = false }) => {
  const handleClick = (key) => {
    if (disabled) return;
    onKeyPress(key);
  };

  return (
    <div className={`keyboard-container ${disabled ? 'disabled' : ''}`}>
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map(key => (
            <button
              key={key}
              className={`${key === 'ENTER' || key === 'BACKSPACE' ? 'key-large' : ''} ${keyStates[key] || ''}`}
              onClick={() => handleClick(key)}
              disabled={disabled}
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
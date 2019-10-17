import React from 'react';

const Controls = ({ newGame }) => {
  return (
    <div className="Controls">
      <div 
        className="button"
        onClick={() => newGame('easy')}
      >
        Easy
      </div>
      <div 
        className="button"
        onClick={() => newGame('medium')}
      >
        Medium
      </div>
      <div 
        className="button"
        onClick={() => newGame('hard')}
      >
        Hard
      </div>
    </div>
  );
};

export default Controls;
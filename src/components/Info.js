import React from 'react';

const Info = ({ minesLeft, gameWon, newGame }) => {
  return (
    <div className="Info">
      <div className="text">Mines: {minesLeft}</div>
      {gameWon && <div className="text">You win!</div>}
      <div 
        className="button"
        onClick={() => newGame()}
      >
        New game
      </div>
    </div>
  );
};

export default Info;
import React, { useState } from 'react';
import './App.css';
import Board from './components/Board';
import Controls from './components/Controls';
import Info from './components/Info';

const modes = {
  easy: {
    rows: 9,
    cols: 9,
    mines: 10,
  },
  medium: {
    rows: 16,
    cols: 16,
    mines: 40,
  },
  hard: {
    rows: 16,
    cols: 30,
    mines: 99,
  },
};

const App = () => {
  const [mode, setMode] = useState('easy');
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(modes.easy.mines);

  function newGame(mode) {
    setMode(mode);
    setGameOver(false);
    setGameWon(false);
  }

  return (
    <div className="App-content">
      <p>Minesweeper</p>
      <Info 
        minesLeft={minesLeft}
        gameWon={gameWon}
        newGame={() => newGame(mode)}
      />
      <Board
        {...modes[mode]}
        gameOver={gameOver}
        setGameOver={setGameOver}
        setGameWon={setGameWon}
        setMinesLeft={setMinesLeft}
      />
      <Controls newGame={newGame}/>
    </div>
  );
};

export default App;

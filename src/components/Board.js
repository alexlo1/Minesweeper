import React, { useState, useEffect } from 'react';
import Tile from './Tile';

const Board = ({ rows, cols, mines, gameOver, setGameOver, setGameWon, setMinesLeft }) => {
  const [boardValues, setBoardValues] = useState([[]]);
  const [boardState, setBoardState] = useState([[]]);

  function isValid(r, c) {
    return r >= 0 && r < rows && c >= 0 && c < cols; 
  }

  function neighbors(r, c) {
    let neighborList = [];
    [-1, 0, 1].forEach(i => {
      [-1, 0, 1].forEach(j => {
        if ((i !== 0 || j !== 0) && isValid(r+i, c+j)) {
          neighborList.push([r+i, c+j]);
        }
      });
    });
    return neighborList;
  }

  function generateBoard(rows, cols, mines) {
    let newBoard = Array(rows);
    for (let r = 0; r < rows; r++) {
      newBoard[r] = Array(cols).fill(0);
    }

    for (let i = 0; i < mines; i++) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);

      if (newBoard[randomRow][randomCol] !== 'M') {
        newBoard[randomRow][randomCol] = 'M';
        neighbors(randomRow, randomCol).forEach(([r, c]) => {
          if (newBoard[r][c] !== 'M') {
            newBoard[r][c]++;
          }
        });
      } else {
        i--;
      }
    }

    setMinesLeft(mines);

    console.log(newBoard);
    return newBoard;   
  }

  function revealMines(newBoardState) {
    boardValues.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value === 'M' && newBoardState[r][c] !== 'F') {
          newBoardState[r][c] = 'R';
        }
      });
    });
    return newBoardState;
  }

  function checkWin(newBoardState) {
    let b = true;
    boardValues.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value === 'M' && newBoardState[r][c] === 'R') {
          b = false;
        } else if (value !== 'M' && newBoardState[r][c] !== 'R') {
          b = false;
        }
      });
    });
    return b;
  }

  function flood(newBoardState, r, c) {
    if (newBoardState[r][c]) {
      return newBoardState;
    }
    newBoardState[r][c] = 'R';
    if (boardValues[r][c] === 0) {
      [-1, 0, 1].forEach(i => {
        [-1, 0, 1].forEach(j => {
          if ((i !== 0 || j !== 0) && isValid(r+i, c+j)) {
            newBoardState = flood(newBoardState, r+i, c+j);
          }
        });
      });
    }
    return newBoardState;
  }

  function reveal(r, c) {
    if (gameOver || boardState[r][c]) {
      return;
    }
    let newBoardState = flood([...boardState], r, c);
    if (boardValues[r][c] === 'M') {
      newBoardState = revealMines(newBoardState);
      setGameOver(true);
    }
    if (checkWin(newBoardState)) {
      setGameWon(true);
      setGameOver(true);
    }
    setBoardState(newBoardState);
  }

  function flag(r, c) {
    if (gameOver || boardState[r][c] === 'R') {
      return;
    }
    let newBoardState = [...boardState];
    if (boardState[r][c] === 'F') {
      newBoardState[r][c] = '';
      setMinesLeft((mines) => mines + 1);
    } else {
      newBoardState[r][c] = 'F';
      setMinesLeft((mines) => mines - 1);
    }
    setBoardState(newBoardState);
  }

  useEffect(() => {
    if (!gameOver) {
      let newBoardState = Array(rows);
      for (let r = 0; r < rows; r++) {
        newBoardState[r] = Array(cols).fill('');
      }
      setBoardState(newBoardState);
      setBoardValues(generateBoard(rows, cols, mines));
    }
  }, [rows, cols, mines, gameOver]);

  return (
    <table className="Board">
      <tbody>
        {boardValues.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, colIndex) => (
              <td key={colIndex}>
                <Tile 
                  value={value}
                  state={boardState[rowIndex][colIndex]}
                  reveal={() => reveal(rowIndex, colIndex)}
                  flag={() => flag(rowIndex, colIndex)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;

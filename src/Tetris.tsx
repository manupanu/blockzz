import React, { useEffect, useRef, useState } from "react";
import "./Tetris.css";

// Tetris constants
const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const COLORS = [
  "#000",
  "#f00",
  "#0f0",
  "#00f",
  "#ff0",
  "#0ff",
  "#f0f",
  "#fa0",
];

const SHAPES = [
  [],
  [
    [1, 1, 1, 1], // I
  ],
  [
    [2, 2],
    [2, 2], // O
  ],
  [
    [0, 3, 0],
    [3, 3, 3], // T
  ],
  [
    [0, 4, 4],
    [4, 4, 0], // S
  ],
  [
    [5, 5, 0],
    [0, 5, 5], // Z
  ],
  [
    [6, 0, 0],
    [6, 6, 6], // J
  ],
  [
    [0, 0, 7],
    [7, 7, 7], // L
  ],
];

function randomPiece() {
  const type = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
  return {
    type,
    shape: SHAPES[type],
    row: 0,
    col: Math.floor((COLS - SHAPES[type][0].length) / 2),
  };
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function checkCollision(board, shape, row, col) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (
        shape[r][c] &&
        (board[row + r] && board[row + r][col + c]) !== 0
      ) {
        return true;
      }
    }
  }
  return false;
}

function merge(board, shape, row, col, type) {
  const newBoard = board.map(arr => arr.slice());
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        newBoard[row + r][col + c] = type;
      }
    }
  }
  return newBoard;
}

function clearLines(board) {
  let cleared = 0;
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  cleared = ROWS - newBoard.length;
  while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(0));
  return { board: newBoard, cleared };
}

const Tetris = () => {
  const [board, setBoard] = useState(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [piece, setPiece] = useState(randomPiece());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef<number | null>(null);
  const dropTime = useRef(Date.now());

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;
      let newPiece = { ...piece, shape: piece.shape.map(row => row.slice()) };
      if (e.key === "ArrowLeft") {
        if (!checkCollision(board, newPiece.shape, newPiece.row, newPiece.col - 1)) {
          newPiece.col--;
        }
      } else if (e.key === "ArrowRight") {
        if (!checkCollision(board, newPiece.shape, newPiece.row, newPiece.col + 1)) {
          newPiece.col++;
        }
      } else if (e.key === "ArrowDown") {
        if (!checkCollision(board, newPiece.shape, newPiece.row + 1, newPiece.col)) {
          newPiece.row++;
        }
      } else if (e.key === "ArrowUp") {
        const rotated = rotate(newPiece.shape);
        // Wall kick: try shifting left/right if rotation collides
        let kicked = false;
        for (let offset of [0, -1, 1, -2, 2]) {
          if (!checkCollision(board, rotated, newPiece.row, newPiece.col + offset)) {
            newPiece.shape = rotated;
            newPiece.col += offset;
            kicked = true;
            break;
          }
        }
        if (!kicked) return; // Don't rotate if all positions collide
      }
      setPiece(newPiece);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [piece, board, gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const animate = () => {
      if (Date.now() - dropTime.current > 500) {
        let newRow = piece.row + 1;
        if (!checkCollision(board, piece.shape, newRow, piece.col)) {
          setPiece({ ...piece, row: newRow });
        } else {
          const merged = merge(board, piece.shape, piece.row, piece.col, piece.type);
          const { board: clearedBoard, cleared } = clearLines(merged);
          setBoard(clearedBoard);
          setScore(s => s + cleared * 100);
          const next = randomPiece();
          if (checkCollision(clearedBoard, next.shape, next.row, next.col)) {
            setGameOver(true);
          } else {
            setPiece(next);
          }
        }
        dropTime.current = Date.now();
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [piece, board, gameOver]);

  function renderBoard() {
    const display = board.map(row => row.slice());
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c] && piece.row + r >= 0) {
          display[piece.row + r][piece.col + c] = piece.type;
        }
      }
    }
    return display;
  }

  return (
    <div className="tetris-container">
      <h2>Tetris</h2>
      <div className="tetris-board" style={{ width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE }}>
        {renderBoard().map((row, r) =>
          row.map((cell, c) => (
            <div
              key={r + "-" + c}
              className="tetris-cell"
              style={{
                left: c * BLOCK_SIZE,
                top: r * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                background: COLORS[cell],
                border: cell ? "1px solid #222" : "1px solid #eee",
                position: "absolute",
              }}
            />
          ))
        )}
      </div>
      <div className="tetris-helper">
        <strong>Controls:</strong>
        <ul>
          <li>←: Move Left</li>
          <li>→: Move Right</li>
          <li>↓: Move Down</li>
          <li>↑: Rotate</li>
        </ul>
      </div>
      <div>Score: {score}</div>
      {gameOver && <div className="tetris-gameover">Game Over</div>}
      <button onClick={() => {
        setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
        setPiece(randomPiece());
        setScore(0);
        setGameOver(false);
      }}>Restart</button>
    </div>
  );
};

export default Tetris;

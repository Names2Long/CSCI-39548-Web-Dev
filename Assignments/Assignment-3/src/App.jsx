/*
  Ishraq Chowdhury
  File: App.jsx
  Assignment 3
  October 9, 2026
  Defines the Square, Board, and Game components and all of the tic tac toe game logic
*/

// useState lets a component remember values (like the move history) between renders
import { useState } from 'react';

// The board is 3 squares wide and 3 squares tall
const boardSize = 3;

/*
  Makes the list [0, 1, 2] so the board can loop over its rows and columns
  Array(3) makes an empty array with 3 slots, keys() gives back 0, 1, 2,
  and the spread operator (...) copies those numbers into a new array
*/
const boardIndices = [...Array(boardSize).keys()];

/*
  Square is a single button on the board
  value is what the square shows ('X', 'O', or nothing)
  onSquareClick is the function to run when the square is clicked
  isWinning is true when this square is part of the winning line
*/
function Square({ value, onSquareClick, isWinning }) {

  // Winning squares get an extra CSS class so they are highlighted green
  const squareClassName = isWinning ? 'square square-winning' : 'square';

  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

/*
  Board draws the 3 x 3 grid and the status message above it
  It does not store any state of its own, everything comes from Game through props
  xIsNext tells it whose turn it is, squares holds what is in each square,
  and onPlay is the function it calls to tell Game a move was made
*/
function Board({ xIsNext, squares, onPlay }) {

  // Check if someone has won, result is null when there is no winner yet
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];

  // It is a draw when nobody has won and every square has been filled in
  const isDraw = !winner && squares.every((square) => square !== null);

  // Runs when the square at position i is clicked
  function handleClick(i) {

    // Ignore the click if the game is over or the square is already taken
    if (winner || squares[i]) {
      return;
    }

    // Make a copy of the squares with slice() instead of changing the original array
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    // Send the new board and the clicked position up to Game
    onPlay(nextSquares, i);
  }

  /*
    Pick the message to show above the board
    The class name changes too so the winner text is green and the draw text is yellow
  */
  let status;
  let statusClassName = 'status';
  if (winner) {
    status = 'Winner: ' + winner;
    statusClassName = 'status status-winner';

  } else if (isDraw) {
    status = "It's a draw!";
    statusClassName = 'status status-draw';

  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  /*
    Build the board with two loops instead of typing out all nine squares
    The outer loop makes one row for each row number (0, 1, 2)
    The inner loop makes one square for each column number in that row
    row * boardSize + col turns a row and column into a position from 0 to 8
  */
  const boardRows = boardIndices.map((row) => (
    <div key={row} className="board-row">
      {boardIndices.map((col) => {
        const index = row * boardSize + col;

        return (
          <Square
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinning={winningLine.includes(index)}
          />
        );
      })}
    </div>
  ));

  return (
    <>
      <div className={statusClassName}>{status}</div>
      {boardRows}
    </>
  );
}

/*
  Game is the main component that holds all of the game's state
  It keeps the full history of moves so players can jump back to any earlier move
*/
export default function Game() {

  /*
    Each entry in history is one snapshot of the game
    squares is what the board looked like after that move
    position is which square was clicked (null for the empty starting board)
  */
  const [history, setHistory] = useState([
    { squares: Array(boardSize * boardSize).fill(null), position: null },
  ]);

  // Which move in the history is currently being shown on the board
  const [currentMove, setCurrentMove] = useState(0);

  // true shows the move list from first to last, false shows it from last to first
  const [isAscending, setIsAscending] = useState(true);

  // X always goes on even moves (0, 2, 4...) so this does not need its own state
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  // Runs when Board reports a new move
  function handlePlay(nextSquares, position) {

    /*
      Keep the history up to the move being shown and add the new move on the end
      slice() and the spread operator (...) build a brand new array so the old one is never changed
      If the player jumped back in time, any moves after that point get dropped
    */
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, position },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // Shows the board as it was after the chosen move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Flips the move list between ascending and descending order
  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  // Turn every entry in history into one item in the move list
  const moves = history.map((step, move) => {

    // Describe the move, including where it was played as (row, col)
    let description;
    if (move > 0) {
      description = 'move #' + move + ' ' + formatLocation(step.position);
    } else {
      description = 'game start';
    }

    // The move currently on the board is shown as plain text instead of a button
    if (move === currentMove) {
      return (
        <li key={move}>
          <span className="current-move">You are at {description}</span>
        </li>
      );
    }

    // Every other move is a button that jumps back to that point in the game
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>Go to {description}</button>
      </li>
    );
  });

  /*
    For descending order, reverse a copy of the list made with slice()
    reverse() on its own would change the original moves array
  */
  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <>
      <h1 className="title">Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <button className="sort-toggle" onClick={toggleSortOrder}>
            Sort {isAscending ? 'descending' : 'ascending'}
          </button>
          {/* reversed makes the list numbers count down when sorted descending */}
          <ol reversed={!isAscending}>{sortedMoves}</ol>
        </div>
      </div>
    </>
  );
}

/*
  Turns a square position (0 to 8) into a "(row, col)" label
  Dividing by 3 and rounding down gives the row, the remainder gives the column
  1 is added to both so the top left square is (1, 1) instead of (0, 0)
*/
function formatLocation(index) {
  const row = Math.floor(index / boardSize) + 1;
  const col = (index % boardSize) + 1;
  return '(' + row + ', ' + col + ')';
}

/*
  Checks the board for a winner
  Returns the winning letter and the three winning positions,
  or null if nobody has three in a row yet
*/
function calculateWinner(squares) {
  
  // Every possible way to get three in a row: 3 rows, 3 columns, and 2 diagonals
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Look at each line and see if all three squares hold the same letter
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }

  return null;
}

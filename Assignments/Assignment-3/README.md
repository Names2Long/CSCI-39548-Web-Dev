# Assignment 3, Tic-Tac-Toe Augmentations

## Instructions

Follow this tutorial: https://react.dev/learn/tutorial-tic-tac-toe

Additionally, watch the recording from Tuesday, going through the actual tutorial ourselves. Your task is to make some specific augmentations to the final product of the tutorial, including new features, quality of life changes to the design, and general programming improvements. Exact improvements and requirements are seen below.

## Rubric

- For the current move only, show “You are at move #…” instead of a button.
- Rewrite Board to use two loops to make the squares instead of hardcoding them.
- Add a toggle button that lets you sort the moves in either ascending or descending order.
- When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
- Display the location for each move in the format (row, col) in the move history list.
- Make sure to use copies of any arrays and objects via .slice() and the spread operator, rather than mutating any data structures.
- Code should be neat and well indented, such that it's easy for me to access and read.

## What Was Added

This project is the React tic-tac-toe tutorial, built with Vite, with these additions:

1. The current move is shown as "You are at move #…" text instead of a button.
2. `Board` builds its squares with two loops (rows, then columns) instead of hardcoding nine `<Square />` components.
3. A toggle button sorts the move history in ascending or descending order.
4. The three winning squares are highlighted in green and the "Winner" message is shown in green. When the board fills up with no winner, "It's a draw!" is shown in yellow.
5. Each move in the history shows its location as `(row, col)`, counting from 1, so the top left square is (1, 1).
6. A "Tic Tac Toe" title is centered at the top of the page.

All state updates use copies (`.slice()` and the spread operator) rather than mutating arrays or objects. JavaScript names use camelCase and CSS class names use kebab case.

## Project Files

- `src/App.jsx` holds the Square, Board, and Game components and all of the game logic
- `src/index.css` holds all of the styles
- `src/main.jsx` loads the styles and renders the app
- `index.html` is the page the app is loaded into

## Running the Project

```
npm install
npm run dev
```
# Chess Board with FEN Input

This project is a simple chess board visualizer built using p5.js. It allows users to input a chess position using FEN (Forsyth-Edwards Notation) and displays the corresponding board layout. The project has been refactored to use a separate `ChessBoard` class for improved modularity and maintainability.

## Features

- Displays a chess board with alternating light and dark squares
- Loads and displays chess piece images
- Accepts FEN input to set up custom board positions
- Implements basic chess piece movement rules
- Allows for piece selection and movement via mouse clicks

## Project Structure

The project now consists of two main JavaScript files:

1. `sketch.js`: Contains the p5.js setup and draw functions, as well as the main game loop.
2. `chessboard.js`: Contains the `ChessBoard` class, which encapsulates all the chess board logic.

## Running the Project on p5js.org

To run this project on p5js.org, follow these steps:

1. Go to [p5js.org](https://editor.p5js.org/)
2. Create a new sketch
3. Replace the contents of the `sketch.js` file in the p5.js Web Editor with the contents of the `sketch.js` file from this project
4. Create a new file called `chessboard.js` and copy the contents of the `chessboard.js` file from this project into it
5. In the p5.js Web Editor, upload the files for each of the chess piece images (e.g., `white_pawn.png`, `dark_knight.png`, etc.) from this project
6. Click the "Run" button in the p5.js Web Editor to start the sketch

## Running the project in VSCode

Follow this [instruction](https://p5js.org/tutorials/setting-up-your-environment/) on how to setup VSCode to run this code.
Basically:

- Install the p5.vscode extension.
- Click the _Go Live_ button in the bottom status bar to open your sketch in a browser.

## Usage

Once the sketch is running:

1. You'll see a chess board with the initial starting position
2. There's an input field at the top of the canvas where you can enter a FEN string
3. After entering a valid FEN string, click the "Update Board" button to display the new position
4. Click on a piece to select it, then click on a valid square to move the piece
5. The game alternates between white and black moves

## Screenshot

<img src="screenshot.png" alt="Chess Board" width="600" />

## Future Improvements

- Implement more advanced chess rules (e.g., castling, en passant)
- Add a move history feature
- Implement a simple AI for playing against the computer


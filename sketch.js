let startX = 50;
let startY = 50;
let square_size = 60;

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
let reverse_numbers = numbers.slice().reverse();

let fenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"; // Default starting position

// Paste this FEN string into the input filed and press: "Update Board"
let exampleFenPosition = "rnbqkb1r/ppp1pppp/5n2/3p5/2PP5/8/PP2PPPP/RNBQKBNR"

let pieceImages = {};
let board = [];
let selectedPiece = null;
let selectedX = -1;
let selectedY = -1;

// Create a dictionary where a FEN "character" points to the corresponding piece image.
function preload() {
  pieceImages = {
    'R': loadImage("white_rook.png"),
    'N': loadImage("white_knight.png"),
    'B': loadImage("white_bishop.png"),
    'Q': loadImage("white_queen.png"),
    'K': loadImage("white_king.png"),
    'P': loadImage("white_pawn.png"),
    'r': loadImage("dark_rook.png"),
    'n': loadImage("dark_knight.png"),
    'b': loadImage("dark_bishop.png"),
    'q': loadImage("dark_queen.png"),
    'k': loadImage("dark_king.png"),
    'p': loadImage("dark_pawn.png")
  };
}

function setup() {
  createCanvas(600, 600);
  createFenInput();
  board = parseFEN(fenPosition);
}

// Create an input field where a new FEN string can be inserted
function createFenInput() {
  let input = createInput(fenPosition);
  input.position(40, 10);
  input.size(400);
  let button = createButton('Update Board');
  button.position(450, 10);
  button.mousePressed(() => {
    fenPosition = input.value();
    board = parseFEN(fenPosition);
    selectedPiece = null;
    selectedX = -1;
    selectedY = -1;
    redraw();
  });
}

// Alternate the colors of the squares
function flip_colors(x, y) {
  if (((x + y) % 2) == 0) {
    fill(245, 245, 220);
  } else {
    fill(196, 164, 132);
  }
}

// Draw the given piece
function draw_piece(piece, x, y, square_size) {
  if (piece in pieceImages) {
    let atX = startX + x * square_size;
    let atY = startY + y * square_size;
    image(pieceImages[piece], atX, atY, square_size, square_size);
  }
}

// Parse the given FEN string and produce a board array where
// each entry either is empty or populated with a FEN "character".
function parseFEN(fen) {
  let board = [];
  let rows = fen.split('/');
  for (let row of rows) {
    let boardRow = [];
    for (let char of row) {
      if (isNaN(char)) {
        boardRow.push(char);
      } else {
        for (let i = 0; i < parseInt(char); i++) {
          boardRow.push('');
        }
      }
    }
    board.push(boardRow);
  }
  return board;
}

// Convert the board array back to a FEN string
function boardToFEN(board) {
  let fen = "";
  for (let row of board) {
    let emptyCount = 0;
    for (let cell of row) {
      if (cell === '') {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          fen += emptyCount;
          emptyCount = 0;
        }
        fen += cell;
      }
    }
    if (emptyCount > 0) {
      fen += emptyCount;
    }
    fen += "/";
  }
  return fen.slice(0, -1); // Remove the trailing slash
}

// Traverse the board and for each non-empty entry draw
// the piece according to the FEN "character" in the entry.
function draw_pieces(square_size) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let piece = board[y][x];
      if (piece !== '') {
        draw_piece(piece, x, y, square_size);
      }
    }
  }
}

// Draw the chess board
function draw_board(square_size, text_size) {
  for (y = 0; y < 8; y++) {
    for (x = 0; x < 8; x++) {
      flip_colors(x, y)
      atX = startX + x * square_size
      atY = startY + y * square_size
      noStroke()
      square(atX, atY, square_size);
      
      // Highlight selected piece
      if (x === selectedX && y === selectedY) {
        fill(255, 255, 0, 100);
        square(atX, atY, square_size);
      }
    }
  }

  // Draw the letters at the bottom (first row)
  let ty = 8;
  atY = startY + ty * square_size;
  textSize(text_size);
  for (x = 0; x < 8; x++) {
    atX = startX + x * square_size
    flip_colors(x, ty)
    text(letters[x], atX + 3, atY - 3);
  }

  // Draw the numbers at the rightmost column
  let tx = 8;
  atX = startX + ty * square_size;
  textSize(text_size);
  for (y = 0; y < 8; y++) {
    atY = startY + y * square_size
    flip_colors(tx, y)
    text(reverse_numbers[y], atX - 10, atY + 12);
  }

  // Draw all the pieces
  draw_pieces(square_size);
}

function isPathClear(fromX, fromY, toX, toY) {
  let dx = Math.sign(toX - fromX);
  let dy = Math.sign(toY - fromY);
  let x = fromX + dx;
  let y = fromY + dy;

  while (x !== toX || y !== toY) {
    if (board[y][x] !== '') {
      return false;
    }
    x += dx;
    y += dy;
  }

  return true;
}

function isValidMove(fromX, fromY, toX, toY) {
  let piece = board[fromY][fromX];
  let dx = toX - fromX;
  let dy = toY - fromY;

  // Check if the destination square is occupied by a piece of the same color
  if (board[toY][toX] !== '' && board[toY][toX].toLowerCase() === piece.toLowerCase()) {
    return false;
  }

  switch (piece.toLowerCase()) {
    case 'p': // Pawn
      let direction = piece === 'P' ? -1 : 1;
      if (dx === 0 && dy === direction && board[toY][toX] === '') {
        return true;
      }
      if (dx === 0 && dy === 2 * direction && board[toY][toX] === '' && board[fromY + direction][fromX] === '' &&
          ((piece === 'P' && fromY === 6) || (piece === 'p' && fromY === 1))) {
        return true;
      }
      if (Math.abs(dx) === 1 && dy === direction && board[toY][toX] !== '') {
        return true;
      }
      return false;

    case 'r': // Rook
      if (dx === 0 || dy === 0) {
        return isPathClear(fromX, fromY, toX, toY);
      }
      return false;

    case 'n': // Knight
      return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);

    case 'b': // Bishop
      if (Math.abs(dx) === Math.abs(dy)) {
        return isPathClear(fromX, fromY, toX, toY);
      }
      return false;

    case 'q': // Queen
      if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
        return isPathClear(fromX, fromY, toX, toY);
      }
      return false;

    case 'k': // King
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

    default:
      return false;
  }
}

function mousePressed() {
  let x = floor((mouseX - startX) / square_size);
  let y = floor((mouseY - startY) / square_size);

  if (x >= 0 && x < 8 && y >= 0 && y < 8) {
    if (selectedPiece === null) {
      // Select a piece
      if (board[y][x] !== '') {
        selectedPiece = board[y][x];
        selectedX = x;
        selectedY = y;
      }
    } else {
      // Check if the move is valid
      if (isValidMove(selectedX, selectedY, x, y)) {
        // Move the selected piece
        board[selectedY][selectedX] = '';
        board[y][x] = selectedPiece;

        // Update FEN string
        fenPosition = boardToFEN(board);
        let input = select('input');
        input.value(fenPosition);
      }
      
      // Reset selection
      selectedPiece = null;
      selectedX = -1;
      selectedY = -1;
    }
    redraw();
  }
}

function draw() {
  background(255);
  draw_board(square_size, 12);
  noLoop()
}

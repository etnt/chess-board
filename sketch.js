let startX = 50;
let startY = 50;

let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
let numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
let reverse_numbers = numbers.slice().reverse();

let fenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"; // Default starting position

// Paste this FEN string into the input filed and press: "Update Board"
let exampleFenPosition = "rnbqkb1r/ppp1pppp/5n2/3p5/2PP5/8/PP2PPPP/RNBQKBNR"

let pieceImages = {};

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

// Traverse the board and for each non-empty entry draw
// the piece according to the FEN "character" in the entry.
function draw_pieces(square_size) {
  let board = parseFEN(fenPosition);
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

function draw() {
  background(255);
  draw_board(60, 12)
  noLoop()
}

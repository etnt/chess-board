//
// This code is dependent on the ChessBoard class, which is found in: chessboard.js
//
let chessBoard;

function preload() {
  chessBoard = new ChessBoard(50, 50, 60);
  chessBoard.preload();
}

function setup() {
  createCanvas(600, 600);
  createFenInput();
  chessBoard.setup();
}

function createFenInput() {
  let input = createInput(chessBoard.getFenPosition());
  input.position(40, 10);
  input.size(400);
  let button = createButton('Update Board');
  button.position(450, 10);
  button.mousePressed(() => {
    chessBoard.setFenPosition(input.value());
    redraw();
  });
}

function mousePressed() {
  if (chessBoard.handleMousePress(mouseX, mouseY)) {
    let input = select('input');
    input.value(chessBoard.getFenPosition());
    redraw();
  }
}

function draw() {
  background(255);
  chessBoard.drawBoard(12);
  noLoop();
}

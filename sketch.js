let startX = 50;
let startY = 50;

let letters = ['a','b','c','d','e','f','g','h'];
let numbers = ['1','2','3','4','5','6','7','8'];
let reverse_numbers = numbers.reverse();


function preload() {
  white_rook = loadImage("white_rook.png");
  white_knight = loadImage("white_knight.png");
  white_bishop = loadImage("white_bishop.png");
  white_queen = loadImage("white_queen.png");
  white_king = loadImage("white_king.png");
  white_pawn = loadImage("white_pawn.png");
  dark_rook = loadImage("dark_rook.png");
  dark_knight = loadImage("dark_knight.png");
  dark_bishop = loadImage("dark_bishop.png");
  dark_queen = loadImage("dark_queen.png");
  dark_king = loadImage("dark_king.png");
  dark_pawn = loadImage("dark_pawn.png");
}

function setup() {
  createCanvas(600, 600);
}

function flip_colors(x, y) {
  if (((x+y) % 2) == 0) {
    fill(245,245,220);
  } else {
    fill(196,164,132);
  }
}

function draw_piece(name, x, y, square_size) {
  atX = startX + x*square_size;
  atY = startY + y*square_size
  image(name, atX, atY)
}

function draw_pieces(square_size) {
  // Draw the white rooks
  draw_piece(white_rook,0,7,square_size)
  draw_piece(white_rook,7,7,square_size)
  
  // Draw the white knights
  draw_piece(white_knight,1,7,square_size)
  draw_piece(white_knight,6,7,square_size)
  
  // Draw the white bishops
  draw_piece(white_bishop,2,7,square_size)
  draw_piece(white_bishop,5,7,square_size)
  
  // Draw the white queen and king
  draw_piece(white_queen,3,7,square_size)
  draw_piece(white_king,4,7,square_size)
  
  // Draw all the white pawns
  for (x=0; x < 8; x++) {
    draw_piece(white_pawn,x,6,square_size);
  }
  
  // Draw the dark rooks
  draw_piece(dark_rook,0,0,square_size)
  draw_piece(dark_rook,7,0,square_size)
  
  // Draw the dark knights
  draw_piece(dark_knight,1,0,square_size)
  draw_piece(dark_knight,6,0,square_size)
  
  // Draw the dark bishops
  draw_piece(dark_bishop,2,0,square_size)
  draw_piece(dark_bishop,5,0,square_size)
  
  // Draw the dark queen and king
  draw_piece(dark_queen,3,0,square_size)
  draw_piece(dark_king,4,0,square_size)
  
  // Draw all the white pawns
  for (x=0; x < 8; x++) {
    draw_piece(dark_pawn,x,1,square_size);
  }
}

// Draw the chess board where each square is of size: 'size'
function draw_board(square_size, text_size) {
  for (y=0; y < 8; y++) {
    for (x=0; x < 8; x++) {
      flip_colors(x,y)
      atX = startX + x*square_size
      atY = startY + y*square_size
      noStroke()
      square(atX, atY, square_size);
    }
  }
  
  // Draw the letters at the bottom (first row)
  let ty = 8;
  atY = startY + ty*square_size;
  textSize(text_size);
  for (x=0; x < 8; x++) {
      atX = startX + x*square_size
      flip_colors(x,ty)
      text(letters[x], atX+3, atY-3);
  }
  
  // Draw the numbers at the rightmost column
  let tx = 8;
  atX = startX + ty*square_size;
  textSize(text_size);
  for (y=0; y < 8; y++) {
      atY = startY + y*square_size
      flip_colors(tx,y)
      text(reverse_numbers[y], atX-10, atY+12);
  }
  
  // Draw all the pieces
  draw_pieces(square_size);
}

function draw() {
  background(255);
  draw_board(60,12)
  noLoop()
}
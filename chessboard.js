
class ChessBoard {

  constructor(startX, startY, squareSize) {
    this.startX = startX;
    this.startY = startY;
    this.squareSize = squareSize;
    this.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    this.numbers = ['1', '2', '3', '4', '5', '6', '7', '8'];
    this.reverseNumbers = this.numbers.slice().reverse();
    this.fenPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - -";
    this.pieceImages = {};
    this.board = [];
    this.selectedPiece = null;
    this.selectedX = -1;
    this.selectedY = -1;
    this.activeColor = 'w';
    this.enPassantTarget = '-';
    this.lastMove = null;
  }

  preload() {
    this.pieceImages = {
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

  setup() {
    this.board = this.parseFEN(this.fenPosition);
  }

  flipColors(x, y) {
    if (((x + y) % 2) == 0) {
      fill(245, 245, 220);
    } else {
      fill(196, 164, 132);
    }
  }

  drawPiece(piece, x, y) {
    if (piece in this.pieceImages) {
      let atX = this.startX + x * this.squareSize;
      let atY = this.startY + y * this.squareSize;
      image(this.pieceImages[piece], atX, atY, this.squareSize, this.squareSize);
    }
  }

  parseFEN(fen) {
    let [boardPart, colorPart, castlingPart, enPassantPart] = fen.split(' ');
    let board = [];
    let rows = boardPart.split('/');
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
    this.activeColor = colorPart || 'w';
    this.enPassantTarget = enPassantPart || '-';
    return board;
  }

  boardToFEN() {
    let fen = "";
    for (let row of this.board) {
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
    fen = fen.slice(0, -1);
    fen += " " + this.activeColor + " - " + this.enPassantTarget;
    return fen;
  }

  drawPieces() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let piece = this.board[y][x];
        if (piece !== '') {
          this.drawPiece(piece, x, y);
        }
      }
    }
  }

  drawBoard(textSizeValue) {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        this.flipColors(x, y);
        let atX = this.startX + x * this.squareSize;
        let atY = this.startY + y * this.squareSize;
        noStroke();
        square(atX, atY, this.squareSize);

        if (x === this.selectedX && y === this.selectedY) {
          fill(255, 255, 0, 100);
          square(atX, atY, this.squareSize);
        }
      }
    }

    let ty = 8;
    let atY = this.startY + ty * this.squareSize;
    textSize(textSizeValue);
    for (let x = 0; x < 8; x++) {
      let atX = this.startX + x * this.squareSize;
      this.flipColors(x, ty);
      text(this.letters[x], atX + 3, atY - 3);
    }

    let tx = 8;
    let atX = this.startX + ty * this.squareSize;
    for (let y = 0; y < 8; y++) {
      atY = this.startY + y * this.squareSize;
      this.flipColors(tx, y);
      text(this.reverseNumbers[y], atX - 10, atY + 12);
    }

    this.drawPieces();
  }

  isPathClear(fromX, fromY, toX, toY) {
    let dx = Math.sign(toX - fromX);
    let dy = Math.sign(toY - fromY);
    let x = fromX + dx;
    let y = fromY + dy;

    while (x !== toX || y !== toY) {
      if (this.board[y][x] !== '') {
        return false;
      }
      x += dx;
      y += dy;
    }

    return true;
  }

  isValidMove(fromX, fromY, toX, toY) {
    let piece = this.board[fromY][fromX];
    let targetPiece = this.board[toY][toX];
    let dx = toX - fromX;
    let dy = toY - fromY;

    // Check if the target square has a piece of the same color
    if (targetPiece !== '' && 
        (piece.toLowerCase() === piece) === (targetPiece.toLowerCase() === targetPiece)) {
      return false;
    }

    switch (piece.toLowerCase()) {
      case 'p':
        let direction = piece === 'P' ? -1 : 1;
        // Move forward
        if (dx === 0 && dy === direction && targetPiece === '') {
          return true;
        }
        // Initial two-square move
        if (dx === 0 && dy === 2 * direction && targetPiece === '' && 
            this.board[fromY + direction][fromX] === '' &&
            ((piece === 'P' && fromY === 6) || (piece === 'p' && fromY === 1))) {
          return true;
        }
        // Capture diagonally
        if (Math.abs(dx) === 1 && dy === direction && targetPiece !== '') {
          return true;
        }
        // En passant capture
        if (Math.abs(dx) === 1 && dy === direction && targetPiece === '' &&
            this.enPassantTarget === this.letters[toX] + (8 - toY)) {
          return true;
        }
        return false;

      case 'r':
        if (dx === 0 || dy === 0) {
          return this.isPathClear(fromX, fromY, toX, toY);
        }
        return false;

      case 'n':
        return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);

      case 'b':
        if (Math.abs(dx) === Math.abs(dy)) {
          return this.isPathClear(fromX, fromY, toX, toY);
        }
        return false;

      case 'q':
        if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
          return this.isPathClear(fromX, fromY, toX, toY);
        }
        return false;

      case 'k':
        return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

      default:
        return false;
    }
  }

  handleMousePress(mouseX, mouseY) {
    let x = floor((mouseX - this.startX) / this.squareSize);
    let y = floor((mouseY - this.startY) / this.squareSize);

    if (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (this.selectedPiece === null) {
        if (this.board[y][x] !== '' && 
            ((this.activeColor === 'w' && this.board[y][x].toUpperCase() === this.board[y][x]) ||
             (this.activeColor === 'b' && this.board[y][x].toLowerCase() === this.board[y][x]))) {
          this.selectedPiece = this.board[y][x];
          this.selectedX = x;
          this.selectedY = y;
        }
      } else {
        if (this.isValidMove(this.selectedX, this.selectedY, x, y)) {
          let piece = this.selectedPiece;
          let fromX = this.selectedX;
          let fromY = this.selectedY;

          // Handle en passant capture
          if (piece.toLowerCase() === 'p' && Math.abs(x - fromX) === 1 && this.board[y][x] === '' &&
              this.enPassantTarget === this.letters[x] + (8 - y)) {
            this.board[fromY][x] = '';  // Remove the captured pawn
          }

          this.board[y][x] = piece;
          this.board[fromY][fromX] = '';

          // Set en passant target
          if (piece.toLowerCase() === 'p' && Math.abs(fromY - y) === 2) {
            this.enPassantTarget = this.letters[x] + (8 - (fromY + y) / 2);
          } else {
            this.enPassantTarget = '-';
          }

          this.activeColor = this.activeColor === 'w' ? 'b' : 'w';
          this.fenPosition = this.boardToFEN();
          this.lastMove = { from: { x: fromX, y: fromY }, to: { x, y } };
        }
        
        this.selectedPiece = null;
        this.selectedX = -1;
        this.selectedY = -1;
      }
      return true;
    }
    return false;
  }

  getFenPosition() {
    return this.fenPosition;
  }

  setFenPosition(fen) {
    this.fenPosition = fen;
    this.board = this.parseFEN(fen);
    this.selectedPiece = null;
    this.selectedX = -1;
    this.selectedY = -1;
  }
}

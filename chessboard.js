import { initialPositions } from './constants.js';

export class ChessBoard {
  constructor() {
    this.positions = initialPositions;
    this.turn = 'w';
  }

  getPositions() {
    return this.positions;
  }

  makeMove(currSquare, newSquare) {
    this.positions[newSquare] = this.positions[currSquare];
    this.positions[currSquare] = null;
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  getAvailableMoves(key) {
    const pieceData = this.positions[key];
    if (!pieceData) return [];

    const [color, piece] = pieceData.split('-');

    if (color !== this.turn) return [];

    switch (piece) {
      case 'p':
        return this.getPawnAvailabeMoves(key);

      default:
        return [];
    }
  }

  getPotentialPawnMoves(row, col) {
    const defaultPawnMoves = [
      [
        { r: 1, c: 0 },
        { r: 2, c: 0 },
      ],
      [{ r: 1, c: 1, attack: true }],
      [{ r: 1, c: -1, attack: true }],
    ];

    const direction = this.turn === 'w' ? -1 : 1;
    const moves = [];

    for (const defaultMoveSeq of defaultPawnMoves) {
      for (const defaultMove of defaultMoveSeq) {
        const newRow = row + direction * defaultMove.r;
        const newCol = col + direction * defaultMove.c;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) continue;
        const newSquareKey = newRow + '-' + newCol;
        if (defaultMove.attack) {
          const existingPiece = this.positions[newSquareKey];
          if (!existingPiece || existingPiece[0] == this.turn) continue;
        }
        moves.push(newSquareKey);
      }
    }
    return moves;
  }

  getPawnAvailabeMovesDummy(key) {
    const row = Number(key[0]);
    const col = Number(key[2]);
    const potentialPawnMoves = this.getPotentialPawnMoves(row, col);
    console.log('🚀 ~ ChessBoard ~ getPawnAvailabeMovesDummy ~ potentialPawnMoves:', potentialPawnMoves);
    const moves = [];

    // if (this.turn === 'w') {
    //   // initial position (2 moves ahead)
    //   if (row == 6) {
    //     const potentialSquare = `${row - 2}-${col}`;
    //     // if there are no other pieces on that square
    //     if (!this.positions[potentialSquare]) {
    //       moves.push(potentialSquare);
    //     }
    //   }

    //   // (1 move ahead)
    //   if (row > 0) {
    //     const potentialSquare = `${row - 1}-${col}`;
    //     // if there are no other pieces on that square
    //     if (!this.positions[potentialSquare]) {
    //       moves.push(potentialSquare);
    //     }
    //   }
    // } else {
    //   // initial position (2 moves ahead)
    //   if (row == 1) {
    //     const potentialSquare = `${row + 2}-${col}`;
    //     // if there are no other pieces on that square
    //     if (!this.positions[potentialSquare]) {
    //       moves.push(potentialSquare);
    //     }
    //   }

    //   // (1 move ahead)
    //   if (row < 7) {
    //     const potentialSquare = `${row + 1}-${col}`;
    //     // if there are no other pieces on that square
    //     if (!this.positions[potentialSquare]) {
    //       moves.push(potentialSquare);
    //     }
    //   }
    // }

    // return moves;
  }

  getPawnAvailabeMoves(key) {
    const row = Number(key[0]);
    const col = Number(key[2]);
    const moves = [];
    this.getPawnAvailabeMovesDummy(key);

    if (this.turn === 'w') {
      // initial position (2 moves ahead)
      if (row == 6) {
        const potentialSquare = `${row - 2}-${col}`;
        // if there are no other pieces on that square
        if (!this.positions[potentialSquare]) {
          moves.push(potentialSquare);
        }
      }

      // (1 move ahead)
      if (row > 0) {
        const potentialSquare = `${row - 1}-${col}`;
        // if there are no other pieces on that square
        if (!this.positions[potentialSquare]) {
          moves.push(potentialSquare);
        }
      }
    } else {
      // initial position (2 moves ahead)
      if (row == 1) {
        const potentialSquare = `${row + 2}-${col}`;
        // if there are no other pieces on that square
        if (!this.positions[potentialSquare]) {
          moves.push(potentialSquare);
        }
      }

      // (1 move ahead)
      if (row < 7) {
        const potentialSquare = `${row + 1}-${col}`;
        // if there are no other pieces on that square
        if (!this.positions[potentialSquare]) {
          moves.push(potentialSquare);
        }
      }
    }

    return moves;
  }
}

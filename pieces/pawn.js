import { isEnPassantMove } from '../lib/helper.js';
import { Piece } from './piece.js';

export class Pawn extends Piece {
  constructor(row, col, color) {
    super(row, col, color, 'p');
  }

  static initialize(blackPieces, whitePieces) {
    for (let i = 0; i < 8; i++) {
      const blackPawn = new Pawn(1, i, 'b');
      const whitePawn = new Pawn(6, i, 'w');
      const blackKey = `1-${i}`;
      const whiteKey = `6-${i}`;
      blackPieces.alive[blackKey] = blackPawn;
      whitePieces.alive[whiteKey] = whitePawn;
    }
  }

  getPotentialMoves(game) {
    const { positions } = game.getPositions();

    const defaultPawnMoves = [
      [
        { r: 1, c: 0 },
        { r: 2, c: 0, initialOnly: true },
      ],
      [{ r: 1, c: 1, attack: true }],
      [{ r: 1, c: -1, attack: true }],
    ];

    const direction = game.turn === "w" ? -1 : 1;
    const moves = [];
    let isCheck = false;

    for (const defaultMoveSeq of defaultPawnMoves) {
      for (const defaultMove of defaultMoveSeq) {
        if (defaultMove.initialOnly) {
          if (game.turn === "w") {
            if (this.row !== 6) break;
          } else {
            if (this.row !== 1) break;
          }
        }
        const newRow = Number(this.row) + direction * defaultMove.r;
        const newCol = Number(this.col) + direction * defaultMove.c;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        const newSquareKey = newRow + "-" + newCol;
        const existingPiece = positions[newSquareKey];

        // not an attack move and thier is existing peice on the square.
        if (!defaultMove.attack && existingPiece) break;

        if (defaultMove.attack) {
          if (existingPiece) {
            // attack move and existing piece is of same color.
            if (existingPiece[0] == game.turn) break;

            // existing piece is a king
            if (existingPiece[2] === 'k') {
              isCheck = true;
            }
          }
          else {
            const lastPlayedMove = game.playedMoves[game.playedMoves.length - 1];
            if (!isEnPassantMove(lastPlayedMove, newCol, this.row)) break;
          }
        }

        moves.push(newSquareKey);
      }
    }

    return { moves, isChecked: isCheck };
  }
}
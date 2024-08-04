import { initializeBishops } from "./pieces/bishop.js";
import { initializeKings } from "./pieces/king.js";
import { initializeKnights } from "./pieces/knight.js";
import { initializePawns } from "./pieces/pawn.js";
import { initializeQueens } from "./pieces/queen.js";
import { initializeRooks } from "./pieces/rook.js";

export class ChessBoard {
  constructor() {
    this.turn = "w";
    this.blackPieces = { alive: {}, dead: {} };
    this.whitePieces = { alive: {}, dead: {} };
    this.initializePositions();
  }

  initializePositions() {
    initializePawns.call(this);
    initializeRooks.call(this);
    initializeKnights.call(this);
    initializeBishops.call(this);
    initializeQueens.call(this);
    initializeKings.call(this);
  }

  getPositions() {
    const positions = {};

    for (const blackPieceInstance of Object.values(this.blackPieces.alive)) {
      const blackPiece = blackPieceInstance.getData();
      const key = `${blackPiece.row}-${blackPiece.col}`;
      const value = `${blackPiece.color}-${blackPiece.type}`;
      positions[key] = value;
    }

    for (const whitePieceInstance of Object.values(this.whitePieces.alive)) {
      const whitePiece = whitePieceInstance.getData();
      const key = `${whitePiece.row}-${whitePiece.col}`;
      const value = `${whitePiece.color}-${whitePiece.type}`;
      positions[key] = value;
    }

    return positions;
  }

  getPieces() {
    if (this.turn === 'w') {
      return { teamPieces: this.whitePieces, oppositeTeamPieces: this.blackPieces }
    }

    return { teamPieces: this.blackPieces, oppositeTeamPieces: this.whitePieces };
  }

  makeMove(currSquare, newSquare) {
    // Alive pieces
    const { teamPieces, oppositeTeamPieces } = this.getPieces();
    const newSpuarePiece = oppositeTeamPieces.alive[newSquare];
    const currSpuarePiece = teamPieces.alive[currSquare];

    if (!currSpuarePiece) return console.error('Error: Current square not found');

    const newRow = newSquare[0];
    const newCol = newSquare[2];

    if (newSpuarePiece) {
      // if new square already contains a piece
      delete oppositeTeamPieces.alive[newSquare];
      oppositeTeamPieces.dead[newSquare] = newSpuarePiece;
    }

    currSpuarePiece.row = newRow;
    currSpuarePiece.col = newCol;

    delete teamPieces.alive[currSquare];
    teamPieces.alive[newSquare] = currSpuarePiece;

    // Change turn
    this.turn = this.turn === "w" ? "b" : "w";
  }

  getAvailableMoves(key) {
    const positions = this.getPositions();
    const pieceData = positions[key];

    if (!pieceData) return [];

    const [color, piece] = pieceData.split("-");

    if (color !== this.turn) return [];

    switch (piece) {
      case "p":
        return this.getPawnAvailabeMoves(key);

      default:
        return [];
    }
  }

  getPawnAvailabeMoves(key) {
    const potentalMoves = this.getPotentialPawnMoves(key);

    return potentalMoves;
  }

  getPotentialPawnMoves(key) {
    const positions = this.getPositions();
    const row = Number(key[0]);
    const col = Number(key[2]);

    const defaultPawnMoves = [
      [
        { r: 1, c: 0 },
        { r: 2, c: 0, initialOnly: true },
      ],
      [{ r: 1, c: 1, attack: true }],
      [{ r: 1, c: -1, attack: true }],
    ];

    const direction = this.turn === "w" ? -1 : 1;
    const moves = [];

    for (const defaultMoveSeq of defaultPawnMoves) {
      for (const defaultMove of defaultMoveSeq) {
        if (defaultMove.initialOnly) {
          if (this.turn === "w") {
            if (row !== 6) break;
          } else {
            if (row !== 1) break;
          }
        }
        const newRow = row + direction * defaultMove.r;
        const newCol = col + direction * defaultMove.c;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        const newSquareKey = newRow + "-" + newCol;
        const existingPiece = positions[newSquareKey];

        // not an attack move and thier is existing peice on the square.
        if (!defaultMove.attack && existingPiece) break;

        if (defaultMove.attack) {
          // attack move and existing piece is of same color.
          if (!existingPiece || existingPiece[0] == this.turn) break;
        }

        moves.push(newSquareKey);
      }
    }

    return moves;
  }
}

import { game } from "./index.js";
import { isEnPassantMove } from "./lib/helper.js";
import { initializeBishops } from "./pieces/bishop.js";
import { initializeKings } from "./pieces/king.js";
import { initializeKnights } from "./pieces/knight.js";
import { Pawn } from "./pieces/pawn.js";
import { initializeQueens } from "./pieces/queen.js";
import { initializeRooks } from "./pieces/rook.js";

export class ChessBoard {
  constructor() {
    this.turn = "w";
    this.blackPieces = { alive: {}, dead: {} };
    this.whitePieces = { alive: {}, dead: {} };
    this.playedMoves = [];
    this.initializePositions();
  }

  initializePositions() {
    Pawn.initializePawns(this.blackPieces, this.whitePieces);
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
    const { teamPieces, oppositeTeamPieces } = this.getPieces();

    // Alive pieces
    const newSpuarePiece = oppositeTeamPieces.alive[newSquare];
    const currSpuarePiece = teamPieces.alive[currSquare];

    if (!currSpuarePiece) return console.error('Error: Current square not found');

    const newRow = newSquare[0];
    const newCol = newSquare[2];

    const moveDetails = {
      from: { ...currSpuarePiece },
      to: {
        row: newRow,
        col: newCol
      },
    }


    if (newSpuarePiece) {
      // capture if new square already contains a piece
      delete oppositeTeamPieces.alive[newSquare];
      oppositeTeamPieces.dead[newSquare] = newSpuarePiece;
      moveDetails.capture = { ...newSpuarePiece };
    }
    else {
      const lastPlayedMove = game.playedMoves[game.playedMoves.length - 1];

      if (isEnPassantMove(lastPlayedMove, newCol, currSpuarePiece.row)) {
        // capture if after en passant move

        const enPassantSquare = `${lastPlayedMove.to.row}-${lastPlayedMove.to.col}`;
        const enPassantPiece = oppositeTeamPieces.alive[enPassantSquare];

        delete oppositeTeamPieces.alive[enPassantSquare];
        oppositeTeamPieces.dead[enPassantSquare] = enPassantPiece;
        moveDetails.capture = { ...enPassantPiece };
      }
    }

    currSpuarePiece.row = newRow;
    currSpuarePiece.col = newCol;

    delete teamPieces.alive[currSquare];
    teamPieces.alive[newSquare] = currSpuarePiece;

    // Save the move details to the history
    this.playedMoves.push(moveDetails);

    // Change turn
    this.turn = this.turn === "w" ? "b" : "w";
  }

  getAvailableMoves(key) {
    const { teamPieces } = this.getPieces();
    const pieceData = teamPieces.alive[key];

    if (!pieceData) {
      console.error('Error: Current square not found');
      return [];
    }

    if (pieceData.color !== this.turn) return [];

    switch (pieceData.type) {
      case "p":
        return pieceData.getPawnAvailabeMoves();

      default:
        return [];
    }
  }
}

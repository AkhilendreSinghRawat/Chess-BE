import { getAvailabeMoves, initializePositions, isEnPassantMove } from "./lib/helper.js";

export class ChessBoard {
  constructor(state = null) {
    if (state) {
      this.turn = state.turn;
      this.blackPieces = state.blackPieces;
      this.whitePieces = state.whitePieces;
      this.playedMoves = state.playedMoves;
    } else {
      this.turn = "w";
      this.blackPieces = { alive: {}, dead: {} };
      this.whitePieces = { alive: {}, dead: {} };
      this.playedMoves = [];
      initializePositions(this.blackPieces, this.whitePieces);
    }
  }


  clone() {
    const clonePieces = (pieces) => {
      const cloned = {
        alive: {},
        dead: {}
      };

      for (const [key, piece] of Object.entries(pieces.alive)) {
        cloned.alive[key] = piece.clone();
      }

      for (const [key, piece] of Object.entries(pieces.dead)) {
        cloned.dead[key] = piece.clone();
      }

      return cloned;
    };

    const state = {
      turn: this.turn,
      blackPieces: clonePieces(this.blackPieces),
      whitePieces: clonePieces(this.whitePieces),
      playedMoves: JSON.parse(JSON.stringify(this.playedMoves))
    };

    return new ChessBoard(state);
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
      const lastPlayedMove = this.playedMoves[this.playedMoves.length - 1];

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

  isCheck() {
    const { teamPieces } = this.getPieces();

    for (const pieceData of Object.values(teamPieces.alive)) {
      const { isChecked } = pieceData.getPotentialMoves(this);
      if (isChecked) return true;
    }

    return false;
  }

  getMoves(key) {
    const { teamPieces } = this.getPieces();
    const pieceData = teamPieces.alive[key];

    if (!pieceData) {
      console.error('Error: Current square not found');
      return [];
    }

    if (pieceData.color !== this.turn) return [];

    const { moves: potentialMoves } = pieceData.getPotentialMoves(this);

    return getAvailabeMoves(this, potentialMoves, pieceData.row, pieceData.col);
  }
}

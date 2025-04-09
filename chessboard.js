import { checkValidPromotionPiece, getAvailabeMoves, initializePositions, isEnPassantMove } from './lib/helper.js';
import { Bishop } from './pieces/bishop.js';
import { Knight } from './pieces/knight.js';
import { Queen } from './pieces/queen.js';
import { Rook } from './pieces/rook.js';

export class ChessBoard {
  constructor(state = null) {
    if (state) {
      this.turn = state.turn;
      this.blackPieces = state.blackPieces;
      this.whitePieces = state.whitePieces;
      this.playedMoves = state.playedMoves;
    } else {
      this.turn = 'w';
      this.isCheck = false;
      this.isMate = false;
      this.blackPieces = { alive: {}, dead: {} };
      this.whitePieces = { alive: {}, dead: {} };
      this.playedMoves = [];
      this.castlingRights = { b: { left: true, right: true }, w: { left: true, right: true } };
      initializePositions(this.blackPieces, this.whitePieces);
    }
  }

  clone() {
    const clonePieces = pieces => {
      const cloned = {
        alive: {},
        dead: {},
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
      playedMoves: JSON.parse(JSON.stringify(this.playedMoves)),
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

    return { positions, isCheck: this.isCheck, isMate: this.isMate };
  }

  getPieces() {
    if (this.turn === 'w') {
      return { teamPieces: this.whitePieces, oppositeTeamPieces: this.blackPieces };
    }

    return { teamPieces: this.blackPieces, oppositeTeamPieces: this.whitePieces };
  }

  makeMove({ currSquare, newSquare, isTempMove, promotionPiece }) {
    const { teamPieces, oppositeTeamPieces } = this.getPieces();

    // Alive pieces
    const newSpuarePiece = oppositeTeamPieces.alive[newSquare];
    let currSpuarePiece = teamPieces.alive[currSquare];
    console.log('🚀 ~ ChessBoard ~ makeMove ~ currSpuarePiece:', currSpuarePiece.type, currSquare, newSquare);
    if (!currSpuarePiece) return console.error('Error: Current square not found');

    const isCastlingMove = currSpuarePiece.type === 'k' && Math.abs(newSquare[2] - currSquare[2]) === 2;
    console.log('🚀 ~ ChessBoard ~ makeMove ~ isCastlingMove:', isCastlingMove);

    if (promotionPiece) {
      const isValidPromotionPiece = checkValidPromotionPiece(newSquare, currSpuarePiece, promotionPiece);
      if (!isValidPromotionPiece) return;
    }

    const newRow = newSquare[0];
    const newCol = newSquare[2];

    const moveDetails = {
      from: { ...currSpuarePiece },
      to: {
        row: newRow,
        col: newCol,
      },
      isCastlingMove,
    };

    if (newSpuarePiece) {
      // capture if new square already contains a piece
      delete oppositeTeamPieces.alive[newSquare];
      oppositeTeamPieces.dead[newSquare] = newSpuarePiece;
      moveDetails.capture = { ...newSpuarePiece };
    } else {
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

    switch (promotionPiece) {
      case 'q':
        currSpuarePiece = new Queen(newRow, newCol, this.turn);
        break;

      case 'r':
        currSpuarePiece = new Rook(newRow, newCol, this.turn);
        break;

      case 'b':
        currSpuarePiece = new Bishop(newRow, newCol, this.turn);
        break;

      case 'k':
        currSpuarePiece = new Knight(newRow, newCol, this.turn);
        break;

      default:
        currSpuarePiece.row = newRow;
        currSpuarePiece.col = newCol;
    }

    delete teamPieces.alive[currSquare];
    teamPieces.alive[newSquare] = currSpuarePiece;

    if (isCastlingMove) {
      const currRookSquare = currSquare[0] + '-' + (newSquare[2] < currSquare[2] ? 0 : 7);
      const newRookSquareCol = newSquare[2] < currSquare[2] ? 3 : 5;
      const newRookSquare = currSquare[0] + '-' + newRookSquareCol;
      const rookSpuarePiece = teamPieces.alive[currRookSquare];
      rookSpuarePiece.col = newRookSquareCol;
      delete teamPieces.alive[currRookSquare];
      teamPieces.alive[newRookSquare] = rookSpuarePiece;
    }

    // Save the move details to the history
    this.playedMoves.push(moveDetails);

    if (!isTempMove) {
      if (currSpuarePiece.type === 'k') {
        this.castlingRights[this.turn].left = false;
        this.castlingRights[this.turn].right = false;
      } else if (currSpuarePiece.type === 'r') {
        if (currSquare[2] == 0) {
          this.castlingRights[this.turn].left = false;
        } else {
          this.castlingRights[this.turn].right = false;
        }
      }

      this.isCheck = this.getIsCheck();
    }

    // Change turn
    this.turn = this.turn === 'w' ? 'b' : 'w';

    if (this.isCheck) {
      this.isCheck = this.turn + '-k';
      this.isMate = this.getIsMate();
    }
  }

  getIsMate() {
    const { teamPieces } = this.getPieces();

    for (const pieceData of Object.values(teamPieces.alive)) {
      const { moves: potentialMoves } = pieceData.getPotentialMoves(this, true);

      const moves = getAvailabeMoves(this, potentialMoves, pieceData.row, pieceData.col);

      if (moves.length) return false;
    }

    return true;
  }

  getIsCheck() {
    const { teamPieces } = this.getPieces();

    for (const pieceData of Object.values(teamPieces.alive)) {
      const { isChecked } = pieceData.getPotentialMoves(this, true);
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

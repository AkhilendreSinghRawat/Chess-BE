import { game } from "../index.js";
import { Bishop } from "../pieces/bishop.js";
import { King } from "../pieces/king.js";
import { Knight } from "../pieces/knight.js";
import { Pawn } from "../pieces/pawn.js";
import { Queen } from "../pieces/queen.js";
import { Rook } from "../pieces/rook.js";

export const isEnPassantMove = (lastPlayedMove, newCol, currRow) => {
    // checking if this potential move is en passant or not.

    // no moves have been played yet.
    if (!lastPlayedMove) return false;

    // if last played piece is not a pawn.
    if (lastPlayedMove.from.type !== 'p') return false;

    // capturing move
    if (lastPlayedMove.capture) return false;

    // if column is not adjacent column.
    if (lastPlayedMove.from.col != newCol) return false;

    // if row is not same.
    if (lastPlayedMove.to.row != currRow) return false;

    // last played move should be a double jump move.
    if (Math.abs(lastPlayedMove.from.row - lastPlayedMove.to.row) !== 2) return false;

    return true;
}

export const getAvailabeMoves = (potentialMoves, row, col) => {
    const moves = [];

    for (const potentialMove of potentialMoves) {
        // temp instance of board for every move.
        const tempGame = game.clone();
        // make a move on temp board.
        tempGame.makeMove(`${row}-${col}`, potentialMove);

        // if is check then don't allow the move.
        if (tempGame.isCheck()) continue;

        // confirm potential move.
        moves.push(potentialMove);
    }

    return moves;
}

const validateMove = (row, col, moves) => {
    if (row < 0 || row > 7 || col < 0 || col > 7) return false;

    const positions = game.getPositions();

    // check if the new sqaure already have a piece
    const newSquareKey = row + "-" + col;
    const existingPiece = positions[newSquareKey];

    if (existingPiece) {
        // existing piece is of same color.
        if (existingPiece[0] == game.turn) return false;

        // existing piece is of opponent
        moves.push(newSquareKey);
        return false;
    }

    moves.push(newSquareKey);
    return true;
}

export const getPotentialStraightLineMoves = (row, col, isSingle) => {
    const moves = [];

    // loop through the column by increasing the row
    for (let newRow = Number(row) + 1; newRow <= (isSingle ? Number(row) + 1 : 7); newRow++) {
        if (!validateMove(newRow, col, moves)) break;
    }

    // loop through the column by decreasing the row
    for (let newRow = row - 1; newRow >= (isSingle ? (row - 1) : 0); newRow--) {
        if (!validateMove(newRow, col, moves)) break;
    }

    // loop through the row by increasing the row
    for (let newCol = Number(col) + 1; newCol <= (isSingle ? (Number(col) + 1) : 7); newCol++) {
        if (!validateMove(row, newCol, moves)) break;
    }

    // loop through the row by decreasing the row
    for (let newCol = col - 1; newCol >= (isSingle ? (col - 1) : 0); newCol--) {
        if (!validateMove(row, newCol, moves)) break;
    }

    return moves;
}

export const getPotentialDiagonalMoves = (row, col, isSingle) => {
    const moves = [];

    // 1st diagonal increase row and column
    for (let i = 1; i <= (isSingle ? 1 : 7); i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) + i;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 2nd diagonal decrease row and column
    for (let i = 1; i <= (isSingle ? 1 : 7); i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) - i;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 3rd diagonal decrease row and increase column
    for (let i = 1; i <= (isSingle ? 1 : 7); i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) + i;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 4th diagonal increase row and decrease column
    for (let i = 1; i <= (isSingle ? 1 : 7); i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) - i;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    return moves;
}

export const initializePositions = (blackPieces, whitePieces) => {
    Pawn.initialize(blackPieces, whitePieces);
    Rook.initialize(blackPieces, whitePieces);
    Bishop.initialize(blackPieces, whitePieces);
    Queen.initialize(blackPieces, whitePieces);
    King.initialize(blackPieces, whitePieces);
    Knight.initialize(blackPieces, whitePieces);
}
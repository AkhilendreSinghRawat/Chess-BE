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

export const getAvailabeMoves = (game, potentialMoves, row, col) => {
    const moves = [];

    for (const potentialMove of potentialMoves) {
        // temp instance of board for every move.
        const tempGame = game.clone();
        // make a move on temp board.
        tempGame.makeMove(`${row}-${col}`, potentialMove, true);

        // if is check then don't allow the move.
        if (tempGame.getIsCheck()) continue;

        // confirm potential move.
        moves.push(potentialMove);
    }

    return moves;
}

const validateMove = (game, row, col, moves, checkStatus) => {
    if (row < 0 || row > 7 || col < 0 || col > 7) return false;

    const { positions } = game.getPositions();

    // check if the new sqaure already have a piece
    const newSquareKey = row + "-" + col;
    const existingPiece = positions[newSquareKey];

    if (existingPiece) {
        // existing piece is of same color.
        if (existingPiece[0] == game.turn) return false;

        // existing piece is of opponent
        moves.push(newSquareKey);

        // existing piece is a king
        if (existingPiece[2] === 'k') {
            checkStatus.isCheck = true;
        }

        return false;
    }

    moves.push(newSquareKey);
    return true;
}

export const getPotentialStraightLineMoves = (game, row, col) => {
    const moves = [];
    const checkStatus = { isCheck: false };

    // loop through the column by increasing the row
    for (let newRow = Number(row) + 1; newRow <= 7; newRow++) {
        if (!validateMove(game, newRow, col, moves, checkStatus)) break;
    }

    // loop through the column by decreasing the row
    for (let newRow = row - 1; newRow >= 0; newRow--) {
        if (!validateMove(game, newRow, col, moves, checkStatus)) break;
    }

    // loop through the row by increasing the row
    for (let newCol = Number(col) + 1; newCol <= 7; newCol++) {
        if (!validateMove(game, row, newCol, moves, checkStatus)) break;
    }

    // loop through the row by decreasing the row
    for (let newCol = col - 1; newCol >= 0; newCol--) {
        if (!validateMove(game, row, newCol, moves, checkStatus)) break;
    }

    return { moves, isChecked: checkStatus.isCheck };
}

export const getPotentialDiagonalMoves = (game, row, col) => {
    const moves = [];
    const checkStatus = { isCheck: false };

    // 1st diagonal increase row and column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) + i;
        if (!validateMove(game, newRow, newCol, moves, checkStatus)) break;
    }

    // 2nd diagonal decrease row and column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) - i;
        if (!validateMove(game, newRow, newCol, moves, checkStatus)) break;
    }

    // 3rd diagonal decrease row and increase column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) + i;
        if (!validateMove(game, newRow, newCol, moves, checkStatus)) break;
    }

    // 4th diagonal increase row and decrease column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) - i;
        if (!validateMove(game, newRow, newCol, moves, checkStatus)) break;
    }

    return { moves, isChecked: checkStatus.isCheck };
}

export const initializePositions = (blackPieces, whitePieces) => {
    Pawn.initialize(blackPieces, whitePieces);
    Rook.initialize(blackPieces, whitePieces);
    Bishop.initialize(blackPieces, whitePieces);
    Queen.initialize(blackPieces, whitePieces);
    King.initialize(blackPieces, whitePieces);
    Knight.initialize(blackPieces, whitePieces);
}

export const getPotentialKnightMoves = (game, row, col) => {
    const defaultKnightsMoves = [
        { r: - 1, c: - 2 },
        { r: - 2, c: - 1 },
        { r: - 2, c: 1 },
        { r: -1, c: 2 },
    ]

    const moves = [];
    const checkStatus = { isCheck: false };

    for (const direction of [1, -1]) {
        for (const move of defaultKnightsMoves) {
            const newRow = Number(row) + direction * move.r;
            const newCol = Number(col) + direction * move.c;
            validateMove(game, newRow, newCol, moves, checkStatus);
        }
    }

    return { moves, isChecked: checkStatus.isCheck };
}

export const getPotentialKingMoves = (game, row, col) => {
    const defaultKingMoves = [
        { r: 1, c: 0 },
        { r: 1, c: 1 },
        { r: 0, c: 1 },
        { r: -1, c: 1 },
    ]

    const moves = [];
    const checkStatus = { isCheck: false };

    for (const direction of [1, -1]) {
        for (const move of defaultKingMoves) {
            const newRow = Number(row) + direction * move.r;
            const newCol = Number(col) + direction * move.c;
            validateMove(game, newRow, newCol, moves, checkStatus);
        }
    }

    return { moves, isChecked: checkStatus.isCheck };
}
import { game } from "../index.js";

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

export const getPotentialStraightLineMoves = (row, col) => {
    const moves = [];

    // loop through the column by increasing the row
    for (let newRow = Number(row) + 1; newRow <= 7; newRow++) {
        if (!validateMove(newRow, col, moves)) break;
    }

    // loop through the column by decreasing the row
    for (let newRow = row - 1; newRow >= 0; newRow--) {
        if (!validateMove(newRow, col, moves)) break;
    }

    // loop through the row by increasing the row
    for (let newCol = Number(col) + 1; newCol <= 7; newCol++) {
        if (!validateMove(row, newCol, moves)) break;
    }

    // loop through the row by decreasing the row
    for (let newCol = col - 1; newCol >= 0; newCol--) {
        if (!validateMove(row, newCol, moves)) break;
    }

    return moves;
}

export const getPotentialDiagonalMoves = (row, col) => {
    const moves = [];

    // 1st diagonal increase row and column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) + i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 2nd diagonal decrease row and column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) - i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 3rd diagonal decrease row and increase column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) - i;
        const newCol = Number(col) + i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    // 4th diagonal increase row and decrease column
    for (let i = 1; i <= 7; i++) {
        const newRow = Number(row) + i;
        const newCol = Number(col) - i;
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
        if (!validateMove(newRow, newCol, moves)) break;
    }

    return moves;
}
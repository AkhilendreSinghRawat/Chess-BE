import { game } from "../index.js";
import { Piece } from "./piece.js";

export class Rook extends Piece {
    constructor(row, col, color) {
        super(row, col, color, 'r');
    }

    static initialize(blackPieces, whitePieces) {
        for (const i of [0, 7]) {
            const blackRook = new Rook(0, i, "b");
            const whiteRook = new Rook(7, i, "w");
            const blackKey = `0-${i}`;
            const whiteKey = `7-${i}`;
            blackPieces.alive[blackKey] = blackRook;
            whitePieces.alive[whiteKey] = whiteRook;
        }
    }

    getPotentialMoves() {
        const positions = game.getPositions();
        const moves = [];

        const validateMove = (row, col) => {
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

        // loop through the column by increasing the row
        for (let newRow = Number(this.row) + 1; newRow <= 7; newRow++) {
            if (!validateMove(newRow, this.col)) break;
        }

        // loop through the column by decreasing the row
        for (let newRow = this.row - 1; newRow >= 0; newRow--) {
            if (!validateMove(newRow, this.col)) break;
        }

        // loop through the row by increasing the row
        for (let newCol = Number(this.col) + 1; newCol <= 7; newCol++) {
            if (!validateMove(this.row, newCol)) break;
        }

        // loop through the row by decreasing the row
        for (let newCol = this.col - 1; newCol >= 0; newCol--) {
            if (!validateMove(this.row, newCol)) break;
        }

        return moves;
    }
}

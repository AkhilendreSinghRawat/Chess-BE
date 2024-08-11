import { game } from "../index.js";
import { Piece } from "./piece.js";

export class Bishop extends Piece {
    constructor(row, col, color) {
        super(row, col, color, 'b');
    }

    static initialize(blackPieces, whitePieces) {
        for (const i of [2, 5]) {
            const blackBishop = new Bishop(0, i, "b");
            const whiteBishop = new Bishop(7, i, "w");
            const blackKey = `0-${i}`;
            const whiteKey = `7-${i}`;
            blackPieces.alive[blackKey] = blackBishop;
            whitePieces.alive[whiteKey] = whiteBishop;
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

        // 1st diagonal increase row and column
        for (let i = 1; i <= 7; i++) {
            const newRow = Number(this.row) + i;
            const newCol = Number(this.col) + i;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
            if (!validateMove(newRow, newCol)) break;
        }

        // 2nd diagonal decrease row and column
        for (let i = 1; i <= 7; i++) {
            const newRow = Number(this.row) - i;
            const newCol = Number(this.col) - i;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
            if (!validateMove(newRow, newCol)) break;
        }

        // 3rd diagonal decrease row and increase column
        for (let i = 1; i <= 7; i++) {
            const newRow = Number(this.row) - i;
            const newCol = Number(this.col) + i;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
            if (!validateMove(newRow, newCol)) break;
        }

        // 4th diagonal increase row and decrease column
        for (let i = 1; i <= 7; i++) {
            const newRow = Number(this.row) + i;
            const newCol = Number(this.col) - i;
            if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) break;
            if (!validateMove(newRow, newCol)) break;
        }

        return moves;
    }
}

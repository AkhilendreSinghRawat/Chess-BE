import { Piece } from "./piece.js";

export class Knight extends Piece {
    constructor(row, col, color) {
        super(row, col, color, 'n');
    }

    static initialize(blackPieces, whitePieces) {
        for (const i of [1, 6]) {
            const blackKnight = new Knight(0, i, "b");
            const whiteKnight = new Knight(7, i, "w");
            const blackKey = `0-${i}`;
            const whiteKey = `7-${i}`;
            blackPieces.alive[blackKey] = blackKnight;
            whitePieces.alive[whiteKey] = whiteKnight;
        }
    }

    getPotentialMoves() {
        return [];
    }
}


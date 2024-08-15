import { getPotentialDiagonalMoves } from "../lib/helper.js";
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

    getPotentialMoves(game) {
        return getPotentialDiagonalMoves(game, this.row, this.col);
    }
}

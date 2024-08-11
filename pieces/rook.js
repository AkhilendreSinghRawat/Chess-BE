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
}

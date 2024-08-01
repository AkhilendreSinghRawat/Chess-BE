import { Piece } from "./piece.js";

export function initializeBishops() {
    for (const i of [2, 5]) {
        const blackBishop = new Piece(0, i, "b", 'b');
        const whiteBishop = new Piece(7, i, "w", 'b');
        const blackKey = `0-${i}`;
        const whiteKey = `7-${i}`;
        this.blackPieces.alive[blackKey] = blackBishop;
        this.whitePieces.alive[whiteKey] = whiteBishop;
    }
};


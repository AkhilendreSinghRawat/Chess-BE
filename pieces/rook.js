import { Piece } from "./piece.js";

export function initializeRooks() {
    for (const i of [0, 7]) {
        const blackRook = new Piece(0, i, "b", 'r');
        const whiteRook = new Piece(7, i, "w", 'r');
        const blackKey = `0-${i}`;
        const whiteKey = `7-${i}`;
        this.blackPieces.alive[blackKey] = blackRook;
        this.whitePieces.alive[whiteKey] = whiteRook;
    }
};


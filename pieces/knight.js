import { Piece } from "./piece.js";

export function initializeKnights() {
    for (const i of [1, 6]) {
        const blackKnight = new Piece(0, i, "b", 'n');
        const whiteKnight = new Piece(7, i, "w", 'n');
        const blackKey = `0-${i}`;
        const whiteKey = `7-${i}`;
        this.blackPieces.alive[blackKey] = blackKnight;
        this.whitePieces.alive[whiteKey] = whiteKnight;
    }
};


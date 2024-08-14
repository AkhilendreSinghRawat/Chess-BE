import { Piece } from "./piece.js";

export function initializeKings() {
    const blackKing = new Piece(0, 4, "b", 'k');
    const whiteKing = new Piece(7, 4, "w", 'k');
    this.blackPieces.alive['0-4'] = blackKing;
    this.whitePieces.alive['7-4'] = whiteKing;
};


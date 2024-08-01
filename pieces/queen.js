import { Piece } from "./piece.js";

export function initializeQueens() {
    const blackQueen = new Piece(0, 3, "b", 'q');
    const whiteQueen = new Piece(7, 4, "w", 'q');
    this.blackPieces.alive['0-3'] = blackQueen;
    this.whitePieces.alive['7-4'] = whiteQueen;
};


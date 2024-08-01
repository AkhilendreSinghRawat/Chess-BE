import { Piece } from "./piece.js";

export function initializePawns() {
  for (let i = 0; i < 8; i++) {
    const blackPawn = new Piece(1, i, "b", 'p');
    const whitePawn = new Piece(6, i, "w", 'p');
    const blackKey = `1-${i}`;
    const whiteKey = `6-${i}`;
    this.blackPieces.alive[blackKey] = blackPawn;
    this.whitePieces.alive[whiteKey] = whitePawn;
  }
};

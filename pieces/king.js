import { getPotentialKingMoves } from "../lib/helper.js";
import { Piece } from "./piece.js";

export class King extends Piece {
    constructor(row, col, color) {
        super(row, col, color, 'k');
    }

    static initialize(blackPieces, whitePieces) {
        const blackKing = new King(0, 4, "b");
        const whiteKing = new King(7, 4, "w");
        blackPieces.alive['0-4'] = blackKing;
        whitePieces.alive['7-4'] = whiteKing;
    }

    getPotentialMoves(game) {
        return getPotentialKingMoves(game, this.row, this.col);
    }
}


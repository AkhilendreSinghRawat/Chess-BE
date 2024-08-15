import { getPotentialDiagonalMoves, getPotentialStraightLineMoves } from "../lib/helper.js";
import { Piece } from "./piece.js";

export class Queen extends Piece {
    constructor(row, col, color) {
        super(row, col, color, 'q');
    }

    static initialize(blackPieces, whitePieces) {
        const blackQueen = new Queen(0, 3, "b");
        const whiteQueen = new Queen(7, 3, "w");
        blackPieces.alive['0-3'] = blackQueen;
        whitePieces.alive['7-3'] = whiteQueen;
    }

    getPotentialMoves(game) {
        const { moves: straightLineMoves, isChecked: straightLineIsChecked } = getPotentialStraightLineMoves(game, this.row, this.col);
        const { moves: diagonalMoves, isChecked: diagonalIsChecked } = getPotentialDiagonalMoves(game, this.row, this.col);

        return {
            moves: [...straightLineMoves, ...diagonalMoves], isChecked: straightLineIsChecked || diagonalIsChecked
        }
    }
}



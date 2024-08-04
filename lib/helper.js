export const isEnPassantMove = (lastPlayedMove, newCol, currRow) => {
    // checking if this potential move is en passant or not.

    // no moves have been played yet.
    if (!lastPlayedMove) return false;

    // if last played piece is not a pawn.
    if (lastPlayedMove.from.type !== 'p') return false;

    // capturing move
    if (lastPlayedMove.capture) return false;

    // if column is not adjacent column.
    if (lastPlayedMove.from.col != newCol) return false;

    // if row is not same.
    if (lastPlayedMove.to.row != currRow) return false;

    // last played move should be a double jump move.
    if (Math.abs(lastPlayedMove.from.row - lastPlayedMove.to.row) !== 2) return false;

    return true;
}

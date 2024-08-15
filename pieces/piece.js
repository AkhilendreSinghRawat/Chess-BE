export class Piece {
    constructor(row, col, color, type) {
        this.row = row;
        this.col = col;
        this.color = color;
        this.type = type;
    }

    getData() {
        return {
            row: this.row,
            col: this.col,
            color: this.color,
            type: this.type,
        }
    }

    clone() {
        return new this.constructor(this.row, this.col, this.color);
    }
}
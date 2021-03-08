export default class Position {
    private static regexPattern = /r(\d+)c(\d+)/;
    private _row: number;
    private _col: number
    constructor(pos?: { row: number, col: number }) {
        this._row = pos?.row ?? 0;
        this._col = pos?.col ?? 0;
    }

    get row(): number {
        return this._row;
    }

    set row(value) {
        if (value < 0) {
            throw new Error("Position's row must be greater or equal to 0");
        }

        this._row = value;
    }

    get col(): number {
        return this._col;
    }

    set col(value) {
        if (value < 0) {
            throw new Error("Position's col must be greater or equal to 0");
        }

        this._col = value;
    }

    toString(): string {
        return `r${this.row}c${this.col}`;
    }

    static fromString(str: string): Position {
        return this.fromJSON(str);
    }

    toJSON(): string {
        return this.toString();
    }

    static fromJSON(str: string): Position {
        return new Position().assign(JSON.parse(str));
    }

    assign(data: { row: number, col: number } | string | string[]): Position {
        if (Array.isArray(data)) {
            data = data.join('');
        }

        if (typeof data === "string") {
            let array = Position.regexPattern.exec(data as string);
            if (array === null || array.length < 3) {
                throw new Error(`Parse error: input does not match position pattern`);
            }

            this.row = parseInt(array[1], 10);
            this.col = parseInt(array[2], 10);
        } else {
            this.row = data.row;
            this.col = data.col;
        }

        return this;
    }
}

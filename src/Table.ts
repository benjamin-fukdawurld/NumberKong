/// <reference path="decls.d.ts" />

import Move from "./Move";
import Cell from "./Cell";
import Row from "./Row";

import stringhash from "string-hash-64";

export default class Table {
    protected _values: number[];
    protected _colCount: number;
    constructor(colCount: number = 0, values: number[] = []) {
        if (colCount < 0) {
            throw new Error('Table column count must be greater or equal to 0');
        }

        if (colCount && values.length && values.length % colCount > 0) {
            throw new Error('Table values length must be a multiple of column count');
        }

        this._values = values;
        this._colCount = colCount;
    }

    get colCount(): number {
        return this._colCount;
    }

    get rowCount(): number {
        return this._values.length / this.colCount;
    }

    get values(): number[] {
        return this._values;
    }

    get score(): number {
        return this._values.reduce((accum, current) => accum - (current <= 0 ? 0 : 1), 0);
    }

    get hash(): number {
        return stringhash(this._values.join());
    }

    get playableMoves(): Move[] {
        let results: Move[] = [];
        for (let row = 0, rmax = this.rowCount; row < rmax; ++row) {
            for (let col = 0, cmax = this.colCount; col < cmax; ++col) {
                let cell = this.cell(row, col);
                if (cell.isSolved) {
                    continue;
                }
                let other = cell.left;
                if (other && cell.match(other)) {
                    results.push(new Move([cell.position, other.position]));
                }
                other = cell.right;
                if (other && cell.match(other)) {
                    results.push(new Move([cell.position, other.position]));
                }
                other = cell.top;
                if (other && cell.match(other)) {
                    results.push(new Move([cell.position, other.position]));
                }
                other = cell.bottom;
                if (other && cell.match(other)) {
                    results.push(new Move([cell.position, other.position]));
                }
            }
        }

        return results;
    }

    init(colCount: number, rng: Generator<number, void, number> = Table.staticRng()): void {
        this._values = [];
        this._colCount = colCount;

        let current = rng.next();
        while (!current.done) {
            this._values.push(current.value as number);
            current = rng.next();
        }

        let remaining = this._values.length % this.colCount;
        if (remaining === 0) {
            return;
        }

        remaining = this.colCount - remaining;
        for (let i = 0; i < remaining; ++i) {
            this._values.push(0);
        }
    }

    row(index: number): Row {
        if (index < 0 || !Number.isInteger(index) || index >= this.rowCount) {
            throw new Error(`Cannot get row: index must be a valid integer in range [0, ${this.rowCount - 1}]`)
        }

        return new Row(this, index);
    }

    cell(row: number, col: number): Cell {
        if (row < 0 || row >= this.rowCount || !Number.isInteger(row)
            || col < 0 || col >= this.colCount || !Number.isInteger(col)) {
            throw new Error(`Cannot get cell(${row}, ${col}): invalid position`);
        }

        return new Cell(this.row(row), col);
    }

    value(row: number, col: number): number {
        if (row < 0 || row >= this.rowCount || !Number.isInteger(row)
            || col < 0 || col >= this.colCount || !Number.isInteger(col)) {
            throw new Error(`Cannot get value(${row}, ${col}): invalid position`);
        }

        return this._values[row * this.colCount + col];
    }

    setValue(row: number, col: number, value: number): void {
        if (row < 0 || row >= this.rowCount || !Number.isInteger(row)
            || col < 0 || col >= this.colCount || !Number.isInteger(col)) {
            throw new Error(`Cannot set value(${row}, ${col}): invalid position`);
        }

        if (!Number.isInteger(value)) {
            throw new Error(`Cannot set value(${row}, ${col}): invalid value '${value}'`);
        }

        this._values[row * this.colCount + col] = value;
    }

    display(): string {
        let result = `[\n\t${this.row(0).toString()}`;
        for (let i = 1, imax = this.rowCount; i < imax; ++i) {
            result += `,\n\t${this.row(i).toString()}`;
        }

        return result + "\n]";
    }

    play(move: Move | string): void {
        if (typeof move === "string") {
            move = Move.fromString(move as string);
        }

        if (move.positions[0].row === move.positions[1].row
            && move.positions[0].col === move.positions[1].col) {
            throw new Error("Move must be two different cells");
        }

        let cell1 = this.cell(move.positions[0].row, move.positions[0].col);
        let cell2 = this.cell(move.positions[1].row, move.positions[1].col);

        if (cell1.isSolved) {
            throw new Error(`cell(${cell1.row.index}, ${cell1.column}) is already solved`);
        }

        if (cell2.isSolved) {
            throw new Error(`cell(${cell2.row.index}, ${cell2.column}) is already solved`);
        }

        if (!cell1.match(cell2)) {
            throw new Error(
                `cell(${cell1.row.index}, ${cell1.column}) does not match cell(${cell2.row.index}, ${cell2.column})`
            );
        }

        cell1.solve();
        cell2.solve();

        let i = 0,
            imax = this.rowCount;
        while (i < imax) {
            let row = this.row(i);
            if (row.score == 0) {
                this.removeRow(i);
                --imax;
            } else {
                ++i;
            }
        }
    }

    removeRow(index: number): void {
        if (index < 0 || index >= this.rowCount) {
            throw new Error(
                `Cannot remove row n°${index}: invalid index, index must be in range [0, ${this.rowCount - 1}]`
            );
        }

        let rowStart = index * this.colCount;
        if (index === this.rowCount - 1) {
            this._values = this._values.slice(0, rowStart);
            return;
        }

        this._values = [
            ...this._values.slice(0, rowStart),
            ...this._values.slice(rowStart + this.colCount)
        ];
    }

    append(): void {
        let end = this._values.length - 1;
        while (this.values[end] === 0) {
            --end;
            this._values.pop();
        }

        for (let i = 0; i <= end; ++i) {
            if (this._values[i] > 0) {
                this._values.push(this._values[i]);
            }
        }

        let remaining = this._values.length % this.colCount;
        if (remaining === 0) {
            return;
        }

        for (let i = 0, imax = this.colCount - remaining; i < imax; ++i) {
            this._values.push(0);
        }
    }

    toString(): string {
        return `${this._colCount} ${this._values.join(' ')}`;
    }

    static fromString(str: string): Table {
        return new Table().assign(str);
    }

    toJSON(): string {
        return JSON.stringify(this.toString());
    }

    static fromJSON(str: string): Table {
        return Table.fromString(JSON.parse(str));
    }

    assign(data: string | string[] | number[]): Table {
        if (typeof data === 'string') {
            data = data.split(' ');
        }

        const toInt = (val: string | number) => {
            let result = typeof val === 'string' ? parseInt(val) : Math.floor(val);
            if (Number.isNaN(result)) {
                throw new Error("Parse error input does not match table pattern");
            }

            return result;
        }

        this._colCount = toInt(data[0]);
        if (this._colCount < 1) {
            throw new Error("Parse error invalid number of column");
        }

        this._values = data.slice(1).map((cell: string | number) => toInt(cell));

        return this;
    }

    static *staticRng(): Generator<number, void, number> {
        yield 1;
        yield 2;
        yield 3;
        yield 4;
        yield 5;
        yield 6;
        yield 7;
        yield 8;
        yield 9;
        yield 1;
        yield 1;
        yield 1;
        yield 2;
        yield 1;
        yield 3;
        yield 1;
        yield 4;
        yield 1;
        yield 5;
        yield 1;
        yield 6;
        yield 1;
        yield 7;
        yield 1;
        yield 8;
        yield 1;
        yield 9;
    }
}

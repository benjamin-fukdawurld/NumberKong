import Cell from './Cell';
import Table from './Table';

export default class Row {
    constructor(readonly table: Table, readonly index: number) { }

    get score(): number {
        let result = 0;
        for (let i = 0; i < this.table.colCount; ++i) {
            if (this.value(i) > 0) {
                result += this.value(i);
            }
        }

        return result;
    }

    cell(index: number): Cell {
        return new Cell(this, index);
    }

    value(index: number): number {
        return this.table.value(this.index, index);
    }

    setValue(index: number, value: number): void {
        this.table.setValue(this.index, index, value);
    }

    values(): number[] {
        const start = this.table.colCount * this.index;
        return this.table.values.slice(start, start + this.table.colCount + 1);
    }

    cells(): Cell[] {
        let result: Cell[] = [];
        for (let i = 0, imax = this.table.colCount; i < imax; ++i)
            result.push(new Cell(this, i));
        return result;
    }

    toString(): string {
        let result = `[ ${this.cell(0)}`;
        for (let i = 1, imax = this.table.colCount; i < imax; ++i) {
            result += `, ${this.cell(i).toString()}`;
        }

        return result + " ]";
    }
}

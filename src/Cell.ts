import Row from './Row';
import Position from './Position';
import Table from './Table';

export default class Cell {
    readonly row: Row;
    readonly index: number;
    constructor(row: Row, index: number) {
        this.row = row;
        this.index = index;
    }

    get table(): Table {
        return this.row.table;
    }

    get value() {
        return this.row.value(this.index);
    }

    set value(value: number) {
        this.row.setValue(this.index, value);
    }

    get position(): Position {
        return new Position({
            col: this.index,
            row: this.row.index
        });
    }

    get isSolved(): boolean {
        return this.value <= 0;
    }

    get isNull(): boolean {
        return this.value === 0;
    }

    solve(): void {
        if (this.isSolved) {
            throw new Error(`cell(${this.row.index}, ${this.index}) is already solved`);
        }

        this.value *= -1;
    }

    match(other: number | Cell): boolean {
        if (this.isSolved) {
            throw new Error("cell is already solved");
        }

        if (typeof other !== "number") {
            other = other.value;
        }

        if (other <= 0) {
            throw new Error("other is not a positive number");
        }

        return this.value === other || this.value + other === 10;
    }

    toString(): string {
        if (this.value > 0) {
            return `${this.value}`;
        }

        return `${this.value === 0 ? "_" : "X"}`;
    }

    get left(): Cell | null {
        let colCount = this.table.colCount;
        let rowIndex = this.row.index;
        let colIndex = this.index - 1;
        do {
            if (colIndex < 0) {
                colIndex = colCount - 1;
                --rowIndex;
                if (rowIndex < 0) {
                    rowIndex = this.table.rowCount - 1;
                }
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }

            --colIndex;
        } while (rowIndex != this.row.index || colIndex != this.index);

        return null;
    }

    get right(): Cell | null {
        let colCount = this.table.colCount;
        let rowIndex = this.row.index;
        let colIndex = this.index + 1;
        do {
            if (colIndex >= colCount) {
                colIndex = 0;
                ++rowIndex;
                if (rowIndex >= this.table.rowCount) {
                    rowIndex = 0;
                }
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }

            ++colIndex;
        } while (rowIndex != this.row.index || colIndex != this.index);

        return null;
    }

    get top(): Cell | null {
        let rowIndex = this.row.index;
        let colIndex = this.index;
        do {
            --rowIndex;
            if (rowIndex < 0) {
                break;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }
        } while (rowIndex != this.row.index || colIndex != this.index);

        return null;
    }

    get bottom(): Cell | null {
        let rowIndex = this.row.index;
        let colIndex = this.index;
        do {
            ++rowIndex;
            if (rowIndex >= this.table.rowCount) {
                break;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }
        } while (rowIndex != this.row.index || colIndex != this.index);

        return null;
    }
}

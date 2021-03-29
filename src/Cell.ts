import Row from './Row';
import Position from './Position';
import Table from './Table';

export default class Cell {
    constructor(readonly row: Row, readonly column: number) {
        if (this.column < 0 || this.column >= this.row.colCount) {
            throw new Error(
                `Cannot create cell with column '${this.column}', column must be in range [0, ${this.row.colCount - 1}]`);
        }
    }

    get index() {
        return this.column;
    }

    get table(): Table {
        return this.row.table;
    }

    get value() {
        return this.row.value(this.column);
    }

    set value(value: number) {
        this.row.setValue(this.column, value);
    }

    get position(): Position {
        return new Position({
            col: this.column,
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
            throw new Error(`cell(${this.row.index}, ${this.column}) is already solved`);
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
        let colIndex = this.column - 1;
        while (true) {
            if (colIndex < 0) {
                colIndex = colCount - 1;
                --rowIndex;
                if (rowIndex < 0) {
                    rowIndex = this.table.rowCount - 1;
                }
            }

            if (rowIndex === this.row.index && colIndex === this.column) {
                return null;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }

            --colIndex;
        }
    }

    get right(): Cell | null {
        let colCount = this.table.colCount;
        let rowIndex = this.row.index;
        let colIndex = this.column + 1;
        while (true) {
            if (colIndex >= colCount) {
                colIndex = 0;
                ++rowIndex;
                if (rowIndex >= this.table.rowCount) {
                    rowIndex = 0;
                }
            }

            if (rowIndex === this.row.index && colIndex === this.column) {
                return null;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }

            ++colIndex;
        }
    }

    get top(): Cell | null {
        let rowIndex = this.row.index;
        let colIndex = this.column;
        while (true) {
            --rowIndex;
            if (rowIndex < 0) {
                return null;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }
        }
    }

    get bottom(): Cell | null {
        let rowIndex = this.row.index;
        let colIndex = this.column;
        while (true) {
            ++rowIndex;
            if (rowIndex >= this.table.rowCount) {
                return null;
            }

            if (this.table.value(rowIndex, colIndex) > 0) {
                return this.table.cell(rowIndex, colIndex);
            }
        }
    }
}

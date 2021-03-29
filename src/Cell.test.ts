import Cell from "./Cell";
import Table from "./Table";
import Row from "./Row";
import Position from "./Position";

test("Test Cell constructor", () => {
    let table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    let row = new Row(table, 0);
    expect(() => new Cell(row, 3)).toThrow("Cannot create cell with column '3', column must be in range [0, 2]");
    expect(new Cell(row, 0).value).toBe(1);
});

test("Test Cell getters and setters", () => {
    let table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    let row = new Row(table, 0);
    let cell = new Cell(row, 0);
    cell.value = -1;
    expect(cell.index).toBe(cell.column);
    expect(cell.value).toBe(-1);
    expect(cell.row).toBe(row);
    expect(cell.table).toBe(table);
    expect(cell.position).toEqual(new Position({ col: 0, row: 0 }));
    expect(cell.isSolved).toBeTruthy();
    cell.value = 0;
    expect(cell.isNull).toBeTruthy();
    cell.value = 1;
    expect(cell.isSolved).toBeFalsy();
});

test("Test Cell play utils", () => {
    let table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    {
        let row = new Row(table, 0);
        let cell = new Cell(row, 0);
        cell.solve();
        expect(cell.value).toBe(-1);
        expect(() => cell.solve()).toThrow("cell(0, 0) is already solved");
    }

    {
        let row = new Row(table, 0);
        let cell0 = new Cell(row, 0);
        let cell1 = new Cell(row, 1);
        let cell2 = new Cell(row, 2);
        expect(cell1.match(cell2)).toBeTruthy();
        expect(() => cell1.match(1)).toBeTruthy();
        expect(() => cell1.match(9)).toBeTruthy();
        expect(() => cell0.match(cell2)).toThrow("cell is already solved");
        expect(() => cell2.match(cell0)).toThrow("other is not a positive number");
        expect(() => cell2.match(-1)).toThrow("other is not a positive number");
    }

    {
        let row = new Row(table, 0);
        let cell = new Cell(row, 0);
        cell.value = 1;
        let other = cell.left;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(3);
        expect(other?.row.index).toBe(2);
        expect(other?.column).toBe(2);

        other?.solve();
        other = cell.left;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(3);
        expect(other?.row.index).toBe(2);
        expect(other?.column).toBe(1);

        other = new Cell(row, 1).left;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(1);
        expect(other?.row.index).toBe(0);
        expect(other?.column).toBe(0);

        other = new Cell(new Row(table, 1), 0).left;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(1);
        expect(other?.row.index).toBe(0);
        expect(other?.column).toBe(2);
        table.setValue(2, 2, 3);

        expect(new Cell(new Row(new Table(2, [1, 0]), 0), 0).left).toBeNull();
    }

    {
        let row = new Row(table, 2);
        let cell = new Cell(row, 2);
        let other = cell.right;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(1);
        expect(other?.row.index).toBe(0);
        expect(other?.column).toBe(0);

        other?.solve();
        other = cell.right;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(1);
        expect(other?.row.index).toBe(0);
        expect(other?.column).toBe(1);

        other = new Cell(row, 1).right;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(3);
        expect(other?.row.index).toBe(2);
        expect(other?.column).toBe(2);

        other = new Cell(new Row(table, 1), 2).right;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(3);
        expect(other?.row.index).toBe(2);
        expect(other?.column).toBe(0);
        table.setValue(0, 0, 1);

        expect(new Cell(new Row(new Table(2, [1, 0]), 0), 0).right).toBeNull();
    }

    {
        let row = new Row(table, 2);
        let cell = new Cell(row, 1);
        let other = cell.top;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(2);
        expect(other?.row.index).toBe(1);
        expect(other?.column).toBe(1);

        other?.solve();
        other = cell.top;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(1);
        expect(other?.row.index).toBe(0);
        expect(other?.column).toBe(1);

        table.setValue(1, 1, 2);

        expect(new Cell(new Row(new Table(2, [1, 0]), 0), 0).top).toBeNull();
    }

    {
        let row = new Row(table, 0);
        let cell = new Cell(row, 1);
        let other = cell.bottom;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(2);
        expect(other?.row.index).toBe(1);
        expect(other?.column).toBe(1);

        other?.solve();
        other = cell.bottom;
        expect(other).not.toBeNull();
        expect(other?.value).toBe(3);
        expect(other?.row.index).toBe(2);
        expect(other?.column).toBe(1);

        table.setValue(1, 1, 2);

        expect(new Cell(new Row(new Table(2, [1, 0]), 0), 0).bottom).toBeNull();
    }
});

test("Test Cell serialization", () => {
    let table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    let row = new Row(table, 0);
    let cell = new Cell(row, 0);
    expect(cell.toString()).toEqual("1");
    cell.value = 0;
    expect(cell.toString()).toEqual("_");
    cell.value = -1;
    expect(cell.toString()).toEqual("X");
});

/*
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
*/

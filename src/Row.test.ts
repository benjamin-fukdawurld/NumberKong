import Row from "./Row";
import Table from "./Table"

test("Test Row constructor", () => {
    let t = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);

    expect((() => {
        let r1 = new Row(t, 0);
        return r1.values;
    })()).toEqual([1, 1, 1]);

    expect((() => {
        let r1 = new Row(t, 3);
        return r1.values;
    })).toThrow("Cannot create row with index '3', index must be in range [0, 2]");
});

test("Test Row getters and setters", () => {
    let t = new Table(3, [1, 0, 1, 2, 2, 2, 3, 3, 3]);
    let row = new Row(t, 0);

    expect(row.score).toBe(-2);
    expect(row.colCount).toBe(3);
    expect(row.values).toEqual([1, 0, 1]);
    expect(row.cells[1].value).toBe(0);
    expect(row.cell(1).value).toBe(row.cells[1].value);
    expect(row.value(1)).toBe(row.cell(1).value);

    row.setValue(1, 1);
    expect(row.value(1)).toBe(1);
});

test("Test Row serialization", () => {
    let t = new Table(3, [1, 0, 1, 2, 2, 2, 3, 3, 3]);
    let row = new Row(t, 0);

    expect(row.toString()).toEqual("[ 1, _, 1 ]");
});

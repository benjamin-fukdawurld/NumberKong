import Cell from './Cell';
import Table from './Table';
import Row from './Row';
import Position from './Position';
import { describe, it, expect } from 'vitest';

describe('Cell', () => {
  it('constructor', () => {
    const table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const row = new Row(table, 0);
    expect(() => new Cell(row, 3)).toThrow(
      "Cannot create cell with column '3', column must be in range [0, 2]"
    );
    expect(new Cell(row, 0).value).toBe(1);
  });

  it('getters and setters', () => {
    const table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const row = new Row(table, 0);
    const cell = new Cell(row, 0);
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

  it('play utils', () => {
    const table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    {
      const row = new Row(table, 0);
      const cell = new Cell(row, 0);
      cell.solve();
      expect(cell.value).toBe(-1);
      expect(() => cell.solve()).toThrow('cell(0, 0) is already solved');
    }

    {
      const row = new Row(table, 0);
      const cell0 = new Cell(row, 0);
      const cell1 = new Cell(row, 1);
      const cell2 = new Cell(row, 2);
      expect(cell1.match(cell2)).toBeTruthy();
      expect(() => cell1.match(1)).toBeTruthy();
      expect(() => cell1.match(9)).toBeTruthy();
      expect(() => cell0.match(cell2)).toThrow('cell is already solved');
      expect(() => cell2.match(cell0)).toThrow(
        'other is not a positive number'
      );
      expect(() => cell2.match(-1)).toThrow('other is not a positive number');
    }

    {
      const row = new Row(table, 0);
      const cell = new Cell(row, 0);
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
      const row = new Row(table, 2);
      const cell = new Cell(row, 2);
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
      const row = new Row(table, 2);
      const cell = new Cell(row, 1);
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
      const row = new Row(table, 0);
      const cell = new Cell(row, 1);
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

  it('serialization', () => {
    const table = new Table(3, [1, 1, 1, 2, 2, 2, 3, 3, 3]);
    const row = new Row(table, 0);
    const cell = new Cell(row, 0);
    expect(cell.toString()).toEqual('1');
    cell.value = 0;
    expect(cell.toString()).toEqual('_');
    cell.value = -1;
    expect(cell.toString()).toEqual('X');
  });
});

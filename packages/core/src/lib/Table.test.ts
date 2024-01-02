import Move from './Move';
import Table from './Table';
import { describe, it, expect } from 'vitest';

describe('Table', () => {
  it('constructor', () => {
    let t = new Table();
    expect(t.colCount).toBe(0);
    expect(t.values).toEqual([]);
    t = new Table(9);
    expect(t.colCount).toBe(9);
    expect(t.values).toEqual([]);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    t = new Table(9, arr);
    expect(t.colCount).toBe(9);
    expect(t.values).toEqual(arr);

    expect(() => (t = new Table(-1))).toThrow(
      'Table column count must be greater or equal to 0'
    );
    expect(() => (t = new Table(8, arr))).toThrow(
      'Table values length must be a multiple of column count'
    );
  });

  it('getters and setters', () => {
    const arr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8,
      1, 9,
    ];

    const t = new Table(9, arr);
    expect(t.colCount).toBe(9);
    expect(t.rowCount).toBe(3);
    expect(t.values).toEqual(arr);
    expect(t.score).toBe(-27);

    expect(t.row(0).values).toEqual(arr.slice(0, 9));
    expect(() => t.row(-1)).toThrow(
      `Cannot get row: index must be a valid integer in range [0, 2]`
    );
    expect(() => t.row(3)).toThrow(
      `Cannot get row: index must be a valid integer in range [0, 2]`
    );
    expect(() => t.row(0.5)).toThrow(
      `Cannot get row: index must be a valid integer in range [0, 2]`
    );
    expect(t.cell(0, 0).value).toBe(1);
    expect(() => t.cell(-1, 0)).toThrow(
      'Cannot get cell(-1, 0): invalid position'
    );
    expect(() => t.cell(0, -1)).toThrow(
      'Cannot get cell(0, -1): invalid position'
    );
    expect(() => t.cell(3, 0)).toThrow(
      'Cannot get cell(3, 0): invalid position'
    );
    expect(() => t.cell(0, 9)).toThrow(
      'Cannot get cell(0, 9): invalid position'
    );
    expect(() => t.cell(0, 0.5)).toThrow(
      'Cannot get cell(0, 0.5): invalid position'
    );
    expect(() => t.cell(0.5, 0)).toThrow(
      'Cannot get cell(0.5, 0): invalid position'
    );
    expect(t.value(0, 0)).toBe(1);
    expect(() => t.value(-1, 0)).toThrow(
      'Cannot get value(-1, 0): invalid position'
    );
    expect(() => t.value(0, -1)).toThrow(
      'Cannot get value(0, -1): invalid position'
    );
    expect(() => t.value(3, 0)).toThrow(
      'Cannot get value(3, 0): invalid position'
    );
    expect(() => t.value(0, 9)).toThrow(
      'Cannot get value(0, 9): invalid position'
    );
    expect(() => t.value(0, 0.5)).toThrow(
      'Cannot get value(0, 0.5): invalid position'
    );
    expect(() => t.value(0.5, 0)).toThrow(
      'Cannot get value(0.5, 0): invalid position'
    );

    expect(
      (() => {
        t.setValue(0, 0, -123456);
        return t.value(0, 0);
      })()
    ).toBe(-123456);
    expect(() => t.setValue(-1, 0, 0)).toThrow(
      'Cannot set value(-1, 0): invalid position'
    );
    expect(() => t.setValue(0, -1, 0)).toThrow(
      'Cannot set value(0, -1): invalid position'
    );
    expect(() => t.setValue(3, 0, 0)).toThrow(
      'Cannot set value(3, 0): invalid position'
    );
    expect(() => t.setValue(0, 9, 0)).toThrow(
      'Cannot set value(0, 9): invalid position'
    );
    expect(() => t.setValue(0, 0.5, 0)).toThrow(
      'Cannot set value(0, 0.5): invalid position'
    );
    expect(() => t.setValue(0.5, 0, 0)).toThrow(
      'Cannot set value(0.5, 0): invalid position'
    );
    expect(() => t.setValue(0, 0, 0.5)).toThrow(
      "Cannot set value(0, 0): invalid value '0.5'"
    );

    expect((() => new Table(3, [0, 0, 0]).score)()).toBe(0);
  });

  it('playableMoves', () => {
    const t = new Table(5, [1, 2, 3, 4, 5, 9, 8, 7, 6, 5, 5, -1, 5, -6, 9]);
    expect(t.playableMoves.length).toBe(16);
  });

  it('init', () => {
    const t = new Table();
    t.init(
      9,
      (function* () {
        yield 1;
        yield 1;
        yield 1;
        yield 1;
        yield 1;
      })()
    );

    expect(t.values).toEqual([1, 1, 1, 1, 1, 0, 0, 0, 0]);

    t.init(
      5,
      (function* () {
        yield 1;
        yield 1;
        yield 1;
        yield 1;
        yield 1;
      })()
    );

    expect(t.values).toEqual([1, 1, 1, 1, 1]);
  });

  it('serialization', () => {
    const t = new Table(2, [1, 2, 3, 4, 5, 6]);
    expect(t.display()).toEqual(`[
	[ 1, 2 ],
	[ 3, 4 ],
	[ 5, 6 ]
]`);

    expect(t.toString()).toEqual('2 1 2 3 4 5 6');
    expect(t.toJSON()).toEqual(JSON.stringify('2 1 2 3 4 5 6'));
  });

  it('deserialization', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    let t = Table.fromString('2 1 2 3 4 5 6');
    expect(t.colCount).toEqual(2);
    expect(t.values).toEqual(arr);

    t = Table.fromJSON(JSON.stringify('2 1 2 3 4 5 6'));
    expect(t.colCount).toEqual(2);
    expect(t.values).toEqual(arr);

    expect(new Table().assign('2 1 2 3 4 5 6').values).toEqual(arr);
    expect(new Table().assign([2, ...arr]).values).toEqual(arr);
    expect(
      new Table().assign(['2', '1', '2', '3', '4', '5', '6']).values
    ).toEqual(arr);

    expect(() =>
      new Table().assign(['2', '1', 'NaN', '3', '4', '5', '6'])
    ).toThrow('Parse error input does not match table pattern');
    expect(() =>
      new Table().assign(['-1', '1', '2', '3', '4', '5', '6'])
    ).toThrow('Parse error invalid number of column');
  });

  it('play', () => {
    const t = new Table(3, [1, 2, 3, 1, 3, 3]);
    expect(() => {
      t.play('r0c0 r0c0');
    }).toThrow('Move must be two different cells');

    expect(
      (() => {
        t.play('r0c0 r1c0');
        return t.cell(0, 0).isSolved;
      })()
    ).toBeTruthy();

    expect(() => {
      t.play('r0c0 r1c0');
    }).toThrow('cell(0, 0) is already solved');

    expect(() => {
      t.play('r1c1 r1c0');
    }).toThrow('cell(1, 0) is already solved');

    expect(
      (() => {
        t.play(new Move('r1c1 r1c2'));
        return t.rowCount;
      })()
    ).toBe(1);

    expect(() => {
      t.play('r0c1 r0c2');
    }).toThrow('cell(0, 1) does not match cell(0, 2)');
  });

  it('insertion and removal', () => {
    expect(
      (() => {
        const t = new Table(3, [1, 2, 3, 1, 3, 3]);
        t.removeRow(0);
        return t.rowCount;
      })()
    ).toBe(1);

    expect(() => {
      const t = new Table(3, [1, 2, 3, 1, 3, 3]);
      t.removeRow(2);
      return t.rowCount;
    }).toThrow(
      'Cannot remove row n°2: invalid index, index must be in range [0, 1]'
    );

    const arr = [1, 2, 3, 1, 3, 3];
    expect(
      (() => {
        const t = new Table(3, [...arr]);
        t.append();
        return t.values;
      })()
    ).toEqual([...arr, ...arr]);

    expect(
      (() => {
        const t = new Table(
          3,
          arr.map((i) => (i === 2 ? -2 : i))
        );
        t.append();
        return t.values;
      })()
    ).toEqual([1, -2, 3, 1, 3, 3, 1, 3, 1, 3, 3, 0]);

    expect(
      (() => {
        const t = new Table(3, [1, 2, 3, 4, 5, 0]);
        t.append();
        return t.values;
      })()
    ).toEqual([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 0, 0]);
  });

  it('Test static generator', () => {
    const arr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 1, 8,
      1, 9,
    ];
    const gen = Table.staticRng();
    arr.forEach((value) => {
      expect(gen.next().value).toBe(value);
    });

    expect(gen.next().done).toBeTruthy();
  });
});

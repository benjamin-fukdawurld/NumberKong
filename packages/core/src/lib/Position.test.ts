import Position from './Position';
import { describe, it, expect } from 'vitest';

describe('Position', () => {
  it('constructor', () => {
    let p = new Position();
    expect(p.row).toEqual(0);
    expect(p.col).toEqual(0);

    const row = 11;
    const col = 25;
    p = new Position({ row: 11, col: 25 });
    expect(p.row).toEqual(row);
    expect(p.col).toEqual(col);
    expect(() => new Position({ row: -1, col: 0 })).toThrow(
      "Position's row must be greater or equal to 0"
    );
    expect(() => new Position({ row: 0, col: -1 })).toThrow(
      "Position's col must be greater or equal to 0"
    );
    p = new Position(`r${row}c${col}`);
    expect(p.row).toEqual(row);
    expect(p.col).toEqual(col);
  });

  it('setters', () => {
    const p = new Position();
    expect(() => {
      p.row = -1;
    }).toThrow("Position's row must be greater or equal to 0");
    expect(() => {
      p.col = -1;
    }).toThrow("Position's col must be greater or equal to 0");
    p.row = 1234;
    p.col = 5678;
    expect(p.row).toBe(1234);
    expect(p.col).toBe(5678);
  });

  it('serialization', () => {
    const expectedString = 'r12c11';
    const row = 12;
    const col = 11;
    expect(new Position({ row, col }).toString()).toEqual(expectedString);
    expect(new Position(expectedString).toString()).toEqual(expectedString);
    expect(new Position({ row, col }).toJSON()).toEqual(
      JSON.stringify(expectedString)
    );
    expect(new Position(expectedString).toJSON()).toEqual(
      JSON.stringify(expectedString)
    );
  });

  it('deserialization', () => {
    const expectedString = 'r12c11';
    const row = 12;
    const col = 11;
    let p = Position.fromString(expectedString);
    expect(p.row).toEqual(row);
    expect(p.col).toEqual(col);
    p = Position.fromJSON(JSON.stringify(expectedString));
    expect(p.row).toEqual(row);
    expect(p.col).toEqual(col);
    p = new Position();
    p.assign(expectedString);
    expect(p.row).toEqual(row);
    expect(p.col).toEqual(col);
  });

  it('assign', () => {
    const p = new Position();

    p.assign({ row: 1, col: 1 });
    expect(p.row).toEqual(1);
    expect(p.col).toEqual(1);
    p.assign('r2c2'.split(''));
    expect(p.row).toEqual(2);
    expect(p.col).toEqual(2);
    p.assign('r3c3');
    expect(p.row).toEqual(3);
    expect(p.col).toEqual(3);
    expect(() => p.assign('this string does not match the pattern')).toThrow(
      'Parse error: input does not match position pattern'
    );
  });
});

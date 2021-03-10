import Position from './Position';
import Move from './Move';

test('test Move constructor', () => {
    let m = new Move();
    expect(m.positions[0].row).toBe(0);
    expect(m.positions[0].col).toBe(0);
    expect(m.positions[1].row).toBe(0);
    expect(m.positions[1].col).toBe(0);
    m = new Move([new Position('r1c2'), new Position('r3c4')]);
    expect(m.positions[0].row).toBe(1);
    expect(m.positions[0].col).toBe(2);
    expect(m.positions[1].row).toBe(3);
    expect(m.positions[1].col).toBe(4);
    m = new Move('r5c6 r7c8');
    expect(m.positions[0].row).toBe(5);
    expect(m.positions[0].col).toBe(6);
    expect(m.positions[1].row).toBe(7);
    expect(m.positions[1].col).toBe(8);
});

test('test Move serialization', () => {
    expect(new Move("r12c13 r21c22").toString()).toEqual("r12c13 r21c22");
    expect(new Move("r12c13 r21c22").toJSON()).toEqual(JSON.stringify("r12c13 r21c22"));
});

test('test Move serialization', () => {
    expect(Move.fromString("r12c13 r21c22").toString()).toEqual("r12c13 r21c22");
    expect(Move.fromJSON(JSON.stringify("r12c13 r21c22")).toString()).toEqual("r12c13 r21c22");
})

test('test Move assign', () => {
    expect(new Move().assign("r12c13 r21c22").toString()).toEqual("r12c13 r21c22");
    expect(new Move().assign(["r12c13", "r21c22"]).toString()).toEqual("r12c13 r21c22");
    expect(new Move().assign(["r12c13".split(''), "r21c22".split('')]).toString()).toEqual("r12c13 r21c22");
});

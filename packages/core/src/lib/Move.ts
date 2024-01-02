import Position from './Position';

export default class Move {
  public positions: [Position, Position];
  constructor(
    positions: [Position, Position] | string = [new Position(), new Position()]
  ) {
    if (typeof positions === 'string') {
      this.positions = [new Position(), new Position()];
      this.assign(positions);
    } else {
      this.positions = positions;
    }
  }

  toString(): string {
    return `${this.positions[0].toString()} ${this.positions[1].toString()}`;
  }

  static fromString(str: string): Move {
    return new Move().assign(str);
  }

  toJSON(): string {
    return JSON.stringify(this.toString());
  }

  static fromJSON(str: string): Move {
    return new Move().assign(JSON.parse(str));
  }

  assign(data: string | [string, string] | [string[], string[]]): this {
    if (typeof data === 'string') {
      data = data.split(' ') as [string, string];
    }

    this.positions[0].assign(data[0]);
    this.positions[1].assign(data[1]);

    return this;
  }
}

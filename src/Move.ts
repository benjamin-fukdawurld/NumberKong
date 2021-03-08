import Position from './Position';

export default class Move {
    constructor(public positions: [Position, Position] =
        [new Position(), new Position()]) { }

    toString(): string {
        return `${this.positions[0].toString()} ${this.positions[1].toString()}`;
    }

    static fromString(str: string): Move {
        return new Move().assign(str);
    }

    toJSON(): string {
        return this.toString();
    }

    static fromJSON(str: string): Move {
        return new Move().assign(JSON.parse(str));
    }

    assign(data: string | [string, string] | string[][]): Move {
        if (typeof data === 'string') {
            data = data.split(' ') as [string, string];
        }

        this.positions[0].assign(data[0]);
        this.positions[1].assign(data[1]);

        return this;
    }
}

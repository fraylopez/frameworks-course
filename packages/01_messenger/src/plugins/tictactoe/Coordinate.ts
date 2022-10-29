export class Coordinate {
  public i: number;
  public j: number;
  constructor(i: string, j: string) {
    this.i = parseInt(i);
    this.j = parseInt(j);
  }

  static fromPrimitives(data: any): Coordinate {
    return new Coordinate(data.i, data.j);
  }

  toPrimitives() {
    return {
      i: this.i,
      j: this.j,
    };
  }
}

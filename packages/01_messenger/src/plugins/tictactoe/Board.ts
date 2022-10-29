import { Coordinate } from "./Coordinate";

export class Board {
  private pieces: string[][];
  constructor() {
    this.pieces = [[], [], []];
  }
  move(coord: Coordinate): void {
    this.pieces[coord.i][coord.j] = `X`;
  }
  render(): string {
    let board = "";
    for (let i = 0; i < 3; i++) {
      let row = "";
      for (let j = 0; j < 3; j++) {
        row += this.renderCell(j, this.pieces[i][j]);
      }
      board += row + "\n";
    }
    return board;
  }

  private renderCell(j: number, data?: string): string {
    if (j === 0) {
      return `| ${data || " "} |`;
    }
    else {
      return ` ${data || " "} |`;
    }
  }
}

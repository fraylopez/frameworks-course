import { Plugin } from "../core/Plugin";
import { Sender } from "../core/Sender";
import prompt from "prompt";

export default class TicTacToe implements Plugin {
  readonly name = "TicTacToe";
  private sender!: Sender;
  private board!: Board;

  constructor() {
    this.board = new Board();
  }

  setup(sender: Sender): void {
    this.sender = sender;
  }

  sendMessage(move: Coordinate): void {
    this.sender.send(move.serialize());
  }

  launch(): void {
    console.log('Image app launched!');
    console.log(`${this.board.render()}`);
    this.gameLoop();
  }

  onData(data: string): void {
    this.board.move(Coordinate.deserialize(data));
    console.log(`${this.board.render()}`);
  };


  private gameLoop(): void {
    console.log("Your move(01,20,...):");
    prompt.start();
    prompt.get(["move"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.move(
        new Coordinate(
          result.move.toString().charAt(0),
          result.move.toString().charAt(1)
        )
      );
      this.gameLoop();
    });
  }

  private move(move: Coordinate): void {
    this.sendMessage(move);
  }

}

class Coordinate {
  public i: number;
  public j: number;
  constructor(i: string, j: string) {
    this.i = parseInt(i);
    this.j = parseInt(j);
  }

  static deserialize(data: string): Coordinate {
    return new Coordinate(data.charAt(0), data.charAt(1));
  }

  serialize(): string {
    return `${this.i}${this.j}`;
  }
}

class Board {
  private pieces: string[][];
  constructor() {
    this.pieces = [[], [], []];
  }
  move(coord: Coordinate): void {
    this.pieces[coord.i][coord.j] = `X`;
  }
  render(): void {
    for (let i = 0; i < 3; i++) {
      let row = "";
      for (let j = 0; j < 3; j++) {
        row += this.renderCell(i, j, this.pieces[i][j]);
      }
      console.log(row);
    }
  }

  private renderCell(i: number, j: number, data?: string): string {
    if (j === 0) {
      return `| ${data || " "} |`;
    }
    else {
      return ` ${data || " "} |`;
    }
  }
}
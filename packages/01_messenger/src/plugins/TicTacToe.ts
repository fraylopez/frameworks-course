import { Plugin } from "../core/models/Plugin";
import prompt from "prompt";
import { Coordinate } from "./tictactoe/Coordinate";
import { Board } from "./tictactoe/Board";
import { MessageController } from "../core/controllers/MessageController";

export default class TicTacToe implements Plugin {
  readonly name = "TicTacToe";
  private messenger!: MessageController;
  private board!: Board;
  private uid: string;
  constructor() {
    this.board = new Board();
    this.uid = Math.random().toString(36).substring(7);
  }
  get id(): string {
    return this.uid;
  }
  setup(messenger: MessageController): void {
    this.messenger = messenger;
    this.messenger.createRoom(this.name, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      this.messenger.subscribeToMessages(this.name, this, (err) => {
        if (err) {
          console.log(err);
          return;
        }
      });
    });
  };

  sendMessage(move: Coordinate): void {
    this.messenger.sendMessage(this.name, move.toPrimitives());
  };

  launch(): void {
    console.log('-- Welcome to TicTacToe --');
    console.log(`${this.board.render()}`);
    this.gameLoop();
  };

  consume(data: object): void {
    const coordinate = Coordinate.fromPrimitives(data);
    const isMyMove = this.board.isOccupied(coordinate, "X");
    if (!isMyMove) {
      this.board.move(Coordinate.fromPrimitives(data), "O");
      this.gameLoop();
    }
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
    });
  }

  private move(move: Coordinate): void {
    this.board.move(move, "X");
    this.sendMessage(move);
  }

}


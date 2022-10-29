import { Plugin } from "../core/models/Plugin";
import prompt from "prompt";
import { Coordinate } from "./tictactoe/Coordinate";
import { Board } from "./tictactoe/Board";
import { MessageController } from "../core/controllers/MessageController";

export default class TicTacToe implements Plugin {
  readonly name = "TicTacToe";
  private messenger!: MessageController;
  private board!: Board;

  constructor() {
    this.board = new Board();
  }
  get id(): string {
    return this.name;
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
    this.board.move(Coordinate.fromPrimitives(data));
    console.log(`${this.board.render()}`);
  };

  private gameLoop(): void {
    console.log("Your move(01,20,...):");
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


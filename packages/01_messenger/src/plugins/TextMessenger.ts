import { Plugin } from "../core/models/Plugin";
import prompt, { message } from "prompt";
import { TextMessage } from "./text-messenger/TextMessage";
import { PubSub } from "../core/services/PubSub";
import { MessageController } from "../core/controllers/MessageController";

export default class TextMessenger implements Plugin {
  readonly name = "TextMessenger";
  private messenger!: MessageController;
  private room!: string;
  private username!: string;

  get id(): string {
    return this.username;
  }

  setup(messenger: MessageController): void {
    this.messenger = messenger;
  }

  launch() {
    console.log('-- Welcome to TextMessenger --');
    this.joinRoom(() => {
      this.setName(() => {
        this.messenger.subscribeToMessages(
          this.room,
          this,
          (err) => {
            if (err) {
              console.log(err);
              return;
            }
            this.messageLoop();
          });
      });
    });
  }

  consume(data: object): void {
    const message = TextMessage.fromPrimitives(data);
    if (message.from !== this.username) {
      console.log(`${message.format()}`);
    }
  };

  private sendMessage(message: TextMessage): void {
    void this.messenger.sendMessage(this.room, message.toPrimitives());
  }

  private joinRoom(callback: () => void): void {
    console.log("Create or join a room:");
    prompt.start();
    prompt.get(["room"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.room = result.room.toString();
      console.log(`Joined to: ${this.room}`);
      callback();
    });
  }

  private setName(callback: () => void): void {
    console.log("Write your name:");
    prompt.start();
    prompt.get(["name"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.username = result.name.toString();
      console.log(`Registered as: ${this.username}`);
      callback();
    });
  }

  private messageLoop(): void {
    prompt.get(["message"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.sendMessage(new TextMessage(this.username, result.message.toString()));
      this.messageLoop();
    });
  }
}


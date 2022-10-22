import { Plugin } from "../core/Plugin";
import { Sender } from "../core/Sender";
import prompt from "prompt";

export default class TextMessenger implements Plugin {
  readonly name = "TextMessenger";
  private sender!: Sender;
  private username!: string;
  setup(sender: Sender): void {
    this.sender = sender;
  }

  launch(): void {
    console.log('-- Welcome to TextMessenger --');
    this.setName(this.messageLoop.bind(this));
  }

  onData(data: string): void {
    console.log(`${Message.deserialize(data).format()}`);
  };

  private sendMessage(message: Message): void {
    this.sender.send(message.serialize());
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
    console.log("Write your message:");
    prompt.start();
    prompt.get(["message"], (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      this.sendMessage(new Message(this.username, result.message.toString()));
      this.messageLoop();
    });
  }
}

class Message {
  constructor(
    public from: string,
    public text: string,
  ) { }

  static deserialize(data: string): Message {
    const message = JSON.parse(data) as Message;
    return new Message(message.from, message.text);
  }

  serialize(): string {
    return JSON.stringify(this);
  }

  format(): string {
    return `          Message from ${this.from}: ${this.text}`;
  }
}
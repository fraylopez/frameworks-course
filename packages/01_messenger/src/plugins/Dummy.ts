import { MessageController } from "../core/controllers/MessageController";
import { Plugin } from "../core/models/Plugin";
import { Consumer } from "../core/services/Consumer";

export default class Dummy implements Plugin, Consumer {
  readonly name = "Dummy";
  get id(): string {
    return this.name;
  }

  setup(_messenger: MessageController): void { /*  */ }

  launch(): void {
    console.log('-- Welcome to DummyApp --');
    console.log("This is a dummy app that does nothing.");
    setInterval(() => { }, 1000);
  }

  consume(_data: object): void {/*  */ };
};

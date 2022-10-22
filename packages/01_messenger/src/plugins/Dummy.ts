import { Plugin } from "../core/Plugin";
import { Sender } from "../core/Sender";
import prompt from "prompt";

export default class Dummy implements Plugin {
  readonly name = "Dummy";

  setup(_sender: Sender): void {
    //TODO: implement
  }

  launch(): void {
    console.log('-- Welcome to DummyApp --');
    console.log("This is a dummy app that does nothing.");
    setInterval(() => { }, 1000);
  }

  onData(_data: string): void {
    //TODO: implement
  };
};

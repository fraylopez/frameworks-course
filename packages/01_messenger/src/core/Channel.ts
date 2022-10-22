import { Plugin } from "./Plugin";
import { Sender } from "./Sender";
import { randomUUID } from "crypto";

export class Channel implements Sender {
  readonly id: string;
  constructor(private plugin: Plugin) {
    this.id = randomUUID();
  }

  send(data: string): void {
    this.onMessage(data);
  }

  onMessage(data: string): void {
    this.plugin.onData(data);
  }
}

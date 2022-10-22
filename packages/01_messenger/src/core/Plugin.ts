import { Sender } from "./Sender";

export interface Plugin {
  name: string;
  setup(sender: Sender): void;
  launch(): void;
  onData(data: string): void;
}

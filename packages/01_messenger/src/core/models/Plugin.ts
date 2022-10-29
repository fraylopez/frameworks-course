import { MessageController } from "../controllers/MessageController";

export interface Plugin {
  name: string;
  setup(sender: MessageController): void;
  launch(): void;
}

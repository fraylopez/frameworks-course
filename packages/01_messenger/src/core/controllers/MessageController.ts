import { Consumer } from "../services/Consumer";
import { PubSub } from "../services/PubSub";


export class MessageController {
  constructor(private readonly pubsub: PubSub) { }

  createRoom(roomName: string, callback: (err?: Error) => void): void {
    this.
      pubsub.createTopic(roomName)
      .then(() => callback)
      .catch(() => callback(new Error("Room creation failed")));
  }
  sendMessage(room: string, message: object, callback?: (err?: Error) => void): void {
    this.pubsub.publish(room, message)
      .then(() => callback?.call(null))
      .catch(() => callback?.call(null, new Error("Message not sent")));
  }
  subscribeToMessages(room: string, consumer: Consumer, callback: (err?: Error) => void): void {
    this.pubsub.subscribe(room, consumer)
      .then(() => callback())
      .catch(() => callback(new Error("Subscription failed")));
  }
}
import { Consumer } from "./Consumer";

export interface PubSub {
  connect(): Promise<void>;
  createTopic(topic: string): Promise<void>;
  publish(channel: string, data: object): Promise<void>;
  subscribe(channel: string, consumer: Consumer): Promise<void>;
}


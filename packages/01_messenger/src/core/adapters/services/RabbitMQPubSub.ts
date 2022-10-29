import { AMQPChannel, AMQPClient, AMQPMessage } from "@cloudamqp/amqp-client";
import { Consumer } from "../../services/Consumer";
import { PubSub } from "../../services/PubSub";

export class RabbitMQPubSub implements PubSub {
  private client: AMQPClient;
  private channel!: AMQPChannel;
  constructor(url: string) {
    this.client = new AMQPClient(url);
  }

  async connect(): Promise<void> {
    const connection = await this.client.connect();
    this.channel = await connection.channel();
  }

  async createTopic(topic: string): Promise<void> {
    await this.assertExchange(topic);
  }

  async subscribe(topic: string, consumer: Consumer): Promise<void> {
    await this.createTopic(topic);
    const queueName = `${topic}.${consumer.id}`;
    const queue = await this.assertQueue(queueName);
    await queue.subscribe({}, (data: AMQPMessage) => {
      const stringifiedBody = data.bodyToString();
      if (stringifiedBody) {
        consumer.consume.call(consumer, JSON.parse(stringifiedBody));
      }
    });
    await this.channel.queueBind(queueName, topic, "");
  }

  async publish(topic: string, data: object): Promise<void> {
    await this.createTopic(topic);
    await this.channel.basicPublish(topic, "", JSON.stringify(data));
  }

  private async assertExchange(topic: string): Promise<void> {
    await this.channel.exchangeDeclare(topic, "fanout");
  }

  private assertQueue(queueName: string) {
    return this.channel.queue(queueName);
  }
}

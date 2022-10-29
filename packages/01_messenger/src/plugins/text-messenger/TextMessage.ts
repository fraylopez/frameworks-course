export class TextMessage {
  constructor(
    public from: string,
    public text: string
  ) { }

  static fromPrimitives(message: any): TextMessage {
    return new TextMessage(message.from, message.text);
  }

  toPrimitives() {
    return {
      from: this.from,
      text: this.text,
    };
  }

  format(): string {
    return `          ${this.from}: ${this.text}`;
  }
}

export default class ErrorHandler extends Error {
  statusCode: number;
  messages: string | string[];
  infos: any;

  constructor(statusCode: number, messages: string | string[], infos?: any) {
    super();
    this.statusCode = statusCode;
    this.infos = infos;
    this.messages = this.buildMessages(messages);
  }

  private buildMessages(messages: string | string[]) {
    if (typeof messages === 'string') {
      return messages;
    }
    return Array.from(messages);
  }
}

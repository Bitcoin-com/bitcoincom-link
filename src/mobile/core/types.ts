
export interface Message {
  messageId: string;
  command: string;
  data?: any;
  websiteMetadata: any;
}

export interface IncomingMessage extends Message {
  error?: Error;
}

export interface Error {
  type: string;
  description: string;
  data: any;
}

export interface SendMessageArgs {
  command: string;
  data?: any;
  timeout?: number;
}

export type SendMessage = (args: SendMessageArgs) => Promise<any>;

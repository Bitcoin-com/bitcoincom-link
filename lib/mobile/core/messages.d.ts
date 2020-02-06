import { IncomingMessage, SendMessageArgs } from './types';
export declare function receiveMessage(message: IncomingMessage): void;
export declare function sendMessage({ command, data, timeout, }: SendMessageArgs): Promise<any>;
export declare function hasMobileProvider(): boolean;
//# sourceMappingURL=messages.d.ts.map
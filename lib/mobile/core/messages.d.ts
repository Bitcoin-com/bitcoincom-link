import { IncomingMessage, SendMessageArgs } from './types';
export declare function receiveMessage(message: IncomingMessage): void;
export declare function sendMessage({ command, data, timeout, }: SendMessageArgs): Promise<any>;
export declare function hasMobileProvider(): boolean;
export declare function hasAndroidProvider(): boolean;
export declare function hasIosProvider(): boolean;
//# sourceMappingURL=messages.d.ts.map
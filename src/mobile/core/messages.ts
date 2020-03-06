declare const window: any;
declare const global: any;
declare const _bitcoinWalletApi: any;
import { Message, IncomingMessage, SendMessageArgs } from './types';
import { NO_PROVIDER, REQUEST_TIMEOUT } from '../../constants';
import { getWebsiteMetadata } from '../../utils';

const messageQueue = {};

const isBrowser = typeof window !== 'undefined';
const safeWindow = isBrowser ? window : global;

safeWindow._bitcoinWalletApi = safeWindow._bitcoinWalletApi ? safeWindow._bitcoinWalletApi : {};
_bitcoinWalletApi.receiveMessage = receiveMessage;

export function receiveMessage(message: IncomingMessage) {
  try {
    if (typeof message === 'string') {
      message = JSON.parse(message);
    }
    const {
      messageId,
      data,
      error,
    } = message;

    const messageResolver = messageQueue[messageId];
    if (messageResolver) {
      const { resolve, timeout, reject } = messageResolver;
      timeout && clearTimeout(timeout);
      error ? reject(error) : resolve(data);
    }
  } catch (err) {}
}

// Packages a message and sends it to detected wallet provider
// Stores resolver reference by id, awaiting response from provider
export function sendMessage({
  command,
  data,
  timeout,
}: SendMessageArgs): Promise<any> {

  // generate arbitrary message id to facilitate callback on message from wallet provider
  const messageId = command + (Date.now() + Math.random()).toString();
  const message: Message = {
    messageId,
    command,
    data,
    websiteMetadata: getWebsiteMetadata(),
  };

  return new Promise((resolve, reject) => {

    // android
    const messageHandler = isBrowser && window?._bitcoinWalletApi?.messageHandler;

    // ios
    const webkitPostMessage = isBrowser && window?.webkit?.messageHandlers?.sendMessageHandler?.postMessage;
    const isIOS = Boolean(webkitPostMessage) && typeof webkitPostMessage === 'function';

    if (messageHandler) {
      try {
        window._bitcoinWalletApi.messageHandler(JSON.stringify(message));
      } catch (err) {
        console.log('android error', err);
        reject(NO_PROVIDER);
      }
    } else if (isIOS) {
      try {
        window.webkit.messageHandlers.sendMessageHandler.postMessage(message);
      } catch (err) {
        console.log('ios error', err);
        reject(NO_PROVIDER);
      }
    }

    // message was sent to provider
    // store resolver to wait response
    if (messageHandler || webkitPostMessage) {
      messageQueue[messageId] = {
        resolve,
        reject,
        timeout: timeout && setTimeout(() => {
          delete messageQueue[messageId];
          reject(REQUEST_TIMEOUT);
        }, timeout),
      };
    }
  });
}

export function hasMobileProvider(): boolean {
    return Boolean(hasAndroidProvider() || hasIosProvider());
}

export function hasAndroidProvider(): boolean {
  return Boolean(isBrowser && window?._bitcoinWalletApi?.messageHandler);
}

export function hasIosProvider(): boolean {
  const webkitPostMessage = isBrowser && window?.webkit?.messageHandlers?.sendMessageHandler?.postMessage;
  return Boolean(webkitPostMessage) && typeof webkitPostMessage === 'function';
}

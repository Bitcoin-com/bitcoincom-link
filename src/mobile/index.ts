import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import getInfo from './methods/getInfo';
import requestValue from './methods/requestValue';
import requestWeb3Sign from './methods/requestWeb3Sign';

export { hasMobileProvider, hasAndroidProvider, hasIosProvider } from './core/messages';

export const mobileMethods = {
  getAddress,
  sendAssets,
  payInvoice,
  getInfo,
  requestValue,
  requestWeb3Sign,
};

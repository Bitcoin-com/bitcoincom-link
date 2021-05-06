import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import createToken from './methods/createToken';
import getInfo from './methods/getInfo';
import requestValue from './methods/requestValue';

export { hasMobileProvider, hasAndroidProvider, hasIosProvider } from './core/messages';

export const mobileMethods = {
  getAddress,
  sendAssets,
  payInvoice,
  createToken,
  getInfo,
  requestValue,
};

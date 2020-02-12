import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import createToken from './methods/createToken';
export {
  hasMobileProvider,
  hasAndroidProvider,
  hasIosProvider,
} from './core/messages';

export const mobileMethods = {
  getAddress,
  sendAssets,
  payInvoice,
  createToken,
};

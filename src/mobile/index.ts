export { 
  hasMobileProvider,
  hasAndroidProvider,
  hasIosProvider,
} from './core/messages';
import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import createToken from './methods/createToken';

export const mobileMethods = {
  getAddress,
  sendAssets,
  payInvoice,
  createToken,
};

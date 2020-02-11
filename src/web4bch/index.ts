declare let web4bch: any;
declare const Web4Bch: any;
import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import createToken from './methods/createToken';
import { WalletProviderStatus } from '../constants';

function isBadgerLoggedIn() {
  if (typeof web4bch === 'undefined') {
    return false;
  }

  web4bch = new Web4Bch(web4bch.currentProvider);
  return Boolean(web4bch.bch.defaultAccount);
}

export function getBadgerStatus() {
  if (typeof web4bch === 'undefined') {
    return WalletProviderStatus.NOT_AVAILABLE;
  }
  return isBadgerLoggedIn() ? WalletProviderStatus.LOGGED_IN : WalletProviderStatus.AVAILABLE;
}

export default {
  getAddress,
  sendAssets,
  payInvoice,
  createToken,
};

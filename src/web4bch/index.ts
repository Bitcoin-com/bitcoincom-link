declare let web4bch: any;
declare const Web4Bch: any;
import getAddress from './methods/getAddress';
import sendAssets from './methods/sendAssets';
import payInvoice from './methods/payInvoice';
import createToken from './methods/createToken';
import { ProviderStatus } from '../constants';

function isBadgerLoggedIn() {
  if (typeof web4bch === 'undefined') {
    return false;
  }

  web4bch = new Web4Bch(web4bch.currentProvider);
  return Boolean(web4bch.bch.defaultAddress);
}

export function getBadgerStatus() {
  if (typeof web4bch === 'undefined') {
    return ProviderStatus.NOT_AVAILABLE;
  }
  return isBadgerLoggedIn() ? ProviderStatus.LOGGED_IN : ProviderStatus.AVAILABLE;
}

export default {
  getAddress,
  sendAssets,
  payInvoice,
  createToken,
};

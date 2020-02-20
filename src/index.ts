declare const web4bch: any;
import web4bchMethods, { getBadgerStatus, hasWeb4BchProvider } from './web4bch';
import { METHOD, WalletProviderStatus } from './constants';
import {
  hasMobileProvider,
  mobileMethods,
  hasAndroidProvider,
  hasIosProvider,
} from './mobile';

function checkProvider(methodName: METHOD) {
  return args => {
    if (hasWeb4BchProvider()) {
      return web4bchMethods[methodName](args);
    }

    if (hasMobileProvider()) {
      return mobileMethods[methodName](args);
    }

    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  };
}

function getWalletProviderStatus() {
  return {
    badger: getBadgerStatus(),
    android: hasAndroidProvider() ? WalletProviderStatus.AVAILABLE : WalletProviderStatus.NOT_AVAILABLE,
    ios: hasIosProvider() ? WalletProviderStatus.AVAILABLE : WalletProviderStatus.NOT_AVAILABLE,
  };
}

const coreMethods = Object.keys(METHOD)
.filter(key => typeof key !== 'number')
.reduce((accum, key: METHOD) => {
  accum[key] = checkProvider(key);
  return accum;
}, {});

export default {
  ...coreMethods,
  getWalletProviderStatus,
  constants: {
    WalletProviderStatus,
  },
};

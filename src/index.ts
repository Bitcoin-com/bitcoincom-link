import { METHOD, WalletProviderStatus } from './constants';
import {
  hasMobileProvider,
  mobileMethods,
  hasAndroidProvider,
  hasIosProvider,
} from './mobile';

function checkProvider(methodName: METHOD) {
  return args => {
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

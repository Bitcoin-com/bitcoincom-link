declare const web4bch: any;
import web4bchMethods, { getBadgerStatus } from './web4bch';
import { METHOD, ProviderStatus } from './constants';
import {
  hasMobileProvider,
  mobileMethods,
  hasAndroidProvider,
  hasIosProvider,
} from './mobile';

function checkProvider(methodName: METHOD) {
  return args => {
    if (web4bch !== undefined) {
      return web4bchMethods[methodName](args);
    }

    if (hasMobileProvider()) {
      mobileMethods[methodName](args);
    }

    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  };
}

function getProviderStatus() {
  return {
    badger: getBadgerStatus(),
    android: hasAndroidProvider() ? ProviderStatus.AVAILABLE : ProviderStatus.NOT_AVAILABLE,
    ios: hasIosProvider() ? ProviderStatus.AVAILABLE : ProviderStatus.NOT_AVAILABLE,
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
  getProviderStatus,
};

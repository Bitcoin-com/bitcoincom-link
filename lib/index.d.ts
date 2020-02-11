import { WalletProviderStatus } from './constants';
declare function getWalletProviderStatus(): {
    badger: WalletProviderStatus;
    android: WalletProviderStatus;
    ios: WalletProviderStatus;
};
declare const _default: {
    getWalletProviderStatus: typeof getWalletProviderStatus;
    constants: {
        WalletProviderStatus: typeof WalletProviderStatus;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
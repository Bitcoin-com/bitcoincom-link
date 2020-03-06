/// <reference types="node" />
import BigNumber from 'bignumber.js';
export declare function fromFixed(number: string, decimals: number): number;
interface ConfigBuildGenesisOpReturn {
    ticker: string | null;
    name: string | null;
    documentUri: string | null;
    hash: Buffer | null;
    decimals: number;
    batonVout: number | null;
    initialQuantity: BigNumber;
}
export declare function buildGenesisOpReturn(config: ConfigBuildGenesisOpReturn, type?: number): Buffer;
export declare function isSlpAddress(address: string): boolean;
export declare function getWebsiteMetadata(): any;
export {};
//# sourceMappingURL=utils.d.ts.map
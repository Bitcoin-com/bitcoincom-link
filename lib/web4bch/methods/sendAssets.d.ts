declare enum PROTOCOL {
    BCH = "BCH",
    SLP = "SLP",
    BTC = "BTC"
}
interface SendAssetsInput {
    to: string;
    protocol: PROTOCOL;
    assetId?: string;
    value: string;
}
interface SendAssetsOutput {
    txid: string;
}
export default function sendAssets({ to, protocol, value, assetId, }: SendAssetsInput): Promise<SendAssetsOutput>;
export {};
//# sourceMappingURL=sendAssets.d.ts.map
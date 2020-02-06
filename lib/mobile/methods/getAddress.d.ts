declare enum PROTOCOL {
    BCH = "BCH",
    SLP = "SLP",
    BTC = "BTC"
}
interface GetAccountInput {
    protocol: PROTOCOL;
}
interface GetAccountOutput {
    address: string;
    label?: string;
}
export default function getAddress(data: GetAccountInput): Promise<GetAccountOutput>;
export {};
//# sourceMappingURL=getAddress.d.ts.map
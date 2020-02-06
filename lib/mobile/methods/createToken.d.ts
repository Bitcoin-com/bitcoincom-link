interface CreateTokenInput {
    name: string;
    symbol: string;
    decimals: number;
    initialSupply: number;
    tokenReceiverAddress: string;
    batonReceiverAddress?: string;
    documentUri?: string;
    documentHash?: string;
}
interface CreateTokenOutput {
    tokenId: string;
}
export default function createToken(data: CreateTokenInput): Promise<CreateTokenOutput>;
export {};
//# sourceMappingURL=createToken.d.ts.map
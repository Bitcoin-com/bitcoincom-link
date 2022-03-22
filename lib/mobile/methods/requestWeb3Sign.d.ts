interface RequestWeb3SignInput {
    address: string;
    message: string;
    signType: 'eth_sendTransaction' | 'eth_signTransaction' | 'eth_signTypedData' | 'eth_sign' | 'personal_sign';
}
interface RequestWeb3SignOutput {
    message: string;
    signature: string;
}
export default function requestWeb3Sign(data: RequestWeb3SignInput): Promise<RequestWeb3SignOutput>;
export {};
//# sourceMappingURL=requestWeb3Sign.d.ts.map
interface PayInvoiceInput {
    url: string;
}
interface PayInvoiceOutput {
    memo: string;
}
export default function payInvoice({ url }: PayInvoiceInput): Promise<PayInvoiceOutput>;
export {};
//# sourceMappingURL=payInvoice.d.ts.map
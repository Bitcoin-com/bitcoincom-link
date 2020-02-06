interface PayInvoiceInput {
    url: string;
}
interface PayInvoiceOutput {
    memo: string;
}
export default function payInvoice(data: PayInvoiceInput): Promise<PayInvoiceOutput>;
export {};
//# sourceMappingURL=payInvoice.d.ts.map
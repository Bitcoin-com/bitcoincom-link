import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

interface PayInvoiceInput {
  url: string; // Url to retrieve the BIP70 payment request from the merchant server
}

interface PayInvoiceOutput {
  memo: string; // Message from merchant server upon receiving payment
}

export default function payInvoice(data: PayInvoiceInput): Promise<PayInvoiceOutput> {
  return sendMessage({
    command: METHOD.payInvoice,
    data,
  });
}

declare let web4bch: any;
declare let Web4Bch: any;

interface PayInvoiceInput {
  url: string; // Url to retrieve the BIP70 payment request from the merchant server
}

interface PayInvoiceOutput {
  memo: string; // Message from merchant server upon receiving payment
}

export default function payInvoice({ url }: PayInvoiceInput): Promise<PayInvoiceOutput> {
  if (typeof web4bch === 'undefined') {
    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  }

  web4bch = new Web4Bch(web4bch.currentProvider);

  const txParams = {
    paymentRequestUrl: url,
  };

  return new Promise((resolve, reject) => {
    web4bch.bch.sendTransaction(txParams, (err: any, txid: string) => {
      if (err) {
        return reject({
          type: 'SEND_ERROR',
          data: err.message,
        });
      } else {
        resolve({memo: txid});
      }
    });
  });
}

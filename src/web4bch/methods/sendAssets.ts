declare let web4bch: any;
declare const Web4Bch: any;
import { fromFixed } from '../../utils';

enum PROTOCOL {
  BCH = 'BCH',
  SLP = 'SLP',
  BTC = 'BTC',
}

interface SendAssetsInput {
  to: string; // Address of the receiver of the assets to be sent
  protocol: PROTOCOL; // BCH/SLP/BTC or any future protocol
  assetId?: string; // Optional in the case of BCH or BTC. Required in the case of SLP, and will be token id
  value: string; // The amount of coins or assets to be sent
}

interface SendAssetsOutput {
  txid: string; // Transaction id of the sent assets
}

export default function sendAssets({
  to,
  protocol,
  value,
  assetId,
}: SendAssetsInput): Promise<SendAssetsOutput> {
  if (typeof web4bch === 'undefined') {
    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  }

  web4bch = new Web4Bch(web4bch.currentProvider);

  const txParams = {
   to,
   value: undefined,
   from: undefined,
   sendTokenData: undefined,
 };
  switch (protocol) {
    case PROTOCOL.BCH:
      txParams.from = web4bch.bch.defaultAccount;
      txParams.value = fromFixed(value, 8);
      break;
    case PROTOCOL.SLP:
      txParams.from = web4bch.bch.defaultAccount;
      txParams.value = value;
      txParams.sendTokenData = {
        tokenId: assetId,
        tokenProtocol: 'slp',
      };
      break;
    default:
      return Promise.reject({
        type: 'PROTOCOL_ERROR',
        description: 'The provided protocol is not supported by this wallet.',
      });
  }

  return new Promise((resolve, reject) => {
    web4bch.bch.sendTransaction(txParams, (err: any, txid: string) => {
      if (err) {
        if (err.message.includes('User denied transaction signature')) {
          return reject({
            type: 'CANCELED',
            data: err.message,
          });
        }
        return reject({
          type: 'SEND_ERROR',
          data: err.message,
        });
      } else {
        resolve({txid});
      }
    });
  });
}

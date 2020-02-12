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
  opReturn?: string[]; // arbitrary op return to attach to transaction
}

interface SendAssetsOutput {
  txid: string; // Transaction id of the sent assets
}

interface TxParams {
  to: string;
  from: string;
  value?: string;
  opReturn?: {
    data: string[],
  };
  sendTokenData?: {
    tokenId: string,
    tokenProtocol: string,
  };
}

export default function sendAssets({
  to,
  protocol,
  value,
  assetId,
  opReturn,
}: SendAssetsInput): Promise<SendAssetsOutput> {
  if (typeof web4bch === 'undefined') {
    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  }

  web4bch = new Web4Bch(web4bch.currentProvider);

  const txParams: TxParams = {
    to,
    from: web4bch.bch.defaultAccount,
  };
  switch (protocol) {
    case PROTOCOL.BCH:
      txParams.value = fromFixed(value, 8).toString();
      break;
    case PROTOCOL.SLP:
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

  if (opReturn) {
    txParams.opReturn = { data: opReturn };
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

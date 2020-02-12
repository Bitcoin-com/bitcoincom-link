declare let web4bch: any;
declare let Web4Bch: any;
import BigNumber from 'bignumber.js';
import { buildGenesisOpReturn, isSlpAddress } from '../../utils';

interface CreateTokenInput {
  name: string; // token name
  symbol: string; // token symbol
  decimals: number; // number of decimals
  initialSupply: number; // initial supply to send to receive address
  tokenReceiverAddress: string; // SLP formatted address to receive the initial token supply
  batonReceiverAddress?: string; // optional SLP formatted address which will have minting privledges for additional tokens
  documentUri?: string; // URI of document related to token
  documentHash?: string; // hash of document related to token
}

interface CreateTokenOutput {
  tokenId: string; // unique id for new token (also txid of token genesis tx)
}

export default function createToken({
  name,
  symbol,
  decimals,
  initialSupply,
  tokenReceiverAddress,
  // not able to set baton address with badger yet
  // if null, then no baton, if anything, then baton to change address
  batonReceiverAddress,
  documentUri,
  documentHash,
}: CreateTokenInput): Promise<CreateTokenOutput> {
  if (typeof web4bch === 'undefined') {
    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  }

  if (!tokenReceiverAddress) {
    return Promise.reject({
      type: 'MALFORMED_INPUT',
      description: 'tokenReceiverAddress is a required field',
    });
  }

  if (!isSlpAddress(tokenReceiverAddress)) {
    return Promise.reject({
      type: 'MALFORMED_INPUT',
      description: 'tokenReceiverAddress should be an slp address',
    });
  }

  web4bch = new Web4Bch(web4bch.currentProvider);

  const initialSupplySatoshis = new BigNumber(Number(initialSupply)).times(10 ** decimals);
  const encodedData = buildGenesisOpReturn({
    ticker: symbol,
    name: name,
    documentUri: documentUri,
    // tslint:disable-next-line: triple-equals
    hash: documentHash != null ? Buffer.from(documentHash, 'utf-8') : null,
    decimals: Number(decimals),
    batonVout: batonReceiverAddress ? 2 : null,
    initialQuantity: initialSupplySatoshis as any,
  });
  const txParams = {
    from: web4bch.bch.defaultAccount,
    to: tokenReceiverAddress,
    value: '546',
    opReturn: {
      data: encodedData,
      isEncoded: true,
      position: '0',
    },
  };

  return new Promise((resolve, reject) => {
    web4bch.bch.sendTransaction(txParams, (err: any, txid: string) => {
      if (err) {
        return reject({
          type: 'SEND_ERROR',
          data: err.message,
        });
      } else {
        resolve({ tokenId: txid });
      }
    });
  });
}

import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

enum PROTOCOL {
  BCH = 'BCH',
  BTC = 'BTC',
  ETH = 'ETH',
}

interface SendAssetsInput {
  to: string; // Address of the receiver of the assets to be sent
  protocol: PROTOCOL; // BCH/BTC or any future protocol
  assetId?: string; // Optional in the case of BCH or BTC.
  value: string; // The amount of coins or assets to be sent
  opReturn?: string[]; // arbitrary op return to attach to transaction
}

interface SendAssetsOutput {
  txid: string; // Transaction id of the sent assets
}

export default function sendAssets(data: SendAssetsInput): Promise<SendAssetsOutput> {
  return sendMessage({
    command: METHOD.sendAssets,
    data,
  });
}

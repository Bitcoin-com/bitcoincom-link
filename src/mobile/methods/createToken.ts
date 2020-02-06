import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

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

export default function createToken(data: CreateTokenInput): Promise<CreateTokenOutput> {
  return sendMessage({
    command: METHOD.createToken,
    data,
  });
}

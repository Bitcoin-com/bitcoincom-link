import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

interface RequestWeb3SignInput {
  address: string; // web3 address
  message: string; // message to be signed
  signType: 'eth_sendTransaction' | 'eth_signTransaction' | 'eth_signTypedData' |
    'eth_sign' | 'personal_sign'; // accepted sign types
}

interface RequestWeb3SignOutput {
  message: string; // message to be signed
  signature: string; // signed message
}

export default function requestWeb3Sign(data: RequestWeb3SignInput): Promise<RequestWeb3SignOutput> {
  return sendMessage({
    command: METHOD.requestWeb3Sign,
    data,
  });
}

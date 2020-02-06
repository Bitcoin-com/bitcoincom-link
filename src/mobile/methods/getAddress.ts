import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

enum PROTOCOL {
  BCH = 'BCH',
  SLP = 'SLP',
  BTC = 'BTC',
}

interface GetAccountInput {
  protocol: PROTOCOL;
}

interface GetAccountOutput {
  address: string; // Address for the given protocol
  label?: string; // A label the users has set to identify their wallet
}

export default function getAddress(data: GetAccountInput): Promise<GetAccountOutput> {
  return sendMessage({
    command: METHOD.getAddress,
    data,
  });
}

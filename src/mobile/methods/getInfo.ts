import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

interface GetInfoOutput {
  version: string;
  platform: string;
  protocols: string[];
}

export default function getInfo(): Promise<GetInfoOutput> {
  return sendMessage({
    command: METHOD.getInfo,
  });
}

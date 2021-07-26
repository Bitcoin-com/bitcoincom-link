import { sendMessage } from '../core/messages';
import { METHOD } from '../../constants';

interface RequestValueInput {
  openValueRequest: boolean; // opens request for value
}

interface RequestValueOutput {
  value: string; // stringified value
}

export default function requestValue(data: RequestValueInput): Promise<RequestValueOutput> {
  return sendMessage({
    command: METHOD.requestValue,
    data,
  });
}

declare let web4bch: any;
declare const Web4Bch: any;

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

export default function getAccount({ protocol }: GetAccountInput): Promise<GetAccountOutput> {
  if (typeof web4bch === 'undefined') {
    return Promise.reject({
      type: 'NO_PROVIDER',
    });
  }

  web4bch = new Web4Bch(web4bch.currentProvider);

  let address: string;
  switch (protocol) {
    case PROTOCOL.BCH:
      address = web4bch.bch.defaultAccount;
      break;
    case PROTOCOL.SLP:
      address = web4bch.bch.defaultSlpAccount;
      break;
    default:
      return Promise.reject({
        type: 'PROTOCOL_ERROR',
        description: 'The provided protocol is not supported by this wallet.',
      });
  }
  return address
    ? Promise.resolve({ address })
    : Promise.reject({
        type: 'CONNECTION_DENIED',
        description: 'User not logged into wallet.',
      });
}

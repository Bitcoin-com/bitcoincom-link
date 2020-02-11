export enum METHOD {
  getAddress = 'getAddress',
  sendAssets = 'sendAssets',
  payInvoice = 'payInvoice',
  createToken = 'createToken',
}

export const NO_PROVIDER = { type: 'NO_PROVIDER', description: 'Bitcoin wallet api provider not found.' };

export const REQUEST_TIMEOUT = {
  type: 'REQUEST_TIMEOUT',
  description: 'Provider is taking longer that timeout specified to complete request.',
};

export enum ProviderStatus {
  NOT_AVAILABLE = 'NOT_AVAILABLE',
  AVAILABLE = 'AVAILABLE',
  LOGGED_IN = 'LOGGED_IN',
}
import BigNumber from 'bignumber.js';
import { getMetadata, metadataRuleSets } from 'page-metadata-parser';

export function fromFixed(number: string, decimals: number): number {
  return Number((Number(number) * Math.pow(10, decimals)).toString().split('.')[0]);
}

interface ConfigBuildGenesisOpReturn {
  ticker: string | null;
  name: string | null;
  documentUri: string | null;
  hash: Buffer | null;
  decimals: number;
  batonVout: number | null; // normally this is null (for fixed supply) or 2+ for flexible
  initialQuantity: BigNumber;
}

export function buildGenesisOpReturn(config: ConfigBuildGenesisOpReturn, type = 0x01) {
  let hash;
  try {
    hash = config.hash!.toString('hex');
  } catch (_) { hash = null; }

  return _buildGenesisOpReturn(
    config.ticker,
    config.name,
    config.documentUri,
    hash,
    config.decimals,
    config.batonVout,
    config.initialQuantity,
    type,
  );
}

function _buildGenesisOpReturn(ticker: string | null, name: string | null, documentUri: string | null, documentHashHex: string | null, decimals: number, batonVout: number | null, initialQuantity: BigNumber, type = 0x01) {
  let script: (number | number[])[] = [];

  // OP Return Prefix
  script.push(0x6a);

  // Lokad Id
  let lokadId = Buffer.from('534c5000', 'hex');
  script.push(getPushDataOpcode(lokadId));
  lokadId.forEach((item) => script.push(item));

  // Token Version/Type
  if (![0x01, 0x41, 0x81].includes(type)) {
    throw Error('Unable to create Genesis for this token type.');
  }
  let tokenVersionType = type;
  script.push(getPushDataOpcode([tokenVersionType]));
  script.push(tokenVersionType);

  // Transaction Type
  let transactionType = Buffer.from('GENESIS');
  script.push(getPushDataOpcode(transactionType));
  transactionType.forEach((item) => script.push(item));

  // Ticker
  if (ticker && typeof ticker !== 'string') {
    throw Error('ticker must be a string');
  } else if (!ticker || ticker.length === 0) {
    [0x4c, 0x00].forEach((item) => script.push(item));
  } else {
    let tickerBuf = Buffer.from(ticker, 'utf8');
    script.push(getPushDataOpcode(tickerBuf));
    tickerBuf.forEach((item) => script.push(item));
  }

  // Name
  if (name && typeof name !== 'string') {
    throw Error('name must be a string');
  } else if (!name || name.length === 0) {
    [0x4c, 0x00].forEach((item) => script.push(item));
  } else {
    let nameBuf = Buffer.from(name, 'utf8');
    script.push(getPushDataOpcode(nameBuf));
    nameBuf.forEach((item) => script.push(item));
  }

  // Document URL
  if (documentUri && typeof documentUri !== 'string') {
    throw Error('documentUri must be a string');
  } else if (!documentUri || documentUri.length === 0) {
    [0x4c, 0x00].forEach((item) => script.push(item));
  } else {
    let documentUriBuf = Buffer.from(documentUri, 'ascii');
    script.push(getPushDataOpcode(documentUriBuf));
    documentUriBuf.forEach((item) => script.push(item));
  }

  // check Token Document Hash should be hexademical chracters.
  const re = /^[0-9a-fA-F]+$/;

  // Document Hash
  if (!documentHashHex || documentHashHex.length === 0) {
    [0x4c, 0x00].forEach((item) => script.push(item));
  } else if (documentHashHex.length === 64 && re.test(documentHashHex)) {
    let documentHashBuf = Buffer.from(documentHashHex, 'hex');
    script.push(getPushDataOpcode(documentHashBuf));
    documentHashBuf.forEach((item) => script.push(item));
  } else {
    throw Error('Document hash must be provided as a 64 character hex string');
  }

  // Decimals
  if (decimals === null || decimals === undefined || decimals < 0 || decimals > 9) {
    throw Error('Decimals property must be in range 0 to 9');
  } else {
    script.push(getPushDataOpcode([decimals]));
    script.push(decimals);
  }

  // Baton Vout
  if (batonVout === null || batonVout === undefined) {
    [0x4c, 0x00].forEach((item) => script.push(item));
  } else {
    if (batonVout < 2 || batonVout > 255 || !(typeof batonVout === 'number')) {
      throw Error('Baton vout must a number and greater than 1 and less than 256.');
    }

    script.push(getPushDataOpcode([batonVout]));
    script.push(batonVout);
  }

  // Initial Quantity
  let MAX_QTY = new BigNumber('18446744073709551615');

  try {
    initialQuantity.absoluteValue();
  } catch (_) {
    throw Error('Amount must be an instance of BigNumber');
  }

  if (initialQuantity.isGreaterThan(MAX_QTY)) {
    throw new Error('Maximum genesis value exceeded. Reduce input quantity below 18446744073709551615.');
  }

  if (initialQuantity.isLessThan(0)) {
    throw Error('Genesis quantity must be greater than 0.');
  }

  if (!initialQuantity.modulo(1).isEqualTo(new BigNumber(0))) {
    throw Error('Genesis quantity must be a whole number.');
  }

  let initialQuantityBuf = int2FixedBuffer(initialQuantity);
  script.push(getPushDataOpcode(initialQuantityBuf));
  initialQuantityBuf.forEach((item) => script.push(item));

  let encodedScript = encodeScript(script);
  if (encodedScript.length > 223) {
    throw Error('Script too long, must be less than 223 bytes.');
  }
  return encodedScript;
}

function getPushDataOpcode(data: number[] | Buffer) {
  let length = data.length;

  if (length === 0) {
    return [0x4c, 0x00];
  } else if (length < 76) {
    return length;
  } else if (length < 256) {
    return [0x4c, length];
  }

  throw Error('Pushdata too large');
}

function int2FixedBuffer(amount: BigNumber) {
  try {
    amount.absoluteValue();
  } catch (_) {
    throw Error('Amount must be an instance of BigNumber');
  }

  let hex: string = amount.toString(16);
  hex = hex.padStart(16, '0');
  return Buffer.from(hex, 'hex');
}

function encodeScript(script: (number | number[])[]) {
  const bufferSize = <number> script.reduce((acc: number, cur) => {
    if (Array.isArray(cur)) {
      return acc + cur.length;
    }
    return acc + 1;
  }, 0);

  const buffer = Buffer.allocUnsafe(bufferSize);
  let offset = 0;
  script.forEach((scriptItem) => {
    if (Array.isArray(scriptItem)) {
      scriptItem.forEach((item) => {
        buffer.writeUInt8(item, offset);
        offset += 1;
      });
    } else {
      buffer.writeUInt8(scriptItem, offset);
      offset += 1;
    }
  });

  return buffer;
}

export function isSlpAddress(address: string): boolean {
  const addressRegex = new RegExp('^(simpleledger:|slptest:|slpreg:)?(q|p)[a-z0-9]{41}$');
  return addressRegex.test(address);
}

const customDescriptionRuleSet = {
  ...metadataRuleSets.description,
  rules: [
    ...metadataRuleSets.description.rules,
    ['meta[name="twitter:description"]', element => element.getAttribute('content')],
    ['meta[property="twitter:description"]', element => element.getAttribute('content')],
    ['meta[itemprop="description"]', element => element.getAttribute('content')],
    ['description', element => element.text],
  ],
};

const customImageRuleSet = {
  ...metadataRuleSets.image,
  rules: [
    ...metadataRuleSets.image.rules,
    ['meta[name="twitter:image:src"]', element => element.getAttribute('content')],
    ['meta[property="twitter:image:src"]', element => element.getAttribute('content')],
    ['meta[name="image"]', element => element.getAttribute('content')],
    ['meta[itemprop="image"]', element => element.getAttribute('content')],
  ],
};

export function getWebsiteMetadata() {
  const location = window?.location;
  const document = window?.document;
  return getMetadata(document, location, {
    title: metadataRuleSets.title,
    description: customDescriptionRuleSet,
    image: customImageRuleSet,
  });
}

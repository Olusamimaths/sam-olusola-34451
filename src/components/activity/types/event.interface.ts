interface Currency {
  contract: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface Amount {
  raw: string;
  decimal: number;
  usd: number;
  native: bigint;
}

interface TokenData {
  tokenId: string;
}

interface Criteria {
  kind: string;
  data: {
    token: TokenData;
  };
}

interface Price {
  currency: Currency;
  amount: Amount;
}

export interface Order {
  id: string;
  status: string;
  contract: string;
  maker: string;
  price: Price;
  quantityRemaining: number;
  nonce: null | string;
  validFrom: bigint;
  validUntil: bigint;
  kind: string;
  source: string;
  isDynamic: boolean;
  criteria: Criteria;
}

export interface EventData {
  id: number | string;
  kind: string;
  txHash: null | string;
  txTimestamp: null | string;
  createdAt: string;
}

export interface EventsResponse {
  events: Array<{
    order: Order;
    event: EventData;
  }>;
  continuation: string;
}

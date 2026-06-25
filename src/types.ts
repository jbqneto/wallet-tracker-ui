export type Chain = 'EVM' | 'SVM';
export type WalletType = 'wallet' | 'bot' | 'card';
export type StableSymbol = 'DAI' | 'USDC' | 'USDT';

export interface Balances {
  DAI: number;
  USDC: number;
  USDT: number;
}

export interface Wallet {
  id: string;
  address: string;
  nickname: string;
  groupId: string;
  chain: Chain;
  type: WalletType;
  cardProvider: string;
  balances: Balances;
}

export interface Group {
  id: string;
  name: string;
}

export interface Filters {
  type: 'all' | WalletType;
  chain: 'all' | Chain;
  group: string;
}

export interface AuthState {
  authed: boolean;
  step: 'email' | 'code';
  email: string;
  code: string;
  sentTo: string;
}

export interface AddWalletForm {
  address: string;
  chain: Chain | null;
  nickname: string;
  group: string;
  newGroup: string;
  type: WalletType;
  cardProvider: string;
}

import type { StableSymbol } from './types';

export const C = {
  bg: '#0B0C0E',
  surface: '#131418',
  surfaceModal: '#15171C',
  sidebar: '#0E1013',
  inputBg: '#0E1013',
  stroke: 'rgba(255,255,255,0.06)',
  stroke2: 'rgba(255,255,255,0.08)',
  strokeInput: 'rgba(255,255,255,0.10)',
  text: '#F4F5F7',
  textMuted: '#9BA1AC',
  textDim: '#71757E',
  textFaint: '#61656E',
  textSubtle: '#5A5E66',
  accent: '#4FD1A1',
  accentText: '#06140D',
  accentBg: 'rgba(79,209,161,0.10)',
  accentBg12: 'rgba(79,209,161,0.12)',
  accentBg14: 'rgba(79,209,161,0.14)',
  accentBg16: 'rgba(79,209,161,0.16)',
  accentBorder: 'rgba(79,209,161,0.3)',
  accentBorderFocus: 'rgba(79,209,161,0.6)',
  evmColor: '#8FB6FF',
  evmBg: 'rgba(143,182,255,0.12)',
  svmColor: '#C9A6FF',
  svmBg: 'rgba(201,166,255,0.12)',
  textAddress: '#6B7079',
  subtotal: '#C8CDD4',
} as const;

export const COIN_META: Record<StableSymbol, { sym: StableSymbol; color: string }> = {
  DAI:  { sym: 'DAI',  color: '#F4B731' },
  USDC: { sym: 'USDC', color: '#2775CA' },
  USDT: { sym: 'USDT', color: '#26A17B' },
};

export const STABLE_SYMBOLS: StableSymbol[] = ['DAI', 'USDC', 'USDT'];

export const CARD_PROVIDERS = [
  'EtherFi',
  'Kast',
  'Gnosis Pay',
  'MetaMask Card',
  'Coinbase Card',
  'Other',
];

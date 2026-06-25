import type { Balances, Chain } from '../types';

export function usd(n: number): string {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function num(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function shortAddr(addr: string): string {
  return addr.length > 14 ? addr.slice(0, 6) + '…' + addr.slice(-4) : addr;
}

export function walletTotal(balances: Balances): number {
  return (balances.DAI || 0) + (balances.USDC || 0) + (balances.USDT || 0);
}

export function autoChain(addr: string): Chain | null {
  const s = (addr || '').trim();
  if (!s) return null;
  if (s.startsWith('0x') && s.length === 42) return 'EVM';
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s)) return 'SVM';
  return null;
}

export function validEmail(email: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((email || '').trim());
}

// Hash-based fake balances — replaced once the API returns real on-chain data.
export function mockBalances(addr: string): Balances {
  let h = 0;
  for (let i = 0; i < addr.length; i++) h = ((h * 31 + addr.charCodeAt(i)) >>> 0);
  return {
    DAI:  Math.round(h % 900 + 50),
    USDC: Math.round(((h >> 3) % 1500) + 100),
    USDT: Math.round((h >> 6) % 600),
  };
}

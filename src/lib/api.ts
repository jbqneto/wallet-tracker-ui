import type { Wallet } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export const auth = {
  // POST /auth/otp/request { email } → emails a 6-digit OTP
  requestOtp(email: string): Promise<void> {
    return request('POST', '/auth/otp/request', { email });
  },

  // POST /auth/otp/verify { email, code } → sets httpOnly session cookie, returns user
  verifyOtp(email: string, code: string): Promise<{ email: string }> {
    return request('POST', '/auth/otp/verify', { email, code });
  },

  // POST /auth/logout → clears session cookie
  logout(): Promise<void> {
    return request('POST', '/auth/logout');
  },
};

export const wallets = {
  // GET /wallets → all wallets for session user with resolved stablecoin balances
  list(): Promise<Wallet[]> {
    return request('GET', '/wallets');
  },

  // POST /wallets → registers address; backend resolves chain + fetches balances
  add(payload: {
    address: string;
    nickname: string;
    groupId: string;
    type: string;
    cardProvider: string;
  }): Promise<Wallet> {
    return request('POST', '/wallets', payload);
  },
};

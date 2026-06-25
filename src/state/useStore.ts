import { useState, useEffect, useCallback } from 'react';
import type { Wallet, Group, Filters, AuthState, AddWalletForm, Chain } from '../types';
import { SEED_GROUPS, SEED_WALLETS } from '../data/seed';
import { storage } from '../lib/storage';
import { autoChain, mockBalances, shortAddr, validEmail } from '../lib/format';
import * as api from '../lib/api';

const STORE_KEY = 'strata.v2';
const API_ENABLED = !!import.meta.env.VITE_API_BASE_URL;

interface StoreState {
  groups: Group[];
  wallets: Wallet[];
  collapsed: Record<string, boolean>;
  filters: Filters;
  auth: AuthState;
  modal: 'desktop' | 'mobile' | null;
}

const DEFAULT_AUTH: AuthState = {
  authed: false,
  step: 'email',
  email: '',
  code: '',
  sentTo: '',
};

function loadInitialState(): StoreState {
  const raw = storage.get(STORE_KEY);
  const base: StoreState = {
    groups: SEED_GROUPS,
    wallets: SEED_WALLETS,
    collapsed: {},
    filters: { type: 'all', chain: 'all', group: 'all' },
    auth: DEFAULT_AUTH,
    modal: null,
  };
  if (!raw) return base;
  try {
    const d = JSON.parse(raw) as Record<string, unknown>;
    return {
      ...base,
      groups: Array.isArray(d.groups) ? (d.groups as Group[]) : base.groups,
      wallets: Array.isArray(d.wallets) ? (d.wallets as Wallet[]) : base.wallets,
      collapsed:
        d.collapsed && typeof d.collapsed === 'object' && !Array.isArray(d.collapsed)
          ? (d.collapsed as Record<string, boolean>)
          : {},
      auth:
        d.auth && typeof d.auth === 'object' && !Array.isArray(d.auth)
          ? {
              ...DEFAULT_AUTH,
              authed: !!(d.auth as Record<string, unknown>).authed,
              email: String((d.auth as Record<string, unknown>).email || ''),
            }
          : DEFAULT_AUTH,
    };
  } catch {
    return base;
  }
}

export function useStore() {
  const [state, setState] = useState<StoreState>(loadInitialState);

  // Persist on every relevant change
  useEffect(() => {
    storage.set(
      STORE_KEY,
      JSON.stringify({
        groups: state.groups,
        wallets: state.wallets,
        collapsed: state.collapsed,
        auth: { authed: state.auth.authed, email: state.auth.email },
      }),
    );
  }, [state.groups, state.wallets, state.collapsed, state.auth]);

  // When API is live, fetch wallets on mount after a confirmed session
  useEffect(() => {
    if (!API_ENABLED || !state.auth.authed) return;
    api.wallets.list().then((serverWallets) => {
      setState((s) => ({ ...s, wallets: serverWallets }));
    }).catch(() => {
      // fall back to cached/seed data on error
    });
  }, [state.auth.authed]);

  const patchAuth = useCallback((patch: Partial<AuthState>) => {
    setState((s) => ({ ...s, auth: { ...s.auth, ...patch } }));
  }, []);

  const sendCode = useCallback(async () => {
    const email = state.auth.email.trim();
    if (!validEmail(email)) return;
    if (API_ENABLED) {
      // TODO: await api.auth.requestOtp(email);
    }
    patchAuth({ step: 'code', sentTo: email, code: '' });
  }, [state.auth.email, patchAuth]);

  const verifyCode = useCallback(async () => {
    const { code } = state.auth;
    if (!/^\d{6}$/.test(code)) return;
    if (API_ENABLED) {
      // TODO: await api.auth.verifyOtp(state.auth.email, code);
    }
    patchAuth({ authed: true, step: 'email', code: '' });
  }, [state.auth, patchAuth]);

  const logout = useCallback(async () => {
    if (API_ENABLED) {
      // TODO: await api.auth.logout();
    }
    patchAuth({ authed: false, step: 'email', code: '' });
  }, [patchAuth]);

  const addWallet = useCallback(
    async (form: AddWalletForm) => {
      const chain: Chain | null = form.chain ?? autoChain(form.address);
      if (!form.address.trim() || !chain) return;
      if (!form.group || (form.group === '__new__' && !form.newGroup.trim())) return;
      if (form.type === 'card' && !form.cardProvider) return;

      const groups = [...state.groups];
      let gid = form.group;
      if (form.group === '__new__') {
        gid = 'g' + Date.now();
        groups.push({ id: gid, name: form.newGroup.trim() });
      }

      const addr = form.address.trim();
      const nickname = form.nickname.trim() || shortAddr(addr);

      if (API_ENABLED) {
        // TODO: replace optimistic wallet below with server response
        // const serverWallet = await api.wallets.add({ address: addr, nickname, groupId: gid, type: form.type, cardProvider: form.cardProvider });
      }

      const w: Wallet = {
        id: 'w' + Date.now(),
        address: addr,
        nickname,
        groupId: gid,
        chain,
        type: form.type,
        cardProvider: form.cardProvider || '',
        balances: mockBalances(addr),
      };

      setState((s) => ({
        ...s,
        groups,
        wallets: [...s.wallets, w],
        modal: null,
      }));
    },
    [state.groups],
  );

  const toggleGroup = useCallback((groupId: string) => {
    setState((s) => ({
      ...s,
      collapsed: { ...s.collapsed, [groupId]: !s.collapsed[groupId] },
    }));
  }, []);

  const setFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setState((s) => ({ ...s, filters: { ...s.filters, [key]: value } }));
    },
    [],
  );

  const openModal = useCallback((target: 'desktop' | 'mobile') => {
    setState((s) => ({ ...s, modal: target }));
  }, []);

  const closeModal = useCallback(() => {
    setState((s) => ({ ...s, modal: null }));
  }, []);

  return {
    state,
    patchAuth,
    sendCode,
    verifyCode,
    logout,
    addWallet,
    toggleGroup,
    setFilter,
    openModal,
    closeModal,
  };
}

export type Store = ReturnType<typeof useStore>;

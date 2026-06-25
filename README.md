# Strata — Crypto Wallet Tracker

A read-only, self-hosted tracker for stablecoin balances across **EVM** and **Solana** wallets. Wallets are grouped by user-defined groups, tagged by type (wallet / bot / card), and filtered by chain, type or group. Authentication is passwordless email OTP — no seed phrases, no signing.

---

## Roadmap

| Version | Scope | Status |
|---|---|---|
| **v1 — MVP** | Add wallets, group them, view stablecoin totals (DAI / USDC / USDT) | ✅ Designed + scaffolded |
| **v2** | Full token list per wallet (beyond stablecoins) | 🔜 Nav stubbed |
| **v3** | Transaction history per wallet and across all | 🔜 Nav stubbed |

---

## What v1 includes

- **Passwordless sign-in** — email → 6-digit OTP → session. No passwords stored.
- **Wallet groups** — user-named (e.g. "Metamask Main", "Phantom Business"). Collapsible, with subtotals.
- **Wallet types** — `wallet`, `bot` (automated/trading), `card` (linked card, e.g. EtherFi, Kast, Gnosis Pay, MetaMask Card).
- **Chains** — EVM (Ethereum-style `0x…`) and Solana (base58). Chain is auto-detected from the address on paste, with manual override.
- **Stablecoins** — DAI · USDC · USDT. Config-driven: adding a new stable requires one line each in `types.ts` and `theme.ts`.
- **Filters** — Chain row always sits above Type row; both chip-wrap so there is never horizontal scroll on mobile.
- **Responsive** — desktop: fixed sidebar + scrolling main. Mobile: top bar + content + bottom tab bar. CSS breakpoint at 900px, no JS.
- **Empty state** — first-run guidance with CTA.
- **Safe persistence** — wallets, groups, collapse state, and the "signed in" flag persist to `localStorage`. Quota-safe and corrupt-data-safe. Real session tokens live in httpOnly cookies, not here.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript 5 + Vite 5 |
| Styling | Inline React style objects + a single global CSS file for resets and the responsive breakpoint |
| Fonts | Geist (UI) + Geist Mono (addresses, numbers) via Google Fonts |
| State | Single `useStore` hook — no Redux, no Zustand |
| Backend | Java (your service — contract stubbed in `src/lib/api.ts`) |
| Auth | Passwordless email OTP generated server-side; email sent via Brevo |
| Sessions | httpOnly cookie set by the Java backend on OTP verify |

---

## Project structure

```
strata-react/           React + TypeScript + Vite app
├── index.html
├── src/
│   ├── main.tsx                    app entry point
│   ├── App.tsx                     shell: auth gate, responsive layout, nav
│   ├── index.css                   resets, hover states, responsive breakpoints
│   ├── theme.ts                    ← design tokens (colors, fonts, radii, coin metadata)
│   ├── types.ts                    ← domain types shared with the backend contract
│   ├── vite-env.d.ts
│   ├── data/
│   │   └── seed.ts                 demo wallets + card providers (delete once API is live)
│   ├── lib/
│   │   ├── api.ts                  ← Java backend contract (stubbed — wire here)
│   │   ├── format.ts               usd(), num(), walletTotal(), autoChain(), mockBalances()
│   │   └── storage.ts              safe localStorage load / save / clear
│   ├── state/
│   │   └── useStore.ts             ← single state hook: data, filters, derived views, auth
│   └── components/
│       ├── icons.tsx               full inline SVG icon set
│       ├── SignIn.tsx              email step + code step screens
│       ├── SummaryBar.tsx          total balance + per-coin breakdown + Brand + AddButton
│       ├── Filters.tsx             chain-over-type chips + group dropdown
│       ├── GroupList.tsx           collapsible group cards + wallet rows (desktop + compact)
│       ├── AddAddressModal.tsx     add-wallet flow (address → chain → nickname → group → type)
│       └── EmptyState.tsx          first-run CTA
│
└── Wallet Tracker.dc.html          ← full hi-fi design prototype (pannable canvas)
```

---

## Getting started

```bash
cd strata-react
cp .env.example .env          # set VITE_API_BASE_URL

npm install
npm run typecheck             # type-check only
npm run dev                   # http://localhost:5173
npm run build                 # production build → dist/
```

**No backend needed to explore.** The app ships with seed data and client-side stubs.
Sign-in demo: any valid email → any 6 digits.

---

## Wiring the Java backend

All API calls are stubbed in `src/lib/api.ts`. Replace the stub bodies with real `fetch` calls, then remove the `// TODO` comments in `useStore.ts` that mark where local mutations should yield to server responses.

Set the base URL in `.env`:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

All requests are sent with `credentials: "include"` so the session cookie flows automatically.

### Endpoints

| Action | Method + Path | Request body | Response |
|---|---|---|---|
| Request OTP | `POST /auth/otp/request` | `{ email }` | `{ ok: true }` |
| Verify OTP | `POST /auth/otp/verify` | `{ email, code }` | `{ email }` + sets httpOnly cookie |
| Logout | `POST /auth/logout` | — | `{ ok: true }` + clears cookie |
| List wallets | `GET /wallets` | — | `Wallet[]` with resolved balances |
| Add wallet | `POST /wallets` | `{ address, nickname, groupId, type, cardProvider }` | `Wallet` with on-chain balances |

The `Wallet` type is in `src/types.ts` — use it as the shared contract between frontend and backend.

### Stablecoin config

The backend should own a config of `{ symbol, contractAddresses: Record<chain, string[]> }` per stable.
On the frontend, add each symbol to:
1. `StableSymbol` union in `src/types.ts`
2. `COIN_META` array in `src/theme.ts` (symbol + brand color)

Totals, breakdowns, and filters derive from these automatically.

### Removing seed / mock data

Once the backend is live:
1. Delete `src/data/seed.ts`
2. In `useStore.ts`, replace the seed initial state with a `useEffect` → `api.wallets.list()`
3. Delete `mockBalances()` from `src/lib/format.ts` and use the balance returned by `api.wallets.add()`

---

## Auth — email OTP

The Java backend generates and validates the 6-digit OTP. The frontend only needs an email-send API.

**Recommended: [Brevo](https://brevo.com)** (ex-Sendinblue)
- Free forever: ~300 emails/day (~9,000/month)
- Simple REST API, good deliverability
- No credit card for the free tier

Other options:

| Provider | Free tier | Notes |
|---|---|---|
| Mailtrap Email API | 4,000/month | Also great for dev/staging |
| Amazon SES | ~62,000/month (first 12 months) | Cheapest at scale ($0.10/1,000); more setup |
| Postmark / SendGrid | ~100/day | Too low for any real usage |

**Alternative:** If you'd rather skip building OTP logic entirely, [Supabase Auth](https://supabase.com/docs/guides/auth) has built-in email OTP on a generous free tier — your Java backend handles everything else.

---

## Design system rules

> These rules keep the visual language consistent as you build v2 and v3. Don't fight them.

- **Tokens in one place** — all colors, radii, fonts, and coin metadata live in `src/theme.ts`. Edit there; don't scatter hex values into components.
- **Inline styles** — all component styling is inline React `style` objects. `src/index.css` exists only for resets, `:hover` / `:active` states, `@keyframes`, and the responsive breakpoint. No Tailwind, no CSS modules.
- **Fonts** — Geist for all UI text; Geist Mono for wallet addresses and numeric amounts. Both loaded via Google Fonts in `index.html`.
- **Accent color** — `#4FD1A1` (green). One accent. Don't introduce a second.
- **Chain colors** — EVM `#8FB6FF` (blue), Solana `#C9A6FF` (purple). Used for tags only.
- **Responsive** — the 900px breakpoint in `index.css` switches from desktop sidebar to mobile top-bar + bottom-tabs. Don't add JS-driven layout switching.
- **No emoji** — the design system uses SVG icons only (see `components/icons.tsx`).

---

## Security notes

- **Never** store session tokens, JWTs, or anything auth-critical in `localStorage`. The Java backend must set an httpOnly, Secure, SameSite=Strict cookie on verify.
- `localStorage` here holds only: wallet list, group list, collapse state, and a UI-only "logged in" boolean. Losing it = the user signs in again and re-adds wallets (acceptable for MVP).
- This is a **read-only** tracker. The frontend never constructs or broadcasts transactions. Never prompt for or store seed phrases, private keys, or mnemonics — not even temporarily.
- OTP codes should be short-lived (≤ 10 minutes TTL) and single-use. Invalidate on first successful verify.

---

## Contributing / extending

**Adding a new wallet type:**
1. Add the value to `WalletType` in `src/types.ts`
2. Add an icon to `src/components/icons.tsx`
3. Add a card to the `TYPES` array in `AddAddressModal.tsx`
4. Add a chip to `TYPE_OPTS` in `Filters.tsx`

**Adding a new chain:**
1. Add the value to `Chain` in `src/types.ts`
2. Add detection logic to `autoChain()` in `src/lib/format.ts`
3. Add a color entry to `theme.ts`
4. Add a chip to `CHAIN_OPTS` in `Filters.tsx`

**Adding a new stablecoin:**
1. Add the symbol to `StableSymbol` in `src/types.ts`
2. Add `{ sym, color }` to `COIN_META` in `src/theme.ts`
3. Update the backend config + balances endpoint to include it

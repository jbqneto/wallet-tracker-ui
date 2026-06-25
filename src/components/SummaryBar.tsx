import { C, COIN_META, STABLE_SYMBOLS } from '../theme';
import { usd, num } from '../lib/format';
import { EyeIcon } from './icons';
import type { Wallet } from '../types';

interface Props {
  wallets: Wallet[];
  compact?: boolean;
}

function computeSums(wallets: Wallet[]) {
  const sums = { DAI: 0, USDC: 0, USDT: 0 };
  wallets.forEach((w) => {
    STABLE_SYMBOLS.forEach((s) => { sums[s] += w.balances[s] || 0; });
  });
  return sums;
}

export function SummaryBar({ wallets, compact = false }: Props) {
  const sums = computeSums(wallets);
  const grand = sums.DAI + sums.USDC + sums.USDT;

  if (compact) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: '18px 0 14px' }}>
          <div style={{ fontSize: '12px', color: C.textMuted }}>Total balance</div>
          <div style={{ font: `600 38px 'Geist Mono', monospace`, letterSpacing: '-1.5px', marginTop: '6px' }}>
            {usd(grand)}
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: C.textMuted,
              fontSize: '11px',
              marginTop: '8px',
              background: 'rgba(255,255,255,0.04)',
              padding: '4px 10px',
              borderRadius: '999px',
            }}
          >
            <EyeIcon size={13} />
            Read-only
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
          {STABLE_SYMBOLS.map((sym) => (
            <div
              key={sym}
              style={{
                flex: 1,
                background: C.surface,
                border: `1px solid ${C.stroke}`,
                borderRadius: '11px',
                padding: '10px 11px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: COIN_META[sym].color }} />
                <span style={{ font: `500 10px 'Geist Mono'`, color: C.textMuted, letterSpacing: '0.3px' }}>
                  {sym}
                </span>
              </div>
              <div style={{ font: `500 13px 'Geist Mono'`, marginTop: '5px' }}>{num(sums[sym])}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '26px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        paddingBottom: '22px',
        borderBottom: `1px solid ${C.stroke}`,
      }}
    >
      <div>
        <div style={{ fontSize: '12px', color: C.textMuted, marginBottom: '8px', letterSpacing: '0.2px' }}>
          Total stablecoin balance
        </div>
        <div style={{ font: `600 42px 'Geist Mono', monospace`, letterSpacing: '-1.5px', lineHeight: 1 }}>
          {usd(grand)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '4px' }}>
        {STABLE_SYMBOLS.map((sym) => {
          const meta = COIN_META[sym];
          return (
            <div
              key={sym}
              style={{
                background: C.surface,
                border: `1px solid ${C.stroke}`,
                borderRadius: '11px',
                padding: '9px 13px',
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
              }}
            >
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: meta.color }} />
              <div>
                <div style={{ font: `500 11px 'Geist Mono'`, color: C.textMuted, letterSpacing: '0.3px' }}>
                  {sym}
                </div>
                <div style={{ font: `500 14px 'Geist Mono'`, marginTop: '1px' }}>{num(sums[sym])}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

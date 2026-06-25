import { C, COIN_META, STABLE_SYMBOLS } from '../theme';
import { usd, num, shortAddr, walletTotal } from '../lib/format';
import { WalletIcon, BotIcon, CardIcon } from './icons';
import type { Wallet } from '../types';

interface Props {
  wallet: Wallet;
  compact?: boolean;
}

export function WalletRow({ wallet, compact = false }: Props) {
  const total = walletTotal(wallet.balances);

  const typeLabel =
    wallet.type === 'card'
      ? `Card · ${wallet.cardProvider || 'Linked'}`
      : wallet.type === 'bot'
      ? 'Bot'
      : 'Wallet';

  const coins = compact
    ? []
    : STABLE_SYMBOLS.filter((s) => (wallet.balances[s] || 0) > 0).map((s) => ({
        sym: s,
        color: COIN_META[s].color,
        amt: num(wallet.balances[s]),
      }));

  const Icon = wallet.type === 'bot' ? BotIcon : wallet.type === 'card' ? CardIcon : WalletIcon;

  const badgePad = compact ? '1px 5px' : '2px 6px';
  const badgeRadius = compact ? '4px' : '5px';
  const badgeSize = compact ? '9px' : '10px';

  return (
    <div
      className="wallet-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '10px' : '14px',
        padding: compact ? '11px 13px' : '13px 16px 13px 18px',
        borderTop: `1px solid rgba(255,255,255,0.05)`,
      }}
    >
      {!compact && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: C.textMuted,
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </div>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: compact ? '6px' : '8px' }}>
          <span
            style={{
              fontWeight: 540,
              fontSize: compact ? '13px' : '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {wallet.nickname}
          </span>
          {wallet.chain === 'EVM' && (
            <span
              style={{
                font: `500 ${badgeSize} 'Geist Mono', monospace`,
                color: C.evmColor,
                background: C.evmBg,
                padding: badgePad,
                borderRadius: badgeRadius,
                letterSpacing: '0.4px',
                flexShrink: 0,
              }}
            >
              EVM
            </span>
          )}
          {wallet.chain === 'SVM' && (
            <span
              style={{
                font: `500 ${badgeSize} 'Geist Mono', monospace`,
                color: C.svmColor,
                background: C.svmBg,
                padding: badgePad,
                borderRadius: badgeRadius,
                letterSpacing: '0.4px',
                flexShrink: 0,
              }}
            >
              SOL
            </span>
          )}
          {!compact && (
            <span style={{ fontSize: '11px', color: C.textFaint }}>{typeLabel}</span>
          )}
        </div>
        <div
          style={{
            font: `400 ${compact ? '11px' : '12px'} 'Geist Mono', monospace`,
            color: C.textAddress,
            marginTop: compact ? '2px' : '3px',
          }}
        >
          {shortAddr(wallet.address)}
        </div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: compact ? '13px' : '14px',
            fontFamily: `'Geist Mono', monospace`,
          }}
        >
          {usd(total)}
        </div>
        {compact ? (
          <div style={{ fontSize: '10px', color: C.textFaint, marginTop: '2px' }}>
            {typeLabel}
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '5px' }}>
            {coins.length > 0
              ? coins.map((c) => (
                  <span
                    key={c.sym}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      font: `400 11px 'Geist Mono', monospace`,
                      color: C.textMuted,
                    }}
                  >
                    <span
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: c.color }}
                    />
                    {c.sym} {c.amt}
                  </span>
                ))
              : (
                  <span style={{ font: `400 11px 'Geist Mono', monospace`, color: C.textSubtle }}>
                    no stablecoins
                  </span>
                )}
          </div>
        )}
      </div>
    </div>
  );
}

import { C } from '../theme';
import { usd, walletTotal } from '../lib/format';
import { ChevronDownIcon } from './icons';
import { WalletRow } from './WalletRow';
import type { Wallet, Group } from '../types';

interface Props {
  group: Group;
  wallets: Wallet[];
  expanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export function WalletGroup({ group, wallets, expanded, onToggle, compact = false }: Props) {
  const subtotal = wallets.reduce((acc, w) => acc + walletTotal(w.balances), 0);
  const countLabel = wallets.length === 1 ? '1 wallet' : `${wallets.length} wallets`;

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.stroke}`,
        borderRadius: compact ? '13px' : '14px',
        overflow: 'hidden',
        marginBottom: compact ? '10px' : '12px',
      }}
    >
      <button
        className="group-toggle"
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: compact ? '10px' : '12px',
          padding: compact ? '13px' : '14px 16px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'inherit',
          textAlign: 'left',
          fontFamily: `'Geist', system-ui, sans-serif`,
        }}
      >
        <span
          style={{
            color: C.textMuted,
            display: 'flex',
            transition: 'transform .15s',
            transform: `rotate(${expanded ? '0deg' : '-90deg'})`,
          }}
        >
          <ChevronDownIcon size={compact ? 13 : 14} />
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: compact ? '13px' : '14px',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {group.name}
        </span>
        {!compact && (
          <span
            style={{
              font: `500 11px 'Geist'`,
              color: C.textDim,
              background: 'rgba(255,255,255,0.05)',
              padding: '2px 9px',
              borderRadius: '999px',
            }}
          >
            {countLabel}
          </span>
        )}
        <span style={{ flex: 1 }} />
        <span style={{ font: `600 ${compact ? '13px' : '14px'} 'Geist Mono', monospace`, color: C.subtotal }}>
          {usd(subtotal)}
        </span>
      </button>

      {expanded && wallets.map((w) => <WalletRow key={w.id} wallet={w} compact={compact} />)}
    </div>
  );
}

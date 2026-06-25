import { C } from '../theme';
import { ChevronSmallDown } from './icons';
import type { Filters, Group } from '../types';

interface Props {
  filters: Filters;
  groups: Group[];
  onSetFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  compact?: boolean;
}

function chipStyle(active: boolean): React.CSSProperties {
  return active
    ? {
        background: C.accent,
        color: C.accentText,
        border: `1px solid ${C.accent}`,
      }
    : {
        background: C.surface,
        color: C.textMuted,
        border: `1px solid ${C.stroke2}`,
      };
}

export function FilterBar({ filters, groups, onSetFilter, compact = false }: Props) {
  const padding = compact ? '6px 12px' : '6px 13px';
  const fontSize = '12px';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        flexWrap: 'wrap',
        marginBottom: '18px',
      }}
    >
      {/* Chain chips */}
      <span
        style={{
          font: `500 10px 'Geist Mono'`,
          color: C.textSubtle,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginRight: '2px',
        }}
      >
        Chain
      </span>
      {(['all', 'EVM', 'SVM'] as const).map((v) => (
        <button
          key={v}
          className="chip-btn"
          onClick={() => onSetFilter('chain', v)}
          style={{
            padding,
            borderRadius: '999px',
            font: `500 ${fontSize} 'Geist', sans-serif`,
            cursor: 'pointer',
            ...chipStyle(filters.chain === v),
          }}
        >
          {v === 'SVM' ? 'Solana' : v === 'EVM' ? 'EVM' : 'All'}
        </button>
      ))}

      {/* Separator */}
      <span
        style={{
          width: '1px',
          height: '20px',
          background: 'rgba(255,255,255,0.10)',
          margin: '0 6px',
        }}
      />

      {/* Type chips */}
      <span
        style={{
          font: `500 10px 'Geist Mono'`,
          color: C.textSubtle,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginRight: '2px',
        }}
      >
        Type
      </span>
      {(
        [
          { value: 'all', label: 'All' },
          { value: 'wallet', label: 'Wallets' },
          { value: 'bot', label: 'Bots' },
          { value: 'card', label: 'Cards' },
        ] as const
      ).map(({ value, label }) => (
        <button
          key={value}
          className="chip-btn"
          onClick={() => onSetFilter('type', value)}
          style={{
            padding,
            borderRadius: '999px',
            font: `500 ${fontSize} 'Geist', sans-serif`,
            cursor: 'pointer',
            ...chipStyle(filters.type === value),
          }}
        >
          {label}
        </button>
      ))}

      <span style={{ flex: 1 }} />

      {/* Group dropdown */}
      <div style={{ position: 'relative' }}>
        <select
          value={filters.group}
          onChange={(e) => onSetFilter('group', e.target.value)}
          style={{
            background: C.surface,
            border: `1px solid ${C.strokeInput}`,
            color: '#C8CDD4',
            font: `500 12px 'Geist', sans-serif`,
            padding: '7px 30px 7px 12px',
            borderRadius: '9px',
            cursor: 'pointer',
          }}
        >
          <option value="all">All groups</option>
          {groups.map((g) => (
            <option key={g.id} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: '11px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: C.textMuted,
            display: 'flex',
          }}
        >
          <ChevronSmallDown size={10} />
        </span>
      </div>
    </div>
  );
}

import { C } from '../theme';
import { PlusIcon } from './icons';

interface Props {
  onOpenModal: () => void;
}

export function EmptyWalletsState({ onOpenModal }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '0 32px',
        gap: '6px',
      }}
    >
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '20px',
          background: 'repeating-linear-gradient(135deg,rgba(255,255,255,0.04) 0 8px,transparent 8px 16px)',
          border: `1px solid rgba(255,255,255,0.08)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="4" width="12" height="9" rx="2" stroke="#4FD1A1" strokeWidth="1.3" />
          <path d="M10.5 8.5h2.2" stroke="#4FD1A1" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ fontSize: '19px', fontWeight: 600 }}>No wallets yet</div>
      <div style={{ fontSize: '13px', color: C.textMuted, lineHeight: 1.5, maxWidth: '240px' }}>
        Add a wallet address to start tracking your stablecoin balances across EVM and Solana.
      </div>
      <button
        onClick={onOpenModal}
        style={{
          marginTop: '18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: C.accent,
          color: C.accentText,
          border: 'none',
          font: `600 14px 'Geist', sans-serif`,
          padding: '13px 22px',
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        <PlusIcon size={16} />
        Add your first wallet
      </button>
      <div style={{ fontSize: '12px', color: C.textFaint, marginTop: '16px', lineHeight: 1.5, maxWidth: '250px' }}>
        Tip: group them by source — like{' '}
        <span style={{ color: C.textMuted }}>"Metamask Main"</span> or{' '}
        <span style={{ color: C.textMuted }}>"Phantom Business"</span>.
      </div>
    </div>
  );
}

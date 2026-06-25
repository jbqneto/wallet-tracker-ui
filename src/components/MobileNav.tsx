import { C } from '../theme';
import { WalletIcon, TokenIcon, TxIcon, UserIcon } from './icons';

export function MobileNav() {
  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        padding: '8px 6px 26px',
        borderTop: `1px solid ${C.stroke}`,
        background: C.sidebar,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: C.accent,
        }}
      >
        <WalletIcon size={20} />
        <span style={{ fontSize: '10px', fontWeight: 500 }}>Wallets</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: C.textSubtle,
        }}
      >
        <TokenIcon size={20} />
        <span style={{ fontSize: '10px' }}>Tokens</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: C.textSubtle,
        }}
      >
        <TxIcon size={20} />
        <span style={{ fontSize: '10px' }}>Activity</span>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          color: C.textSubtle,
        }}
      >
        <UserIcon size={20} />
        <span style={{ fontSize: '10px' }}>Profile</span>
      </div>
    </div>
  );
}

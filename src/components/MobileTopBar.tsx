import { C } from '../theme';
import { StrataLogo, PlusIcon, LogoutIcon } from './icons';
import type { AuthState } from '../types';

interface Props {
  auth: AuthState;
  onLogout: () => void;
  onOpenModal: () => void;
}

export function MobileTopBar({ auth, onLogout, onOpenModal }: Props) {
  return (
    <div
      style={{
        padding: '54px 18px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
      }}
    >
      <StrataLogo size={20} />
      <span style={{ fontWeight: 600, fontSize: '16px' }}>Strata</span>
      <span style={{ flex: 1 }} />
      {auth.authed && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onOpenModal}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: C.accent,
              color: C.accentText,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <PlusIcon size={16} />
          </button>
          <button
            className="icon-btn"
            onClick={onLogout}
            title="Log out"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: C.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <LogoutIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

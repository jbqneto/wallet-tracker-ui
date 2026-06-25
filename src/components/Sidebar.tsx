import { C } from '../theme';
import { StrataLogo, WalletIcon, TokenIcon, TxIcon, EyeIcon, LogoutIcon } from './icons';
import type { AuthState } from '../types';

interface Props {
  auth: AuthState;
  onLogout: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <div
      className="nav-item"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '11px',
        padding: '10px 12px',
        borderRadius: '10px',
        background: active ? C.accentBg12 : 'transparent',
        color: active ? C.accent : C.textDim,
        fontWeight: active ? 540 : 400,
        fontSize: '13px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {icon}
      {label}
      {badge && (
        <span
          style={{
            marginLeft: 'auto',
            font: `500 9px 'Geist Mono'`,
            letterSpacing: '0.4px',
            color: C.textSubtle,
            background: 'rgba(255,255,255,0.05)',
            padding: '2px 6px',
            borderRadius: '5px',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

export function Sidebar({ auth, onLogout }: Props) {
  const emailInitial = auth.email ? auth.email[0].toUpperCase() : 'S';
  const emailLabel = auth.email || 'Signed in';

  return (
    <aside
      style={{
        width: '230px',
        flexShrink: 0,
        borderRight: `1px solid ${C.stroke}`,
        padding: '22px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        background: C.sidebar,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '2px 8px 22px',
        }}
      >
        <StrataLogo size={22} />
        <span style={{ fontWeight: 600, fontSize: '17px', letterSpacing: '0.2px' }}>Strata</span>
      </div>

      <NavItem icon={<WalletIcon size={16} />} label="Wallets" active />
      <NavItem icon={<TokenIcon size={16} />} label="Tokens" badge="SOON" />
      <NavItem icon={<TxIcon size={16} />} label="Transactions" badge="SOON" />

      <div style={{ flex: 1 }} />

      {/* Read-only badge */}
      <div
        style={{
          padding: '12px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid rgba(255,255,255,0.05)`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            color: '#9BA1AC',
            fontSize: '11px',
            fontWeight: 500,
          }}
        >
          <EyeIcon size={14} />
          Read-only mode
        </div>
        <div style={{ fontSize: '11px', color: C.textFaint, lineHeight: 1.45, marginTop: '6px' }}>
          v1 tracks balances only. No keys, no signing.
        </div>
      </div>

      {/* User footer */}
      {auth.authed && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${C.stroke}`,
          }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: C.accentBg16,
              border: `1px solid ${C.accentBorder}`,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.accent,
              font: `600 12px 'Geist'`,
            }}
          >
            {emailInitial}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 540,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {emailLabel}
            </div>
            <div style={{ fontSize: '10px', color: C.textFaint }}>Session active</div>
          </div>
          <button
            className="icon-btn"
            onClick={onLogout}
            title="Log out"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              color: C.textMuted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogoutIcon size={15} />
          </button>
        </div>
      )}
    </aside>
  );
}

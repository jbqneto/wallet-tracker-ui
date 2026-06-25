import { C } from '../theme';
import { validEmail } from '../lib/format';
import { StrataLogo, ChevronLeftIcon, CheckIcon } from './icons';
import type { AuthState } from '../types';

interface Props {
  auth: AuthState;
  onEmailChange: (email: string) => void;
  onCodeChange: (code: string) => void;
  onSendCode: () => void;
  onVerifyCode: () => void;
  onBackToEmail: () => void;
  onResend: () => void;
  onLogout: () => void;
}

export function SignIn({
  auth,
  onEmailChange,
  onCodeChange,
  onSendCode,
  onVerifyCode,
  onBackToEmail,
  onResend,
  onLogout,
}: Props) {
  const canSend = validEmail(auth.email);
  const canVerify = /^\d{6}$/.test(auth.code);

  const btnActive: React.CSSProperties = {
    background: C.accent,
    color: C.accentText,
    cursor: 'pointer',
  };
  const btnDisabled: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    color: C.textSubtle,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '360px',
          background: C.surface,
          border: `1px solid rgba(255,255,255,0.07)`,
          borderRadius: '18px',
          padding: '30px 28px',
          color: C.text,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '9px',
            marginBottom: '20px',
          }}
        >
          <StrataLogo size={24} />
          <span style={{ fontWeight: 600, fontSize: '18px' }}>Strata</span>
        </div>

        {auth.authed ? (
          /* ── Signed-in state ── */
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 0',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: C.accentBg14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckIcon size={26} />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>You're signed in</div>
            <div style={{ fontSize: '13px', color: C.textMuted }}>{auth.email}</div>
            <button
              onClick={onLogout}
              style={{
                marginTop: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid ${C.strokeInput}`,
                color: C.text,
                font: `500 13px 'Geist', sans-serif`,
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </div>
        ) : auth.step === 'email' ? (
          /* ── Email step ── */
          <>
            <div style={{ fontSize: '21px', fontWeight: 600, textAlign: 'center', marginBottom: '6px' }}>
              Sign in
            </div>
            <div
              style={{
                fontSize: '13px',
                color: C.textMuted,
                textAlign: 'center',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              Enter your email and we'll send a one-time code. No password needed.
            </div>
            <label
              style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}
            >
              Email
            </label>
            <input
              type="email"
              value={auth.email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@email.com"
              onKeyDown={(e) => e.key === 'Enter' && canSend && onSendCode()}
              style={{
                width: '100%',
                background: C.inputBg,
                border: `1px solid ${C.strokeInput}`,
                borderRadius: '10px',
                padding: '12px',
                color: C.text,
                font: `400 14px 'Geist'`,
                marginBottom: '14px',
              }}
            />
            <button
              onClick={canSend ? onSendCode : undefined}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '11px',
                border: 'none',
                font: `600 14px 'Geist'`,
                ...(canSend ? btnActive : btnDisabled),
              }}
            >
              Send code
            </button>
            <div
              style={{
                fontSize: '11px',
                color: C.textFaint,
                textAlign: 'center',
                marginTop: '14px',
                lineHeight: 1.5,
              }}
            >
              Read-only tracker — we never ask for keys or seed phrases.
            </div>
          </>
        ) : (
          /* ── Code step ── */
          <>
            <button
              onClick={onBackToEmail}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'none',
                border: 'none',
                color: C.textMuted,
                font: `500 12px 'Geist'`,
                cursor: 'pointer',
                padding: '0',
                marginBottom: '10px',
              }}
            >
              <ChevronLeftIcon size={12} />
              Back
            </button>
            <div style={{ fontSize: '21px', fontWeight: 600, textAlign: 'center', marginBottom: '6px' }}>
              Enter code
            </div>
            <div
              style={{
                fontSize: '13px',
                color: C.textMuted,
                textAlign: 'center',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              We sent a 6-digit code to{' '}
              <span style={{ color: C.text }}>{auth.sentTo}</span>
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={auth.code}
              onChange={(e) => onCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="——————"
              onKeyDown={(e) => e.key === 'Enter' && canVerify && onVerifyCode()}
              style={{
                width: '100%',
                textAlign: 'center',
                background: C.inputBg,
                border: `1px solid ${C.strokeInput}`,
                borderRadius: '10px',
                padding: '14px',
                color: C.text,
                font: `600 24px 'Geist Mono', monospace`,
                letterSpacing: '10px',
                marginBottom: '14px',
              }}
            />
            <button
              onClick={canVerify ? onVerifyCode : undefined}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '11px',
                border: 'none',
                font: `600 14px 'Geist'`,
                ...(canVerify ? btnActive : btnDisabled),
              }}
            >
              Verify &amp; sign in
            </button>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: C.textMuted,
                marginTop: '14px',
              }}
            >
              Didn't get it?{' '}
              <button
                onClick={onResend}
                className="link-btn"
                style={{
                  background: 'none',
                  border: 'none',
                  color: C.accent,
                  cursor: 'pointer',
                  font: `500 12px 'Geist'`,
                  padding: '0',
                }}
              >
                Resend
              </button>
            </div>
            {!import.meta.env.VITE_API_BASE_URL && (
              <div
                style={{
                  fontSize: '11px',
                  color: C.textFaint,
                  textAlign: 'center',
                  marginTop: '8px',
                }}
              >
                Demo: enter any 6 digits.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

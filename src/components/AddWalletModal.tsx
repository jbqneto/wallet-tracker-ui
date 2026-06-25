import { useState, useCallback } from 'react';
import { C, CARD_PROVIDERS } from '../theme';
import { autoChain } from '../lib/format';
import { CloseIcon, ChevronSmallDown, WalletIcon, BotIcon, CardIcon } from './icons';
import type { AddWalletForm, Group, WalletType } from '../types';

interface Props {
  groups: Group[];
  onSave: (form: AddWalletForm) => void;
  onClose: () => void;
}

function blankForm(): AddWalletForm {
  return { address: '', chain: null, nickname: '', group: '', newGroup: '', type: 'wallet', cardProvider: '' };
}

export function AddWalletModal({ groups, onSave, onClose }: Props) {
  const [form, setForm] = useState<AddWalletForm>(blankForm);

  const patch = useCallback((p: Partial<AddWalletForm>) => setForm((f) => ({ ...f, ...p })), []);

  const resolvedChain = form.chain ?? autoChain(form.address);

  const chainLabel = !form.address.trim()
    ? 'Chain auto-detected from the address'
    : form.chain
    ? `Manual override · ${form.chain === 'EVM' ? 'EVM' : 'Solana'}`
    : resolvedChain === 'EVM'
    ? 'Detected: EVM (Ethereum-style)'
    : resolvedChain === 'SVM'
    ? 'Detected: Solana'
    : 'Unrecognized address format';

  const showNewGroup = form.group === '__new__';

  const canSave =
    !!form.address.trim() &&
    !!resolvedChain &&
    !!form.group &&
    (form.group !== '__new__' || !!form.newGroup.trim()) &&
    (form.type !== 'card' || !!form.cardProvider);

  function handleSave() {
    if (!canSave) return;
    onSave({ ...form, chain: resolvedChain });
  }

  const typeButtons: { key: WalletType; label: string; Icon: React.FC<{ size?: number }> }[] = [
    { key: 'wallet', label: 'Wallet', Icon: WalletIcon },
    { key: 'bot', label: 'Bot', Icon: BotIcon },
    { key: 'card', label: 'Card', Icon: CardIcon },
  ];

  function chainBtnStyle(chain: 'EVM' | 'SVM'): React.CSSProperties {
    return resolvedChain === chain
      ? { background: C.accentBg14, color: C.accent, border: `1px solid ${C.accent}` }
      : { background: C.inputBg, color: C.textMuted, border: `1px solid ${C.strokeInput}` };
  }

  function typeBtnStyle(t: WalletType): React.CSSProperties {
    return form.type === t
      ? { background: C.accentBg12, color: C.accent, border: `1px solid ${C.accent}` }
      : { background: C.inputBg, color: C.textMuted, border: `1px solid ${C.stroke2}` };
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px',
        background: 'rgba(4,5,7,0.62)',
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: C.surfaceModal,
          border: `1px solid rgba(255,255,255,0.09)`,
          borderRadius: '18px',
          color: C.text,
          fontFamily: `'Geist', system-ui, sans-serif`,
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '18px 20px 14px',
            borderBottom: `1px solid ${C.stroke}`,
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Add address</span>
          <span style={{ flex: 1 }} />
          <button
            className="icon-btn"
            onClick={onClose}
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
            <CloseIcon size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 20px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Address */}
          <div>
            <label style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}>
              Wallet address
            </label>
            <input
              value={form.address}
              onChange={(e) => patch({ address: e.target.value, chain: null })}
              placeholder="0x… or Solana base58 address"
              style={{
                width: '100%',
                background: C.inputBg,
                border: `1px solid ${C.strokeInput}`,
                borderRadius: '10px',
                padding: '11px 12px',
                color: C.text,
                font: `400 13px 'Geist Mono', monospace`,
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '9px' }}>
              <span style={{ font: `500 11px 'Geist'`, color: C.textDim }}>{chainLabel}</span>
              <span style={{ flex: 1 }} />
              {(['EVM', 'SVM'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => patch({ chain: c })}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    font: `500 12px 'Geist'`,
                    cursor: 'pointer',
                    ...chainBtnStyle(c),
                  }}
                >
                  {c === 'SVM' ? 'Solana' : 'EVM'}
                </button>
              ))}
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}>
              Nickname
            </label>
            <input
              value={form.nickname}
              onChange={(e) => patch({ nickname: e.target.value })}
              placeholder="e.g. Daily, Cold Storage"
              style={{
                width: '100%',
                background: C.inputBg,
                border: `1px solid ${C.strokeInput}`,
                borderRadius: '10px',
                padding: '11px 12px',
                color: C.text,
                font: `400 13px 'Geist'`,
              }}
            />
          </div>

          {/* Group */}
          <div>
            <label style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}>
              Group
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={form.group}
                onChange={(e) => patch({ group: e.target.value })}
                style={{
                  width: '100%',
                  background: C.inputBg,
                  border: `1px solid ${C.strokeInput}`,
                  borderRadius: '10px',
                  padding: '11px 30px 11px 12px',
                  color: form.group ? C.text : C.textSubtle,
                  font: `400 13px 'Geist'`,
                  cursor: 'pointer',
                }}
              >
                <option value="">Choose a group…</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
                <option value="__new__">+ New group…</option>
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
            {showNewGroup && (
              <input
                value={form.newGroup}
                onChange={(e) => patch({ newGroup: e.target.value })}
                placeholder="New group name — e.g. Phantom Business"
                style={{
                  width: '100%',
                  marginTop: '9px',
                  background: C.inputBg,
                  border: `1px solid ${C.strokeInput}`,
                  borderRadius: '10px',
                  padding: '11px 12px',
                  color: C.text,
                  font: `400 13px 'Geist'`,
                }}
              />
            )}
          </div>

          {/* Type */}
          <div>
            <label style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}>
              Type
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {typeButtons.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => patch({ type: key })}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: '11px',
                    cursor: 'pointer',
                    ...typeBtnStyle(key),
                  }}
                >
                  <Icon size={18} />
                  <span style={{ font: `500 12px 'Geist'` }}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Card provider (only for card type) */}
          {form.type === 'card' && (
            <div>
              <label style={{ display: 'block', font: `500 12px 'Geist'`, color: C.textMuted, marginBottom: '7px' }}>
                Card provider
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={form.cardProvider}
                  onChange={(e) => patch({ cardProvider: e.target.value })}
                  style={{
                    width: '100%',
                    background: C.inputBg,
                    border: `1px solid ${C.strokeInput}`,
                    borderRadius: '10px',
                    padding: '11px 30px 11px 12px',
                    color: form.cardProvider ? C.text : C.textSubtle,
                    font: `400 13px 'Geist'`,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Choose provider…</option>
                  {CARD_PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {p}
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
          )}

          {/* Save button */}
          <button
            onClick={handleSave}
            style={{
              marginTop: '4px',
              width: '100%',
              padding: '13px',
              borderRadius: '11px',
              border: 'none',
              font: `600 14px 'Geist'`,
              cursor: canSave ? 'pointer' : 'not-allowed',
              background: canSave ? C.accent : 'rgba(255,255,255,0.06)',
              color: canSave ? C.accentText : C.textSubtle,
            }}
          >
            Add wallet
          </button>
        </div>
      </div>
    </div>
  );
}

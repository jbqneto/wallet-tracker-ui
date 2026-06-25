import { C } from '../theme';
import { PlusIcon } from './icons';
import { SummaryBar } from './SummaryBar';
import { FilterBar } from './FilterBar';
import { WalletGroup } from './WalletGroup';
import type { Wallet, Group, Filters } from '../types';

interface Props {
  wallets: Wallet[];
  groups: Group[];
  filters: Filters;
  collapsed: Record<string, boolean>;
  onSetFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onToggleGroup: (id: string) => void;
  onOpenModal: () => void;
  mobile?: boolean;
}

function matches(w: Wallet, f: Filters, groups: Group[]): boolean {
  if (f.type !== 'all' && w.type !== f.type) return false;
  if (f.chain !== 'all' && w.chain !== f.chain) return false;
  if (f.group !== 'all') {
    const g = groups.find((gr) => gr.id === w.groupId);
    if (!g || g.name !== f.group) return false;
  }
  return true;
}

export function WalletsPage({
  wallets,
  groups,
  filters,
  collapsed,
  onSetFilter,
  onToggleGroup,
  onOpenModal,
  mobile = false,
}: Props) {
  const visible = wallets.filter((w) => matches(w, filters, groups));

  const viewGroups = groups
    .map((g) => ({ group: g, wallets: visible.filter((w) => w.groupId === g.id) }))
    .filter((vg) => vg.wallets.length > 0);

  const visibleCount = visible.length;
  const groupCount = viewGroups.length;

  if (mobile) {
    return (
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 14px 14px' }}>
        <SummaryBar wallets={visible} compact />

        <div style={{ marginBottom: '10px' }}>
          <FilterBar filters={filters} groups={groups} onSetFilter={onSetFilter} compact />
        </div>

        {viewGroups.length > 0
          ? viewGroups.map(({ group, wallets: gw }) => (
              <WalletGroup
                key={group.id}
                group={group}
                wallets={gw}
                expanded={collapsed[group.id] !== true}
                onToggle={() => onToggleGroup(group.id)}
                compact
              />
            ))
          : (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: C.textFaint, fontSize: '13px' }}>
                No wallets match these filters.
              </div>
            )}
      </div>
    );
  }

  return (
    <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '28px 32px 44px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 600, letterSpacing: '-0.3px' }}>Wallets</h1>
          <div style={{ fontSize: '13px', color: C.textMuted, marginTop: '3px' }}>
            {visibleCount} {visibleCount === 1 ? 'wallet' : 'wallets'} · {groupCount} {groupCount === 1 ? 'group' : 'groups'}
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <button
          onClick={onOpenModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: C.accent,
            color: C.accentText,
            border: 'none',
            font: `600 13px 'Geist', sans-serif`,
            padding: '10px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          <PlusIcon size={15} />
          Add address
        </button>
      </div>

      <SummaryBar wallets={visible} />

      <FilterBar filters={filters} groups={groups} onSetFilter={onSetFilter} />

      {viewGroups.length > 0
        ? viewGroups.map(({ group, wallets: gw }) => (
            <WalletGroup
              key={group.id}
              group={group}
              wallets={gw}
              expanded={collapsed[group.id] !== true}
              onToggle={() => onToggleGroup(group.id)}
            />
          ))
        : (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: C.textFaint, fontSize: '13px' }}>
              No wallets match these filters.
            </div>
          )}
    </main>
  );
}

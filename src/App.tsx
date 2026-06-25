import { C } from './theme';
import { useStore } from './state/useStore';
import { Sidebar } from './components/Sidebar';
import { MobileTopBar } from './components/MobileTopBar';
import { MobileNav } from './components/MobileNav';
import { WalletsPage } from './components/WalletsPage';
import { EmptyWalletsState } from './components/EmptyWalletsState';
import { SignIn } from './components/SignIn';
import { AddWalletModal } from './components/AddWalletModal';

export function App() {
  const {
    state,
    patchAuth,
    sendCode,
    verifyCode,
    logout,
    addWallet,
    toggleGroup,
    setFilter,
    openModal,
    closeModal,
  } = useStore();

  const { auth, wallets, groups, filters, collapsed, modal } = state;

  const hasWallets = wallets.length > 0;

  return (
    <>
      {/* ── Desktop layout (≥900px) ── */}
      <div
        className="desktop-layout"
        style={{
          height: '100vh',
          overflow: 'hidden',
          background: C.bg,
          color: C.text,
        }}
      >
        {auth.authed ? (
          <>
            <Sidebar auth={auth} onLogout={logout} />
            {hasWallets ? (
              <WalletsPage
                wallets={wallets}
                groups={groups}
                filters={filters}
                collapsed={collapsed}
                onSetFilter={setFilter}
                onToggleGroup={toggleGroup}
                onOpenModal={() => openModal('desktop')}
              />
            ) : (
              <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <EmptyWalletsState onOpenModal={() => openModal('desktop')} />
              </main>
            )}
          </>
        ) : (
          <SignIn
            auth={auth}
            onEmailChange={(email) => patchAuth({ email })}
            onCodeChange={(code) => patchAuth({ code })}
            onSendCode={sendCode}
            onVerifyCode={verifyCode}
            onBackToEmail={() => patchAuth({ step: 'email', code: '' })}
            onResend={() => patchAuth({ code: '' })}
            onLogout={logout}
          />
        )}
      </div>

      {/* ── Mobile layout (<900px) ── */}
      <div
        className="mobile-layout"
        style={{
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          background: C.bg,
          color: C.text,
        }}
      >
        <MobileTopBar auth={auth} onLogout={logout} onOpenModal={() => openModal('mobile')} />

        {auth.authed ? (
          hasWallets ? (
            <WalletsPage
              wallets={wallets}
              groups={groups}
              filters={filters}
              collapsed={collapsed}
              onSetFilter={setFilter}
              onToggleGroup={toggleGroup}
              onOpenModal={() => openModal('mobile')}
              mobile
            />
          ) : (
            <EmptyWalletsState onOpenModal={() => openModal('mobile')} />
          )
        ) : (
          <SignIn
            auth={auth}
            onEmailChange={(email) => patchAuth({ email })}
            onCodeChange={(code) => patchAuth({ code })}
            onSendCode={sendCode}
            onVerifyCode={verifyCode}
            onBackToEmail={() => patchAuth({ step: 'email', code: '' })}
            onResend={() => patchAuth({ code: '' })}
            onLogout={logout}
          />
        )}

        <MobileNav />
      </div>

      {/* ── Add Wallet modal (shared) ── */}
      {modal !== null && (
        <AddWalletModal
          groups={groups}
          onSave={addWallet}
          onClose={closeModal}
        />
      )}
    </>
  );
}

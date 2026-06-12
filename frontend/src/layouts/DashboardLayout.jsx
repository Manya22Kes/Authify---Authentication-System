/**
 * DashboardLayout.jsx
 * Shell for all authenticated dashboard pages.
 *
 * Mobile: sidebar is hidden, replaced by a bottom nav bar + slide-out drawer.
 * Tablet (md): sidebar hidden, hamburger in top bar opens slide-out drawer.
 * Desktop (lg+): classic fixed left sidebar, scrollable right content.
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import VerificationBanner from '../components/dashboard/VerificationBanner';

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <div className="flex h-screen bg-obsidian-950 overflow-hidden">

      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile / tablet slide-out drawer ─────────────────────────────── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden flex">
            <Sidebar onClose={() => setDrawerOpen(false)} />
          </div>
        </>
      )}

      {/* ── Main content column ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex-shrink-0 h-14 border-b border-obsidian-800 bg-obsidian-950/80 backdrop-blur-sm flex items-center px-4 sm:px-6 justify-between gap-4">
          {/* Hamburger — visible below lg */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-ivory-400/60 hover:text-ivory-100 hover:bg-obsidian-800 transition-colors flex-shrink-0"
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Brand — visible below lg when sidebar is hidden */}
          <div className="lg:hidden flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-obsidian-950" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-display font-bold text-ivory-100 tracking-tight text-sm truncate">Authify</span>
          </div>

          {/* Spacer on desktop (sidebar takes left side) */}
          <div className="hidden lg:block flex-1" />

          {/* Status indicator */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="text-xs text-ivory-400/60 font-mono hidden sm:inline">Connected</span>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Verification nudge — slim amber bar for unverified users */}
          <VerificationBanner />
          <div className="page-enter">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

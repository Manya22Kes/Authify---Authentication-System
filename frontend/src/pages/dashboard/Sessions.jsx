import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import sessionService from '../../services/sessionService';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import { APP_ROUTES } from '../../utils/constants';
import { getDeviceLabel } from '../../utils/device';

import SectionCard from '../../components/profile/SectionCard';
import StatCard from '../../components/profile/StatCard';
import SessionCard from '../../components/sessions/SessionCard';
import SessionCardSkeleton from '../../components/sessions/SessionCardSkeleton';
import RevokeAllModal from '../../components/sessions/RevokeAllModal';
import EmptyStateCard from '../../components/ui/EmptyState';
import PageTransition from '../../components/animations/PageTransition';

function StatSkeleton() {
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-obsidian-700/80 bg-obsidian-800 p-4">
      <div className="h-4 w-4 animate-pulse rounded bg-obsidian-700" />
      <div className="space-y-1.5">
        <div className="h-3.5 w-16 animate-pulse rounded bg-obsidian-700" />
        <div className="h-2.5 w-24 animate-pulse rounded bg-obsidian-800" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <EmptyStateCard
      accent="blue"
      className="m-4"
      title="No active sessions found."
      description="Your account currently has no recorded device sessions."
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
      }
    />
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-400/15 bg-rose-400/5">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-rose-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-ivory-400/60 font-body">Could not load sessions.</p>
      <button
        onClick={onRetry}
        className="mt-3 text-xs text-amber-400/70 font-body underline underline-offset-2 transition-colors hover:text-amber-400"
      >
        Try again
      </button>
    </div>
  );
}

export default function Sessions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeAllLoading, setRevokeAllLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setFetchError(false);
    try {
      const response = await sessionService.getSessions();
      setSessions(response?.data || []);
    } catch (err) {
      setFetchError(true);
      if (err?.response?.status !== 404) {
        toast.error(getErrorMessage(err));
      }
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const currentSession = sessions.find((s) => s.current);
  const lastLogin = currentSession?.lastLogin ?? user?.lastLoginAt ?? null;
  const currentDeviceLabel = currentSession?.device ?? 'This device';

  async function handleRevoke(sessionId) {
    setRevokingId(sessionId);
    try {
      await sessionService.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success('Session revoked.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setRevokingId(null);
    }
  }

  async function handleRevokeAll() {
    setRevokeAllLoading(true);
    try {
      await sessionService.revokeAllSessions();
      toast.success('All sessions revoked. Signing you out...');
      await logout();
      navigate(APP_ROUTES.LOGIN, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setRevokeAllLoading(false);
      setShowRevokeModal(false);
    }
  }

  const statCards = [
    {
      label: 'Active sessions',
      value: loading ? '-' : String(sessions.length),
      accent: 'emerald',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
      ),
    },
    {
      label: 'Current device',
      value: loading ? '-' : currentDeviceLabel,
      accent: 'blue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25A2.25 2.25 0 016 3h12a2.25 2.25 0 012.25 2.25v9A2.25 2.25 0 0118 16.5H6a2.25 2.25 0 01-2.25-2.25v-9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75h19.5"
          />
        </svg>  
      ),
    },
    {
      label: 'Last login',
      value: loading ? '-' : (lastLogin ? formatDate(lastLogin) : 'This session'),
      accent: 'magenta',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
  <PageTransition>  
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-ivory-400/30">Dashboard</span>
          <span className="text-xs text-ivory-400/20">/</span>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Sessions</span>
        </div>
        <h1 className="font-display text-xl font-bold text-ivory-100">Sessions</h1>
        <p className="mt-0.5 text-sm font-body text-ivory-400/50">
          Monitor active sessions and manage account access.
        </p>
      </div>

      <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-3">
        {loading ? [1, 2, 3].map((i) => <StatSkeleton key={i} />) : statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <SectionCard
        title="Active sessions"
        description="All devices currently signed in to your account."
        noPad
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
          </svg>
        }
        action={
          !loading && sessions.length > 0 && (
            <button
              onClick={fetchSessions}
              title="Refresh sessions"
              aria-label="Refresh sessions"
              disabled={loading}
              className="p-1 text-ivory-400/40 transition-colors hover:text-ivory-300 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          )
        }
      >
        {loading ? (
          <div>{[1, 2, 3].map((i) => <SessionCardSkeleton key={i} />)}</div>
        ) : fetchError ? (
          <ErrorState onRetry={fetchSessions} />
        ) : sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {sessions
              .slice()
              .sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0))
              .map((session) => {
                const normalizedSession = {
                  ...session,
                  ip: session.ipAddress,
                  lastLogin: session.loggedAt,
                  device: getDeviceLabel(session.userAgent),
                  rawUserAgent: session.userAgent,
                  deviceType: session.userAgent?.includes('Mobile') ? 'mobile' : 'desktop',
                };

                return (
                  <SessionCard
                    key={session.id}
                    session={normalizedSession}
                    onRevoke={handleRevoke}
                    revoking={revokingId === session.id}
                  />
                );
              })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Danger zone"
        description="Destructive session actions that affect every signed-in device."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-sm font-medium font-body text-ivory-200">Logout all sessions</p>
            <p className="mt-0.5 text-xs font-body text-ivory-400/50">
              This will revoke all active sessions and require you to log in again on every device.
            </p>
          </div>
          <button
            onClick={() => setShowRevokeModal(true)}
            disabled={revokeAllLoading}
            className="
              min-h-[44px] w-full flex-shrink-0 rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-2.5
              text-sm font-display font-semibold text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]
              transition-all duration-200 hover:border-rose-500/50 hover:bg-rose-500/15
              hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] active:scale-[0.98]
              disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:w-auto
            "
          >
            {revokeAllLoading ? 'Revoking...' : 'Logout all sessions'}
          </button>
        </div>
      </SectionCard>

      {showRevokeModal && (
        <RevokeAllModal
          onConfirm={handleRevokeAll}
          onCancel={() => setShowRevokeModal(false)}
          isLoading={revokeAllLoading}
        />
      )}
    </div>
  </PageTransition>  
  );
}

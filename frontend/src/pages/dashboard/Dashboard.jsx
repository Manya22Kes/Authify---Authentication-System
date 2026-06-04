/**
 * Dashboard.jsx
 * Main user dashboard. Shows session info, account overview.
 */

import VerificationBanner from '../../components/dashboard/VerificationBanner';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';

const stats = [
  { label: 'Session Status', value: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { label: 'Auth Method', value: 'JWT + Refresh', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { label: 'Token Storage', value: 'In-Memory', color: 'text-ivory-100', bg: 'bg-obsidian-700', border: 'border-obsidian-600' },
  { label: 'Cookie Type', value: 'httpOnly', color: 'text-ivory-100', bg: 'bg-obsidian-700', border: 'border-obsidian-600' },
];

function buildSecurityChecks(isVerified) {
  return [
    { label: 'Refresh token in httpOnly cookie', ok: true },
    { label: 'Access token in memory only', ok: true },
    { label: 'No tokens in localStorage', ok: true },
    { label: 'Automatic token refresh on 401', ok: true },
    { label: 'Session restored on page load', ok: true },
    { label: 'Refresh queue prevents race conditions', ok: true },
    { label: 'Email verified', ok: Boolean(isVerified) },
  ];
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const securityChecks = buildSecurityChecks(user?.isVerified);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ivory-100 mb-1">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm text-ivory-400/60 font-body">
              Your session is active and secure.
            </p>
          </div>
          <div>
            {isAdmin ? (
              <span className="badge badge-warning">Admin</span>
            ) : (
              <span className="badge badge-neutral">{user?.role || 'User'}</span>
            )}
          </div>
        </div>
      </div>

      {!user?.isVerified && <VerificationBanner />}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
            <p className="text-xs text-ivory-400/50 font-mono uppercase tracking-wider mb-1.5">{s.label}</p>
            <p className={`font-display font-semibold text-sm ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ivory-100 mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Account
          </h2>

          <div className="space-y-4">
            <InfoRow label="Name" value={user?.name || '-'} />
            <InfoRow label="Email" value={user?.email || '-'} mono />
            <InfoRow label="Verification" value={user?.isVerified ? 'Verified' : 'Pending'} />
            <InfoRow label="User ID" value={user?.id ? `${user.id.slice(0, 8)}...` : '-'} mono />
            <InfoRow label="Role" value={user?.role || ROLES.USER} />
            {user?.createdAt && (
              <InfoRow label="Member since" value={formatDate(user.createdAt)} />
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ivory-100 mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Security checks
          </h2>

          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${check.ok ? 'bg-emerald-400/10' : 'bg-rose-400/10'}`}>
                  {check.ok ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-ivory-300 font-body">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <h2 className="font-display font-semibold text-ivory-100 mb-5 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ivory-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Upcoming features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Profile management', 'OTP / 2FA', 'Google OAuth', 'GitHub OAuth', 'Session history', 'Device management', 'Audit logs', 'Security dashboard'].map((feat) => (
              <div key={feat} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-800/50 border border-obsidian-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-obsidian-500 flex-shrink-0" />
                <span className="text-xs text-ivory-400/50 font-body">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-obsidian-800/60 last:border-0">
      <span className="text-xs text-ivory-400/50 uppercase tracking-wider font-mono">{label}</span>
      <span className={`text-sm text-ivory-200 ${mono ? 'font-mono' : 'font-body'}`}>{value}</span>
    </div>
  );
}

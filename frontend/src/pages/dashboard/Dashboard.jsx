import VerificationBanner from '../../components/dashboard/VerificationBanner';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';
import PageTransition from '../../components/animations/PageTransition';

const stats = [
  { label: 'Session Status', value: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
  { label: 'Auth Method', value: 'JWT + Refresh', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
  { label: 'Token Storage', value: 'In-Memory', color: 'text-sky-200', bg: 'bg-sky-400/10', border: 'border-sky-400/20' },
  { label: 'Cookie Type', value: 'httpOnly', color: 'text-fuchsia-200', bg: 'bg-fuchsia-400/10', border: 'border-fuchsia-400/20' },
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
  <PageTransition>
    <div className="mx-auto max-w-5xl p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="mb-1 font-display text-2xl font-bold text-ivory-100">
              Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm font-body text-ivory-400/60">Your session is active and secure.</p>
          </div>
          <div>
            {isAdmin ? <span className="badge badge-warning">Admin</span> : <span className="badge badge bg-sky-400/10
              text-sky-300
              border border-sky-400/20">{user?.role || 'User'}</span>}
          </div>
        </div>
      </div>

      {!user?.isVerified && <VerificationBanner />}

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mb-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4`}>
            <p className="mb-1.5 text-xs font-mono uppercase tracking-wider text-ivory-400/50">{s.label}</p>
            <p className={`truncate font-display text-sm font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 items-stretch">
        <div className="glass-card rounded-2xl border border-obsidian-700/70 p-6 h-full">
          <h2 className="mb-5 flex items-center gap-2 font-display font-semibold text-ivory-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
            {user?.createdAt && <InfoRow label="Member since" value={formatDate(user.createdAt)} />}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-obsidian-700/70 p-6 h-full">
          <h2 className="mb-5 flex items-center gap-2 font-display font-semibold text-ivory-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Security checks
          </h2>

          <div className="space-y-3">
            {securityChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-3">
                <div className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${check.ok ? 'bg-emerald-400/10' : 'bg-rose-400/10'}`}>
                  {check.ok ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-body text-ivory-300">{check.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-obsidian-700/70 p-6 md:col-span-2">
          <h2 className="mb-5 flex items-center gap-2 font-display font-semibold text-ivory-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 6.75h9m-9 4.5h5.25m-7.5 8.25l-4.773-1.591a.75.75 0 01-.477-.712V5.227c0-.502.488-.864.977-.712l4.773 1.59a.75.75 0 01.477.712v12.977c0 .502-.488.864-.977.712z" />
            </svg>
            About Authify
          </h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-xl border border-sky-400/18 bg-sky-400/8 p-4">
              <p className="text-sm font-body leading-relaxed text-ivory-300">
                Authify is a production-style authentication platform built to demonstrate secure authentication workflows, scalable architecture,
                account security tooling, and modern full-stack engineering practices across a premium dashboard experience.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { label: 'Secure workflows', accent: 'bg-emerald-400', shell: 'border-emerald-400/18 bg-emerald-400/8' },
                { label: 'Scalable architecture', accent: 'bg-sky-300', shell: 'border-sky-400/18 bg-sky-400/8' },
                { label: 'Modern engineering', accent: 'bg-fuchsia-300', shell: 'border-fuchsia-400/18 bg-fuchsia-400/8' },
              ].map((item) => (
                <div key={item.label} className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${item.shell}`}>
                  <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${item.accent}`} />
                  <span className="text-xs font-body text-ivory-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageTransition>
  );
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-obsidian-800/60 py-2 last:border-0">
      <span className="text-xs font-mono uppercase tracking-wider text-ivory-400/50">{label}</span>
      <span className={`truncate text-right text-sm text-ivory-200 ${mono ? 'font-mono' : 'font-body'}`}>{value}</span>
    </div>
  );
}

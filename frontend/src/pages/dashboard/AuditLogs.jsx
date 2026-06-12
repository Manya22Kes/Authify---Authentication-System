import SectionCard from '../../components/profile/SectionCard';
import StatCard from '../../components/profile/StatCard';
import FutureFeatureCard from '../../components/security/FutureFeatureCard';
import EmptyStateCard from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/helpers';
import { formatRelativeDateLabel } from '../../utils/date';
import PageTransition from '../../components/animations/PageTransition';

const MOCK_EVENTS = [
  { type: 'LOGIN_SUCCESS', description: 'Successful login from a recognised device.', timestamp: new Date('2026-06-12T09:14:00'), severity: 'success' },
  { type: 'PROFILE_UPDATED', description: 'Display name was changed.', timestamp: new Date('2026-06-12T08:52:00'), severity: 'info' },
  { type: 'EMAIL_VERIFIED', description: 'Email address confirmed via verification link.', timestamp: new Date('2026-06-11T18:31:00'), severity: 'success' },
  { type: 'PASSWORD_CHANGED', description: 'Account password was updated successfully.', timestamp: new Date('2026-06-11T15:18:00'), severity: 'warning' },
  { type: 'EMAIL_UPDATED', description: 'Email address change request was initiated.', timestamp: new Date('2026-06-10T11:05:00'), severity: 'warning' },
  { type: 'LOGOUT', description: 'User signed out of the current session.', timestamp: new Date('2026-06-09T17:44:00'), severity: 'info' },
];

const STAT_CARDS = [
  { label: 'Total events', value: '24', accent: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12m-12 5.25h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm0 5.25h.008v.008H3.75V12zm0 5.25h.008v.008H3.75v-.008z" />
</svg>},
  { label: 'Security events', value: '8', accent: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
</svg>},
  { label: 'Account changes', value: '5', accent: 'magenta', icon:<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0" />
</svg>},
  { label: 'Last activity', value: 'Today', accent: 'emerald', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3.5 3.5m7.5-3.5a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg> },
];

const SEVERITY = {
  success: {
    rail: 'bg-emerald-400/40',
    iconBg: 'bg-emerald-400/12 border-emerald-400/24 shadow-[0_0_24px_rgba(52,211,153,0.10)]',
    iconText: 'text-emerald-300',
    badge: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  },
  warning: {
    rail: 'bg-amber-400/40',
    iconBg: 'bg-amber-400/12 border-amber-400/24 shadow-[0_0_24px_rgba(251,191,36,0.10)]',
    iconText: 'text-amber-300',
    badge: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  },
  info: {
    rail: 'bg-sky-400/40',
    iconBg: 'bg-sky-400/12 border-sky-400/24 shadow-[0_0_24px_rgba(56,189,248,0.010)]',
    iconText: 'text-sky-300',
    badge: 'bg-sky-400/12 text-sky-200 border-sky-400/20',
  },
  profile: {
    rail: 'bg-fuchsia-400/35',
    iconBg: 'bg-fuchsia-400/10 border-fuchsia-400/18 shadow-[0_0_24px_rgba(217,70,239,0.08)]',
    iconText: 'text-fuchsia-200',
    badge: 'bg-fuchsia-400/12 text-fuchsia-200 border-fuchsia-400/10',
  },
};

function EventIcon({ type, className }) {
  const icons = {
    LOGIN_SUCCESS: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75',
    LOGOUT: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9',
    PASSWORD_CHANGED: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    PROFILE_UPDATED: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z',
    EMAIL_UPDATED: 'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
    EMAIL_VERIFIED: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[type] ?? 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'} />
    </svg>
  );
}

function AuditEventRow({ event, isLast }) {
  const s = SEVERITY[event.severity] ?? SEVERITY.info;

  return (
    <div className={`flex flex-col gap-3 px-4 py-4 transition-colors duration-150 hover:bg-obsidian-800/20 sm:flex-row sm:items-center sm:gap-4 sm:px-6 ${!isLast ? 'border-b border-obsidian-800/40' : ''}`}>
      <div className="flex flex-1 min-w-0 items-start gap-3 sm:items-center">
        <div className={`mt-1 h-full w-px self-stretch rounded-full ${s.rail} sm:mt-0`} />
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border ${s.iconBg}`}>
          <EventIcon type={event.type} className={`h-4 w-4 ${s.iconText}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium ${s.badge}`}>
              {event.type}
            </span>
          </div>
          <p className="text-sm font-body text-ivory-300">{event.description}</p>
        </div>
      </div>
      <div className="pl-8 sm:pl-0 sm:text-right">
        <span className="block whitespace-nowrap text-xs font-body text-ivory-400/60">{formatDate(event.timestamp)}</span>
        <span className="block whitespace-nowrap text-[10px] font-mono text-ivory-400/30">{formatRelativeDateLabel(event.timestamp)}</span>
      </div>
    </div>
  );
}

const FUTURE_FEATURES = [
  { label: 'Login Failure Tracking', description: 'Record failed login attempts with IP and device context.', accent: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3l8.25 4.5v4.5c0 5.25-3.75 8.25-8.25 9-4.5-.75-8.25-3.75-8.25-9V7.5L12 3z" />
</svg>},
  { label: 'Device Tracking', description: 'Identify and log the devices used to access your account.', accent: 'blue', icon: <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v9A2.25 2.25 0 0118.75 16.5H5.25A2.25 2.25 0 013 14.25v-9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 21h9m-7.5-4.5h6"
    />
  </svg>},
  { label: 'Geo-location Detection', description: 'Show the approximate location of each login event.', accent: 'magenta', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
</svg>},
  { label: 'Security Alerts', description: 'Receive instant notifications for suspicious account activity.', accent: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
</svg>},
  { label: 'Role Change Tracking', description: 'Track role assignments and permission changes.', accent: 'magenta', icon: <svg
  xmlns="http://www.w3.org/2000/svg"
  className="h-4 w-4"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={1.5}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
  />
</svg>},
  { label: 'Admin Audit Tools', description: 'Full audit trail export, filtering, and admin-level event search.', accent: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5.25H7.5A2.25 2.25 0 005.25 7.5v11.25A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25V7.5A2.25 2.25 0 0016.5 5.25H15m-6 0a2.25 2.25 0 004.5 0m-4.5 0a2.25 2.25 0 014.5 0M9 10.5h6M9 14.25h6" />
</svg>},
];

export default function AuditLogs() {
  const hasEvents = MOCK_EVENTS.length > 0;

  return (
  <PageTransition>  
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-ivory-400/30">Dashboard</span>
          <span className="text-xs text-ivory-400/20">/</span>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Audit Logs</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-xl font-bold text-ivory-100">Audit Logs</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/15 bg-amber-400/8 px-2.5 py-1 text-[10px] font-mono font-medium text-amber-400/70">
            Preview - static data
          </span>
        </div>
        <p className="mt-0.5 text-sm font-body text-ivory-400/50">Track important security and account events. Live data coming soon.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 items-stretch">
        {STAT_CARDS.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <SectionCard
        title="Event timeline"
        description="Recent account and security events. Static preview data shown below."
        noPad
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>}
      >
        {hasEvents ? (
          <div>{MOCK_EVENTS.map((event, index) => <AuditEventRow key={`${event.type}-${index}`} event={event} isLast={index === MOCK_EVENTS.length - 1} />)}</div>
        ) : (
          <EmptyStateCard
            accent="magenta"
            className="m-4"
            title="No security events yet."
            description="Account activity will appear here when available."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Coming soon"
        description="Advanced audit capabilities currently in development."
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FUTURE_FEATURES.map((f) => <FutureFeatureCard key={f.label} {...f} />)}
        </div>
      </SectionCard>
    </div>
  </PageTransition>  
  );
}

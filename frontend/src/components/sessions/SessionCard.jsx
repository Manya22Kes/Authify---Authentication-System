import { formatDate } from '../../utils/helpers';
import Spinner from '../loaders/Spinner';

function DesktopIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
    </svg>
  );
}

function MobileIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

function DeviceIcon({ type, className }) {
  return type === 'mobile' || type === 'tablet' ? <MobileIcon className={className} /> : <DesktopIcon className={className} />;
}

export default function SessionCard({ session, onRevoke, revoking }) {
  const {
    id,
    current = false,
    device = 'Unknown device',
    rawUserAgent,
    deviceType = 'desktop',
    ip = '-',
    lastLogin,
    expiresAt,
    location,
  } = session;

  return (
    <div
      className={`
        flex flex-col gap-3 border-b border-obsidian-800/40 px-4 py-4 transition-colors duration-150 sm:flex-row sm:items-center sm:gap-4 sm:px-6
        ${current ? 'bg-emerald-400/[0.03]' : 'hover:bg-obsidian-800/20'}
      `}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
            ${current ? 'border border-emerald-400/20 bg-emerald-400/10' : 'border border-obsidian-700 bg-obsidian-800'}
          `}
        >
          <DeviceIcon type={deviceType} className={`h-5 w-5 ${current ? 'text-emerald-400' : 'text-ivory-400/60'}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-medium font-body text-ivory-100" title={rawUserAgent || device}>
              {device}
            </p>
            {current && (
              <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Current
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5">
            <MetaItem label="IP" value={ip} />
            {location && <MetaItem label="Location" value={location} />}
            {lastLogin && <MetaItem label="Login" value={formatDate(lastLogin)} />}
            {expiresAt && <MetaItem label="Expires" value={formatDate(expiresAt)} />}
          </div>
        </div>
      </div>

      {!current && (
        <div className="flex-shrink-0 sm:ml-auto">
          <button
            onClick={() => onRevoke(id)}
            disabled={revoking}
            aria-label={`Revoke session for ${device}`}
            className="
              inline-flex min-h-[36px] w-full items-center justify-center gap-1.5 rounded-lg border border-rose-500/25 bg-rose-500/8 px-3 py-2
              text-xs font-display font-semibold tracking-wide text-rose-400 transition-all duration-150
              hover:border-rose-500/40 hover:bg-rose-500/15 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
              sm:min-h-0 sm:w-auto sm:py-1.5
            "
          >
            {revoking ? (
              <>
                <Spinner size="xs" color="light" /> Revoking...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Revoke session
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <span className="max-w-[180px] truncate text-xs font-mono text-ivory-400/50" title={value}>
      <span className="text-ivory-400/30">{label}: </span>
      {value}
    </span>
  );
}

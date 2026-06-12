/**
 * AuthMethodRow.jsx
 * A single auth method row inside the Authentication Methods card.
 *
 * Responsive: label + description truncate on narrow screens;
 * status indicator always stays right-aligned.
 * Touch target: min-height 44px on mobile via py-3.
 */

const STATUS_STYLES = {
  active:   { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Active' },
  inactive: { dot: 'bg-ivory-400/30', text: 'text-ivory-400/50', label: 'Inactive' },
  soon:     { dot: 'bg-sky-300', text: 'text-sky-200/80', label: 'Coming soon' },
};

export default function AuthMethodRow({ icon, label, description, status = 'active', last = false }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.inactive;

  return (
    <div className={`
      flex items-center gap-3 sm:gap-4
      py-3 sm:py-4 px-4 sm:px-6
      ${!last ? 'border-b border-obsidian-800/40' : ''}
      ${status === 'soon' ? 'opacity-50' : ''}
    `}>
      {/* Icon */}
      <div className={`
        w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        ${status === 'active'
          ? 'bg-amber-400/10 border border-amber-400/15 text-amber-400/70'
          : 'bg-sky-400/8 border border-sky-400/18 text-sky-200/75'}
      `}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Text — min-w-0 prevents overflow */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ivory-100 font-body leading-tight truncate">{label}</p>
        {description && (
          <p className="text-xs text-ivory-400/40 font-body mt-0.5 truncate">{description}</p>
        )}
      </div>

      {/* Status — never wraps */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
        <span className={`text-xs font-mono whitespace-nowrap ${s.text}`}>{s.label}</span>
      </div>
    </div>
  );
}

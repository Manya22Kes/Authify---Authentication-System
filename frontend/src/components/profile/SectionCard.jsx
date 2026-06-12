/**
 * SectionCard.jsx
 * Consistent card wrapper for every profile/dashboard section.
 *
 * Responsive:
 *   Header: px-4 sm:px-6  — tighter on mobile
 *   Body:   px-4 sm:px-6  — same
 *   All text truncates within min-w-0 containers.
 *
 * Props:
 *   title       {string}
 *   description {string}
 *   icon        {ReactNode}
 *   action      {ReactNode}   — pinned to right of header
 *   noPad       {boolean}     — skip body padding (flush rows)
 *   className   {string}
 *   children    {ReactNode}
 */

export default function SectionCard({
  title,
  description,
  icon,
  action,
  noPad = false,
  className = '',
  children,
}) {
  return (
    <div
      className={`
        bg-obsidian-900/80 border border-obsidian-700/70 rounded-2xl
        backdrop-blur-sm overflow-hidden transition-all duration-200 h-full
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-obsidian-800/60">
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
            {icon && (
              <div className="mt-0.5 text-amber-400/70 flex-shrink-0">{icon}</div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="font-display font-semibold text-ivory-100 text-sm leading-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-ivory-400/50 mt-0.5 leading-relaxed font-body">
                  {description}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      <div className={noPad ? '' : 'px-4 sm:px-6 py-4 sm:py-5'}>{children}</div>
    </div>
  );
}

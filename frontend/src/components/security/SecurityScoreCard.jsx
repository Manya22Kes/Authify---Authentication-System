
function ScoreSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-4 flex-wrap">
        <div className="h-12 w-24 bg-obsidian-700 rounded animate-pulse" />
        <div className="h-4 w-28 bg-obsidian-800 rounded animate-pulse mb-1" />
      </div>
      <div className="h-2 w-full bg-obsidian-800 rounded-full animate-pulse" />
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-obsidian-700 animate-pulse flex-shrink-0" />
            <div className="h-3 w-40 bg-obsidian-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SecurityScoreCard({
  emailVerified,
  passwordProtected,
  mfaEnabled,
  loading,
}) {
  const checks = [
    { label: 'Email verified',             ok: emailVerified },
    { label: 'Password protected',         ok: passwordProtected },
    { label: 'Two-factor authentication',  ok: mfaEnabled, soon: !mfaEnabled },
  ];

  const score =
    (emailVerified ? 40 : 0) +
    (passwordProtected ? 40 : 0) +
    (mfaEnabled ? 20 : 0);

  const passedCount = checks.filter((c) => c.ok).length;

  const scoreColor = score >= 80 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-rose-400';
  const barColor   = score >= 80 ? 'bg-emerald-400'   : score >= 50 ? 'bg-amber-400'   : 'bg-rose-400';
  const scoreLabel = score >= 80 ? 'Strong'            : score >= 50 ? 'Fair'           : 'Needs attention';

  return (
    <div className="bg-obsidian-900/80 border border-obsidian-700/50 rounded-2xl backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-obsidian-800/60">
        <div className="mt-0.5 text-amber-400/70 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-ivory-100 text-sm leading-tight">Security score</h3>
          <p className="text-xs text-ivory-400/50 mt-0.5 leading-relaxed font-body">
            Based on your current account protection settings.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-6 py-5">
        {loading ? (
          <ScoreSkeleton />
        ) : (
          <div className="space-y-5">
            {/* Score number + label */}
            <div className="flex items-end gap-3 flex-wrap">
              <span className={`font-display font-bold text-4xl sm:text-5xl leading-none ${scoreColor}`}>
                {score}%
              </span>
              <div className="mb-0.5">
                <p className={`text-sm font-display font-semibold ${scoreColor}`}>{scoreLabel}</p>
                <p className="text-xs text-ivory-400/40 font-mono">{passedCount} of {checks.length} checks passed</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full bg-obsidian-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100}>
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                style={{ width: `${score}%` }}
              />
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                      ${check.ok ? 'bg-emerald-400/10' : 'bg-obsidian-700'}
                    `}>
                      {check.ok ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-ivory-400/30" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-body truncate ${check.ok ? 'text-ivory-200' : 'text-ivory-400/50'}`}>
                      {check.label}
                    </span>
                  </div>
                  {check.soon && !check.ok && (
                    <span className="text-[10px] font-mono text-ivory-400/40 bg-obsidian-700 px-1.5 py-0.5 rounded flex-shrink-0">
                      Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

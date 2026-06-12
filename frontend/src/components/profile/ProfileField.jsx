import { useState } from 'react';

export default function ProfileField({
  label,
  value = '—',
  mono = false,
  copyable = false,
  truncate = false,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — fail silently
    }
  }

  return (
    <div className="
      flex flex-col sm:flex-row sm:items-center sm:justify-between
      py-2.5 sm:py-3
      border-b border-obsidian-800/40 last:border-0
      gap-0.5 sm:gap-4
    ">
      {/* Label */}
      <span className="text-xs text-ivory-400/50 uppercase tracking-wider font-mono flex-shrink-0">
        {label}
      </span>

      {/* Value + optional copy */}
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`
            text-sm text-ivory-200 leading-snug
            ${mono ? 'font-mono' : 'font-body'}
            ${truncate ? 'truncate max-w-[180px] sm:max-w-[260px]' : ''}
          `}
          title={truncate ? value : undefined}
        >
          {value}
        </span>

        {copyable && value !== '—' && (
          <button
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            aria-label={copied ? 'Copied' : 'Copy to clipboard'}
            className="flex-shrink-0 text-ivory-400/30 hover:text-amber-400/70 transition-colors p-0.5"
          >
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

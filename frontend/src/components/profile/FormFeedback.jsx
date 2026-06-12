/**
 * FormFeedback.jsx
 * Inline success or error message used below profile forms.
 * Animates in on mount. Auto-dismissible via a timeout in the parent.
 *
 * Props:
 *   type    {'success' | 'error'}
 *   message {string}
 */

const STYLES = {
  success: {
    wrap:  'bg-emerald-400/8 border-emerald-400/20 text-emerald-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  error: {
    wrap:  'bg-rose-400/8 border-rose-400/20 text-rose-400',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function FormFeedback({ type, message }) {
  if (!message) return null;
  const s = STYLES[type] ?? STYLES.error;

  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm font-body leading-relaxed animate-fade-in ${s.wrap}`}>
      {s.icon}
      <span>{message}</span>
    </div>
  );
}

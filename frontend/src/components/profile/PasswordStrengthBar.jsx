/**
 * PasswordStrengthBar.jsx
 * Visual password strength indicator with a segmented bar and requirement checklist.
 *
 * Props:
 *   password {string}
 */

const REQUIREMENTS = [
  { label: 'At least 8 characters',        test: (p) => p.length >= 8 },
  { label: 'Uppercase letter (A–Z)',        test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a–z)',        test: (p) => /[a-z]/.test(p) },
  { label: 'Number (0–9)',                  test: (p) => /\d/.test(p) },
  { label: 'Special character (!@#$…)',     test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const LEVELS = [
  { label: 'Too weak', color: '#f43f5e' },
  { label: 'Weak',     color: '#fb923c' },
  { label: 'Fair',     color: '#fbbf24' },
  { label: 'Good',     color: '#34d399' },
  { label: 'Strong',   color: '#10b981' },
];

export default function PasswordStrengthBar({ password }) {
  if (!password) return null;

  const score = REQUIREMENTS.filter((r) => r.test(password)).length;
  const level = LEVELS[Math.min(score, 4)];

  return (
    <div className="mt-3 space-y-3">
      {/* Segmented bar */}
      <div className="space-y-1.5">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((seg) => (
            <div
              key={seg}
              className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ backgroundColor: score >= seg ? level.color : '#30363d' }}
            />
          ))}
        </div>
        <p className="text-xs font-body" style={{ color: level.color }}>
          {level.label}
        </p>
      </div>

      {/* Requirement checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <div key={req.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                met ? 'bg-emerald-400/15' : 'bg-obsidian-700'
              }`}>
                {met ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-obsidian-500" />
                )}
              </div>
              <span className={`text-xs font-body transition-colors duration-200 ${met ? 'text-ivory-300' : 'text-ivory-400/40'}`}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

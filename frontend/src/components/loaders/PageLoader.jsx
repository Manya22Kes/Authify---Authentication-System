/**
 * PageLoader.jsx
 * Full-page loading screen shown while restoring session on app startup.
 */

import Spinner from './Spinner';

export default function PageLoader({ message = 'Initialising session…' }) {
  return (
    <div className="fixed inset-0 bg-obsidian-950 flex flex-col items-center justify-center z-50">
      {/* Logo mark */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-obsidian-950" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="font-display font-bold text-xl text-ivory-100 tracking-tight">Authify</span>
      </div>

      <Spinner size="lg" color="amber" />

      <p className="mt-5 text-sm text-ivory-400/60 font-body font-light tracking-wide">
        {message}
      </p>
    </div>
  );
}

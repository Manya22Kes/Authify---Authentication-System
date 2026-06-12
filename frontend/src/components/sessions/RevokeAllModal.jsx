import Spinner from '../loaders/Spinner';

export default function RevokeAllModal({ onConfirm, onCancel, isLoading }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="revoke-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-obsidian-900 p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </div>
          <h3 id="revoke-modal-title" className="text-base font-display font-bold text-rose-300 sm:text-lg">
            Sign Out Everywhere
          </h3>
        </div>

        <p className="mb-6 text-sm font-body leading-relaxed text-ivory-400/70">
          This will immediately revoke all active sessions across every device. You will be signed out and will need to log in again.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="
              min-h-[44px] w-full rounded-lg border border-obsidian-700 px-4 py-2.5 text-sm font-body text-ivory-300 transition-colors
              hover:bg-obsidian-800 disabled:opacity-50 sm:min-h-0 sm:w-auto sm:py-2
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="
              inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5
              text-sm font-display font-semibold text-white transition-all hover:bg-rose-600 active:scale-95
              disabled:opacity-70 sm:min-h-0 sm:w-auto sm:py-2
            "
          >
            {isLoading ? (
              <>
                <Spinner size="xs" color="light" /> Revoking...
              </>
            ) : (
              'Logout all sessions'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

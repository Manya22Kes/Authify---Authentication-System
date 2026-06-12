import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import Spinner from '../loaders/Spinner';

export default function VerificationBanner() {
  const { user, resendVerification, syncVerificationStatus } = useAuth();

  const [isResending, setIsResending] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('ver_banner_dismissed') === '1'
  );

  // Hidden when verified or dismissed
  if (!user || user.isVerified || dismissed) return null;

  async function handleResend() {
    setIsResending(true);
    try {
      const result = await resendVerification();
      toast.success(result?.message || 'Verification email sent.');
      // Refresh status silently
      syncVerificationStatus().catch(() => {});
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  function handleDismiss() {
    sessionStorage.setItem('ver_banner_dismissed', '1');
    setDismissed(true);
  }

  return (
    <div className="flex-shrink-0 bg-amber-400/5 border-b border-amber-400/15">
      <div className="px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 max-w-6xl mx-auto">

        {/* Message */}
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0 mt-0.5 sm:mt-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-amber-400/80 font-body leading-snug min-w-0">
            <span className="font-medium">Verify your email</span>
            <span className="text-amber-400/50 hidden sm:inline">
              {' '}— some features are restricted until your address is confirmed.
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 pl-5 sm:pl-0">
          <button
            onClick={handleResend}
            disabled={isResending}
            className="
              text-xs text-amber-400 hover:text-amber-300 font-body font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors flex items-center gap-1.5
              min-h-[28px]
            "
          >
            {isResending ? (
              <><Spinner size="xs" color="amber" /> Sending…</>
            ) : (
              'Resend email'
            )}
          </button>

          <span className="w-px h-3 bg-amber-400/20 flex-shrink-0" />

          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="text-amber-400/40 hover:text-amber-400/70 transition-colors p-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

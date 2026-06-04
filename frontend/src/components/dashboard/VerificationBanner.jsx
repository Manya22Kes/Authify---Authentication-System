import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import Button from '../ui/Button';

export default function VerificationBanner() {
  const { user, resendVerification, syncVerificationStatus } = useAuth();
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!user || user.isVerified) {
      return undefined;
    }

    async function refreshStatus() {
      try {
        await syncVerificationStatus();
      } catch {
        // Leave the banner as-is if the status check fails.
      }
    }

    refreshStatus();
    return undefined;
  }, [syncVerificationStatus, user?.id, user?.isVerified]);

  if (!user || user.isVerified) {
    return null;
  }

  async function handleResend() {
    setIsResending(true);
    try {
      const result = await resendVerification();
      toast.success(result.message || 'Verification email sent.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <section className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400/70">
            Verification required
          </p>
          <h2 className="font-display text-lg text-ivory-100">
            Confirm your email to finish activating this account.
          </h2>
          <p className="text-sm text-ivory-300/75">
            We sent a verification link to <span className="font-mono text-amber-300">{user.email}</span>.
          </p>
        </div>

        <Button type="button" variant="secondary" isLoading={isResending} onClick={handleResend}>
          Resend verification
        </Button>
      </div>
    </section>
  );
}

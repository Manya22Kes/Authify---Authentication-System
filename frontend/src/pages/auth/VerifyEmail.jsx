import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';
import { getErrorMessage } from '../../utils/helpers';
import FormWrapper from '../../components/forms/FormWrapper';
import Button from '../../components/ui/Button';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const { isAuthenticated, user, verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState(token ? 'loading' : 'invalid');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const verificationAttemptedRef = useRef(false);

  useEffect(() => {
    if (!token || verificationAttemptedRef.current) {
      return undefined;
    }

    // Check if user is already verified in auth context
    if (user?.isVerified) {
      setStatus('success');
      setMessage('Your email is already verified!');
      verificationAttemptedRef.current = true;
      return undefined;
    }

    let ignore = false;
    verificationAttemptedRef.current = true;

    // 10-second timeout for verification request
    const timeoutId = window.setTimeout(() => {
      if (ignore) {
        return;
      }

      setStatus('error');
      setMessage('Verification took too long. Please try the link again.');
    }, 10000);

    async function runVerification() {
      try {
        const result = await verifyEmail(token);

        if (ignore) {
          return;
        }

        window.clearTimeout(timeoutId);

        // Treat all successful verification messages as success
        setStatus('success');
        setMessage(result.message || 'Email verified successfully.');
        toast.success(result.message || 'Email verified successfully.');
      } catch (error) {
        if (ignore) {
          return;
        }

        window.clearTimeout(timeoutId);

        const errorMessage = getErrorMessage(error);

        // Check if error is actually "already verified" in different formats
        if (
          errorMessage?.toLowerCase().includes("already verified") ||
          error?.response?.data?.message?.toLowerCase().includes("already verified")
        ) {
          setStatus('success');
          setMessage('Your email is already verified!');
          toast.success('Your email is already verified!');
        } else {
          setStatus('error');
          setMessage(errorMessage);
          toast.error(errorMessage);
        }
      }
    }

    runVerification();

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [token, verifyEmail, user?.isVerified]);

  useEffect(() => {
    if (status !== 'success' || !isAuthenticated) {
      return undefined;
    }

    const redirectId = window.setTimeout(() => {
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    }, 1200);

    return () => {
      window.clearTimeout(redirectId);
    };
  }, [isAuthenticated, navigate, status]);

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

  if (status === 'loading') {
    return (
      <FormWrapper title="Verifying your email" subtitle="Please wait while we confirm your verification link.">
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
          <div className="h-12 w-12 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
          <p className="text-sm text-ivory-400">Talking to the verification endpoint now.</p>
        </div>
      </FormWrapper>
    );
  }

  if (status === 'invalid') {
    return (
      <FormWrapper title="Invalid verification link" subtitle="This email verification link is missing or malformed.">
        <ActionBlock tone="error">
          <p className="text-sm text-ivory-400">Open the full link from your email, or request a fresh verification email after you sign in.</p>
          <Link to={APP_ROUTES.LOGIN} className="block">
            <Button type="button" variant="primary" fullWidth>
              Go to sign in
            </Button>
          </Link>
        </ActionBlock>
      </FormWrapper>
    );
  }

  if (status === 'success') {
    return (
      <FormWrapper title="Email verified" subtitle={message}>
        <ActionBlock tone="success">
          <p className="text-sm text-ivory-400">
            {isAuthenticated
              ? 'Your account is updated. Redirecting you to the dashboard now.'
              : 'Your email is confirmed. You can sign in normally now.'}
          </p>
          {isAuthenticated ? (
            <Button
              type="button"
              variant="primary"
              fullWidth
              onClick={() => navigate(APP_ROUTES.DASHBOARD, { replace: true })}
            >
              Go to dashboard
            </Button>
          ) : (
            <Link to={APP_ROUTES.LOGIN} className="block">
              <Button type="button" variant="primary" fullWidth>
                Go to sign in
              </Button>
            </Link>
          )}
        </ActionBlock>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title="Verification failed" subtitle={message || 'This verification link is invalid or expired.'}>
      <ActionBlock tone="error">
        <p className="text-sm text-ivory-400">
          {user?.email
            ? 'You can request a fresh verification email for your current account.'
            : 'Sign in to request a fresh verification email for your account.'}
        </p>
        {user?.email ? (
          <Button type="button" variant="secondary" fullWidth isLoading={isResending} loadingText="Sending..." onClick={handleResend}>
            Resend verification email
          </Button>
        ) : (
          <Link to={APP_ROUTES.LOGIN} className="block">
            <Button type="button" variant="primary" fullWidth>
              Sign in to resend
            </Button>
          </Link>
        )}
      </ActionBlock>
    </FormWrapper>
  );
}

function ActionBlock({ children, tone }) {
  const iconClasses = tone === 'error'
    ? 'bg-rose-400/10 border-rose-400/20 text-rose-400'
    : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400';

  const iconPath = tone === 'error'
    ? 'M12 9v3.75m0 3.75h.007v.008H12v-.008zm-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z'
    : 'M4.5 12.75l6 6 9-13.5';

  return (
    <div className="text-center space-y-6 py-4">
      <div className={`w-14 h-14 mx-auto rounded-full border flex items-center justify-center ${iconClasses}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      {children}
    </div>
  );
}

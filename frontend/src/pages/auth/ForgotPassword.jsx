import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import { APP_ROUTES } from '../../utils/constants';
import { getErrorMessage, isValidEmail } from '../../utils/helpers';
import FormWrapper from '../../components/forms/FormWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email) {
      setEmailError('Email is required.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setEmailError('');

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Don't reveal whether email exists — show generic message
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <FormWrapper
        title="Check your inbox"
        subtitle="If an account with that email exists, we've sent reset instructions."
      >
        <div className="text-center py-4 space-y-6">
          {/* Email icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <div>
            <p className="text-sm text-ivory-400 mb-1">We sent a reset link to</p>
            <p className="font-mono text-sm text-amber-400 bg-amber-400/5 px-3 py-1.5 rounded-lg inline-block">
              {email}
            </p>
          </div>

          <p className="text-xs text-ivory-400/40 leading-relaxed">
            The link expires in 1 hour. Check your spam folder if you don't see it.
          </p>

          <Link to={APP_ROUTES.LOGIN}>
            <Button variant="secondary" fullWidth>
              ← Back to sign in
            </Button>
          </Link>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper
      title="Reset password"
      subtitle="Enter your email address and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          label="Email address"
          type="email"
          name="email"
          id="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          error={emailError}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Send reset link
        </Button>

        <div className="text-center">
          <Link
            to={APP_ROUTES.LOGIN}
            className="text-sm text-ivory-400/60 hover:text-ivory-300 transition-colors font-body"
          >
            ← Back to sign in
          </Link>
        </div>
      </form>
    </FormWrapper>
  );
}

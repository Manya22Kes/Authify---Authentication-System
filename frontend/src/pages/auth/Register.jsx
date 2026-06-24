
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';
import { getErrorMessage, isValidEmail, getPasswordStrength } from '../../utils/helpers';
import FormWrapper from '../../components/forms/FormWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
  const { register, resendVerification, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isResending, setIsResending] = useState(false);

  const strength = getPasswordStrength(form.password);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email) errs.email = 'Email is required.';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!form.confirm) errs.confirm = 'Please confirm your password.';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(form.name.trim(), form.email, form.password);
      setRegisteredEmail(form.email);
      toast.success(result.message || 'Account created. Check your inbox to verify your email.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse) {
    try {
      await googleLogin(credentialResponse.credential);
  
      toast.success('Welcome to Authify!');
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  async function handleResendVerification() {
    setIsResending(true);
    try {
      const result = await resendVerification(registeredEmail);
      toast.success(result.message || 'Verification email sent.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  }

  if (registeredEmail) {
    return (
      <FormWrapper
        title="Check your inbox"
        subtitle="Your account is created. Verify your email before signing in."
      >
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-ivory-300">We sent a verification link to</p>
            <p className="font-mono text-sm text-amber-400 bg-amber-400/5 px-3 py-1.5 rounded-lg inline-block">
              {registeredEmail}
            </p>
            <p className="text-xs text-ivory-400/50 leading-relaxed">
              Click the link in that email to activate your account. The link expires in 1 hour.
            </p>
          </div>

          <div className="space-y-3">
            <Button type="button" variant="secondary" fullWidth isLoading={isResending} loadingText="Sending..." onClick={handleResendVerification}>
              Resend verification email
            </Button>
            <Link to={APP_ROUTES.LOGIN} className="block">
              <Button type="button" variant="primary" fullWidth>
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper
      title="Create account"
      subtitle="Start your 30-day free trial. No credit card required."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Input
          label="Full name"
          type="text"
          name="name"
          id="name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />

        <Input
          label="Email address"
          type="email"
          name="email"
          id="email"
          placeholder="you@company.com"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            id="password"
            placeholder="min. 8 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            leftIcon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            }
          />

          {/* Strength bar */}
          {form.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        strength.score >= level ? strength.color : '#30363d',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs font-body" style={{ color: strength.color }}>
                {strength.label}
              </p>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          name="confirm"
          id="confirm"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          disabled={isLoading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          }
        />

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Creating account..."
          className="mt-2"
        >
          Create account
        </Button>

        <div className="flex justify-center pt-1">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              toast.error('Google sign up failed');
            }}
            theme="filled_black"
            shape="pill"
            size="large"
            width="300"
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="secondary"
            className="h-10 w-full max-w-[300px] rounded-full border border-slate-300 bg-white px-4 font-sans font-medium tracking-normal text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-slate-900"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844a9.56 9.56 0 012.504.337c1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.748 0 .268.18.58.688.482A10.02 10.02 0 0022 12.017C22 6.484 17.523 2 12 2z" />
              </svg>
            }
            onClick={() => {
              window.location.href =
                `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
            }}
          >
            Sign in with GitHub
          </Button>
        </div>

        <p className="text-center text-xs text-ivory-400/50 font-body">
          Already have an account?{' '}
          <Link to={APP_ROUTES.LOGIN} className="text-amber-400 hover:text-amber-300 transition-colors">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-ivory-400/30 leading-relaxed font-body">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </FormWrapper>
  );
}

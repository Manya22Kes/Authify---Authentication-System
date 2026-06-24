
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';
import { getErrorMessage, isValidEmail } from '../../utils/helpers';
import FormWrapper from '../../components/forms/FormWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || APP_ROUTES.DASHBOARD;

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.email) errs.email = 'Email is required.';
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
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
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      // Surface field-level errors from backend if available
      if (err?.response?.data?.field) {
        setErrors({ [err.response.data.field]: msg });
      }
    } finally {
      setIsLoading(false);
    }
  }
  async function handleGoogleSuccess(credentialResponse) {
    try {
      await googleLogin(credentialResponse.credential);
  
      toast.success('Welcome to Authify!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <FormWrapper
      title="Sign in"
      subtitle="Welcome back. Enter your credentials to continue."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
            placeholder="••••••••"
            autoComplete="current-password"
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
          <div className="mt-2 text-right">
            <Link
              to={APP_ROUTES.FORGOT_PASSWORD}
              className="text-xs text-ivory-400/60 hover:text-amber-400 transition-colors font-body"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
          loadingText="Signing in..."
          className="mt-2"
        >
          Sign in
        </Button>

        <div className="flex justify-center pt-1">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast.error('Google sign in failed');
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


        {/* Divider */}
        <div className="divider">
          <span className="text-xs text-ivory-400/40 font-body">no account yet?</span>
        </div>

        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isLoading}
          onClick={() => navigate(APP_ROUTES.REGISTER)}
        >
          Create an account
        </Button>
      </form>
    </FormWrapper>
  );
}

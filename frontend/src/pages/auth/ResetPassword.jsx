import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../../services/authService';
import { APP_ROUTES } from '../../utils/constants';
import { getErrorMessage, getPasswordStrength } from '../../utils/helpers';
import FormWrapper from '../../components/forms/FormWrapper';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(form.password);

  // If no token in URL, show error state
  if (!token) {
    return (
      <FormWrapper title="Invalid link" subtitle="This password reset link is missing or malformed.">
        <div className="text-center space-y-6 py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-400/10 border border-rose-400/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-ivory-400">Request a new reset link from the forgot password page.</p>
          <Link to={APP_ROUTES.FORGOT_PASSWORD}>
            <Button variant="primary" fullWidth>Request new link</Button>
          </Link>
        </div>
      </FormWrapper>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.password) errs.password = 'New password is required.';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (!form.confirm) errs.confirm = 'Please confirm your password.';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    try {
      await authService.resetPassword(token, form.password);
      setSuccess(true);
      toast.success('Password updated successfully!');
    } catch (err) {
      const msg = getErrorMessage(err);
      toast.error(msg);
      if (msg.toLowerCase().includes('expired') || msg.toLowerCase().includes('invalid')) {
        setErrors({ password: 'This reset link has expired. Please request a new one.' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <FormWrapper title="Password updated!" subtitle="Your password has been changed successfully.">
        <div className="text-center space-y-6 py-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="text-sm text-ivory-400">You can now sign in with your new password.</p>
          <Button variant="primary" fullWidth onClick={() => navigate(APP_ROUTES.LOGIN, { replace: true })}>
            Sign in →
          </Button>
        </div>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper title="Set new password" subtitle="Choose a strong password for your account.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <Input
            label="New password"
            type="password"
            name="password"
            id="password"
            placeholder="min. 8 characters"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          {form.password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((l) => (
                  <div key={l} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ backgroundColor: strength.score >= l ? strength.color : '#30363d' }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
            </div>
          )}
        </div>

        <Input
          label="Confirm new password"
          type="password"
          name="confirm"
          id="confirm"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          disabled={isLoading}
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </FormWrapper>
  );
}

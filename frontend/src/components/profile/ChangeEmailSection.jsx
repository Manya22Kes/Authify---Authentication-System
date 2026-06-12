import { useState } from 'react';
import toast from 'react-hot-toast';
import profileService from '../../services/profileService';
import { getErrorMessage, isValidEmail } from '../../utils/helpers';
import SectionCard from './SectionCard';
import FormFeedback from './FormFeedback';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ChangeEmailSection({ user, emailVerified }) {
  const [step, setStep]         = useState(1); // 1 = form, 2 = sent
  const [form, setForm]         = useState({ newEmail: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setFeedback(null);
  }

  function validate() {
    const errs = {};
    if (!form.newEmail) errs.newEmail = 'New email address is required.';
    else if (!isValidEmail(form.newEmail)) errs.newEmail = 'Enter a valid email address.';
    else if (form.newEmail.toLowerCase() === user?.email?.toLowerCase())
      errs.newEmail = 'New email must be different from your current one.';
    if (!form.password) errs.password = 'Your current password is required to confirm this change.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true); 
    setFeedback(null);
    try {
      await profileService.changeEmail({
        newEmail: form.newEmail.trim().toLowerCase(),
        password: form.password,
      });
      setStep(2);
      /*toast.success('Verification email sent to your new address.');*/
      toast.success('Email updated successfully');
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('incorrect')) {
        setErrors((p) => ({ ...p, password: 'Incorrect password.' }));
      } else if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('use')) {
        setErrors((p) => ({ ...p, newEmail: 'This email is already in use.' }));
      } else {
        setFeedback({ type: 'error', message: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Unverified gate ────────────────────────────────────────────────────────
  if (!emailVerified) {
    return (
      <SectionCard
        title="Change email"
        description="You must verify your current email before changing to a new one."
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        }
      >
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/5 border border-amber-400/15">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-400">Verification required</p>
            <p className="text-xs text-ivory-400/60 mt-1 leading-relaxed font-body">
              Verify your current email address first. Check your inbox for a verification
              link, or use the <strong className="text-ivory-300">Verification Status</strong> section
              above to resend it.
            </p>
          </div>
        </div>
      </SectionCard>
    );
  }

  // ── Step 2: confirmation screen ────────────────────────────────────────────
  if (step === 2) {
    return (
      <SectionCard
        title="{/*Check your inbox*/}Check your profile"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/15">
            <div className="w-9 h-9 rounded-full bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">{/*Verification email sent*/}Email Changed</p>
              <p className="text-xs text-ivory-400/50 mt-0.5 font-mono">{form.newEmail}</p>
            </div>
          </div>
          <p className="text-xs text-ivory-400/50 leading-relaxed font-body">
            {/*Click the link in that email to confirm your new address.
            Your email will not change until you do.
            The link expires in 1 hour.*/}
            Your account email has been updated.
            Future sign-ins will use this address.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setStep(1); setForm({ newEmail: '', password: '' }); }}
          >
            ← Change a different address
          </Button>
        </div>
      </SectionCard>
    );
  }

  // ── Step 1: the form ───────────────────────────────────────────────────────
  return (
    <SectionCard
      title="Change email"
      description="A verification link will be sent to your new address before the change takes effect."
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Current email read-only */}
        <div>
          <label className="form-label">Current email</label>
          <div className="input-base flex items-center gap-2 opacity-60 cursor-not-allowed select-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ivory-400/50 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-sm font-mono text-ivory-300">{user?.email}</span>
          </div>
        </div>

        <Input
          label="New email address"
          type="email"
          name="newEmail"
          id="new-email"
          placeholder="new@example.com"
          autoComplete="email"
          value={form.newEmail}
          onChange={handleChange}
          error={errors.newEmail}
          disabled={loading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          }
        />

        <Input
          label="Current password (to confirm)"
          type="password"
          name="password"
          id="email-pwd"
          placeholder="Your current password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          disabled={loading}
        />

        {feedback && <FormFeedback type={feedback.type} message={feedback.message} />}

        <div className="flex items-center justify-end pt-1">
          <Button type="submit" variant="primary" size="md" isLoading={loading} loadingText="Updating..." disabled={loading}>
            {/*Send verification link*/}
            Update email
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

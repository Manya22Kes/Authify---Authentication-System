/**
 * ChangePasswordSection.jsx
 * Password change form with strength indicator and requirement checklist.
 *
 * Flow:
 *  1. User fills current password + new password + confirm
 *  2. Client validates (match, strength minimum)
 *  3. PATCH /users/change-password
 *  4. Show success state — form resets
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import profileService from '../../services/profileService';
import { getErrorMessage } from '../../utils/helpers';
import SectionCard from './SectionCard';
import FormFeedback from './FormFeedback';
import PasswordStrengthBar from './PasswordStrengthBar';
import Input from '../ui/Input';
import Button from '../ui/Button';

const EMPTY = { current: '', next: '', confirm: '' };

export default function ChangePasswordSection() {
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    setFeedback(null);
  }

  function validate() {
    const errs = {};
    if (!form.current)   errs.current  = 'Current password is required.';
    if (!form.next)      errs.next     = 'New password is required.';
    else if (form.next.length < 8) errs.next = 'Password must be at least 8 characters.';
    else if (form.next === form.current) errs.next = 'New password must differ from current.';
    if (!form.confirm)   errs.confirm  = 'Please confirm your new password.';
    else if (form.next !== form.confirm) errs.confirm = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setFeedback(null);
    try {
      await profileService.changePassword({
        currentPassword: form.current,
        newPassword: form.next,
      });
      setForm(EMPTY);
      setFeedback({ type: 'success', message: 'Password updated successfully. Use your new password on next sign-in.' });
      toast.success('Password changed.');
      setTimeout(() => setFeedback(null), 6000);
    } catch (err) {
      const msg = getErrorMessage(err);
      // Surface wrong-current-password as a field error
      if (msg.toLowerCase().includes('current') || msg.toLowerCase().includes('incorrect') || msg.toLowerCase().includes('wrong')) {
        setErrors((p) => ({ ...p, current: 'Incorrect current password.' }));
      } else {
        setFeedback({ type: 'error', message: msg });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard
      title="Change password"
      description="Use a strong, unique password you don't use elsewhere."
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Current password"
          type="password"
          name="current"
          id="pwd-current"
          placeholder="Your existing password"
          autoComplete="current-password"
          value={form.current}
          onChange={handleChange}
          error={errors.current}
          disabled={loading}
        />

        <div>
          <Input
            label="New password"
            type="password"
            name="next"
            id="pwd-next"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            value={form.next}
            onChange={handleChange}
            error={errors.next}
            disabled={loading}
          />
          <PasswordStrengthBar password={form.next} />
        </div>

        <Input
          label="Confirm new password"
          type="password"
          name="confirm"
          id="pwd-confirm"
          placeholder="Repeat new password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={handleChange}
          error={errors.confirm}
          disabled={loading}
        />

        {feedback && <FormFeedback type={feedback.type} message={feedback.message} />}

        <div className="flex items-center justify-end pt-1">
          <Button type="submit" variant="primary" size="md" isLoading={loading} loadingText="Updating..." disabled={loading}>
            Update password
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

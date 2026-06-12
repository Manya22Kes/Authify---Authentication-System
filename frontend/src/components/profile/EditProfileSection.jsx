/**
 * EditProfileSection.jsx
 * Allows the user to update their display name.
 *
 * On save:
 *  1. Calls profileService.updateProfile({ name })
 *  2. Calls updateUser() from AuthContext to sync changes everywhere
 *  3. Shows inline success/error feedback
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import profileService from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import SectionCard from './SectionCard';
import FormFeedback from './FormFeedback';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function EditProfileSection({ user }) {
  const { updateUser } = useAuth();

  const [name, setName]         = useState(user?.name ?? '');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading]   = useState(false);
  const [feedback, setFeedback] = useState(null); // { type, message }

  const isDirty = name.trim() !== (user?.name ?? '').trim();

  function validate() {
    if (!name.trim()) { setNameError('Name cannot be empty.'); return false; }
    if (name.trim().length < 2) { setNameError('Name must be at least 2 characters.'); return false; }
    if (name.trim().length > 80) { setNameError('Name must be under 80 characters.'); return false; }
    setNameError('');
    return true;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || !isDirty) return;

    setLoading(true);
    setFeedback(null);
    try {
      const data = await profileService.updateProfile({ name: name.trim() });
      // Sync into AuthContext so Sidebar footer + Dashboard header update too
      updateUser({ name: name.trim(), ...(data?.user ?? {}) });
      setFeedback({ type: 'success', message: 'Profile updated successfully.' });
      toast.success('Profile updated.');
      // Auto-clear after 4 s
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      const msg = getErrorMessage(err);
      setFeedback({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SectionCard
      title="Edit profile"
      description="Update your display name. Email changes are handled separately."
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
        </svg>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          type="text"
          id="profile-name"
          placeholder="Your full name"
          autoComplete="name"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); setFeedback(null); }}
          error={nameError}
          disabled={loading}
          leftIcon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />

        {/* Read-only email display */}
        <div>
          <label className="form-label">Email address</label>
          <div className="input-base flex items-center gap-2 opacity-60 cursor-not-allowed select-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ivory-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span className="text-sm text-ivory-300 font-body">{user?.email}</span>
          </div>
          <p className="mt-1.5 text-xs text-ivory-400/40 font-body">
            To change your email address, use the <em>Change Email</em> section below.
          </p>
        </div>

        {feedback && <FormFeedback type={feedback.type} message={feedback.message} />}

        <div className="flex items-center justify-end pt-1">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={loading}
            loadingText="Saving..."
            disabled={!isDirty || loading}
          >
            Save changes
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}

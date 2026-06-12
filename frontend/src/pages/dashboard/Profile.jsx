import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AvatarBlock from '../../components/profile/AvatarBlock';
import StatCard from '../../components/profile/StatCard';
import SectionCard from '../../components/profile/SectionCard';
import ProfileField from '../../components/profile/ProfileField';
import EditProfileSection from '../../components/profile/EditProfileSection';
import ChangePasswordSection from '../../components/profile/ChangePasswordSection';
import ChangeEmailSection from '../../components/profile/ChangeEmailSection';
import VerificationStatusSection from '../../components/profile/VerificationStatusSection';
import PageTransition from '../../components/animations/PageTransition';

function FieldSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-obsidian-800/40 py-3 last:border-0">
      <div className="h-3 w-16 animate-pulse rounded bg-obsidian-700" />
      <div className="h-3 w-28 animate-pulse rounded bg-obsidian-700/60" />
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleAvatarUpload(file) {
    try {
      setAvatarUploading(true);
      const response = await profileService.uploadAvatar(file);
      setProfile((prev) => ({
        ...(prev || user),
        avatar: response.data.avatar,
      }));
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    try {
      await profileService.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      await logout();
      navigate('/');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      try {
        const response = await profileService.getProfile();
        if (!cancelled) setProfile(response?.data ?? null);
      } catch {
        toast.error('Failed to fetch profile data');
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayUser = profile ?? user; 
  const emailVerified = displayUser?.isVerified ?? false;

  const statCards = [
    { label: 'Account', value: 'Active', accent: 'emerald', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ) },
    { label: 'Verification', value: emailVerified ? 'Verified' : 'Unverified', accent: emailVerified ? 'emerald' : 'amber', icon: (
      <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
      />
    </svg>
    ) },
    { label: 'Role', value: displayUser?.role ?? 'user', accent: displayUser?.role === 'admin' ? 'amber' : 'blue', icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
      </svg>
    ) },
    { label: 'Last login', value: displayUser?.lastLoginAt ? formatDate(displayUser.lastLoginAt) : 'This session', accent: 'magenta', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) },
  ];

  return (
  <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-ivory-400/30">Dashboard</span>
              <span className="text-xs text-ivory-400/20">/</span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Profile</span>
          </div>
          <h1 className="font-display text-xl font-bold text-ivory-100">Profile &amp; Settings</h1>
        </div>
      </div>

      <SectionCard>
        <div className="space-y-6">
          <AvatarBlock user={displayUser} emailVerified={emailVerified} onAvatarUpload={handleAvatarUpload} uploading={avatarUploading} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <SectionCard
          title="Account information"
          description="Read-only record of your account details."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>}
        >
          {profileLoading ? (
            <div>{Array.from({ length: 5 }).map((_, i) => <FieldSkeleton key={i} />)}</div>
          ) : (
            <div>
              <ProfileField label="User ID" value={displayUser?.id ?? displayUser?._id ?? '-'} mono copyable truncate />
              <ProfileField label="Email" value={displayUser?.email ?? '-'} mono copyable />
              <ProfileField label="Name" value={displayUser?.name ?? '-'} />
              <ProfileField label="Role" value={displayUser?.role ?? 'user'} mono />
              <ProfileField label="Member since" value={formatDate(displayUser?.createdAt)} />
              <ProfileField label="Last updated" value={displayUser?.updatedAt ? formatDate(displayUser.updatedAt) : '-'} />
            </div>
          )}
        </SectionCard>

        <EditProfileSection user={displayUser} />
        <VerificationStatusSection />
        <ChangePasswordSection />

        <div className="lg:col-span-2">
          <ChangeEmailSection user={displayUser} emailVerified={emailVerified} />
        </div>

        <div className="lg:col-span-2">
          <SectionCard
            title="Danger zone"
            description="Irreversible account actions. Proceed with caution."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          >
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-ivory-200">Delete account</p>
                <p className="mt-0.5 text-xs font-body text-ivory-400/50">
                  Permanently remove your account and all associated data. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(true)}
                disabled={deleteLoading}
                className="
                  min-h-[44px] w-full rounded-lg border border-rose-500/30 bg-rose-500/10 px-5 py-2.5
                  text-sm font-display font-semibold text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.15)]
                  transition-all duration-200 hover:border-rose-500/50 hover:bg-rose-500/15
                  hover:shadow-[0_0_30px_rgba(244,63,94,0.25)] disabled:cursor-not-allowed disabled:opacity-60
                  sm:w-auto
                "
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </SectionCard>
        </div>

        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => !deleteLoading && setDeleteModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="mx-4 w-full max-w-md rounded-2xl border border-rose-500/20 bg-obsidian-900 p-6 shadow-2xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.007v.008H12v-.008zm9-4.5c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-display font-bold text-rose-300">Delete Account</h3>
              </div>

              <p className="mb-6 text-sm text-ivory-400/70">
                This action is permanent. Your account and all associated data will be removed and cannot be recovered.
              </p>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password to continue"
                className="mb-6 w-full rounded-lg border border-obsidian-700 bg-obsidian-800 px-4 py-3 text-ivory-100"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="rounded-lg border border-obsidian-700 px-4 py-2 text-ivory-300 hover:bg-obsidian-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading || !deletePassword}
                  className="rounded-lg bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-60"
                >
                  {deleteLoading ? 'Deleting...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </PageTransition>  
  );
}

/**
 * VerificationStatusSection.jsx
 * Displays email verification status on the profile page.
 * Mirrors the dashboard card but lives in the profile flow.
 * Resend logic is self-contained (own cooldown state).
 */

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/helpers';
import SectionCard from './SectionCard';
import Spinner from '../loaders/Spinner';

export default function VerificationStatusSection() {
  const { user, resendVerification } = useAuth();

const emailVerified = user?.isVerified ?? false;

  const [resendState, setResendState] = useState('idle');
  const [cooldown, setCooldown]       = useState(0);

  async function handleResend() {
    if (resendState === 'loading' || cooldown > 0) return;
    setResendState('loading');
    try {
      await resendVerification();
      setResendState('sent');
      toast.success('Verification email sent — check your inbox.');
      let s = 60;
      setCooldown(s);
      const tick = setInterval(() => {
        s -= 1;
        setCooldown(s);
        if (s <= 0) { clearInterval(tick); setResendState('idle'); }
      }, 1000);
    } catch (err) {
      setResendState('idle');
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <SectionCard
      title="Verification status"
      description="Verified accounts can change email, recover access, and receive security alerts."
      icon={
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      }
    >
      {emailVerified ? (
        /* ── Verified ── */
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-400/6 border border-emerald-400/15">
            <div className="w-9 h-9 rounded-full bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-400">Email verified</p>
              <p className="text-xs text-ivory-400/50 mt-0.5 font-mono">{user?.email}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {['Account recovery enabled', 'Security alerts active', 'Email change unlocked'].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-xs text-ivory-300 font-body">
                <div className="w-4 h-4 rounded-full bg-emerald-400/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* ── Unverified ── */
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-400/6 border border-amber-400/15">
            <div className="w-9 h-9 rounded-full bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-400">Email not yet verified</p>
              <p className="text-xs text-ivory-400/50 mt-1 leading-relaxed font-body">
                A verification link was sent to <span className="font-mono text-ivory-300">{user?.email}</span>.
                Check your inbox and spam folder.
              </p>
            </div>
          </div>

          <button
            onClick={handleResend}
            disabled={resendState === 'loading' || cooldown > 0 || resendState === 'sent'}
            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
                       text-sm font-display font-semibold tracking-wide
                       transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                       ${resendState === 'sent'
                         ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20'
                         : 'bg-amber-400/10 hover:bg-amber-400/15 text-amber-400 border border-amber-400/20'
                       }`}
          >
            {resendState === 'loading' ? (
              <><Spinner size="xs" color="amber" /> Sending…</>
            ) : resendState === 'sent' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Email sent{cooldown > 0 ? ` · resend in ${cooldown}s` : ''}
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              'Resend verification email'
            )}
          </button>
        </div>
      )}
    </SectionCard>
  );
}

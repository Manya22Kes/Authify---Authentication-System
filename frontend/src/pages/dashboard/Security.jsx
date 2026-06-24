import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useAuth } from '../../hooks/useAuth';
import securityService from '../../services/securityService';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import { getDeviceLabel } from '../../utils/device';

import SectionCard from '../../components/profile/SectionCard';
import ProfileField from '../../components/profile/ProfileField';
import SecurityScoreCard from '../../components/security/SecurityScoreCard';
import AuthMethodRow from '../../components/security/AuthMethodRow';
import FutureFeatureCard from '../../components/security/FutureFeatureCard';
import PageTransition from '../../components/animations/PageTransition';

function ActivitySkeleton() {
  return (
    <div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between gap-4 border-b border-obsidian-800/40 py-3 last:border-0">
          <div className="h-2.5 w-20 animate-pulse rounded bg-obsidian-700" />
          <div className="h-2.5 w-28 animate-pulse rounded bg-obsidian-800 sm:w-36" />
        </div>
      ))}
    </div>
  );
}

function RecommendationItem({ text, done, soon }) {
  return (
    <div className="flex items-start gap-3 border-b border-obsidian-800/40 py-2.5 last:border-0">
      <div className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${done ? 'bg-emerald-400/10' : 'bg-amber-400/8'}`}>
        {done ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className={`text-sm font-body ${done ? 'text-ivory-300' : 'text-ivory-400/70'}`}>{text}</span>
        {soon && !done && (
          <span className="ml-2 rounded bg-obsidian-700 px-1.5 py-0.5 text-[10px] font-mono text-ivory-400/30">Soon</span>
        )}
      </div>
    </div>
  );
}

export default function Security() {
  const { user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchOverview() {
      try {
        const data = await securityService.getSecurityOverview();
        if (!cancelled) setOverview(data);
      } catch (err) {
        if (err?.response?.status !== 404) {
          toast.error(getErrorMessage(err));
        }
        if (!cancelled) setOverview(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOverview();
    return () => {
      cancelled = true;
    };
  }, []);

  const emailVerified = overview?.verification?.isVerified ?? user?.isVerified ?? false;
  const passwordProtected = overview?.securityIndicators?.passwordProtected ?? true;
  const mfaEnabled = false;
  const lastSuccessfulLogin = overview?.lastLogin?.loggedAt ?? user?.lastLoginAt ?? null;
  const lastFailedLogin = overview?.lastFailedLoginAt ?? null;
  const loginIp = overview?.lastLogin?.ipAddress ?? null;
  const deviceUsed = overview?.lastLogin?.userAgent
  ? getDeviceLabel(overview.lastLogin.userAgent)
  : null;


  const recommendations = [
    { text: 'Verify your email address', done: emailVerified },
    { text: 'Use a strong, unique password', done: passwordProtected },
    { text: 'Enable two-factor authentication', done: mfaEnabled, soon: true },
    { text: 'Review your active sessions regularly', done: true },
  ];

  const futureFeatures = [
    { label: 'Two-Factor Authentication', description: 'Add a second layer of login protection via TOTP.', accent: 'amber' , icon :<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
  </svg>},
    { label: 'SMS OTP Verification', description: 'Receive one-time codes via text message.', accent: 'magenta', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75h6.75m-6.75 3h4.5m5.625-6.75H5.25A2.25 2.25 0 003 8.25v7.5A2.25 2.25 0 005.25 18h4.879l3.621 3v-3h5A2.25 2.25 0 0021 15.75v-7.5A2.25 2.25 0 0018.75 6z" />
  </svg>},
    { label: 'Authenticator App', description: 'Use Google Authenticator or Authy for TOTP codes.', accent: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5A2.25 2.25 0 008.25 22.5h7.5A2.25 2.25 0 0018 20.25V3.75A2.25 2.25 0 0015.75 1.5H13.5m-3 0h3m-3 18h3" />
  </svg>},
    { label: 'Backup Recovery Codes', description: 'Generate emergency access codes.', accent: 'blue', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5A2.25 2.25 0 006.75 19.5h10.5A2.25 2.25 0 0019.5 17.25v-3m-9-4.5h6m-6 3h4.5" />
  </svg>},
    { label: 'Security Alerts', description: 'Get notified of suspicious login attempts.', accent: 'magenta', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.311 6.022c1.733.64 3.57 1.082 5.454 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>},
    { label: 'Login Notifications', description: 'Receive email alerts on every new sign-in.', accent: 'amber', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 7.5v9A2.25 2.25 0 0119.5 18.75h-15A2.25 2.25 0 012.25 16.5v-9A2.25 2.25 0 014.5 5.25h15A2.25 2.25 0 0121.75 7.5zm-1.5.75L12 13.5 3.75 8.25" />
  </svg>},
  ];

  return (
  <PageTransition>
      <div className="mx-auto max-w-6xl space-y-5 p-4 sm:space-y-6 sm:p-6 md:p-8">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-ivory-400/30">Dashboard</span>
            <span className="text-xs text-ivory-400/20">/</span>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Security</span>
        </div>
        <h1 className="font-display text-xl font-bold text-ivory-100">Security</h1>
        <p className="mt-0.5 text-sm font-body text-ivory-400/50">
          Manage authentication, verification, and account protection settings.
        </p>
      </div>

      <SecurityScoreCard
        emailVerified={emailVerified}
        passwordProtected={passwordProtected}
        mfaEnabled={mfaEnabled}
        loading={loading}
      />

      <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-2 mt-1">
        <SectionCard
          title="Authentication methods"
          description="Ways you can sign in to your account."
          noPad
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" /></svg>}
        >
          <AuthMethodRow label="Email & Password" description="Sign in with your email and password." status="active" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>} />
          <AuthMethodRow label="Google Sign-In" description="Link your Google account for one-click login." status="active" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" /></svg>} />
          <AuthMethodRow label="GitHub Sign-In" description="Use your GitHub identity for secure social sign-in." status="active" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.649.5.5 5.649.5 12a11.5 11.5 0 008 10.94c.584.108.797-.254.797-.564 0-.278-.01-1.015-.015-1.993-3.252.707-3.938-1.566-3.938-1.566-.532-1.351-1.299-1.712-1.299-1.712-1.062-.726.08-.711.08-.711 1.174.082 1.792 1.206 1.792 1.206 1.043 1.787 2.736 1.271 3.403.972.106-.756.408-1.271.743-1.563-2.596-.295-5.327-1.298-5.327-5.78 0-1.277.457-2.323 1.206-3.142-.12-.295-.523-1.484.115-3.093 0 0 .984-.315 3.225 1.2A11.24 11.24 0 0112 6.188c.994.005 1.996.134 2.932.394 2.24-1.515 3.223-1.2 3.223-1.2.64 1.609.237 2.798.117 3.093.75.819 1.204 1.865 1.204 3.142 0 4.493-2.735 5.482-5.338 5.771.42.361.794 1.074.794 2.166 0 1.564-.014 2.825-.014 3.21 0 .313.21.678.802.563A11.502 11.502 0 0023.5 12C23.5 5.649 18.351.5 12 .5z" /></svg>} />
          <AuthMethodRow label="Authenticator App" description="Use TOTP codes from an authenticator app." status="soon" last icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" /></svg>} />
        </SectionCard>

        <SectionCard
          title="Security activity"
          description="Recent authentication events on your account."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        >
          {loading ? (
            <ActivitySkeleton />
          ) : (
            <div>
              <ProfileField label="Last login" value={lastSuccessfulLogin ? formatDate(lastSuccessfulLogin) : '-'} />
              <ProfileField label="Last failed" value={lastFailedLogin ? formatDate(lastFailedLogin) : 'None recorded'} />
              <ProfileField label="Login IP" value={loginIp ?? '-'} mono truncate />
              <ProfileField label="Device" value={deviceUsed ?? '-'} truncate />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Recommendations"
          description="Steps to improve your account security."
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>}
        >
          <div>{recommendations.map((r) => <RecommendationItem key={r.text} {...r} />)}</div>
        </SectionCard>

        <div className="lg:col-span-2">
          <SectionCard
            title="Coming soon"
            description="Advanced security features currently in development."
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {futureFeatures.map((f) => <FutureFeatureCard key={f.label} {...f} />)}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  </PageTransition>  
  );
}

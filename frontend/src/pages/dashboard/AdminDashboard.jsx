import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import adminService from '../../services/adminService';
import Spinner from '../../components/loaders/Spinner';
import FutureFeatureCard from '../../components/security/FutureFeatureCard';
import PageTransition from '../../components/animations/PageTransition';

const upcomingItems = [
  {
    label: 'User Management',
    description: 'Manage users, account status and permissions.',
    accent: 'amber',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0" />
      </svg>
    ),
  },

  {
    label: 'Role Management',
    description: 'Assign roles and control permission levels.',
    accent: 'blue',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
      </svg>
    ),
  },

  {
    label: 'Audit Logs',
    description: 'Track important administrative actions and changes.',
    accent: 'magenta',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12m-12 5.25h12m-12 5.25h12M3.75 6.75h.008v.008H3.75V6.75zm0 5.25h.008v.008H3.75V12zm0 5.25h.008v.008H3.75v-.008z" />
      </svg>
    ),
  },

  {
    label: 'Security Alerts',
    description: 'Monitor suspicious activity across the platform.',
    accent: 'emerald',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
      </svg>
    ),
  },
];
export default function AdminDashboard() {
  const { user } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAdminDashboard() {
      try {
        const data = await adminService.getDashboard();
        if (!isMounted) return;
        setAdminData(data);
      } catch (err) {
        if (!isMounted) return;
        const message = getErrorMessage(err);
        setError(message);
        toast.error(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAdminDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
  <PageTransition>
    <div className="mx-auto max-w-6xl p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400/60">Admin Panel</p>
        </div>
        <h1 className="font-display text-2xl font-bold text-ivory-100">System Overview</h1>
        <p className="mt-1 text-sm text-ivory-400/60">
          Logged in as <span className="font-mono text-amber-400">{user?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 items-stretch">
        <div className="glass-card min-h-[220px] rounded-2xl border border-obsidian-700/70 p-6 h-full">
          <h2 className="mb-5 flex items-center gap-2 font-display font-semibold text-ivory-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7.5 4.5v4.75c0 5.25-3.438 8.812-7.5 9.75-4.062-.938-7.5-4.5-7.5-9.75V7.5L12 3z" />
        </svg>
        Access Check
          </h2>
          {isLoading ? (
            <div className="flex h-full min-h-[140px] items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <p className="text-sm text-rose-300">{error}</p>
              <p className="mt-2 text-xs text-ivory-400/50">
                This confirms the frontend route guard worked, but the backend admin endpoint still rejected the request.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <StatusRow label="Backend message" value={adminData?.message || 'Welcome Admin'} />
              <StatusRow label="Current role" value={user?.role || 'admin'} />
              <StatusRow label="Session type" value="Cookie refresh + bearer access token" />
              <StatusRow label="Member since" value={user?.createdAt ? formatDate(user.createdAt) : 'Unavailable'} />
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl border border-obsidian-700/70 p-6 h-full">
        <h2 className="mb-5 flex items-center gap-2 font-display font-semibold text-ivory-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
        Current Admin Session
        </h2>
          <div className="space-y-4">
            <StatusRow label="Name" value={user?.name || 'Unavailable'} />
            <StatusRow label="Email" value={user?.email || 'Unavailable'} />
            <StatusRow label="User ID" value={user?.id || 'Unavailable'} mono />
            <StatusRow label="Last sync" value={formatDate(new Date())} />
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-obsidian-700/70 p-6 md:col-span-2">
          <h2 className="mb-5 font-display font-semibold text-ivory-100">Administrative Tools Roadmap</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {upcomingItems.map((item) => (
              <FutureFeatureCard
                key={item.label}
                label={item.label}
                description={item.description}
                accent={item.accent}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </PageTransition>
  );
}

function StatusRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-obsidian-800/60 py-2 last:border-0">
      <span className="text-xs font-mono uppercase tracking-wider text-ivory-400/50">{label}</span>
      <span className={`break-words text-right text-sm text-ivory-200 ${mono ? 'font-mono break-all' : 'font-body'}`}>{value}</span>
    </div>
  );
}

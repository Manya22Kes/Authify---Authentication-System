/**
 * AdminDashboard.jsx
 * Admin-only control panel backed by the real protected admin endpoint.
 */

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, getErrorMessage } from '../../utils/helpers';
import adminService from '../../services/adminService';
import Spinner from '../../components/loaders/Spinner';

const upcomingItems = [
  'User management',
  'Session management',
  'Audit logs',
  'Security alerts',
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <p className="text-xs font-mono text-amber-400/60 uppercase tracking-widest">Admin Panel</p>
        </div>
        <h1 className="font-display text-2xl font-bold text-ivory-100">
          System Overview
        </h1>
        <p className="text-sm text-ivory-400/60 mt-1">
          Logged in as <span className="text-amber-400 font-mono">{user?.email}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 min-h-[220px]">
          <h2 className="font-display font-semibold text-ivory-100 mb-5">Access Check</h2>

          {isLoading ? (
            <div className="h-full min-h-[140px] flex items-center justify-center">
              <Spinner />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
              <p className="text-sm text-rose-300">{error}</p>
              <p className="text-xs text-ivory-400/50 mt-2">
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

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ivory-100 mb-5">Current Admin Session</h2>
          <div className="space-y-4">
            <StatusRow label="Name" value={user?.name || 'Unavailable'} />
            <StatusRow label="Email" value={user?.email || 'Unavailable'} />
            <StatusRow label="User ID" value={user?.id || 'Unavailable'} mono />
            <StatusRow label="Last sync" value={formatDate(new Date())} />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <h2 className="font-display font-semibold text-ivory-100 mb-5">Upcoming Admin Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {upcomingItems.map((item) => (
              <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-obsidian-800/50 border border-obsidian-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-obsidian-500 flex-shrink-0" />
                <span className="text-xs text-ivory-400/50 font-body">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-obsidian-800/60 last:border-0 gap-4">
      <span className="text-xs text-ivory-400/50 uppercase tracking-wider font-mono">{label}</span>
      <span className={`text-sm text-right text-ivory-200 ${mono ? 'font-mono break-all' : 'font-body'}`}>
        {value}
      </span>
    </div>
  );
}

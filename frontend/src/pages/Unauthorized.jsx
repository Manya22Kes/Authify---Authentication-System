import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../utils/constants';
import Button from '../components/ui/Button';

export default function Unauthorized() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-obsidian-950 grid-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md animate-slide-up">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-rose-400/5 border border-rose-400/20 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-rose-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>

        {/* Code */}
        <p className="font-mono text-rose-400/50 text-sm tracking-widest mb-3 uppercase">403 Forbidden</p>

        {/* Heading */}
        <h1 className="font-display text-3xl font-bold text-ivory-100 mb-4">
          Access denied.
        </h1>

        <p className="text-ivory-400/70 font-body leading-relaxed mb-8">
          You don't have permission to view this page.
          {user?.role && (
            <> Your current role is <span className="font-mono text-amber-400 text-sm">{user.role}</span>.</>
          )}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" onClick={() => navigate(-1)}>
            ← Go back
          </Button>
          <Link to={APP_ROUTES.DASHBOARD}>
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

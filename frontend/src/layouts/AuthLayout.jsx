import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../utils/constants';
import PageLoader from '../components/loaders/PageLoader';
import { Link } from 'react-router-dom';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  // Already logged in → go to dashboard
  if (isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="min-h-screen bg-obsidian-950 grid-bg flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-amber-400/4 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-amber-400/3 rounded-full blur-3xl" />
      </div>

      {/* Minimal header */}
      <header className="relative z-10 px-8 py-6">
        <Link to={APP_ROUTES.HOME} className="inline-flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-obsidian-950" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-display font-bold text-ivory-100 tracking-tight">Authify</span>
        </Link>
      </header>

      {/* Main centred content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-5 text-center">
        <p className="text-xs text-ivory-400/30 font-body">
          © {new Date().getFullYear()} Authify. Secured by design.
        </p>
      </footer>
    </div>
  );
}

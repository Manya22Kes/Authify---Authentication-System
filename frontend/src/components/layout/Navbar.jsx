
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../utils/constants';
import Button from '../ui/Button';

export default function Navbar() {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 z-40 border-b border-obsidian-800/60 bg-obsidian-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to={APP_ROUTES.HOME} className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center transition-transform group-hover:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-obsidian-950" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-ivory-100 tracking-tight">Authify</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-ivory-400 hover:text-ivory-100 transition-colors font-body">Features</a>
          <a href="#security" className="text-sm text-ivory-400 hover:text-ivory-100 transition-colors font-body">Security</a>
          <a href="#docs" className="text-sm text-ivory-400 hover:text-ivory-100 transition-colors font-body">Docs</a>
        </div>

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link to={APP_ROUTES.DASHBOARD}>
              <Button size="sm" variant="primary">
                Dashboard →
              </Button>
            </Link>
          ) : (
            <>
              <Link to={APP_ROUTES.LOGIN}>
                <Button size="sm" variant="ghost">Sign in</Button>
              </Link>
              <Link to={APP_ROUTES.REGISTER}>
                <Button size="sm" variant="primary">Get started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

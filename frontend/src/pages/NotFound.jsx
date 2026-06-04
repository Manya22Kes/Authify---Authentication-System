import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../utils/constants';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian-950 grid-bg flex items-center justify-center px-6">
      <div className="text-center max-w-md animate-slide-up">
        {/* Large 404 */}
        <div className="mb-8 relative">
          <p className="font-display text-[120px] md:text-[160px] font-bold text-obsidian-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-display text-2xl font-bold text-ivory-100 mb-3">
          Page not found.
        </h1>
        <p className="text-ivory-400/70 font-body mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to={APP_ROUTES.HOME}>
            <Button variant="primary">← Back to home</Button>
          </Link>
          <Link to={APP_ROUTES.DASHBOARD}>
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

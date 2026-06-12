
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PageLoader from '../components/loaders/PageLoader';
import { APP_ROUTES } from '../utils/constants';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Wait for session restoration before making routing decision
  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    // Preserve intended destination for post-login redirect
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <Outlet />;
}

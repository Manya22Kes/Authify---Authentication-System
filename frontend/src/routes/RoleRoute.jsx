
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../utils/constants';

/**
 * @param {{ roles: string[] }} props - Array of allowed roles
 */
export default function RoleRoute({ roles = [] }) {
  const { user } = useAuth();

  const isAllowed = roles.length === 0 || roles.includes(user?.role);

  if (!isAllowed) {
    return <Navigate to={APP_ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
}

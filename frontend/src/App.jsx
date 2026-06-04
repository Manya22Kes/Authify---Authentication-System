import { Routes, Route } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Route guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Public pages
import Landing from './pages/Landing';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Toast
import ToastProvider from './components/ui/ToastProvider';

// Role constants
import { APP_ROUTES, ROLES } from './utils/constants';

export default function App() {
  return (
    <>
      <ToastProvider />

      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />
        <Route path={APP_ROUTES.VERIFY_EMAIL_ROUTE} element={<VerifyEmail />} />

        {/* Auth flow — AuthLayout redirects already-authed users to dashboard */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected: requires authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Any authenticated user */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Admin-only routes */}
            <Route element={<RoleRoute roles={[ROLES.ADMIN]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Misc public pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

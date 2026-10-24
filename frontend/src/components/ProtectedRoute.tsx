import { Navigate, Outlet } from 'react-router';
import { ApiError } from '../lib/api';
import { getToken } from '../lib/token';
import { useCurrentUser } from '../lib/useCurrentUser';

export default function ProtectedRoute() {
  const { isPending, isError, error } = useCurrentUser();

  if (!getToken()) return <Navigate to="/login" replace />;
  if (isPending) return <p className="p-8 text-muted">Loading...</p>;

  if (isError) {
    if (error instanceof ApiError && error.status === 401) {
      return <Navigate to="/login" replace />;
    }
    return <p className="p-8 text-danger">Cannot reach the server. Please try again.</p>;
  }

  return <Outlet />;
}
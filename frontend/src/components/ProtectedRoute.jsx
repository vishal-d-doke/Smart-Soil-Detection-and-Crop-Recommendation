import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAuthToken } from '../api';

export default function ProtectedRoute() {
  const token = getAuthToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

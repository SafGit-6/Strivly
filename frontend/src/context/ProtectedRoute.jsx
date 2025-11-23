import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';


function ProtectedRoute() {
    const { user } = useAuth();

  if (!user) {
    // If no user is logged in, redirect to the authentication page
    return <Navigate to="/" replace />;
  }

  // If a user is logged in, render the requested page
  return <Outlet />;
}

export default ProtectedRoute;

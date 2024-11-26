import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresManager?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresManager = false
}) => {
  const { isLoggedIn, user, checkAuthStatus } = useAuth();
  const location = useLocation();

  if (!checkAuthStatus() || !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresManager && !user?.venueManager) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
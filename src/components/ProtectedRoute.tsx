import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresManager?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiresManager = false }) => {
  const { isLoggedIn, user, checkAuthStatus, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    )
  }

  if (!checkAuthStatus() || !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (requiresManager && !user?.venueManager) {
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
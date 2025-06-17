import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './auth';

const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const userRole = getUserRole();
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Element />;
};

export default ProtectedRoute;

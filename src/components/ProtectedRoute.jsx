import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCokie } from '../app/utils/utils';

const ProtectedRoute = ({ children }) => {
  const token = getCokie('access_token');
  
  if (!token) {
    // Redirect to login if no token found
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

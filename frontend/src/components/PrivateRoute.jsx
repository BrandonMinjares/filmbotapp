import React from 'react';
import {Navigate} from 'react-router-dom';

/**
 * @return {void}
 */
export default function PrivateRoute({children}) {
  const isAuthenticated = localStorage.getItem('user');

  return (
    isAuthenticated ? children : <Navigate to="/login" />
  );
}


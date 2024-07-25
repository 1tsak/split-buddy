import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import React, { useState } from 'react';

import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const ProtectedRoute: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

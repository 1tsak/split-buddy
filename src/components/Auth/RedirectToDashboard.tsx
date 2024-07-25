import { Box, CircularProgress } from '@mui/material';

import { Navigate } from 'react-router-dom';
import React from 'react';
import { auth } from '../../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const RedirectToDashboard: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const [user, loading] = useAuthState(auth);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

export default RedirectToDashboard;

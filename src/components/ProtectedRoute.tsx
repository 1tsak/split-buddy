import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const [state,setStat] = useState<boolean>(true);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return state ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;

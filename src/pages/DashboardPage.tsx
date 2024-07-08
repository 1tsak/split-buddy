import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { Box, Avatar, Typography, CircularProgress, Button } from '@mui/material';
import { signOut } from 'firebase/auth';

const DashboardPage: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error.message}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Avatar
        src={user?.photoURL || ''}
        alt={user?.displayName || ''}
        sx={{ width: 100, height: 100, mb: 2 }}
      />
      <Typography variant="h4">{user?.displayName}</Typography>
      <Typography variant="h6">{user?.email}</Typography>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 4 }}
        onClick={handleLogout}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default DashboardPage;

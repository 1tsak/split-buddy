// components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, Box, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import UserInfoModal from './UserInfoModal';

const Sidebar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '250px',
        height: '100vh',
        backgroundColor: '#576cce',
        padding: '20px',
        justifyContent: 'space-between',
        borderRadius: '0 20px 20px 0', // Rounded edges on the right side
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
      }}
    >
      {/* Navigation Links */}
      <Box>
        <NavLink to="/dashboard" className="nav-link" style={{ textDecoration: 'none', color: 'white', marginBottom: '15px' }}>
          Home
        </NavLink>
        <NavLink to="/groups" className="nav-link" style={{ textDecoration: 'none', color: 'white', marginBottom: '15px' }}>
          Groups
        </NavLink>
        <NavLink to="/notifications" className="nav-link" style={{ textDecoration: 'none', color: 'white', marginBottom: '15px' }}>
          Notifications
        </NavLink>
      </Box>

      {/* Avatar and User Info */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        {loading ? (
          <CircularProgress sx={{ color: 'white' }} />
        ) : (
          <Avatar
            src={user?.photoURL || ''}
            alt={user?.displayName || ''}
            sx={{ width: 50, height: 50, cursor: 'pointer' }}
            onClick={handleModalOpen}
          />
        )}
      </Box>

      {/* User Info Modal */}
      <UserInfoModal isOpen={isModalOpen} onClose={handleModalClose} user={user} onLogout={handleLogout} />
    </Box>
  );
};

export default Sidebar;


import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, Box, CircularProgress, Typography } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import UserInfoModal from './UserInfoModal';

const Sidebar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

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

  const navLinks = [
    { path: '/dashboard', name: 'Home' },
    { path: '/group', name: 'Groups' },
    { path: '/notifications', name: 'Notifications' },
  ];

  return (
       <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height:"93vh",
        width: '250px',
        backgroundColor: '#576cce',
        padding: '20px',
        justifyContent: 'space-between',
        borderRadius: '0 20px 20px 0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Navigation Links */}
      <Box className="flex-grow overflow-y-auto">
        {navLinks.map((link) => (
          <NavLink
            to={link.path}
            key={link.name}
            className={`text-white mb-4 block ${
              location.pathname === link.path ? 'underline' : ''
            }`}
          >
            <Typography variant="h6">{link.name}</Typography>
          </NavLink>
        ))}
      </Box>

      {/* Avatar and User Info */}
      <Box className="flex items-center mb-5">
        {loading ? (
          <CircularProgress className="text-white" />
        ) : (
          <Avatar
            src={user?.photoURL || ''}
            alt={user?.displayName || ''}
            className="w-12 h-12 cursor-pointer"
            onClick={handleModalOpen}
          />
        )}
      </Box>

      {/* User Info Modal */}
      <UserInfoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={user}
        onLogout={handleLogout}
      />
    </Box>
  );
};

export default Sidebar;

// src/pages/DashboardPage.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
      }}
    >
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">Welcome to your dashboard!</Typography>
    </Box>
  );
};

export default DashboardPage;

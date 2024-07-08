// src/pages/LoginPage.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage: React.FC = () => {
  return (
    <div>
      <AuthForm isSignUp={false} />
    </div>
  );
};

export default LoginPage;

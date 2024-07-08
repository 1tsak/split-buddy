// src/pages/SignUpPage.tsx
import React from 'react';
import AuthForm from '../components/AuthForm';

const SignUpPage: React.FC = () => {
  return (
    <div>
      <AuthForm isSignUp={true} />
    </div>
  );
};

export default SignUpPage;

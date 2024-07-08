import React from 'react';
import SignUpForm from '../components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div>
      <SignUpForm />
      <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
  );
};

export default SignUpPage;

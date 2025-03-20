
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 pt-24 pb-12 flex items-center justify-center">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
};

export default Login;

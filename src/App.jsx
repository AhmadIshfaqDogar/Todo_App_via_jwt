import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import Onboarding from './components/Onboarding';
import Login from './components/Login';
import Register from './components/Register';
import TodoApp from './components/TodoApp';
import Background from './components/Background';

function App() {
  const [currentScreen, setCurrentScreen] = useState('loader');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const user = localStorage.getItem('user') || sessionStorage.getItem('user');
      
      if (token && user) {
        setIsLoggedIn(true);
        setCurrentScreen('todo');
      } else {
        // No user logged in, show loader then onboarding
        const timer = setTimeout(() => {
          setCurrentScreen('onboarding');
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    checkAuthStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setCurrentScreen('login');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('todo');
  };

  const handleRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleLogout = () => {
    // Clear both storage locations on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  return (
    <div className="h-screen w-screen relative">
      <Background />
      {currentScreen === 'loader' && <Loader />}
      {currentScreen === 'onboarding' && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'login' && (
        <Login 
          onLogin={handleLogin} 
          onRegister={handleRegister}
        />
      )}
      {currentScreen === 'register' && (
        <Register 
          onRegister={handleLogin} 
          onBackToLogin={handleBackToLogin}
        />
      )}
      {currentScreen === 'todo' && isLoggedIn && (
        <TodoApp onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
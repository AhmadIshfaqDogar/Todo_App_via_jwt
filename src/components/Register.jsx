import React, { useState } from 'react';

const Register = ({ onRegister, onBackToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/todo-app/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        onRegister();
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative z-10">
      <div className="relative w-full max-w-sm md:max-w-md">
        {/* Responsive Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl border border-indigo-200 p-5 md:p-6">
          
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-700 mb-1 md:mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-xs md:text-sm">
              Join thousands of productive users
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl mb-3 md:mb-4 text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* Responsive Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 md:mb-2 text-xs md:text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg md:rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm md:text-base"
                placeholder="Enter your full name"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 md:mb-2 text-xs md:text-sm">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg md:rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm md:text-base"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 md:mb-2 text-xs md:text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg md:rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm md:text-base"
                placeholder="Create a password (min 6 characters)"
                required
                disabled={loading}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 md:mb-2 text-xs md:text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-3 md:px-4 py-2 md:py-3 bg-white border border-gray-300 rounded-lg md:rounded-xl text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm md:text-base"
                placeholder="Confirm your password"
                required
                disabled={loading}
              />
            </div>

            {/* Terms and Conditions */}
            <label className="flex items-start mt-2 md:mt-3">
              <input
                type="checkbox"
                className="w-3 h-3 md:w-4 md:h-4 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500 mt-0.5 md:mt-1 flex-shrink-0"
                required
                disabled={loading}
              />
              <span className="ml-2 text-gray-700 text-xs md:text-sm leading-tight">
                I agree to the{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50" disabled={loading}>
                  Terms
                </button>{' '}
                &{' '}
                <button type="button" className="text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50" disabled={loading}>
                  Privacy
                </button>
              </span>
            </label>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-2 md:mt-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 md:my-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-2 md:px-3 text-gray-500 text-xs md:text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6">
            <button 
              className="flex items-center justify-center px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 border border-gray-300 rounded-lg md:rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-300 text-xs md:text-sm disabled:opacity-50"
              disabled={loading}
            >
              Google
            </button>
            <button 
              className="flex items-center justify-center px-2 md:px-3 py-1.5 md:py-2 bg-gray-100 border border-gray-300 rounded-lg md:rounded-xl text-gray-700 hover:bg-gray-200 transition-all duration-300 text-xs md:text-sm disabled:opacity-50"
              disabled={loading}
            >
              GitHub
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-600 text-xs md:text-sm">
              Already have an account?{' '}
              <button
                onClick={onBackToLogin}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              >
                Sign in
              </button>
            </p>
          </div>

          {/* Demo Hint */}
          <div className="mt-3 md:mt-4 p-2 md:p-3 bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl text-center">
            <p className="text-blue-700 text-xs md:text-sm">
              <strong>Note:</strong> Passwords are securely hashed and stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
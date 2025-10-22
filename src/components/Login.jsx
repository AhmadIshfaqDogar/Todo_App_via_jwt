import React, { useState } from "react";

const Login = ({ onLogin, onRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false, // Add rememberMe to state
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost/todo-app/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (formData.rememberMe) {
          // Store with expiration time (10 hours = 10 * 60 * 60 * 1000 ms)
          const expirationTime = Date.now() + 10 * 60 * 60 * 1000;

          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("tokenExpiration", expirationTime.toString());
        } else {
          sessionStorage.setItem("token", data.data.token);
          sessionStorage.setItem("user", JSON.stringify(data.data.user));
        }

        onLogin();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center p-4 relative z-10">
      {/* Content Container with Blur Background Only on Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-indigo-200 p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-indigo-700 mb-2 sm:mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-gray-300 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base md:text-lg"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-2 sm:mb-3 text-sm sm:text-base md:text-lg">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border border-gray-300 rounded-xl sm:rounded-2xl text-gray-800 placeholder-gray-500 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm sm:text-base md:text-lg"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 bg-white text-indigo-600 focus:ring-indigo-500"
                  disabled={loading}
                />
                <span className="ml-2 sm:ml-3 text-gray-700 text-xs sm:text-sm md:text-base">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-700 text-xs sm:text-sm md:text-base transition-colors duration-300 disabled:opacity-50"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 sm:my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 sm:px-4 text-gray-500 text-xs sm:text-sm md:text-base">
              or
            </span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm disabled:opacity-50"
              disabled={loading}
            >
              <span>Google</span>
            </button>
            <button
              className="flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl sm:rounded-2xl text-gray-700 hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm disabled:opacity-50"
              disabled={loading}
            >
              <span>GitHub</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Don't have an account?{" "}
              <button
                onClick={onRegister}
                className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline transition-all duration-300 disabled:opacity-50"
                disabled={loading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

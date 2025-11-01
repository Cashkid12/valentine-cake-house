import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: 'admin@valentinecakehouse.com',
    password: 'valentine2024'
  });
  const [loginError, setLoginError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');
    setErrorDetails('');

    console.log('🔄 Login started...');

    // Test direct API call first
    try {
      console.log('🔍 Testing API connectivity...');
      const healthResponse = await fetch('https://valentine-cake-house.onrender.com/api/health');
      const healthData = await healthResponse.json();
      console.log('🏥 API Health:', healthData);
      setErrorDetails(`API Health: ${healthData.status}\nEnvironment: ${healthData.environment}`);
    } catch (healthError) {
      console.error('❌ API Health check failed:', healthError);
      setErrorDetails('API server is not reachable. Please check your connection.');
    }

    const result = await login(credentials.email, credentials.password);
    
    console.log('📋 Login result:', result);
    
    if (result.success) {
      console.log('✅ Login successful, navigating to admin...');
      navigate('/admin');
    } else {
      console.log('❌ Login failed:', result.message);
      setLoginError(result.message);
      setErrorDetails(`Error: ${result.message}\n\nTry using:\nEmail: admin@valentinecakehouse.com\nPassword: valentine2024`);
    }
    
    setIsLoading(false);
  };

  // Add a test function to check the API directly
  const testDirectLogin = async () => {
    try {
      setErrorDetails('Testing direct API call...');
      
      const response = await fetch('https://valentine-cake-house.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@valentinecakehouse.com',
          password: 'valentine2024'
        })
      });
      
      const data = await response.json();
      setErrorDetails(`Direct API Test Result:\nStatus: ${response.status}\nSuccess: ${data.success}\nMessage: ${data.message || 'No message'}\n\nFull Response: ${JSON.stringify(data, null, 2)}`);
      
    } catch (error) {
      setErrorDetails(`Direct API Error: ${error.message}\n\nMake sure:\n1. Backend is running\n2. CORS is configured\n3. Database is connected`);
    }
  };

  const autoFillCredentials = () => {
    setCredentials({
      email: 'admin@valentinecakehouse.com',
      password: 'valentine2024'
    });
    setErrorDetails('Credentials auto-filled! Click "Sign In to Dashboard" to login.');
  };

  return (
    <div className="min-h-screen section-sweet flex items-center justify-center py-12">
      {/* Floating decorative elements */}
      <div className="fixed top-20 left-10 w-6 h-6 bg-gradient-to-r from-primary-400 to-berry-400 rounded-full opacity-20 animate-float"></div>
      <div className="fixed top-40 right-20 w-8 h-8 bg-gradient-to-r from-gold-300 to-gold-400 rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 hover-lift transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-berry-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl text-white">🔐</span>
          </div>
          <h1 className="cursive text-3xl text-primary-700 mb-2">Admin Login</h1>
          <p className="text-gray-600 font-medium">Valentine Cake House Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50 hover:bg-white/70"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          {loginError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm font-medium mb-2">{loginError}</p>
              <button
                type="button"
                onClick={testDirectLogin}
                className="text-red-600 text-sm underline font-medium"
              >
                🔧 Click to see detailed technical error
              </button>
            </div>
          )}

          {errorDetails && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm font-mono whitespace-pre-wrap">
                {errorDetails}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'btn-primary hover:scale-105 hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-primary-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700 text-center font-medium mb-3">
            Demo Credentials
          </p>
          <div className="text-center space-y-2">
            <p className="text-blue-600 text-sm font-mono">admin@valentinecakehouse.com</p>
            <p className="text-blue-600 text-sm font-mono">valentine2024</p>
            <button
              onClick={autoFillCredentials}
              className="text-blue-600 text-sm underline font-medium hover:text-blue-700 transition-colors"
            >
              🚀 Auto-fill demo credentials
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Having issues? Check that your backend is running and database is connected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

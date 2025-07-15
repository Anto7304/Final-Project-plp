import React, { useState, useContext } from 'react';
import { login } from '../../services/auth.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useContext(AuthContext);

  const validateForm = () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      const res = await login({ email, password });
      if (res.data.success) {
        setAuth({ user: res.data.user, token: res.data.token });
        toast.success('Login successful!');
      } else {
        setError(res.data.message || 'Login failed');
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
      toast.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto" aria-labelledby="login-form-title" noValidate>
      <h2 id="login-form-title" className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <div className="mb-4 text-red-600 bg-red-50 rounded px-3 py-2 text-center" role="alert" aria-live="assertive">{error}</div>}
      <div className="mb-4">
        <label htmlFor="login-email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required aria-invalid={!!error} aria-describedby={error ? 'login-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline" />
      </div>
      <div className="mb-6">
        <label htmlFor="login-password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            aria-invalid={!!error}
            aria-describedby={error ? 'login-form-error' : undefined}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400">Login</button>
      {error && <div id="login-form-error" className="sr-only">{error}</div>}
    </form>
  );
};

export default Login;

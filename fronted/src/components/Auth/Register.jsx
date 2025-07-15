import React, { useState, useContext } from 'react';
import { register } from '../../services/auth.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    userName: '', 
    profilePicture: '' 
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (!form.userName.trim() || form.userName.length < 3) {
      setError('User name must be at least 3 characters.');
      return false;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (form.profilePicture && !/^https?:\/\/.+/.test(form.profilePicture)) {
      setError('Profile picture must be a valid URL.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    try {
      const res = await register(form);
      if (res.data.success) {
        setAuth({ user: res.data.user, token: res.data.token });
        toast.success('Registration successful!');
      } else {
        setError(res.data.message || 'Registration failed');
        toast.error(res.data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
      toast.error('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto" aria-labelledby="register-form-title" noValidate>
      <h2 id="register-form-title" className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <div className="mb-4 text-red-600 bg-red-50 rounded px-3 py-2 text-center" role="alert" aria-live="assertive">{error}</div>}
      
      <div className="mb-4">
        <label htmlFor="register-username" className="block text-gray-700 text-sm font-bold mb-2">User Name:</label>
        <input 
          id="register-username" 
          name="userName" 
          value={form.userName} 
          onChange={handleChange} 
          required 
          minLength={3} 
          aria-invalid={!!error} 
          aria-describedby={error ? 'register-form-error' : undefined} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline" 
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="register-email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input 
          id="register-email" 
          type="email" 
          name="email" 
          value={form.email} 
          onChange={handleChange} 
          required 
          aria-invalid={!!error} 
          aria-describedby={error ? 'register-form-error' : undefined} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline" 
        />
      </div>
      
      <div className="mb-4 relative">
        <label htmlFor="register-password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <div className="relative">
          <input 
            id="register-password" 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={form.password} 
            onChange={handleChange} 
            required 
            minLength={6} 
            aria-invalid={!!error} 
            aria-describedby={error ? 'register-form-error' : undefined} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline pr-10" 
          />
          <button 
            type="button" 
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      
      <div className="mb-4 relative">
        <label htmlFor="register-confirm-password" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password:</label>
        <div className="relative">
          <input 
            id="register-confirm-password" 
            type={showConfirmPassword ? "text" : "password"} 
            name="confirmPassword" 
            value={form.confirmPassword} 
            onChange={handleChange} 
            required 
            minLength={6} 
            aria-invalid={!!error} 
            aria-describedby={error ? 'register-form-error' : undefined} 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline pr-10" 
          />
          <button 
            type="button" 
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <label htmlFor="register-profilePicture" className="block text-gray-700 text-sm font-bold mb-2">Profile Picture URL:</label>
        <input 
          id="register-profilePicture" 
          name="profilePicture" 
          value={form.profilePicture} 
          onChange={handleChange} 
          aria-invalid={!!error} 
          aria-describedby={error ? 'register-form-error' : undefined} 
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline" 
        />
      </div>
      
      <button 
        type="submit" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Register
      </button>
      
      {error && <div id="register-form-error" className="sr-only">{error}</div>}
    </form>
  );
};

export default Register;
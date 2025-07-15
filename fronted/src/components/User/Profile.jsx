import React, { useState, useContext } from 'react';
import { updateProfile, deleteAccount } from '../../services/user.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Profile = ({ user, setUser }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    userName: user.userName || '',
    email: user.email || '',
    profilePicture: user.profilePicture || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, setAuth } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.userName.trim() || form.userName.length < 3) {
      setError('User name must be at least 3 characters.');
      return false;
    }
    if (form.userName.length > 30) {
      setError('User name must be less than 30 characters.');
      return false;
    }
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    // Profile picture validation removed: allow any string
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await updateProfile(user._id, form, token);
      setUser(res.data.message);
      setEdit(false);
      toast.success('Profile updated!');
    } catch {
      setError('Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      await deleteAccount(user._id, token);
      setAuth({ user: null, token: null });
      toast.success('Account deleted!');
    } catch {
      setError('Failed to delete account');
      toast.error('Failed to delete account');
    }
  };

  const avatar = user.profilePicture ? (
    <img src={user.profilePicture} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-blue-400" />
  ) : (
    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-500 border-2 border-blue-400">
      {user.userName ? user.userName[0].toUpperCase() : '?'}
    </div>
  );

  const Spinner = () => (
    <div className="flex justify-center items-center h-10">
      <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );

  if (edit) {
    return (
      <form onSubmit={handleUpdate} className="bg-white shadow-md border border-gray-200 rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto mt-8" aria-labelledby="profile-form-title" noValidate>
        <h2 id="profile-form-title" className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
        {error && <div className="mb-4 text-red-600 bg-red-50 rounded px-3 py-2 text-center" role="alert" aria-live="assertive">{error}</div>}
        <div className="mb-4">
          <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">User Name:</label>
          <input id="userName" name="userName" value={form.userName} onChange={handleChange} required minLength={3} maxLength={30} aria-invalid={!!error} aria-describedby={error ? 'profile-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required aria-invalid={!!error} aria-describedby={error ? 'profile-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="mb-6">
          <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">Profile Picture URL:</label>
          <input id="profilePicture" name="profilePicture" value={form.profilePicture} onChange={handleChange} pattern="https?://.+\.(jpg|jpeg|png|gif|webp)" aria-invalid={!!error} aria-describedby={error ? 'profile-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" disabled={loading} aria-busy={loading} aria-live="polite">{loading ? <Spinner /> : 'Save'}</button>
          <button type="button" onClick={() => setEdit(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded w-full">Cancel</button>
        </div>
        {error && <div id="profile-form-error" className="sr-only">{error}</div>}
      </form>
    );
  }

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto mt-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      <div className="flex justify-center mb-4">{avatar}</div>
      <div className="mb-2 text-lg font-semibold">{user.userName}</div>
      <div className="mb-4 text-gray-600">{user.email}</div>
      <div className="flex gap-4 justify-center">
        <button onClick={() => setEdit(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Profile</button>
        <button onClick={handleDelete} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;

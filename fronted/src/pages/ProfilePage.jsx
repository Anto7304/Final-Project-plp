import React, { useContext, useEffect, useState } from 'react';
import Profile from '../components/User/Profile';
import { AuthContext } from '../context/AuthContext';
import { getMe } from '../services/user.service';

const ProfilePage = () => {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await getMe(token);
        setUser(res.data.message);
        setError('');
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="flex justify-center items-center h-64"><span className="text-gray-500 text-lg" role="status" aria-live="polite">Loading...</span></div>;
  if (error) return <div className="flex justify-center items-center h-64"><span className="text-red-600 bg-red-50 rounded px-3 py-2 text-lg" role="alert" aria-live="assertive">{error}</span></div>;
  if (!user) return null;

  return <Profile user={user} setUser={setUser} />;
};

export default ProfilePage;

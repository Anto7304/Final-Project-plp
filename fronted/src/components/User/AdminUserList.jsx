import React, { useEffect, useState, useContext } from 'react';
import { getAllUsers, updateUserRole, deleteAccount, updateUserStatus, resetUserPassword } from '../../services/user.service';
import { getPosts } from '../../services/post.service';
import { getComments } from '../../services/comment.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminUserList = () => {
  const { token, user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [roleUpdates, setRoleUpdates] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [viewUser, setViewUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(token);
      setUsers(res.data.message || []);
      setError('');
    } catch {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') fetchUsers();
    // eslint-disable-next-line
  }, [token]);

  const handleRoleChange = (id, newRole) => {
    setRoleUpdates({ ...roleUpdates, [id]: newRole });
  };

  const handleUpdateRole = async (id) => {
    setUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await updateUserRole(id, roleUpdates[id], token);
      fetchUsers();
      toast.success('Role updated!');
      setError('');
    } catch {
      setError('Failed to update role');
      toast.error('Failed to update role');
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteAccount(id, token);
      fetchUsers();
      toast.success('User deleted!');
    } catch {
      setError('Failed to delete user');
      toast.error('Failed to delete user');
    }
  };

  const handleToggleSuspend = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      await updateUserStatus(id, newStatus, token);
      fetchUsers();
      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'unsuspended'}!`);
    } catch {
      setError('Failed to update user status');
      toast.error('Failed to update user status');
    }
  };

  const handleResetPassword = async (id) => {
    const password = window.prompt('Enter a new password (at least 6 characters):');
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    try {
      await resetUserPassword(id, password, token);
      toast.success('Password reset!');
    } catch {
      setError('Failed to reset password');
      toast.error('Failed to reset password');
    }
  };

  const handleViewDetails = async (user) => {
    setViewUser(user);
    setLoadingDetails(true);
    try {
      // Fetch all posts and comments, then filter by user._id
      const postsRes = await getPosts(token);
      setUserPosts((postsRes.data.message || []).filter(p => p.userId && p.userId._id === user._id));
      // Fetch all comments for all posts, then filter by user._id
      let allComments = [];
      for (const post of postsRes.data.message || []) {
        try {
          const commentsRes = await getComments(post._id, token);
          allComments = allComments.concat(commentsRes.data.message || []);
        } catch {}
      }
      setUserComments(allComments.filter(c => c.userId && c.userId._id === user._id));
    } finally {
      setLoadingDetails(false);
    }
  };
  const handleCloseDetails = () => {
    setViewUser(null);
    setUserPosts([]);
    setUserComments([]);
  };

  const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white inline-block ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );

  if (loading) return <div className="flex justify-center items-center h-64"><span className="text-gray-500 text-lg">Loading...</span></div>;
  if (error) return <div className="flex justify-center items-center h-64"><span className="text-red-600 bg-red-50 rounded px-3 py-2 text-lg" role="alert" aria-live="assertive">{error}</span></div>;
  if (!users.length) return <div className="text-gray-500 text-center my-4">No users found.</div>;

  // Compute filtered users
  const filteredUsers = users.filter(u => {
    const matchesName = u.userName.toLowerCase().includes(search.toLowerCase());
    const matchesEmail = u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole ? u.role === filterRole : true;
    return (matchesName || matchesEmail) && matchesRole;
  });

  return (
    <div className="overflow-x-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">All Users (Admin Only)</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center justify-center">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          aria-label="Search by name or email"
        />
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden" aria-describedby={error ? 'admin-userlist-error' : undefined}>
        <thead className="bg-blue-100">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">User Name</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Suspend/Unsuspend</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Reset Password</th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Update Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, idx) => (
            <tr key={u._id} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50`}>
              <td className="py-2 px-4">{u.userName}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.role}</td>
              <td className="py-2 px-4">{u.status || 'active'}</td>
              <td className="py-2 px-4">
                {user._id !== u._id && (
                  <button
                    onClick={() => handleToggleSuspend(u._id, u.status)}
                    className={`px-3 py-1 rounded transition flex items-center justify-center ${u.status === 'active' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    aria-label={`${u.status === 'active' ? 'Suspend' : 'Unsuspend'} user ${u.userName}`}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Unsuspend'}
                  </button>
                )}
              </td>
              <td className="py-2 px-4">
                {user._id !== u._id && (
                  <button
                    onClick={() => handleResetPassword(u._id)}
                    className="bg-purple-500 hover:bg-purple-700 text-white px-3 py-1 rounded transition flex items-center justify-center"
                    aria-label={`Reset password for ${u.userName}`}
                  >
                    Reset Password
                  </button>
                )}
              </td>
              <td className="py-2 px-4 flex gap-2 items-center">
                <select
                  value={roleUpdates[u._id] || u.role}
                  onChange={e => handleRoleChange(u._id, e.target.value)}
                  className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
                  aria-label={`Change role for ${u.userName}`}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
                <button
                  onClick={() => handleUpdateRole(u._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded transition flex items-center justify-center"
                  disabled={!!updating[u._id]}
                  aria-busy={!!updating[u._id]}
                  aria-live="polite"
                >
                  Update {updating[u._id] ? <Spinner /> : null}
                </button>
                {user._id !== u._id && (
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition flex items-center justify-center"
                    aria-label={`Delete user ${u.userName}`}
                  >
                    Delete
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(u)}
                  className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded transition flex items-center justify-center"
                  aria-label={`View details for ${u.userName}`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div id="admin-userlist-error" className="sr-only">{error}</div>}
      {viewUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
            <button onClick={handleCloseDetails} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl font-bold">&times;</button>
            <h3 className="text-xl font-bold mb-2">User Details: {viewUser.userName} ({viewUser.email})</h3>
            {loadingDetails ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Posts by this user:</h4>
                  {userPosts.length ? (
                    <ul className="list-disc pl-6">
                      {userPosts.map(post => (
                        <li key={post._id}>{post.title} <span className="text-xs text-gray-500">({new Date(post.createdAt).toLocaleDateString()})</span></li>
                      ))}
                    </ul>
                  ) : <div className="text-gray-500">No posts found.</div>}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comments by this user:</h4>
                  {userComments.length ? (
                    <ul className="list-disc pl-6">
                      {userComments.map(comment => (
                        <li key={comment._id}>{comment.content} <span className="text-xs text-gray-500">({new Date(comment.createdAt).toLocaleDateString()})</span></li>
                      ))}
                    </ul>
                  ) : <div className="text-gray-500">No comments found.</div>}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserList; 
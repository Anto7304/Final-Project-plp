import React, { useContext, useState, useEffect } from 'react';
import AdminUserList from '../components/User/AdminUserList';
import { AuthContext } from '../context/AuthContext';
import { getAuditLogs, clearAuditLogs } from '../services/user.service';
import { getFlaggedPosts, deletePost, unflagPost } from '../services/post.service';
import { getFlaggedComments, deleteComment, unflagComment } from '../services/comment.service';
import { toast } from 'react-hot-toast';

const AdminPage = () => {
  const { token, user } = useContext(AuthContext);
  console.log('AdminPage token:', token, 'user:', user);
  if (!user || user.role !== 'admin') return <div className="flex justify-center items-center h-64"><span className="text-red-600 bg-red-50 rounded px-3 py-2 text-lg" role="alert" aria-live="assertive">Access denied. Admins only.</span></div>;

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState('');

  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [flaggedComments, setFlaggedComments] = useState([]);
  const [loadingFlagged, setLoadingFlagged] = useState(false);
  const [flaggedError, setFlaggedError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const res = await getAuditLogs(token);
        setLogs(res.data.logs || []);
        setLogsError('');
      } catch (err) {
        setLogsError(err.response?.data?.message || 'Failed to load audit logs');
      } finally {
        setLoadingLogs(false);
      }
    };
    if (user && user.role === 'admin') fetchLogs();
  }, [user, token]);

  useEffect(() => {
    const fetchFlagged = async () => {
      setLoadingFlagged(true);
      try {
        const [postsRes, commentsRes] = await Promise.all([
          getFlaggedPosts(token),
          getFlaggedComments(token)
        ]);
        setFlaggedPosts(postsRes.data.message || []);
        setFlaggedComments(commentsRes.data.message || []);
        setFlaggedError('');
      } catch (err) {
        setFlaggedError(err.response?.data?.message || 'Failed to load flagged content');
      } finally {
        setLoadingFlagged(false);
      }
    };
    if (user && user.role === 'admin') fetchFlagged();
  }, [user, token]);

  const handleUnflagPost = async (id) => {
    try {
      await unflagPost(id, token);
      setFlaggedPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post unflagged');
    } catch {
      toast.error('Failed to unflag post');
    }
  };
  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id, token);
      setFlaggedPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post deleted');
    } catch {
      toast.error('Failed to delete post');
    }
  };
  const handleUnflagComment = async (id) => {
    try {
      await unflagComment(id, token);
      setFlaggedComments(prev => prev.filter(c => c._id !== id));
      toast.success('Comment unflagged');
    } catch {
      toast.error('Failed to unflag comment');
    }
  };
  const handleDeleteComment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(id, token);
      setFlaggedComments(prev => prev.filter(c => c._id !== id));
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center" id="admin-main-heading">Admin Panel</h1>
      <AdminUserList />
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Activity / Audit Log</h2>
        <button
          onClick={async () => {
            if (!window.confirm('Are you sure you want to clear the audit log?')) return;
            try {
              await clearAuditLogs(token);
              setLogs([]);
              toast.success('Audit log cleared!');
            } catch (err) {
              toast.error(err.response?.data?.message || 'Failed to clear audit log');
            }
          }}
          className="mb-4 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Clear Audit Log
        </button>
        {loadingLogs ? (
          <div className="text-center py-8">Loading logs...</div>
        ) : logsError ? (
          <div className="text-red-600 bg-red-50 rounded px-3 py-2 text-center mb-4">{logsError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden text-xs">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-2 px-3 text-left">Timestamp</th>
                  <th className="py-2 px-3 text-left">Action</th>
                  <th className="py-2 px-3 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.slice().reverse().map((log, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-1 px-3 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-1 px-3 whitespace-nowrap">{log.message.action}</td>
                    <td className="py-1 px-3">
                      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(log.message, null, 2)}</pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Flagged Posts</h2>
        {loadingFlagged ? (
          <div className="text-center py-8">Loading flagged posts...</div>
        ) : flaggedError ? (
          <div className="text-red-600 bg-red-50 rounded px-3 py-2 text-center mb-4">{flaggedError}</div>
        ) : (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden text-xs">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-2 px-3 text-left">Title</th>
                  <th className="py-2 px-3 text-left">Flagged By</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedPosts.map((post, idx) => (
                  <tr key={post._id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-1 px-3 whitespace-nowrap">{post.title}</td>
                    <td className="py-1 px-3 whitespace-nowrap">{post.flaggedBy?.length || 0}</td>
                    <td className="py-1 px-3">
                      <button onClick={() => handleUnflagPost(post._id)} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" aria-label="Unflag post">Unflag</button>
                      <button onClick={() => handleDeletePost(post._id)} className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400" aria-label="Delete post">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <h2 className="text-2xl font-bold mb-4 text-center">Flagged Comments</h2>
        {loadingFlagged ? (
          <div className="text-center py-8">Loading flagged comments...</div>
        ) : flaggedError ? (
          <div className="text-red-600 bg-red-50 rounded px-3 py-2 text-center mb-4">{flaggedError}</div>
        ) : (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden text-xs">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-2 px-3 text-left">Content</th>
                  <th className="py-2 px-3 text-left">Flagged By</th>
                  <th className="py-2 px-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedComments.map((comment, idx) => (
                  <tr key={comment._id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-1 px-3 whitespace-nowrap max-w-xs truncate">{comment.content}</td>
                    <td className="py-1 px-3 whitespace-nowrap">{comment.flaggedBy?.length || 0}</td>
                    <td className="py-1 px-3">
                      <button onClick={() => handleUnflagComment(comment._id)} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-2 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400" aria-label="Unflag comment">Unflag</button>
                      <button onClick={() => handleDeleteComment(comment._id)} className="bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400" aria-label="Delete comment">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage; 
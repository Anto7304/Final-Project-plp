import React, { useEffect, useState, useContext } from 'react';
import { getComments, deleteComment, toggleLike, flagComment, unflagComment } from '../../services/comment.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Spinner = () => (
  <div className="flex justify-center items-center h-24">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  </div>
);

const CommentList = ({ postId, onEdit }) => {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user } = useContext(AuthContext);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await getComments(postId, token);
      setComments(res.data.message || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const handleDelete = async (id) => {
    try {
      await deleteComment(id, token);
      fetchComments();
      toast.success('Comment deleted!');
    } catch {
      setError('Failed to delete comment');
      toast.error('Failed to delete comment');
    }
  };

  const handleLike = async (id) => {
    try {
      await toggleLike(id, token);
      fetchComments();
      toast.success('Toggled like!');
    } catch {
      setError('Failed to like/unlike comment');
      toast.error('Failed to like/unlike comment');
    }
  };

  const handleFlag = async (id) => {
    try {
      await flagComment(id, token);
      setComments(prev => prev.map(c => c._id === id ? {
        ...c,
        flaggedBy: c.flaggedBy ? [...c.flaggedBy, user._id] : [user._id]
      } : c));
    } catch {
      setError('Failed to flag comment');
      toast.error('Failed to flag comment');
    }
  };

  const handleUnflag = async (id) => {
    try {
      await unflagComment(id, token);
      setComments(prev => prev.map(c => c._id === id ? {
        ...c,
        flaggedBy: c.flaggedBy ? c.flaggedBy.filter(uid => uid !== user._id) : []
      } : c));
    } catch {
      setError('Failed to unflag comment');
      toast.error('Failed to unflag comment');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-center my-4" role="alert" aria-live="assertive" id="commentlist-error">{error}</div>;
  if (!comments.length) return (
    <div className="flex flex-col items-center justify-center my-8" role="status" aria-live="polite" id="commentlist-empty">
      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h2m2-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
      <div className="text-gray-500 dark:text-gray-400 text-center">No comments yet.</div>
    </div>
  );

  return (
    <div className="mt-6">
      <div className="border-b pb-2 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2v-8a2 2 0 012-2h2m2-4h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6a2 2 0 012-2z" /></svg>
        <h4 className="text-lg font-semibold mb-0 text-blue-700 dark:text-blue-400">Comments</h4>
      </div>
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={comment._id} className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-4 flex flex-col gap-2">
            <div className="text-gray-800 dark:text-gray-200">{comment.content}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
              <span>By: {comment.userId?.userName || 'Unknown'}</span>
              <span>
                <button onClick={() => handleLike(comment._id)} className="text-blue-500 hover:underline mr-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label={comment.likes && comment.likes.includes(user?._id) ? 'Unlike comment' : 'Like comment'}>
                  {comment.likes && comment.likes.includes(user?._id) ? 'Unlike' : 'Like'} ({comment.numberOfLikes || 0})
                </button>
                {/* Flag/Unflag button */}
                <button
                  onClick={() => (comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? handleUnflag(comment._id) : handleFlag(comment._id))}
                  className={`mr-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
                  aria-label={comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? 'Unflag comment' : 'Flag comment'}
                  title={comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? 'Unflag comment' : 'Flag comment'}
                >
                  {comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? (
                    // Filled flag icon
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3.75A.75.75 0 013.75 3h12.5a.75.75 0 01.664 1.107l-2.1 3.793 2.1 3.793A.75.75 0 0116.25 13H4.5v4.25a.75.75 0 01-1.5 0v-13.5z" /></svg>
                  ) : (
                    // Outlined flag icon
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18m0-18h13.5a1 1 0 01.894 1.447l-2.1 3.793 2.1 3.793A1 1 0 0116.5 13H3m0-10v18" /></svg>
                  )}
                  <span className="sr-only">{comment.flaggedBy && comment.flaggedBy.includes(user?._id) ? 'Unflag' : 'Flag'}</span>
                </button>
                {(user && (user._id === comment.userId?._id || user.role === 'admin')) && (
                  <>
                    <button onClick={() => onEdit(comment)} className="text-yellow-600 hover:underline mr-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400" aria-label="Edit comment">Edit</button>
                    <button onClick={() => handleDelete(comment._id)} className="text-red-500 hover:underline transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400" aria-label="Delete comment">Delete</button>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;

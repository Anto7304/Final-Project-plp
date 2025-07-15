import React, { useState, useContext, useEffect } from 'react';
import { addComment, updateComment } from '../../services/comment.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Spinner = () => (
  <div className="flex justify-center items-center h-10">
    <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  </div>
);

const CommentForm = ({ postId, comment, onSuccess }) => {
  const [content, setContent] = useState(comment ? comment.content : '');
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setContent(comment ? comment.content : '');
  }, [comment]);

  const validateForm = () => {
    if (!content.trim() || content.length < 2) {
      setError('Comment must be at least 2 characters.');
      return false;
    }
    if (content.length > 500) {
      setError('Comment must be less than 500 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (comment && comment._id) {
        await updateComment(comment._id, { content }, token);
        toast.success('Comment updated!');
      } else {
        await addComment({ postId, content }, token);
        toast.success('Comment added!');
      }
      setContent('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit comment');
      toast.error('Failed to submit comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded px-6 pt-4 pb-6 mb-4 max-w-lg mx-auto mt-6" aria-labelledby="comment-form-title" noValidate>
      <h4 id="comment-form-title" className="text-lg font-semibold mb-2 text-center">{comment ? 'Edit Comment' : 'Add Comment'}</h4>
      {error && <div className="mb-2 text-red-600 bg-red-50 rounded px-3 py-2 text-center" role="alert" aria-live="assertive">{error}</div>}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        minLength={2}
        maxLength={500}
        aria-invalid={!!error}
        aria-describedby={error ? 'comment-form-error' : undefined}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline min-h-[60px] mb-4"
        placeholder="Write your comment..."
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" disabled={loading} aria-busy={loading} aria-live="polite">
        {loading ? <Spinner /> : comment ? 'Update' : 'Add'}
      </button>
      {error && <div id="comment-form-error" className="sr-only">{error}</div>}
    </form>
  );
};

export default CommentForm;

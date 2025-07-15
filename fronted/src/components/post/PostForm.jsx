import React, { useState, useContext } from 'react';
import { createPost, updatePost } from '../../services/post.service';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const Spinner = () => (
  <div className="flex justify-center items-center h-16">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  </div>
);

const PostForm = ({ post, onSuccess }) => {
  const [form, setForm] = useState({
    title: post?.title || '',
    content: post?.content || '',
    image: post?.image || '',
    category: post?.category || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.title.trim() || form.title.length < 5) {
      setError('Title must be at least 5 characters.');
      return false;
    }
    if (form.title.length > 100) {
      setError('Title must be less than 100 characters.');
      return false;
    }
    if (!form.content.trim() || form.content.length < 10) {
      setError('Content must be at least 10 characters.');
      return false;
    }
    if (form.content.length > 2000) {
      setError('Content must be less than 2000 characters.');
      return false;
    }
    if (form.image && !/^https?:\/\/.+/i.test(form.image)) {
      setError('Image URL must be a valid URL.');
      return false;
    }
    if (form.category && (form.category.length < 2 || form.category.length > 30)) {
      setError('Category must be 2-30 characters.');
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
      if (post && post._id) {
        await updatePost(post._id, form, token);
        toast.success('Post updated!');
      } else {
        await createPost(form, token);
        toast.success('Post created!');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit post');
      toast.error('Failed to submit post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-lg mx-auto" aria-labelledby="post-form-title" noValidate>
      <h2 id="post-form-title" className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">{post ? 'Edit Post' : 'Create Post'}</h2>
      {error && <div className="mb-4 text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-center" role="alert" aria-live="assertive">{error}</div>}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">Title:</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required minLength={5} maxLength={100} aria-invalid={!!error} aria-describedby={error ? 'post-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">Content:</label>
        <textarea id="content" name="content" value={form.content} onChange={handleChange} required minLength={10} maxLength={2000} aria-invalid={!!error} aria-describedby={error ? 'post-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline min-h-[100px]" />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">Image URL:</label>
        <input id="image" name="image" value={form.image} onChange={handleChange} pattern="https?://.+\.(jpg|jpeg|png|gif|webp)" aria-invalid={!!error} aria-describedby={error ? 'post-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-6">
        <label htmlFor="category" className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">Category:</label>
        <input id="category" name="category" value={form.category} onChange={handleChange} minLength={2} maxLength={30} aria-invalid={!!error} aria-describedby={error ? 'post-form-error' : undefined} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-200 dark:bg-gray-900 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" disabled={loading} aria-busy={loading} aria-live="polite">
        {loading ? <Spinner /> : post ? 'Update' : 'Create'}
      </button>
      {error && <div id="post-form-error" className="sr-only">{error}</div>}
    </form>
  );
};

export default PostForm;

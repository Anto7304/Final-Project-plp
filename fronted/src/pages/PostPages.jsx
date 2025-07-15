import React, { useState, useContext } from 'react';
import PostList from '../components/post/PostList';
import PostCard from '../components/post/PostCard';
import PostForm from '../components/post/PostForm';
import CommentList from '../components/comment/CommentList';
import CommentForm from '../components/comment/CommentForm';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { deletePost } from '../services/post.service';

const PostPages = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const { user } = useContext(AuthContext);

  const isAdmin = user && user.role === 'admin';

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId, user.token);
      setSelectedPost(null);
      setShowForm(false);
      // Optionally, trigger a refresh of the post list
    } catch {
      alert('Failed to delete post');
    }
  };

  const handleBulkDeletePosts = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm('Are you sure you want to delete the selected posts?')) return;
    try {
      for (const id of ids) {
        await deletePost(id, user.token);
      }
      setSelectedPost(null);
      setShowForm(false);
      // Optionally, trigger a refresh of the post list
    } catch {
      alert('Failed to delete selected posts');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center" id="posts-main-heading">Posts</h1>
      {isAdmin && (
        <button
          onClick={() => { setShowForm(true); setSelectedPost(null); }}
          className="mb-6 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Create new post"
          tabIndex={0}
        >
          Create New Post
        </button>
      )}
      {showForm && isAdmin && (
        <PostForm post={selectedPost} onSuccess={() => { setShowForm(false); setSelectedPost(null); }} />
      )}
      {!showForm && !selectedPost && (
        <PostList onSelectPost={setSelectedPost} isAdmin={isAdmin} onBulkDelete={handleBulkDeletePosts} />
      )}
      {!showForm && selectedPost && (
        <div className="mt-6">
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Back to post list"
            tabIndex={0}
          >
            Back to List
          </button>
          <PostCard post={selectedPost} isAdmin={isAdmin} onDelete={handleDeletePost} />
          {user ? (
            <>
              <CommentForm
                postId={selectedPost._id}
                comment={editingComment}
                onSuccess={() => setEditingComment(null)}
              />
              <CommentList
                postId={selectedPost._id}
                onEdit={setEditingComment}
              />
            </>
          ) : (
            <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded text-center">
              Please <Link to="/auth?tab=login" className="underline text-blue-600">log in</Link> or <Link to="/auth?tab=register" className="underline text-blue-600">sign up</Link> to comment and see comments.
            </div>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Edit post"
              tabIndex={0}
            >
              Edit Post
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PostPages;

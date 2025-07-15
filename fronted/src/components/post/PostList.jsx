import React, { useEffect, useState, useContext } from 'react';
import { getPosts, flagPost, unflagPost } from '../../services/post.service';
import PostCard from './PostCard';
import { AuthContext } from '../../context/AuthContext';

const Spinner = () => (
  <div className="flex justify-center items-center h-24">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  </div>
);

const PostList = ({ onSelectPost, isAdmin, onBulkDelete }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getPosts(token);
        setPosts(res.data.message || []);
        setError('');
      } catch (err) {
        setError('Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [token]);

  const handleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selected.length === posts.length) {
      setSelected([]);
    } else {
      setSelected(posts.map(p => p._id));
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) onBulkDelete(selected);
  };

  const handleFlag = async (postId) => {
    try {
      await flagPost(postId, token);
      setPosts(prev => prev.map(p => p._id === postId ? {
        ...p,
        flaggedBy: p.flaggedBy ? [...p.flaggedBy, user._id] : [user._id]
      } : p));
    } catch (err) {
      // Optionally show error
    }
  };

  const handleUnflag = async (postId) => {
    try {
      await unflagPost(postId, token);
      setPosts(prev => prev.map(p => p._id === postId ? {
        ...p,
        flaggedBy: p.flaggedBy ? p.flaggedBy.filter(id => id !== user._id) : []
      } : p));
    } catch (err) {
      // Optionally show error
    }
  };

  // Compute filtered posts
  const filteredPosts = posts.filter(post => {
    const matchesTitle = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory ? (post.category && post.category.toLowerCase() === filterCategory.toLowerCase()) : true;
    const matchesAuthor = filterAuthor ? (post.userId && (post.userId.userName?.toLowerCase().includes(filterAuthor.toLowerCase()) || post.userId.email?.toLowerCase().includes(filterAuthor.toLowerCase()))) : true;
    const matchesDate = filterDate ? (post.createdAt && post.createdAt.slice(0, 10) === filterDate) : true;
    return matchesTitle && matchesCategory && matchesAuthor && matchesDate;
  });

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600 bg-red-50 dark:bg-red-900 dark:text-red-300 rounded px-3 py-2 text-center my-4" role="alert" aria-live="assertive" id="postlist-error">{error}</div>;
  if (!posts.length) return (
    <div className="flex flex-col items-center justify-center my-8" role="status" aria-live="polite" id="postlist-empty">
      <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
      <div className="text-gray-500 dark:text-gray-400 text-center">No posts found.</div>
    </div>
  );

  return (
    <div>
      <div className="border-b pb-2 mb-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            aria-label="Search by title"
          />
          <input
            type="text"
            placeholder="Filter by author..."
            value={filterAuthor}
            onChange={e => setFilterAuthor(e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            aria-label="Filter by author"
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            aria-label="Filter by category"
          />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-300"
            aria-label="Filter by date"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {isAdmin && (
            <>
              <input type="checkbox" checked={selected.length === posts.length} onChange={handleSelectAll} className="ml-4" aria-label="Select all posts" />
              <button
                onClick={handleBulkDelete}
                disabled={!selected.length}
                className="ml-2 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50"
              >
                Delete Selected
              </button>
            </>
          )}
        </div>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Post list" aria-describedby={error ? 'postlist-error' : undefined}>
        {filteredPosts.map(post => (
          <div key={post._id} className="relative">
            {isAdmin && (
              <input
                type="checkbox"
                checked={selected.includes(post._id)}
                onChange={() => handleSelect(post._id)}
                className="absolute top-2 left-2 z-10"
                aria-label={`Select post ${post.title}`}
              />
            )}
            <PostCard
              post={post}
              onClick={onSelectPost ? () => onSelectPost(post) : undefined}
              isAdmin={isAdmin}
              isFlagged={post.flaggedBy && user && post.flaggedBy.includes(user._id)}
              onFlag={handleFlag}
              onUnflag={handleUnflag}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;

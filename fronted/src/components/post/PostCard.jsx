import React from 'react';

const PostCard = ({ post, onClick, onDelete, isAdmin, isFlagged, onFlag, onUnflag }) => {
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const [imgError, setImgError] = React.useState(false);

  // Format date
  const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : '';

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col transition hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 max-w-full min-h-[350px]"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-pressed="false"
      aria-label={post.title}
    >
      {post.image && !imgError ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-100 dark:border-gray-700"
          onError={() => setImgError(true)}
        />
      ) : post.image ? (
        <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 text-gray-400 text-sm">Image not available</div>
      ) : null}
      <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
        <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 truncate max-w-[70%]" title={post.title}>{post.title}</h3>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 whitespace-nowrap ml-auto">
          {post.category || 'Uncategorized'}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-200 mb-4 text-base leading-relaxed break-words whitespace-pre-line max-h-32 overflow-auto">
        {post.content}
      </p>
      <div className="flex flex-wrap justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 gap-2">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          By: {post.userId?.userName || post.userId?.email || 'Unknown'}
        </span>
        {date && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {date}
          </span>
        )}
        {/* Flag/Unflag button for users */}
        {onFlag && onUnflag && (
          <button
            onClick={e => {
              e.stopPropagation();
              isFlagged ? onUnflag(post._id) : onFlag(post._id);
            }}
            className={`ml-auto flex items-center gap-1 px-2 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${isFlagged ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500 hover:bg-yellow-50'}`}
            aria-label={isFlagged ? 'Unflag post' : 'Flag post'}
            title={isFlagged ? 'Unflag post' : 'Flag post'}
          >
            {isFlagged ? (
              // Filled flag icon
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3.75A.75.75 0 013.75 3h12.5a.75.75 0 01.664 1.107l-2.1 3.793 2.1 3.793A.75.75 0 0116.25 13H4.5v4.25a.75.75 0 01-1.5 0v-13.5z" /></svg>
            ) : (
              // Outlined flag icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18m0-18h13.5a1 1 0 01.894 1.447l-2.1 3.793 2.1 3.793A1 1 0 0116.5 13H3m0-10v18" /></svg>
            )}
            <span className="sr-only">{isFlagged ? 'Unflag' : 'Flag'}</span>
          </button>
        )}
        {isAdmin && onDelete && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(post._id); }}
            className="ml-auto bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Delete post"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;

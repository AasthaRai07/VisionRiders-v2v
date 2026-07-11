'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useEffect, useState, useRef, useCallback } from 'react';

const API_BASE = 'http://127.0.0.1:5001/hernova-13f01/us-central1/api';
const CATEGORIES = ['All', 'Career Talk', 'Wellness', 'Money Matters', 'Wins & Support'];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : (dateStr.toDate ? dateStr.toDate() : new Date(dateStr._seconds * 1000));
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name) {
  if (!name || name === 'Anonymous') return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function CommunityHub() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedComments, setExpandedComments] = useState({}); // postId -> comments[]
  const [loadingComments, setLoadingComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Career Talk');
  const [newPostAnonymous, setNewPostAnonymous] = useState(false);
  const [newPostImage, setNewPostImage] = useState(null);
  const [postingNew, setPostingNew] = useState(false);
  const [postError, setPostError] = useState(null);
  const sentinelRef = useRef(null);
  const fileInputRef = useRef(null);

  // ─── Fetch posts ──────────────────────────────────────────────────────
  const fetchPosts = useCallback(async (category, cursor = null) => {
    try {
      if (!cursor) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (cursor) params.append('cursor', cursor);
      params.append('limit', '20');

      const res = await fetch(`${API_BASE}/community/posts?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();

      if (cursor) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.warn('Error fetching posts:', err);
      if (!cursor) {
        setPosts([
          {
            id: 'mock-1',
            display_name: 'Priya Sharma',
            avatar_url: null,
            category: 'Career Talk',
            post_text: "Just landed my first job in tech after taking the HerNova coding bootcamp! To everyone still studying: keep going, it's worth it! 🚀",
            image_url: null,
            support_count: 24,
            comment_count: 5,
            has_user_supported: false,
            created_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 'mock-2',
            display_name: 'Anonymous',
            avatar_url: null,
            category: 'Money Matters',
            post_text: "How much should I be putting into my emergency fund each month? I'm currently saving 10% of my salary but I feel like it's not enough.",
            image_url: null,
            support_count: 12,
            comment_count: 8,
            has_user_supported: true,
            created_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 'mock-3',
            display_name: 'Anita Desai',
            avatar_url: null,
            category: 'Wellness',
            post_text: "Remember to take breaks! Working from home can blur the lines between work and life. Taking a 15 min walk has changed my productivity entirely.",
            image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80',
            support_count: 45,
            comment_count: 12,
            has_user_supported: false,
            created_at: new Date(Date.now() - 172800000).toISOString()
          }
        ].filter(p => !category || category === 'All' || p.category === category));
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory, fetchPosts]);

  // ─── Infinite scroll ──────────────────────────────────────────────────
  useEffect(() => {
    if (!sentinelRef.current || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          fetchPosts(activeCategory, nextCursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, activeCategory, fetchPosts]);

  // ─── Toggle Support ───────────────────────────────────────────────────
  const toggleSupport = async (postId) => {
    // Optimistic update
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const wasSupported = p.has_user_supported;
      return {
        ...p,
        has_user_supported: !wasSupported,
        support_count: wasSupported ? Math.max(0, p.support_count - 1) : p.support_count + 1
      };
    }));

    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/support`, { method: 'POST' });
      if (!res.ok) throw new Error('Support toggle failed');
      const data = await res.json();

      // Reconcile with server
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        return { ...p, support_count: data.support_count, has_user_supported: data.has_supported };
      }));
    } catch (err) {
      console.warn('Support toggle error:', err);
      // Revert on failure
      setPosts(prev => prev.map(p => {
        if (p.id !== postId) return p;
        const wasSupported = p.has_user_supported;
        return {
          ...p,
          has_user_supported: !wasSupported,
          support_count: wasSupported ? Math.max(0, p.support_count - 1) : p.support_count + 1
        };
      }));
    }
  };

  // ─── Load Comments ────────────────────────────────────────────────────
  const toggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments(prev => { const next = { ...prev }; delete next[postId]; return next; });
      return;
    }

    setLoadingComments(prev => ({ ...prev, [postId]: true }));
    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setExpandedComments(prev => ({ ...prev, [postId]: data.comments }));
    } catch (err) {
      console.warn('Error fetching comments:', err);
      setExpandedComments(prev => ({ 
        ...prev, 
        [postId]: [
          {
            id: 'comment-1',
            display_name: 'Simran K.',
            avatar_url: null,
            comment_text: "Totally agree with this!",
            created_at: new Date(Date.now() - 1800000).toISOString()
          },
          {
            id: 'comment-2',
            display_name: 'Aditi M.',
            avatar_url: null,
            comment_text: "Thanks for sharing ❤️",
            created_at: new Date(Date.now() - 900000).toISOString()
          }
        ] 
      }));
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };

  // ─── Add Comment ──────────────────────────────────────────────────────
  const addComment = async (postId) => {
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    try {
      const res = await fetch(`${API_BASE}/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_text: text, is_anonymous: false })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(errData.error || 'Failed to add comment');
        return;
      }
      const data = await res.json();

      // Append to expanded comments
      setExpandedComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));

      // Update comment count
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
      ));

      // Clear input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.warn('Error adding comment:', err);
    }
  };

  // ─── Create New Post ──────────────────────────────────────────────────
  const createPost = async () => {
    if (!newPostText.trim()) return;
    setPostingNew(true);
    setPostError(null);

    try {
      const res = await fetch(`${API_BASE}/community/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newPostCategory,
          post_text: newPostText.trim(),
          is_anonymous: newPostAnonymous,
          image_data: newPostImage
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setPostError(errData.error || 'Failed to create post');
        return;
      }

      const data = await res.json();

      // Prepend to feed if matching filter
      if (activeCategory === 'All' || activeCategory === newPostCategory) {
        setPosts(prev => [data, ...prev]);
      }

      // Reset modal
      setNewPostText('');
      setNewPostAnonymous(false);
      setNewPostImage(null);
      setShowNewPost(false);
    } catch (err) {
      console.warn('Error creating post:', err);
      setPostError('Network error. Please try again.');
    } finally {
      setPostingNew(false);
    }
  };

  // ─── Share handler ────────────────────────────────────────────────────
  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: `${post.display_name} on HerNova`,
        text: post.post_text.slice(0, 100) + '...',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(post.post_text).then(() => {
        alert('Post text copied to clipboard!');
      });
    }
  };

  // ─── Image Upload Handler ───────────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPostError("Image must be smaller than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPostImage(reader.result);
      setPostError(null);
    };
    reader.readAsDataURL(file);
  };

  // ─── Render ───────────────────────────────────────────────────────────
  return (
    <div className="relative text-on-surface flex-grow flex flex-col min-h-screen overflow-x-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .fade-slide-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .fade-slide-up.visible {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes novaPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 0, 0.4); }
            70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(255, 179, 0, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 179, 0, 0); }
        }
        .pulse-active {
            animation: novaPulse 0.5s ease-out;
        }
        @keyframes twinkle {
            0% { opacity: 0.2; transform: scale(0.8); }
            100% { opacity: 0.6; transform: scale(1.2); }
        }
        .star-particle {
            position: absolute;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            animation: twinkle 4s infinite ease-in-out alternate;
        }
        @keyframes slideUp {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-slide-up {
            animation: slideUp 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .modal-backdrop {
            animation: fadeIn 0.2s ease-out forwards;
        }
      `}} />

      {/* Background Particles */}
      <div aria-hidden="true" className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="star-particle" style={{top: '10%', left: '20%', width: '4px', height: '4px', animationDelay: '0s'}}></div>
        <div className="star-particle" style={{top: '30%', left: '80%', width: '6px', height: '6px', animationDelay: '1s'}}></div>
        <div className="star-particle" style={{top: '60%', left: '15%', width: '3px', height: '3px', animationDelay: '2s'}}></div>
        <div className="star-particle" style={{top: '80%', left: '70%', width: '5px', height: '5px', animationDelay: '0.5s'}}></div>
        <div className="star-particle" style={{top: '40%', left: '50%', width: '4px', height: '4px', animationDelay: '1.5s'}}></div>
      </div>
      
      <Sidebar activeItem="community" />
      <Header />
      
      <main className="pt-20 md:pt-24 pb-32 md:pb-12 px-margin-mobile md:px-margin-desktop md:ml-64 max-w-container-max mx-auto min-h-screen flex flex-col gap-stack-lg w-full">
        {/* Community Guidelines Banner */}
        <div className="glass-panel rounded-xl py-3 px-6 flex items-center justify-center gap-3 sticky top-20 md:top-8 z-30 mb-4 bg-white/40">
          <span className="material-symbols-outlined text-secondary">shield</span>
          <p className="font-body-md text-body-md text-[#594045] font-medium text-center">
              A safe space for growth. Please follow our community guidelines.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-label-sm text-label-sm transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'text-primary font-bold border-b-2 border-accent-golden shadow-[0_4px_12px_rgba(255,179,0,0.3)] bg-white/50 glass-panel relative'
                  : 'glass-panel text-on-surface-variant hover:text-primary'
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFB300] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFB300] shadow-[0_0_8px_rgba(255,179,0,0.8)]"></span>
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-stack-md max-w-3xl mx-auto w-full">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-panel rounded-2xl p-6 animate-pulse flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10"></div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-32"></div>
                    <div className="h-3 bg-white/10 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-16 bg-white/10 rounded"></div>
                <div className="h-8 bg-white/10 rounded w-48"></div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">forum</span>
              <p className="text-lg font-medium">No posts yet in this category</p>
              <p className="text-sm mt-1">Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <article key={post.id} className="glass-panel rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300">
                {/* Header */}
                <header className="flex items-center gap-4">
                  {post.avatar_url ? (
                    <img className="w-12 h-12 rounded-full border-2 border-glass-border object-cover" src={post.avatar_url} alt={post.display_name} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-headline-md text-headline-md font-bold">
                      {getInitials(post.display_name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">{post.display_name}</h3>
                    <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
                      {timeAgo(post.created_at)} • {post.category}
                    </p>
                  </div>
                  <button className="ml-auto text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </header>

                {/* Body */}
                <div className="font-body-md text-body-md text-on-surface leading-relaxed flex flex-col gap-4">
                  <p>{post.post_text}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="Post attachment"
                      className="rounded-xl border border-glass-border max-h-96 object-cover w-full shadow-sm"
                    />
                  )}
                </div>

                {/* Footer Actions */}
                <footer className="pt-4 border-t border-glass-border flex gap-6 items-center">
                  {/* Support Button */}
                  <button
                    onClick={() => toggleSupport(post.id)}
                    className={`flex items-center gap-2 transition-colors group ${
                      post.has_user_supported
                        ? 'text-[#FFB300]'
                        : 'text-on-surface-variant hover:text-[#FFB300]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${post.has_user_supported ? 'pulse-active' : 'group-hover:scale-110 transition-transform'}`}
                      style={post.has_user_supported ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      auto_awesome
                    </span>
                    <span className={`font-label-sm text-label-sm ${post.has_user_supported ? 'font-bold' : ''}`}>
                      {post.support_count} {post.has_user_supported ? 'Supported' : 'Support'}
                    </span>
                  </button>

                  {/* Comments Button */}
                  <button
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      expandedComments[post.id] ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {expandedComments[post.id] ? 'chat_bubble' : 'chat_bubble_outline'}
                    </span>
                    <span className="font-label-sm text-label-sm">{post.comment_count} Comments</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => handleShare(post)}
                    className="ml-auto text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">share</span>
                  </button>
                </footer>

                {/* Expanded Comments Section */}
                {(expandedComments[post.id] || loadingComments[post.id]) && (
                  <div className="mt-2 pt-4 border-t border-glass-border/50 flex flex-col gap-3">
                    {loadingComments[post.id] ? (
                      <div className="flex items-center gap-2 text-on-surface-variant text-sm py-4 justify-center">
                        <div className="w-4 h-4 border-2 border-primary/50 border-t-transparent rounded-full animate-spin"></div>
                        Loading comments...
                      </div>
                    ) : (
                      <>
                        {(expandedComments[post.id] || []).length === 0 ? (
                          <p className="text-sm text-on-surface-variant text-center py-2 italic">No comments yet. Be the first!</p>
                        ) : (
                          (expandedComments[post.id] || []).map(comment => (
                            <div key={comment.id} className="flex gap-3 items-start">
                              {comment.avatar_url ? (
                                <img className="w-8 h-8 rounded-full border border-glass-border object-cover mt-0.5" src={comment.avatar_url} alt="" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-on-surface-variant mt-0.5 flex-shrink-0">
                                  {getInitials(comment.display_name)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-sm font-semibold text-on-surface">{comment.display_name}</span>
                                  <span className="text-xs text-on-surface-variant opacity-50">{timeAgo(comment.created_at)}</span>
                                </div>
                                <p className="text-sm text-on-surface/80 mt-0.5">{comment.comment_text}</p>
                              </div>
                            </div>
                          ))
                        )}

                        {/* Add Comment Input */}
                        <div className="flex gap-2 mt-2 items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                            You
                          </div>
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 bg-white/5 border border-glass-border rounded-full px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary transition-colors"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') addComment(post.id); }}
                          />
                          <button
                            onClick={() => addComment(post.id)}
                            disabled={!(commentInputs[post.id] || '').trim()}
                            className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors flex-shrink-0"
                          >
                            <span className="material-symbols-outlined text-lg">send</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </article>
            ))
          )}

          {/* Infinite Scroll Sentinel */}
          {nextCursor && (
            <div ref={sentinelRef} className="py-8 flex justify-center">
              {loadingMore && (
                <div className="w-6 h-6 border-2 border-primary/50 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating New Post Button */}
      <button
        onClick={() => setShowNewPost(true)}
        className="fixed bottom-24 md:bottom-12 right-6 md:right-12 w-14 h-14 bg-[#FFB300] rounded-full flex items-center justify-center text-[#281526] hover:scale-105 active:scale-95 transition-all z-40 group shadow-[0_0_15px_rgba(255,179,0,0.5)]"
      >
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform duration-300">add_circle</span>
      </button>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm modal-backdrop" onClick={() => setShowNewPost(false)}></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-white border border-glass-border shadow-2xl rounded-t-3xl md:rounded-3xl p-6 flex flex-col gap-5 modal-slide-up z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-headline-md font-bold text-gray-900">New Post</h2>
              <button onClick={() => setShowNewPost(false)} className="text-gray-500 hover:text-gray-900 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewPostCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    newPostCategory === cat
                      ? 'bg-primary text-white border-primary shadow-[0_0_10px_rgba(194,24,91,0.3)]'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-primary/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Text Area */}
            <textarea
              placeholder="Share your thoughts, wins, questions, or advice..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary transition-colors resize-none min-h-[120px]"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              maxLength={2000}
            />
            
            {newPostImage && (
              <div className="relative w-full max-h-48 rounded-xl overflow-hidden border border-gray-200">
                <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setNewPostImage(null)}
                  className="absolute top-2 right-2 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-gray-500">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-lg">image</span>
                <span className="font-medium text-sm">Add Image</span>
              </button>
              <span>{newPostText.length}/2000</span>
            </div>

            {/* Anonymous Toggle */}
            <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div
                className={`w-10 h-6 rounded-full flex items-center transition-colors p-0.5 ${
                  newPostAnonymous ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                }`}
                onClick={() => setNewPostAnonymous(!newPostAnonymous)}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-md transition-transform"></div>
              </div>
              <span className="text-sm text-gray-700 font-medium">
                Post anonymously
              </span>
              {newPostAnonymous && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">Your identity will be hidden</span>
              )}
            </label>

            {/* Error */}
            {postError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm">
                {postError}
              </div>
            )}

            {/* Post Button */}
            <button
              onClick={createPost}
              disabled={postingNew || !newPostText.trim()}
              className={`w-full py-3 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                postingNew || !newPostText.trim()
                  ? 'bg-white/10 text-on-surface-variant cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-[#FFB300] text-[#320047] hover:shadow-[0_0_20px_rgba(194,24,91,0.3)] hover:scale-[1.02]'
              }`}
            >
              {postingNew ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/50 border-t-transparent rounded-full animate-spin"></div>
                  Posting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Post
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

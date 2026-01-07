import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const getYoutubeEmbed = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : null;
};

const NewsDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API}/news/${id}`);
                setNews(res.data);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
        window.scrollTo(0, 0);
    }, [id]);

    const handleLike = async () => {
        if (!user) return alert('Please login to like');
        try {
            const res = await axios.put(`${import.meta.env.VITE_API}/news/${id}/like`, {}, {
                headers: { Authorization: 'Bearer ' + user.token }
            });
            setNews(prev => ({ ...prev, likes: res.data }));
        } catch (err) { alert('Error liking post') }
    };

    const handleComment = async () => {
        if (!user) return alert('Please login to comment');
        if (!commentText.trim()) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API}/news/${id}/comment`, { text: commentText }, {
                headers: { Authorization: 'Bearer ' + user.token }
            });
            setNews(prev => ({ ...prev, comments: res.data }));
            setCommentText('');
        } catch (err) { alert('Error posting comment') }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!news) return <div className="text-center py-20 text-xl font-semibold text-gray-600">News not found</div>;

    const embedUrl = getYoutubeEmbed(news.youtubeLink);
    const shareUrl = window.location.href;
    const shareText = `Check out this news: ${news.title}`;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-b-2xl overflow-hidden">
                {/* Media Section */}
                <div className="relative w-full bg-black aspect-video">
                    {embedUrl ? (
                        <iframe
                            src={embedUrl}
                            title={news.title}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <img
                            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
                            alt={news.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                    )}
                </div>

                <div className="p-8 md:p-12">
                    {/* Tags & Date */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        {news.categories && news.categories.map(cat => (
                            <span key={cat} className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                {cat}
                            </span>
                        ))}
                        {news.isBreaking && (
                            <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wide animate-pulse">
                                Breaking
                            </span>
                        )}
                        <span className="text-gray-500 text-sm font-medium ml-auto">
                            {new Date(news.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                        {news.title}
                    </h1>

                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-10">
                        <p className="whitespace-pre-line text-lg">{news.script}</p>
                    </div>

                    {/* Engagement Section */}
                    <div className="border-t border-gray-100 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            {/* Like Button */}
                            <button
                                onClick={handleLike}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-bold transition-all ${news.likes?.includes(user?._id)
                                        ? 'bg-red-100 text-red-600 border border-red-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill={news.likes?.includes(user?._id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                </svg>
                                <span>{news.likes?.length || 0} Likes</span>
                            </button>

                            {/* Share Buttons */}
                            <div className="flex items-center space-x-3">
                                <span className="font-semibold text-gray-700">Share:</span>
                                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noreferrer" className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition">
                                    WhatsApp
                                </a>
                                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition">
                                    X (Twitter)
                                </a>
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                                    Facebook
                                </a>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-gray-50 rounded-xl p-6 md:p-8">
                            <h3 className="text-2xl font-bold mb-6">Comments ({news.comments?.length || 0})</h3>

                            {/* Comment Input */}
                            {user ? (
                                <div className="mb-8">
                                    <textarea
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="3"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                    ></textarea>
                                    <button
                                        onClick={handleComment}
                                        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                    >
                                        Post Comment
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
                                    <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link> to join the discussion.
                                </div>
                            )}

                            {/* Comments List */}
                            <div className="space-y-6">
                                {news.comments?.slice().reverse().map((comment, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900">{comment.name}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-700">{comment.text}</p>
                                    </div>
                                ))}
                                {(!news.comments || news.comments.length === 0) && (
                                    <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex">
                        <Link to="/" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center transition-colors">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;

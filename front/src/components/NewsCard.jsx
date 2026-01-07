import React from 'react';
import { Link } from 'react-router-dom';

const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const NewsCard = ({ news }) => {
    const videoId = getYoutubeId(news.youtubeLink);
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

    return (
        <Link to={`/news/${news._id}`} className="block h-full group">
            <div className="bg-white rounded-xl shadow-sm group-hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                <div className="relative">
                    <img
                        src={thumbnailUrl}
                        alt={news.title}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                        }}
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                        {news.categories && news.categories.slice(0, 2).map(cat => (
                            <span key={cat} className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                {cat}
                            </span>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {news.script}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                        <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                        <span className="text-blue-500 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                            Read More →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NewsCard;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const getYoutubeThumbnail = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80';
};

const HeroCarousel = ({ news }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % news.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [news.length]);

    if (!news || news.length === 0) return null;

    return (
        <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl mb-12 group">
            {/* Slides */}
            {news.map((item, index) => (
                <div
                    key={item._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                    <img
                        src={getYoutubeThumbnail(item.youtubeLink)}
                        alt={item.title}
                        className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2000ms]"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
                        }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20 flex flex-col items-start">
                        <div className="flex space-x-2 mb-4">
                            {item.categories && item.categories.map(cat => (
                                <span key={cat} className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-blue-600 rounded-full">
                                    {cat}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg line-clamp-2">
                            {item.title}
                        </h2>
                        <p className="text-gray-200 text-lg md:text-xl mb-8 line-clamp-2 max-w-3xl drop-shadow-md hidden md:block">
                            {item.script}
                        </p>
                        <Link
                            to={`/news/${item._id}`}
                            className="inline-flex items-center px-8 py-3 text-base font-bold text-white transition-all duration-300 bg-red-600 rounded-full hover:bg-red-700 hover:shadow-lg hover:-translate-y-1"
                        >
                            Read Full Story
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </Link>
                    </div>
                </div>
            ))}

            {/* Indicators */}
            <div className="absolute bottom-8 right-8 z-30 flex space-x-3">
                {news.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Arrows */}
            <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % news.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
        </div>
    );
};

export default HeroCarousel;

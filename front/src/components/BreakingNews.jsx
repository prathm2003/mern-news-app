import React from 'react';
import { Link } from 'react-router-dom';

const BreakingNews = ({ news }) => {
    if (!news || news.length === 0) return null;

    return (
        <div className="bg-red-600 text-white text-sm py-2 overflow-hidden relative shadow-sm">
            <div className="container mx-auto flex items-center">
                <span className="font-bold uppercase tracking-wider px-4 bg-red-700 h-full py-1 z-10 text-xs sm:text-sm">Breaking</span>
                <div className="whitespace-nowrap overflow-hidden w-full relative">
                    <div className="animate-marquee inline-block pl-4">
                        {news.map((item, index) => (
                            <span key={item._id} className="mx-8 font-medium">
                                <Link to={`/news/${item._id}`} className="hover:underline">
                                    {item.title}
                                </Link>
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BreakingNews;

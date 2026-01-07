import React from 'react';

const AdCard = ({ ad }) => {
    return (
        <div className="my-8 mx-auto max-w-4xl bg-gray-50 border border-gray-200 rounded-lg overflow-hidden relative shadow-sm hover:shadow-md transition">
            <div className="absolute top-0 right-0 bg-gray-200 text-gray-500 text-[10px] px-1 uppercase tracking-tighter">Ad</div>
            <div className="md:flex">
                {ad.imageUrl && (
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={ad.imageUrl} alt={ad.title} />
                    </div>
                )}
                <div className="p-8">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{ad.title}</div>
                    <p className="mt-2 text-gray-500">{ad.content}</p>
                    <div className="mt-4">
                        <a href={ad.link} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">
                            Learn more &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdCard;

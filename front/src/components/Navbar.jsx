import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ onCategoryChange }) => {
    const { user, logout } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const categories = ['All', 'Crime', 'Technology', 'Sports', 'Business', 'entertainment'];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link className="flex-shrink-0 flex items-center" to="/">
                            <img className="h-12 w-auto" src="/logo.png" alt="NewsHub" />
                        </Link>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
                        <Link to="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium">Home</Link>
                        <div className="relative group">
                            <button className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                                Categories
                                <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block transition ease-out duration-100">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => onCategoryChange && onCategoryChange(cat)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm font-medium">About</Link>
                        {user ? (
                            <div className="relative group ml-3">
                                <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="/avtar.png"
                                        alt={user.name}
                                    />
                                </button>
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block transition ease-out duration-100">
                                    <div className="px-4 py-2 border-b">
                                        <p className="text-sm text-gray-500">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                    </div>
                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Login</Link>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link to="/" className="bg-blue-50 border-blue-500 text-blue-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                onCategoryChange && onCategoryChange(cat);
                                setIsOpen(false);
                            }}
                            className="w-full text-left border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        >
                            {cat}
                        </button>
                    ))}
                    {user ? (
                        <>
                            <div className="px-3 py-2 border-t border-gray-200">
                                <div className="flex items-center">
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="/avtar.png"
                                        alt={user.name}
                                    />
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

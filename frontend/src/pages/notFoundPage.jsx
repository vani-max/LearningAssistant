import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-gray-600 mb-8">Page not found</p>
            <Link to="/" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Go Home
            </Link>
        </div>
    );
};

export default NotFoundPage;

import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => {
    return (
        <snow-fall count="400">
            <div className="min-h-screen bg-slate-300 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <h1 className="text-7xl font-semibold text-red-700 font-mountains">Sin Autorización</h1>
                </div>
            </div>
        </snow-fall>
    );
};

export default NotFound;

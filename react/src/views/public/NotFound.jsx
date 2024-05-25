import React from 'react';
import { Link } from 'react-router-dom';


const NotFound = () => {
    return (
        <snow-fall count="400">
            <div className="min-h-screen bg-slate-300 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <h1 className="text-7xl font-semibold text-red-700 font-mountains">404 Por ahí no es...</h1>
                </div>
                <div className="relative flex justify-center mt-6">
                    <Link
                        to="/login"
                        className="bg-red-700 font-mountains shadow-lg shadow-red-950 text-white text-2xl rounded-md w-40 px-6 py-2 transition transform hover:scale-105 active:scale-95 text-center"
                    >
                        Volver a Login
                    </Link>
                </div>
            </div>
        </snow-fall>
    );
};

export default NotFound;

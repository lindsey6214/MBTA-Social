import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';

const LandingPage = () => {
    return (
        <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white">
            <div className="md:w-1/2 flex justify-center items-center">
                <FaTrain className="text-[200px] drop-shadow-2xl" />
            </div>

            <div className="md:w-1/2 flex flex-col justify-center items-center text-center px-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">What's happening on the T?</h1>
                <p className="text-lg md:text-xl font-medium mb-8">Join the MBTA Social App today.</p>

                <div className="w-full max-w-sm space-y-4">
                    <Link
                        to="/signup"
                        className="block w-full bg-white text-purple-600 font-semibold py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
                    >
                        Create Account
                    </Link>

                    <div className="flex items-center justify-center">
                        <hr className="w-1/4 border-white" />
                        <span className="mx-2 text-white font-light">or</span>
                        <hr className="w-1/4 border-white" />
                    </div>

                    <Link
                        to="/login"
                        className="block w-full bg-white text-purple-600 font-semibold py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
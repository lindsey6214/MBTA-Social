import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(getUserInfo());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };

    if (!user) {
        return (
            <div className="text-center mt-4">
                <h4>Log in to view this page.</h4>
            </div>
        );
    }

    const { id, email, username } = user;

    return (
        <div className="container text-center mt-4">
            <div className="card-container d-flex flex-column align-items-center">
                <div className="card p-3 mb-3" style={{ width: '25rem' }}>
                    <h3>Welcome</h3>
                    <p className="username">{username}</p>
                </div>
                <div className="card p-3 mb-3" style={{ width: '25rem' }}>
                    <h3>Your User ID in MongoDB</h3>
                    <p className="userId">{id}</p>
                </div>
                <div className="card p-3 mb-3" style={{ width: '25rem' }}>
                    <h3>Your Email</h3>
                    <p className="email">{email}</p>
                </div>
            </div>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );
};

export default HomePage;
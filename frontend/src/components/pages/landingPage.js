import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrain } from 'react-icons/fa';
import "../../css/base.css";
import "../../css/landingLoginRegister.css";

const LandingPage = () => {
    return (
        <div className="landing-container">
            <div className="landing-left">
                <FaTrain className="train-icon" />
            </div>

            <div className="landing-right">
                    <div className="landing-text-group">
                <h1 className="landing-heading">What's happening on the T?</h1>
                <p className="landing-subtext">Join the MBTA Social App today.</p>

                <div className="auth-buttons">
                    <Link
                        to="/signup"
                        className="auth-button">Create Account</Link>

                    <div className="or-separator">
                        <hr />
                            <span>or</span>
                        <hr />
                    </div>

                    <Link
                        to="/login"
                        className="auth-button">Sign In</Link>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
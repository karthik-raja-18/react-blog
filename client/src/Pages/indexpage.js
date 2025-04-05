import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'; // Import the custom CSS file

const IndexPage = () => {
    return (
        <div className="index-container">
            {/* Welcome Message */}
            <h1 className="welcome-title">Welcome to BlogGerZz!</h1>
            <p className="welcome-message">
                Your go-to platform for all things blogging. Ready to get started?
            </p>

            {/* Get Started Button */}
            <Link to="/login">
                <button className="get-started-button">Get Started</button>
            </Link>
        </div>
    );
};

export default IndexPage;

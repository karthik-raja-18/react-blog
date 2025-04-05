import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa'; // Import search icon from React Icons
import './Header.css';

export default function Header() {
  return (
    <header className="header">
<h3
  style={{
    color:'#7e104b'   ,
    fontSize: '2.5rem', /* Slightly bigger font size */
    fontWeight: 'bold',
    fontFamily: 'Poppins, sans-serif', /* Using Poppins font family */
    letterSpacing: '2px', /* Increased letter spacing for better readability */
    textAlign: 'center', /* Center alignment */
    display: 'inline-block', /* Needed to ensure the animation works on individual letters */
    animation: 'fadeIn 2s ease-out, bounce 1s infinite alternate', /* Adding fade-in and bounce animation */
  }}
>
  {['B','l','o','g','G','e','r','Z','z','!', ' 📝'].map((letter, index) => (
    <span
      key={index}
      style={{
        display: 'inline-block',
        animation: `jumping ${1 + index * 0.1}s ease-in-out infinite`, /* Individual jumping animation timing */
      }}
    >
      {letter}
    </span>
  ))}
</h3>



      <nav>
        <Link to="/home">Home</Link>
        <Link to="/create-blog">Create Blog</Link>
        <Link to="/blogs">Manage Blogs</Link>
        {/* <Link to="/profile">Profile</Link> */}
        <Link to="/Subscription">Subscribe</Link>
        <Link to="/login">Log Out</Link>
        {/* <Link to="/Subscription">Subscribe</Link> */}
      </nav>
      {/* <div className="search-container">
        <FaSearch className="search-icon" />
        <input type="text" className="search-bar" placeholder="Search..." />
      </div> */}
    </header>
  );
}
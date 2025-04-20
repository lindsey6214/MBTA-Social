import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUsers, FaCrown, FaBolt, FaUserCircle, FaEllipsisH, FaFeatherAlt } from 'react-icons/fa';
import '../../css/base.css';
import '../../css/feed.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState(''); 
  const [userId, setUserId] = useState('');

  useEffect(() => {

    const userData = localStorage.getItem('user');
    console.log("Raw user data:", userData);

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData); // Parse the user data
        setUsername(parsedUserData.username);
        setUserId(parsedUserData._id);
      } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
  }
} 

    axios.get('http://localhost:8081/posts/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  const handlePost = () => {
    console.log("Posting with:", {
      username,
      userId,
      content
    });
    if (!content.trim()) return;
  
    axios.post('http://localhost:8081/posts/createPost', {
      username,
      userId,
      content
    })
    .then(() => {
      setContent('');
      return axios.get('http://localhost:8081/posts/');
    })
    .then(response => {
      setPosts(response.data);
    })
    .catch(error => {
      console.error('Error creating post:', error);
    });
  };

  return (
    <div className="main-container">

      {/* Sidebar */}
      <div className="sidebar">
          <FaFeatherAlt className="icon" />
          <div className="nav-list">
            <NavItem to="/" icon={<FaHome />} label="Home" />
            <NavItem to="/" icon={<FaHashtag />} label="Explore" />
            <NavItem to="/" icon={<FaBell />} label="Notifications" />
            <NavItem to="/" icon={<FaEnvelope />} label="Messages" />
            <NavItem to="/" icon={<FaBookmark />} label="Bookmarks" />
            <NavItem to="/" icon={<FaUsers />} label="Communities" />
            <NavItem to="/" icon={<FaCrown />} label="Premium" />
            <NavItem to="/" icon={<FaBolt />} label="Verified Orgs" />
            <NavItem to="/profile" icon={<FaUser />} label="Profile" />
            <NavItem to="/" icon={<FaEllipsisH />} label="More" />
          </div>
          <button 
            className="post-button"
            onClick={handlePost}
            >
              Post
            </button>
      </div>

      {/* Feed */}
      <div className="feed-container">
        <div className="new-post-box">
          <textarea 
            className="new-post-textarea" 
            placeholder="What’s happening?" 
            rows="3" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            />
          <div className="flex justify-end">
            <button className="new-post-button"
            onClick={handlePost}
            >
              Post
            </button>
          </div>
        </div>

        {posts.map(post => (
          <div key={post._id} className="post-card">
           <div className="post-header">
             <FaUserCircle className="text-xl" />
            <span>{post.username}</span>
          </div>
            <p className="post-content">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <div className="flex items-center space-x-3 text-lg cursor-pointer hover:font-bold transition">
    <div>{icon}</div>
    <span>{label}</span>
  </div>
);

export default HomePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUsers, FaCrown, FaBolt, FaUserCircle, FaEllipsisH, FaFeatherAlt } from 'react-icons/fa';

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/posts/')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          <FaFeatherAlt className="text-3xl mb-4" />
          <div className="space-y-4">
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
          <button className="mt-6 bg-white text-purple-600 font-bold py-2 rounded-full w-full hover:bg-gray-100 transition">Post</button>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img
            src="https://i.imgur.com/QCNbOAo.png" // example profile picture
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold leading-tight">FIX THIS</div>
            <div className="text-sm text-white/80">@FIX THIS</div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-scroll px-8 py-6 space-y-6">
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
          <textarea
            placeholder="What’s happening?"
            className="w-full p-2 rounded-lg text-black"
            rows="3"
          />
          <div className="flex justify-end mt-2">
            <button className="bg-white text-purple-600 font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition">Post</button>
          </div>
        </div>

        {/* Posts */}
        {posts.map(post => (
          <div key={post._id} className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-xl" />
              <div className="font-semibold">{post.username}</div>
            </div>
            <p className="mt-2 text-white text-lg">{post.content}</p>
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
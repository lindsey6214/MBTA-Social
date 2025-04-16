import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark,
  FaUserCircle, FaEllipsisH, FaFeatherAlt
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import getUserInfo from '../../utilities/decodeJwt';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [media, setMedia] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const fetchPosts = useCallback(() => {
    axios.get('http://localhost:8081/posts/')
      .then(response => {
        const userPosts = response.data.filter(post => post.username === user.username);
        setPosts(userPosts);
      })
      .catch(error => console.error('Error fetching posts:', error));
  }, [user]);

  useEffect(() => {
    if (user) fetchPosts();
  }, [user, fetchPosts]);

  const handleSubmit = async () => {
    if (!user) {
      alert("⚠️ You must be logged in to post.");
      return;
    }

    if (!content && !media) {
      alert("Post must have text or media.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("username", user.username);
    formData.append("content", content);
    if (media) formData.append("media", media);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        formData.append("location", `${latitude},${longitude}`);

        try {
          await axios.post("http://localhost:8081/posts/createPost", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          setContent('');
          setMedia(null);
          fetchPosts();
        } catch (err) {
          console.error("❌ Error posting:", err.response?.data || err.message);
          alert("Upload failed. See console.");
        }
      },
      (err) => {
        alert("Location permission denied.");
        console.error("Geolocation error:", err);
      }
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white">
      {/* Sidebar */}
      <div className="w-1/5 flex flex-col justify-between py-6 px-4">
        <div className="space-y-6">
          <FaFeatherAlt className="text-3xl mb-4" />
          <div className="space-y-4">
            <NavItem icon={<FaHome />} label="Home" />
            <Link to="/explore">
              <NavItem icon={<FaHashtag />} label="Explore" />
            </Link>
            <NavItem icon={<FaBell />} label="Notifications" />
            <Link to="/messages" className="block">
              <NavItem icon={<FaEnvelope />} label="Messages" />
            </Link>
            <NavItem icon={<FaBookmark />} label="Bookmarks" />
            <NavItem icon={<FaUser />} label="Profile" />
            <NavItem icon={<FaEllipsisH />} label="More" />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img
            src="https://i.imgur.com/QCNbOAo.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold leading-tight">{user?.username || 'Anonymous'}</div>
            <div className="text-sm text-white/80">@{user?.username || 'anonymous'}</div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-scroll px-8 py-6 space-y-6">
        {/* Post Creator */}
        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
          <textarea
            placeholder="What’s happening?"
            className="w-full p-2 rounded-lg text-black"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setMedia(e.target.files[0])}
            className="mt-2"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-white via-purple-200 to-white text-purple-800 font-bold px-6 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition duration-200 ease-in-out"
            >
              ✨ Post
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        {posts.map(post => (
          <div key={post._id} className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-xl" />
              <div className="font-semibold">{post.username}</div>
            </div>
            <p className="mt-2 text-white text-lg">{post.content}</p>
            {post.imageUri && (
              post.imageUri.endsWith(".mp4") ? (
                <video controls className="mt-2 w-full rounded-lg">
                  <source src={`http://localhost:8081${post.imageUri}`} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={`http://localhost:8081${post.imageUri}`}
                  alt="Post media"
                  className="mt-2 w-full rounded-lg"
                />
              )
            )}
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

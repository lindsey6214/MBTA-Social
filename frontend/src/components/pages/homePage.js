import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUserCircle, FaEllipsisH } from 'react-icons/fa';
import '../../css/base.css';
import '../../css/feed.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [validUsernames, setValidUsernames] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [trainLines, setTrainLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUsername(parsedUserData.username);
        setUserId(parsedUserData._id);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    if (userId) {
      axios.get(`http://localhost:8081/posts/homeFeed/${userId}`)
        .then(response => {
          setPosts(response.data);
          response.data.forEach(post => {
            axios.get(`http://localhost:8081/comments/post/${post._id}`)
              .then(res => {
                setCommentCounts(prev => ({
                  ...prev,
                  [post._id]: res.data.length
                }));
              })
              .catch(err => console.error('Error fetching comments for post:', post._id, err));
          });
        })
        .catch(error => console.error('Error fetching posts:', error));
    }

    axios.get('http://localhost:8081/users/')
      .then(response => {
        const usernames = response.data.map(user => user.username);
        setValidUsernames(usernames);
      })
      .catch(error => console.error('Error fetching usernames:', error));

    axios.get("http://localhost:8081/trainlines")
      .then((res) => {
        setTrainLines(res.data);
      })
      .catch((err) => {
        console.error("Error loading train lines:", err);
      });

  }, [userId]);

  const handlePost = () => {
    if (!content.trim()) return;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          axios.post('http://localhost:8081/posts/createPost', {
            username,
            userId,
            content,
            latitude,
            longitude,
            trainLineId: selectedLine || null
          })
            .then(() => {
              setContent('');
              setSelectedLine('');
              return axios.get(`http://localhost:8081/posts/homeFeed/${userId}`);
            })
            .then(response => setPosts(response.data))
            .catch(error => console.error('Error creating post:', error));
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Location permission denied. Cannot create post without location.");
        }
      );
    } else {
      alert("Geolocation not supported by your browser.");
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const highlightMentions = (text) => {
    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    const parts = text.split(mentionRegex);

    return parts.map((part, i) => {
      if (i % 2 === 1) {
        const mentionedUser = part;
        return validUsernames.includes(mentionedUser)
          ? <span key={i} className="mention">@{mentionedUser}</span>
          : `@${mentionedUser}`;
      }
      return part;
    });
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="nav-list">
          <NavItem to="/home" icon={<FaHome />} label="Home" />
          <NavItem to="/explore" icon={<FaHashtag />} label="Explore" />
          <NavItem to="/notifications" icon={<FaBell />} label="Notifications" />
          <NavItem to="/messages" icon={<FaEnvelope />} label="Messages" />
          <NavItem to="/bookmarks" icon={<FaBookmark />} label="Bookmarks" />
          <NavItem to="/profile" icon={<FaUser />} label="Profile" />
          <NavItem to="/more" icon={<FaEllipsisH />} label="More" />
        </div>
      </div>

      <div className="feed-container">
        <div className="new-post-box">
          <textarea
            className="new-post-textarea"
            placeholder="What’s happening?"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="form-select"
          >
            <option value="">Attach a train line (optional)</option>
            {trainLines.map((line) => (
              <option key={line._id} value={line._id}>
                {line.name}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <button className="new-post-button" onClick={handlePost}>Post</button>
          </div>
        </div>

        {posts.map(post => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="post-card">
              <div className="post-header">
                <FaUserCircle className="text-xl" />
                <span>{post.username}</span>
              </div>
              <p className="post-content">{highlightMentions(post.content)}</p>
              <p className="post-timestamp">{formatTimestamp(post.timestamp)}</p>

              <button className="comment-count-button">
                💬 {commentCounts[post._id] ?? 0} Comments
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="nav-item">
    <div>{icon}</div>
    <span>{label}</span>
  </Link>
);

export default HomePage;

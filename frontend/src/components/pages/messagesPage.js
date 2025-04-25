import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHome, FaUser, FaBell, FaEnvelope, FaHashtag, FaBookmark, FaUserCircle, FaEllipsisH } from 'react-icons/fa';
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";
import "../../css/base.css";
import "../../css/messagesPage.css";

const MessagesPage = () => {
  const user = getUserInfo();
  const [followedUsers, setFollowedUsers] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch followed users
  useEffect(() => {
    if (!user) return;

    axios
      .get(`http://localhost:8081/following/${user.id}`)
      .then((res) => setFollowedUsers(res.data))
      .catch((err) => console.error("Failed to load followed users:", err));
  }, [user]);

  // Fetch messages with selected receiver
  useEffect(() => {
    if (!user || !receiverId) return;

    axios
      .get("http://localhost:8081/messages/conversation", {
        params: { user1: user.id, user2: receiverId },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Message fetch error:", err));
  }, [user, receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !receiverId) return;

    const payload = {
      senderId: user.id,
      receiverId,
      content: newMessage,
    };

    try {
      const res = await axios.post("http://localhost:8081/messages/send", payload);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
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

      {/* Messages Section */}
      <div className="messages-container">
        <h1 className="messages-title">
          <FaEnvelope /> Messages
        </h1>

        {/* User Picker */}
        <select
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="receiver-select"
        >
          <option value="">Select a user to message</option>
          {followedUsers.map((u) => (
            <option key={u._id} value={u._id}>
              {u.username}
            </option>
          ))}
        </select>

        {/* Messages UI */}
        <div className="messages-box">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-row ${msg.senderId === user.id ? "you" : "them"}`}
            >
              <div className="message-bubble">
                <p className="message-meta">{msg.senderId === user.id ? "You" : "Them"}</p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="message-input-wrapper">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="message-input"
          />
          <button
            onClick={handleSend}
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="nav-item" style={{ textDecoration: "none" }}>
    <div>{icon}</div>
    <span>{label}</span>
  </Link>
);

export default MessagesPage;

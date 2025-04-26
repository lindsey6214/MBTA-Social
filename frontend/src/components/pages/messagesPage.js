import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  FaHome,
  FaUser,
  FaBell,
  FaEnvelope,
  FaHashtag,
  FaBookmark,
  FaEllipsisH,
} from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";
import { Link } from "react-router-dom";
import "../../css/base.css";
import "../../css/messagesPage.css";

// Debounce function to delay the API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MessagesPage = () => {
  const user = getUserInfo();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [userError, setUserError] = useState(null); // To store user fetch errors
  const [messagesError, setMessagesError] = useState(null); // To store message fetch errors

  // Use debounce for search input
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch all users
  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:8081/user/getAll")
      .then((res) => setAllUsers(res.data))
      .catch((err) => {
        setUserError("Failed to fetch users. Please try again later.");
        console.error("Failed to fetch users:", err);
      });
  }, [user]);

  // Fetch all conversations for the current user
  useEffect(() => {
    if (!user?.id) return;

    axios
      .get(`http://localhost:8081/messages/conversations/${user.id}`)
      .then((res) => setConversations(res.data))
      .catch((err) => {
        setMessagesError("Failed to load conversations. Please try again later.");
        console.error("Failed to load conversations:", err);
      });
  }, [user?.id]);

  // Fetch messages with selected receiver
  useEffect(() => {
    if (!user?.id || !receiverId) return;

    axios
      .get("http://localhost:8081/messages/conversation", {
        params: {
          senderId: user.id,
          receiverId: receiverId,
        },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => {
        setMessagesError("Failed to load messages. Please try again later.");
        console.error("Message fetch error:", err);
      });
  }, [user?.id, receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim() || !receiverId) return;

    const payload = {
      senderId: user.id,
      receiverId,
      content: newMessage,
    };

    try {
      const res = await axios.post(
        "http://localhost:8081/messages/send",
        payload
      );
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      setMessagesError("Failed to send the message. Please try again.");
      console.error("Send error:", err);
    }
  };

  const handleSelectUser = (id) => {
    setReceiverId(id);
    setSearchTerm("");
  };

  const getUsername = (id) => {
    const userObj = allUsers.find((u) => u._id === id);
    return userObj ? userObj.username : "Unknown";
  };

  // Filter and sort users
  const filteredUsers = allUsers
    .filter(
      (u) =>
        u.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
        u._id !== user.id
    )
    .sort((a, b) => {
      const usernameA = a.username.toLowerCase();
      const usernameB = b.username.toLowerCase();

      // Compare alphabetically first
      if (usernameA < usernameB) return -1;
      if (usernameA > usernameB) return 1;

      // If the usernames are the same, compare numerically (if one is a number)
      const isAValueNumeric = !isNaN(usernameA);
      const isBValueNumeric = !isNaN(usernameB);

      // If one is numeric and the other isn't, place the numeric one last
      if (isAValueNumeric && !isBValueNumeric) return 1;
      if (!isAValueNumeric && isBValueNumeric) return -1;

      return 0; // If both are equal, keep their order
    });

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

        {/* Error Handling for Users */}
        {userError && <p className="error-message">{userError}</p>}

        {/* User Search */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a user to message"
          className="receiver-select"
        />

        {debouncedSearchTerm &&
          filteredUsers.length > 0 &&
          filteredUsers.map((u) => (
            <div
              key={u._id}
              className="search-result"
              onClick={() => handleSelectUser(u._id)}
            >
              {u.username}
            </div>
          ))}

        {debouncedSearchTerm && filteredUsers.length === 0 && (
          <p className="no-user-found">User does not exist</p>
        )}

        {/* Error Handling for Messages */}
        {messagesError && <p className="error-message">{messagesError}</p>}

        {/* Current Conversation UI */}
        <div className="messages-box">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`message-row ${
                  msg.senderId === user.id ? "you" : "them"
                }`}
              >
                <div className="message-bubble">
                  <p className="message-meta">
                    {msg.senderId === user.id ? "You" : "Them"}
                  </p>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-messages">No messages yet</p>
          )}
        </div>

        {/* Message Input */}
        <div className="message-input-wrapper">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message"
            className="message-input"
          />
          <button onClick={handleSend} className="send-button">
            Send
          </button>
        </div>

        {/* Previous Conversations List */}
        <div className="conversation-list">
          <h2>Previous Conversations</h2>
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map((conv, i) => {
              const otherUser =
                conv._id.sender === user.id
                  ? conv._id.receiver
                  : conv._id.sender;

              const lastMsg =
                conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1].content
                  : "";

              return (
                <div
                  key={i}
                  className="conversation-item"
                  onClick={() => handleSelectUser(otherUser)}
                >
                  <strong>{getUsername(otherUser)}</strong>
                  <p className="last-message-preview">{lastMsg}</p>
                </div>
              );
            })
          )}
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
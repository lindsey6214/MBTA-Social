import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FaEnvelope /> Messages
      </h1>

      {/* User Picker */}
      <select
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        className="p-2 text-black rounded mb-4 w-full"
      >
        <option value="">Select a user to message</option>
        {followedUsers.map((u) => (
          <option key={u._id} value={u._id}>
            {u.username}
          </option>
        ))}
      </select>

      {/* Messages UI */}
      <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm shadow-md mb-6 h-72 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-3 flex ${msg.senderId === user.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`bg-white/30 p-3 rounded-lg max-w-xs ${
                msg.senderId === user.id ? "text-right" : "text-left"
              }`}
            >
              <p className="text-sm text-white/80">{msg.senderId === user.id ? "You" : "Them"}</p>
              <p className="text-white font-medium">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-grow p-2 rounded-lg text-black"
        />
        <button
          onClick={handleSend}
          className="bg-white text-purple-600 font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;

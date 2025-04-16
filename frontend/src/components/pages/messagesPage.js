import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = getUserInfo();

  // Replace this with the actual receiverId you want to test with
  const receiverId = "Useryg529q"; // ❗️ Replace this

  useEffect(() => {
    if (!user) return;

    axios
      .get("http://localhost:8081/messages/conversation", {
        params: {
          user1: user.id,
          user2: receiverId,
        },
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Fetch error:", err));
  }, [user]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const payload = {
      senderId: user.id,
      receiverId,
      content: newMessage,
    };

    try {
      const res = await axios.post("http://localhost:8081/messages/send", payload);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaEnvelope /> Messages
      </h1>

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

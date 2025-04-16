import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const user = getUserInfo();

  useEffect(() => {
    if (!user) return;
    // This is just mocked notifications for now
    setNotifications([
      {
        _id: 1,
        message: "Your post received a new like!",
        time: "Just now",
      },
      {
        _id: 2,
        message: "You have a new follower.",
        time: "2h ago",
      },
    ]);
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBell /> Notifications
      </h1>

      {user ? (
        notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((note) => (
              <div
                key={note._id}
                className="bg-white/20 p-4 rounded-xl backdrop-blur-sm shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <FaUserCircle className="text-xl" />
                  <div>
                    <p className="text-white font-semibold">{note.message}</p>
                    <p className="text-sm text-white/70">{note.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No notifications yet.</p>
        )
      ) : (
        <p className="text-lg">Please log in to see your notifications.</p>
      )}
    </div>
  );
};

export default NotificationsPage;

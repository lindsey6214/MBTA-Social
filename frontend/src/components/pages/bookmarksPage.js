import React, { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import getUserInfo from "../../utilities/decodeJwt";
import axios from "axios";

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const user = getUserInfo();

  useEffect(() => {
    if (!user) return;

    // Replace this with real API call to get bookmarked posts
    axios
      .get(`http://localhost:8081/posts/bookmarks/${user.id}`)
      .then((res) => setBookmarks(res.data))
      .catch((err) => console.error("Error loading bookmarks:", err));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white px-8 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaBookmark /> Bookmarked Posts
      </h1>

      {user ? (
        bookmarks.length > 0 ? (
          bookmarks.map((post) => (
            <div
              key={post._id}
              className="bg-white/20 p-4 mb-4 rounded-xl backdrop-blur-sm"
            >
              <p className="font-semibold">@{post.username}</p>
              <p className="mt-2">{post.content}</p>
              {post.mediaUris && (
                post.mediaUris.endsWith(".mp4") ? (
                  <video controls className="mt-2 w-full rounded-lg">
                    <source
                      src={`http://localhost:8081${post.mediaUris}`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={`http://localhost:8081${post.mediaUris}`}
                    alt="Post media"
                    className="mt-2 w-full rounded-lg"
                  />
                )
              )}
            </div>
          ))
        ) : (
          <p>You haven't bookmarked any posts yet.</p>
        )
      ) : (
        <p>Please log in to view your bookmarks.</p>
      )}
    </div>
  );
};

export default BookmarksPage;

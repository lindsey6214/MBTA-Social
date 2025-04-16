import React, { useState, useEffect } from "react";
import axios from "axios";

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get("http://localhost:8081/explore/nearby", {
              params: { lat: latitude, lon: longitude },
            });
            setPosts(res.data);
          } catch (err) {
            setError("Failed to load nearby posts.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Location access denied.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setLoading(false);
    }
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400">
      <h1 className="text-3xl font-bold mb-4">Explore Nearby Posts</h1>

      <input
        type="text"
        placeholder="Search posts..."
        className="p-2 rounded-lg text-black w-full mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading && <p>Loading nearby posts...</p>}
      {error && <p className="text-red-300">{error}</p>}

      {filteredPosts.map((post) => (
        <div
          key={post._id}
          className="bg-white/20 text-white p-4 mb-4 rounded-xl backdrop-blur-sm"
        >
          <div className="font-semibold">@{post.username}</div>
          <p className="mt-2">{post.content}</p>
          {post.imageUri &&
            (post.imageUri.endsWith(".mp4") ? (
              <video controls className="mt-2 w-full rounded-lg">
                <source src={`http://localhost:8081${post.imageUri}`} type="video/mp4" />
              </video>
            ) : (
              <img
                src={`http://localhost:8081${post.imageUri}`}
                alt="Post media"
                className="mt-2 w-full rounded-lg"
              />
            ))}
        </div>
      ))}
    </div>
  );
};

export default ExplorePage;

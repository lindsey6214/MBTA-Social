import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import getUserInfo from "../../utilities/decodeJwt";
import "../../css/feed.css";
import "../../css/base.css";

const PostDetailsPage = () => {
  const { postID } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUserInfo();
    setUser(userData);

    axios.get(`http://localhost:8081/posts/${postID}`)
      .then(res => setPost(res.data))
      .catch(err => console.error("Error loading post:", err));

    axios.get(`http://localhost:8081/comments/post/${postID}`)
      .then(res => setComments(res.data))
      .catch(err => console.error("Error loading comments:", err));
  }, [postID]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;
    try {
      const res = await axios.post("http://localhost:8081/comments/createComment", {
        postID,
        userID: user._id,
        username: user.username,
        content: newComment
      });
      setComments(prev => [res.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  if (!post) return <div className="feed-container">Loading post...</div>;

  return (
    <div className="main-container">
      {/* Sidebar placeholder or import if you want a nav here */}

      <div className="feed-container">
        <div className="post-card">
          <div className="post-header">
            <span>@{post.username}</span>
          </div>
          <p className="post-content">{post.content}</p>
          <p className="post-timestamp">{formatTimestamp(post.timestamp)}</p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "white" }}>Comments</h2>

          {user ? (
            <div className="new-post-box">
              <textarea
                className="new-post-textarea"
                placeholder="Write a comment..."
                rows="2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-end">
                <button className="new-post-button" onClick={handleCommentSubmit}>
                  Comment
                </button>
              </div>
            </div>
          ) : (
            <p style={{ color: "white" }}>Please log in to comment.</p>
          )}

          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="post-card">
                <div className="post-header">
                  <span>@{comment.username}</span>
                </div>
                <p className="post-content">{comment.content}</p>
                <p className="post-timestamp">{formatTimestamp(comment.timestamp)}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "white" }}>No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
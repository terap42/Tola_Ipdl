import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddPostModal from './AddPostModal';
import './HomePage.css';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handlePostAdded = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/dislike`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
        )
      );
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleCommentSubmit = async (postId, commentText, userId) => {
    try {
      await axios.post(`http://localhost:5001/api/posts/${postId}/comments`, { text: commentText, user_id: userId });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, { user_email: 'current_user@example.com', text: commentText }]
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="home-page">
      <header className="header">
        <h1>Tola</h1>
        <button className="add-post-btn" onClick={() => setIsModalOpen(true)}>Ajouter une question</button>
        <button onClick={handleLogout}>Se Déconnecter</button>
      </header>
      <AddPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onPostAdded={handlePostAdded} />
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <div className="post-header">
              <h2>{post.title}</h2>
              <p>{post.user_email}</p>
            </div>
            {post.image && <img src={`http://localhost:5001/${post.image}`} alt={post.title} />}
            <p>{post.content}</p>
            <div className="post-actions">
              <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
              <button onClick={() => handleDislike(post.id)}>👎 {post.dislikes}</button>
              <button>💬 {post.comments.length}</button>
            </div>
            <div className="comments">
              {post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <p>{comment.user_email}: {comment.text}</p>
                </div>
              ))}
              <div className="add-comment">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCommentSubmit(post.id, e.target.value, 1);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import axios from 'axios';
import './AddPostModal.css';

const AddPostModal = ({ isOpen, onClose, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('user_id', 1); // Remplacez par l'ID utilisateur actuel
    formData.append('user_email', 'user@example.com'); // Remplacez par l'email utilisateur actuel

    console.log('Form data:', {
      title,
      content,
      image,
      user_id: 1,
      user_email: 'user@example.com'
    });

    try {
      const response = await axios.post('http://localhost:5001/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response:', response.data);
      onPostAdded(response.data); // Envoyer le nouveau post au parent
      setTitle('');
      setContent('');
      setImage(null); // Réinitialise l'état de l'image après la soumission
      onClose();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Ajouter une question</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <button type="submit" onSubmit={handleSubmit}>Publier</button>
        </form>
      </div>
    </div>
  );
};

export default AddPostModal;

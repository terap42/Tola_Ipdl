const express = require('express');
const multer = require('multer');
const router = express.Router();
const db = require('../db'); // Assurez-vous que db est correctement configuré pour utiliser des promesses

// Configurer Multer pour stocker les fichiers dans le dossier "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Route pour obtenir toutes les publications
router.get('/posts', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT posts.*, users.email AS user_email 
      FROM posts 
      JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
    `);
    const posts = results.map(post => ({
      ...post,
      comments: []
    }));

    // Fetch comments for each post
    for (let post of posts) {
      const [comments] = await db.query('SELECT comments.*, users.email AS user_email FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?', [post.id]);
      post.comments = comments;
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route pour créer une nouvelle publication avec une image
router.post('/posts', upload.single('image'), async (req, res) => {
  const { title, content, user_id } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const [result] = await db.query('INSERT INTO posts (title, content, image, user_id) VALUES (?, ?, ?, ?)', [title, content, image, user_id]);
    const newPost = {
      id: result.insertId,
      title,
      content,
      image,
      user_id,
      user_email: req.body.user_email,
      likes: 0,
      dislikes: 0,
      comments: [],
      created_at: new Date()
    };
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route pour ajouter un commentaire
router.post('/posts/:id/comments', async (req, res) => {
  const { text, user_id } = req.body;
  const postId = req.params.id;
  try {
    await db.query('INSERT INTO comments (text, user_id, post_id) VALUES (?, ?, ?)', [text, user_id, postId]);
    res.status(201).json({ message: 'Comment added' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route pour liker une publication
router.post('/posts/:id/like', async (req, res) => {
  const postId = req.params.id;
  try {
    await db.query('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
    res.status(200).json({ message: 'Post liked' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Route pour détester une publication
router.post('/posts/:id/dislike', async (req, res) => {
  const postId = req.params.id;
  try {
    await db.query('UPDATE posts SET dislikes = dislikes + 1 WHERE id = ?', [postId]);
    res.status(200).json({ message: 'Post disliked' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

module.exports = router;

// src/components/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      console.log('Login successful:', data);
      // Vous pouvez stocker le token de l'utilisateur dans le localStorage ou un contexte global
      localStorage.setItem('userToken', data.token);
      navigate('/home');  // Redirection vers la page d'accueil
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h1>Bienvenue sur Tola!</h1>
          <p>Un lieu pour partager le savoir et mieux comprendre le monde</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Nom d'utilisateur</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="adresse email"
              />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="mot de passe"
              />
            </div>
            <button type="submit" className="btn-login">Se connecter</button>
          </form>
          <p>
            Vous n'avez pas de compte? <Link to="/signup">Créer un compte</Link>
          </p>
        </div>
        <div className="about-section">
          <h2>A propos</h2>
          <p>
            « Tola » est une plateforme qui permet aux utilisateurs (étudiants de l'ESP) de poser des questions et d'y répondre. Les questions sont assignées à certaines catégories ; en s'inscrivant, les utilisateurs sélectionnent les thèmes sur lesquels ils ont des connaissances. Les questions-réponses postées sur Quora peuvent être évaluées positivement ou négativement par les utilisateurs. Par conséquent, les échanges bien notés et donc utiles sont mis en évidence et apparaissent plus fréquemment dans les flux. La fonction de commentaire permet aux utilisateurs de participer ou de discuter des sujets. De plus, Quora dispose également d'une fonction de modification qui permet aux utilisateurs de retravailler les questions et réponses d'autres personnes et ainsi de les améliorer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

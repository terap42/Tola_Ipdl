import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../services/authService'; 
import './SignUpPage.css';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    console.log('SignUp attempt:', { email, password, confirmPassword });

    if (password === confirmPassword) {
      try {
        const response = await signUp(email, password);
        console.log('SignUp success:', response);
        navigate('/');
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    } else {
      console.error("Les mots de passe ne correspondent pas.");
    }
  };

  return (
    <div className="sign-up-page">
      <div className="sign-up-container">
        <h1>Créer un compte</h1>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse email"
              required
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmer le mot de passe"
              required
            />
          </div>
          <button type="submit" className="btn-sign-up">Créer un compte</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;

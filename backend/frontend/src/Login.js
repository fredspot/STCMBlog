import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { isLoggedIn, setIsLoggedIn, setUsername: setAuthUsername } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from.pathname);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showPopup, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', { //'http://localhost:8080/api/login'
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setIsLoggedIn(true);
      setAuthUsername(username);
      setShowPopup(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <label htmlFor="password">Password</label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
      {showPopup && (
        <div className="login-popup">
          Successfully logged in
        </div>
      )}
    </div>
  );
};

export default Login;

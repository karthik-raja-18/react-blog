import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function login(ev) {
    ev.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      // Redirect to /home page after successful login and pass the username in the state
      navigate('/home', { state: { username } });
    } else {
      alert('Login failed');
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={login}>
        <h1 className="login-title">Login</h1>
        <div className="input-container">
          <input
            className="input-field"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
        </div>
        <div className="input-container">
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
        </div>
        <button className="login-button">Login</button>
        <p className="register-link">
          Don’t have an account?{' '}
          <Link className="register-link-text" to="/register">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

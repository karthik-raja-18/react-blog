import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Registration.css"; // Import the custom CSS for styles

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // New email state
  const navigate = useNavigate();

  async function register(ev) {
    ev.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ username, password, email }), // Include email in the request body
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        alert("Registration Successful! A confirmation email has been sent.");
        navigate("/login");
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (err) {
      alert("Unable to connect to the server. Please try again later.");
    }
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={register}>
        <h1 className="register-title">Create Account</h1>

        <div className="input-container">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            className="input-field"
            required
          />
        </div>

        <div className="input-container">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            className="input-field"
            required
          />
        </div>

        {/* <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className="input-field"
            required
          />
        </div> */}

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="login-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="login-link-text">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

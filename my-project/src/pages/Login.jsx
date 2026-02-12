import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
        password: password,
      });

      const { access_token, refresh_token, token_type } = response.data;

      // Save tokens
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      localStorage.setItem("token_type", token_type);

      alert("Login successful!");
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background-gradient"></div>
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✨</div>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to continue</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Link to="/signup" className="auth-link-button">
            Don't have an account? Sign up
          </Link>

          <div className="auth-footer">
            Secure login with end-to-end encryption.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

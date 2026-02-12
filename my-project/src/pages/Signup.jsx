import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/auth.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Signup successful ✅");
      } else {
        setError(data.detail || "Signup failed ❌");
      }
    } catch (error) {
      setError("Server error ❌");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background-gradient"></div>
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">✨</div>
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join us today</p>
          </div>

          {error && (
            <div className="auth-alert auth-alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {message && (
            <div className="auth-alert auth-alert-success">
              <span>✅</span> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  placeholder="Enter strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <Link to="/login" className="auth-link-button">
            Already have an account? Login
          </Link>

          <div className="auth-footer">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/village");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth card">
      <h1>Welcome back</h1>
      <p className="sub muted">Log in to your village house</p>
      <form onSubmit={handleSubmit} className="stack">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

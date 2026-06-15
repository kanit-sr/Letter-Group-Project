import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(username, email, password);
      navigate("/village");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth card">
      <h1>Build your house</h1>
      <p className="sub muted">Join the village and start sending letters</p>
      <form onSubmit={handleSubmit} className="stack">
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p className="muted">
        Already a villager? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}

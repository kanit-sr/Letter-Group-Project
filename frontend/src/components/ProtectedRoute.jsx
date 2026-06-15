import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

// Gates routes behind authentication; redirects to /login when logged out.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p style={{ padding: "2rem" }}>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

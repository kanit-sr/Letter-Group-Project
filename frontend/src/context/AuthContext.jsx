import React, { createContext, useContext, useEffect, useState } from "react";

import api, { setToken, clearToken, getToken } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a token, try to restore the session.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const register = async (username, email, password) => {
    const data = await api.post(
      "/auth/register",
      { username, email, password },
      { auth: false }
    );
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const data = await api.post(
      "/auth/login",
      { email, password },
      { auth: false }
    );
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

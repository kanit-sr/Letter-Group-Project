import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { IconHouse } from "./icons";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    api
      .get("/letters/unread-count")
      .then((data) => setUnread(data.count))
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <Link to="/village" className="brand">
        <IconHouse className="brand-icon" />
        Letter Village
      </Link>
      {user && (
        <>
          <Link to="/village">Village</Link>
          <Link to="/my-house">My House</Link>
          <Link to="/mailbox">
            Mailbox{unread > 0 && <span className="badge">{unread}</span>}
          </Link>
          <span className="spacer" />
          <span>Hi, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
}

import React, { useEffect, useState } from "react";

import api from "../utils/api";

export default function Mailbox() {
  const [tab, setTab] = useState("inbox");
  const [letters, setLetters] = useState([]);
  const [error, setError] = useState("");

  const load = (which) => {
    setError("");
    const path = which === "inbox" ? "/letters/inbox" : "/letters/public";
    api
      .get(path)
      .then((data) => setLetters(data.letters))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load(tab);
  }, [tab]);

  const markRead = async (id) => {
    try {
      await api.patch(`/letters/${id}/read`);
      setLetters((ls) =>
        ls.map((l) => (l._id === id ? { ...l, isRead: true } : l))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1>Mailbox</h1>
      <div className="tabs">
        <button onClick={() => setTab("inbox")} disabled={tab === "inbox"}>
          Inbox
        </button>
        <button onClick={() => setTab("public")} disabled={tab === "public"}>
          Community Board
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {letters.length === 0 && !error && (
        <p className="muted">No letters here yet.</p>
      )}
      <ul className="letter-list">
        {letters.map((l) => {
          const unread = tab === "inbox" && !l.isRead;
          return (
            <li key={l._id} className={`letter${unread ? " unread" : ""}`}>
              <div className="subject">{l.subject}</div>
              <div className="from">
                from {l.senderId?.username || "someone"}
              </div>
              <p className="body">{l.body}</p>
              {unread && (
                <button onClick={() => markRead(l._id)}>Mark as read</button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

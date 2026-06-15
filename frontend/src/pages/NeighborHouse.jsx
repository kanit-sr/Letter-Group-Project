import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../utils/api";
import HouseView from "../components/HouseView";
import { useAuth } from "../context/AuthContext";
import { IconEnvelope } from "../components/icons";

export default function NeighborHouse() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [house, setHouse] = useState(null);
  const [error, setError] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api
      .get(`/houses/${userId}`)
      .then((data) => setHouse(data.house))
      .catch((err) => setError(err.message));
  }, [userId]);

  const send = async (e) => {
    e.preventDefault();
    setStatus("Sending…");
    try {
      await api.post("/letters", {
        recipientId: isPublic ? undefined : userId,
        subject,
        body,
        isPublic,
      });
      setSubject("");
      setBody("");
      setStatus("Letter sent!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  if (error) return <p className="page error">{error}</p>;
  if (!house) return <p className="page muted">Loading…</p>;

  const ownerName = house.userId?.username || "this villager";
  const isOwn = user && (house.userId?._id || house.userId) === user._id;

  return (
    <div className="page">
      <h1>{ownerName}'s House</h1>
      <div className="row">
        <div className="house-stage">
          <HouseView house={house} size={240} />
        </div>
        {!isOwn ? (
          <form onSubmit={send} className="card stack" style={{ minWidth: 320, flex: 1 }}>
            <h2 className="with-icon">
              <IconEnvelope /> Send a letter
            </h2>
            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <textarea
              placeholder="Write your letter…"
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
            <label className="inline">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Post publicly (community board)
            </label>
            <button type="submit">Send</button>
            {status && <p className="muted">{status}</p>}
          </form>
        ) : (
          <div className="card">
            <p className="muted">This is your house. Visit a neighbor to send a letter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

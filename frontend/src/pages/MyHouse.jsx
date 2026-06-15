import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../utils/api";
import HouseView from "../components/HouseView";
import { useAuth } from "../context/AuthContext";

const ROOF_SHAPES = ["gable", "hip", "flat", "gambrel", "shed", "mansard"];
const DOOR_STYLES = ["classic", "arched", "double", "cottage", "modern"];
const WALL_PATTERNS = ["plain", "brick", "wood", "stone"];
const MAILBOX_STYLES = ["default", "rustic", "modern", "vintage"];

export default function MyHouse() {
  const { user } = useAuth();
  const [house, setHouse] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user) return;
    api
      .get(`/houses/${user._id}`)
      .then((data) => setHouse(data.house))
      .catch(() => setHouse({}));
  }, [user]);

  if (!house) return <p className="page muted">Loading…</p>;

  const update = (key, value) => setHouse((h) => ({ ...h, [key]: value }));

  const save = async () => {
    setStatus("Saving…");
    try {
      const data = await api.put("/houses/me", {
        roofColor: house.roofColor,
        roofShape: house.roofShape,
        wallColor: house.wallColor,
        wallPattern: house.wallPattern,
        doorStyle: house.doorStyle,
        mailboxStyle: house.mailboxStyle,
      });
      setHouse(data.house);
      setStatus("Saved!");
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="page">
      <h1>My House</h1>
      <p className="muted">
        Quick colors below, or open the{" "}
        <Link to="/my-house/edit">House Editor</Link> to build with layered parts.
      </p>
      <div className="row">
        <div className="house-stage">
          <HouseView house={house} size={240} />
        </div>
        <div className="card stack" style={{ minWidth: 260 }}>
          <h2>Customize</h2>
          <label>
            Roof color
            <input
              type="color"
              value={house.roofColor || "#8B4513"}
              onChange={(e) => update("roofColor", e.target.value)}
            />
          </label>
          <label>
            Roof shape
            <select value={house.roofShape || "gable"} onChange={(e) => update("roofShape", e.target.value)}>
              {ROOF_SHAPES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Wall color
            <input
              type="color"
              value={house.wallColor || "#E8D7C3"}
              onChange={(e) => update("wallColor", e.target.value)}
            />
          </label>
          <label>
            Wall pattern
            <select value={house.wallPattern || "plain"} onChange={(e) => update("wallPattern", e.target.value)}>
              {WALL_PATTERNS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Door style
            <select value={house.doorStyle || "classic"} onChange={(e) => update("doorStyle", e.target.value)}>
              {DOOR_STYLES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Mailbox
            <select value={house.mailboxStyle || "default"} onChange={(e) => update("mailboxStyle", e.target.value)}>
              {MAILBOX_STYLES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <button onClick={save}>Save customization</button>
          {status && <p className="muted">{status}</p>}
        </div>
      </div>
    </div>
  );
}

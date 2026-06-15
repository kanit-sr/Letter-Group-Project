import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../utils/api";
import HouseView from "../components/HouseView";

export default function Village() {
  const [houses, setHouses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/houses")
      .then((data) => setHouses(data.houses))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <h1>The Village</h1>
      <p className="muted">Click a house to visit a neighbor and leave a letter.</p>
      {error && <p className="error">{error}</p>}
      {houses.length === 0 && !error && <p className="muted">No houses yet.</p>}
      <div className="village-grid">
        {houses.map((h) => (
          <Link
            key={h._id}
            to={`/house/${h.userId?._id || h.userId}`}
            className="house-plot"
          >
            <HouseView house={h} />
            <div className="name">{h.userId?.username || "villager"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

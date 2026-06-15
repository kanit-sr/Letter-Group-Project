import React from "react";

import { layerSrc } from "../utils/houseParts";

// Read-only render of a v2 layer design, scaled to fit `size`. Layers are
// positioned by their center (x, y) with rotation/scale around that center.
function DesignView({ design, size }) {
  const { canvas, layers } = design;
  const scale = size / Math.max(canvas.width, canvas.height);
  const ordered = [...layers].sort((a, b) => (a.z || 0) - (b.z || 0));

  return (
    <div
      style={{
        position: "relative",
        width: canvas.width * scale,
        height: canvas.height * scale,
        background: canvas.background || "#cfe9f2",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {ordered.map((l) => (
        <img
          key={l.id}
          src={layerSrc(l)}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            left: l.x * scale,
            top: l.y * scale,
            width: l.width * scale,
            height: l.height * scale,
            opacity: l.opacity ?? 1,
            transform: `translate(-50%, -50%) rotate(${l.rotation || 0}deg) scale(${l.scaleX ?? 1}, ${l.scaleY ?? 1})`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

// Tiny SVG house preview driven by customization fields. Roof shape and wall
// pattern are approximated visually — enough for a demo. Renders the v2 layer
// design instead when present.
export default function HouseView({ house, size = 120 }) {
  if (house?.design?.version === 2 && Array.isArray(house.design.layers)) {
    return <DesignView design={house.design} size={size} />;
  }

  const {
    roofColor = "#8B4513",
    roofShape = "gable",
    wallColor = "#E8D7C3",
    wallPattern = "plain",
    doorStyle = "classic",
  } = house || {};

  const roof = (() => {
    switch (roofShape) {
      case "flat":
        return <rect x="10" y="40" width="80" height="12" fill={roofColor} />;
      case "shed":
        return <polygon points="10,52 90,32 90,52" fill={roofColor} />;
      case "hip":
        return <polygon points="50,18 92,52 8,52" fill={roofColor} />;
      case "gambrel":
        return (
          <polygon points="50,20 78,38 90,52 10,52 22,38" fill={roofColor} />
        );
      case "mansard":
        return (
          <polygon points="22,24 78,24 90,52 10,52" fill={roofColor} />
        );
      case "gable":
      default:
        return <polygon points="50,18 90,52 10,52" fill={roofColor} />;
    }
  })();

  const wallFill =
    wallPattern === "brick"
      ? "#c1694f"
      : wallPattern === "wood"
      ? "#b5894e"
      : wallPattern === "stone"
      ? "#9e9e9e"
      : wallColor;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {roof}
      <rect x="20" y="52" width="60" height="40" fill={wallFill} />
      {doorStyle === "arched" ? (
        <path d="M42 92 V72 a8 8 0 0 1 16 0 V92 Z" fill="#5b3a1e" />
      ) : (
        <rect x="42" y="70" width="16" height="22" fill="#5b3a1e" />
      )}
      <rect x="26" y="60" width="12" height="12" fill="#fff8dc" />
      <rect x="62" y="60" width="12" height="12" fill="#fff8dc" />
    </svg>
  );
}

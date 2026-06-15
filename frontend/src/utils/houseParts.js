// Shared house-part art. Each part is an SVG generator keyed by the same id the
// backend catalog (config/houseAssets.js) validates. Recolorable parts take a
// `color`. Used by both the editor (HouseEditor) and the read-only renderer
// (HouseView), so a house looks identical everywhere.

// id -> { w, h, recolorable, defaultTint, svg(color) -> string }
const PARTS = {
  ground_grass: {
    w: 600, h: 150, recolorable: true, defaultTint: "#8bb86a",
    svg: (c) =>
      `<rect width='600' height='150' rx='24' fill='${c}'/><rect width='600' height='22' rx='11' fill='#000' opacity='0.06'/>`,
  },
  wall_box: {
    w: 300, h: 220, recolorable: true, defaultTint: "#e8d7c3",
    svg: (c) =>
      `<rect x='4' y='4' width='292' height='212' rx='8' fill='${c}' stroke='#000' stroke-opacity='0.12' stroke-width='3'/>`,
  },
  roof_gable: {
    w: 340, h: 150, recolorable: true, defaultTint: "#9e3b2e",
    svg: (c) => `<polygon points='170,8 334,144 6,144' fill='${c}'/>`,
  },
  roof_hip: {
    w: 340, h: 140, recolorable: true, defaultTint: "#8b4513",
    svg: (c) => `<polygon points='86,8 254,8 334,134 6,134' fill='${c}'/>`,
  },
  roof_flat: {
    w: 320, h: 44, recolorable: true, defaultTint: "#6d350f",
    svg: (c) => `<rect x='4' y='6' width='312' height='32' rx='5' fill='${c}'/>`,
  },
  door_classic: {
    w: 70, h: 120, recolorable: true, defaultTint: "#5b3a1e",
    svg: (c) =>
      `<rect x='4' y='4' width='62' height='116' rx='7' fill='${c}'/><circle cx='56' cy='64' r='4' fill='#ffe9c2'/>`,
  },
  door_arched: {
    w: 70, h: 130, recolorable: true, defaultTint: "#5b3a1e",
    svg: (c) =>
      `<path d='M6 128 V54 a29 29 0 0 1 58 0 V128 Z' fill='${c}'/><circle cx='54' cy='82' r='4' fill='#ffe9c2'/>`,
  },
  window_square: {
    w: 84, h: 84, recolorable: true, defaultTint: "#cfe9f2",
    svg: (c) =>
      `<rect x='5' y='5' width='74' height='74' rx='5' fill='${c}' stroke='#5b3a1e' stroke-width='6'/><path d='M42 6 V78 M6 42 H78' stroke='#5b3a1e' stroke-width='6'/>`,
  },
  tree: {
    w: 120, h: 160, recolorable: false,
    svg: () =>
      `<rect x='52' y='86' width='16' height='72' rx='4' fill='#7a5230'/><circle cx='60' cy='56' r='52' fill='#6f9d52'/><circle cx='34' cy='70' r='30' fill='#7faf5e'/><circle cx='86' cy='70' r='28' fill='#5f8f48'/>`,
  },
  bush: {
    w: 110, h: 80, recolorable: true, defaultTint: "#6f9d52",
    svg: (c) =>
      `<ellipse cx='55' cy='54' rx='52' ry='24' fill='${c}'/><circle cx='30' cy='42' r='24' fill='${c}'/><circle cx='80' cy='44' r='22' fill='${c}'/><circle cx='55' cy='34' r='26' fill='${c}'/>`,
  },
  flower: {
    w: 50, h: 70, recolorable: true, defaultTint: "#d9774e",
    svg: (c) =>
      `<rect x='23' y='32' width='4' height='36' fill='#6f9d52'/><g fill='${c}'><circle cx='25' cy='16' r='9'/><circle cx='13' cy='25' r='9'/><circle cx='37' cy='25' r='9'/><circle cx='18' cy='37' r='9'/><circle cx='32' cy='37' r='9'/></g><circle cx='25' cy='27' r='7' fill='#f2c14e'/>`,
  },
  fence: {
    w: 200, h: 70, recolorable: true, defaultTint: "#c2a06b",
    svg: (c) => {
      const pickets = [10, 55, 100, 145].map(
        (x) =>
          `<path d='M${x} 18 h28 v50 h-28 Z M${x} 18 l14 -12 l14 12' fill='${c}'/>`
      );
      return `<rect x='2' y='30' width='196' height='8' fill='${c}'/><rect x='2' y='50' width='196' height='8' fill='${c}'/>${pickets.join("")}`;
    },
  },
  path: {
    w: 120, h: 160, recolorable: false,
    svg: () =>
      `<g fill='#cbb892' stroke='#b9a276' stroke-width='2'><ellipse cx='60' cy='140' rx='40' ry='15'/><ellipse cx='60' cy='100' rx='34' ry='13'/><ellipse cx='60' cy='64' rx='28' ry='11'/><ellipse cx='60' cy='34' rx='22' ry='9'/></g>`,
  },
  cloud: {
    w: 140, h: 70, recolorable: false,
    svg: () =>
      `<g fill='#ffffff'><circle cx='42' cy='42' r='24'/><circle cx='74' cy='34' r='28'/><circle cx='104' cy='44' r='22'/><rect x='40' y='42' width='66' height='24' rx='12'/></g>`,
  },
  sun: {
    w: 96, h: 96, recolorable: true, defaultTint: "#f2c14e",
    svg: (c) => {
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 48 + Math.cos(a) * 34;
        const y1 = 48 + Math.sin(a) * 34;
        const x2 = 48 + Math.cos(a) * 46;
        const y2 = 48 + Math.sin(a) * 46;
        return `<line x1='${x1.toFixed(1)}' y1='${y1.toFixed(1)}' x2='${x2.toFixed(1)}' y2='${y2.toFixed(1)}' stroke='${c}' stroke-width='5' stroke-linecap='round'/>`;
      }).join("");
      return `${rays}<circle cx='48' cy='48' r='26' fill='${c}'/>`;
    },
  },
};

// Returns the natural size for a part id.
export function partSize(assetId) {
  const p = PARTS[assetId];
  return p ? { width: p.w, height: p.h } : { width: 100, height: 100 };
}

export function isRecolorable(assetId) {
  return Boolean(PARTS[assetId]?.recolorable);
}

export function defaultTint(assetId) {
  return PARTS[assetId]?.defaultTint || "#9e3b2e";
}

// Resolves a part (optionally tinted) to an SVG data URI usable as an <img> src
// or a Konva image source.
export function partToDataUri(assetId, tint) {
  const p = PARTS[assetId];
  if (!p) return "";
  const color = p.recolorable ? tint || p.defaultTint : undefined;
  const inner = p.svg(color);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${p.w} ${p.h}'>${inner}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Resolves any design layer (asset or uploaded image) to an image src.
export function layerSrc(layer) {
  if (layer.type === "upload") return layer.src || "";
  return partToDataUri(layer.assetId, layer.tint);
}

export default PARTS;

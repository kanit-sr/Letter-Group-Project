// House-part catalog (metadata only). The actual art is generated as SVG on the
// frontend (frontend/src/utils/houseParts.js) keyed by these same ids — so the
// backend can validate `assetId` without hosting binaries. Served at GET /assets.

const CATEGORIES = ["base", "wall", "roof", "door", "window", "garden", "decoration"];

const ASSETS = [
  { id: "ground_grass", category: "base", name: "Grass", recolorable: true, defaultW: 600, defaultH: 150, defaultTint: "#8bb86a" },
  { id: "wall_box", category: "wall", name: "House body", recolorable: true, defaultW: 300, defaultH: 220, defaultTint: "#e8d7c3" },
  { id: "roof_gable", category: "roof", name: "Gable roof", recolorable: true, defaultW: 340, defaultH: 150, defaultTint: "#9e3b2e" },
  { id: "roof_hip", category: "roof", name: "Hip roof", recolorable: true, defaultW: 340, defaultH: 140, defaultTint: "#8b4513" },
  { id: "roof_flat", category: "roof", name: "Flat roof", recolorable: true, defaultW: 320, defaultH: 44, defaultTint: "#6d350f" },
  { id: "door_classic", category: "door", name: "Door", recolorable: true, defaultW: 70, defaultH: 120, defaultTint: "#5b3a1e" },
  { id: "door_arched", category: "door", name: "Arched door", recolorable: true, defaultW: 70, defaultH: 130, defaultTint: "#5b3a1e" },
  { id: "window_square", category: "window", name: "Window", recolorable: true, defaultW: 84, defaultH: 84, defaultTint: "#cfe9f2" },
  { id: "tree", category: "garden", name: "Tree", recolorable: false, defaultW: 120, defaultH: 160 },
  { id: "bush", category: "garden", name: "Bush", recolorable: true, defaultW: 110, defaultH: 80, defaultTint: "#6f9d52" },
  { id: "flower", category: "garden", name: "Flower", recolorable: true, defaultW: 50, defaultH: 70, defaultTint: "#d9774e" },
  { id: "fence", category: "garden", name: "Fence", recolorable: true, defaultW: 200, defaultH: 70, defaultTint: "#c2a06b" },
  { id: "path", category: "garden", name: "Path", recolorable: false, defaultW: 120, defaultH: 160 },
  { id: "cloud", category: "decoration", name: "Cloud", recolorable: false, defaultW: 140, defaultH: 70 },
  { id: "sun", category: "decoration", name: "Sun", recolorable: true, defaultW: 96, defaultH: 96, defaultTint: "#f2c14e" },
];

const ASSET_IDS = new Set(ASSETS.map((a) => a.id));

module.exports = { CATEGORIES, ASSETS, ASSET_IDS };

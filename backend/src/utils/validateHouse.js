const {
  ROOF_SHAPES,
  DOOR_STYLES,
  WALL_PATTERNS,
  MAILBOX_STYLES,
  HEX_COLOR,
} = require("../config/houseOptions");
const { ASSET_IDS } = require("../config/houseAssets");

// Bounds for the v2 design canvas/layers (per-house sizes allowed).
const CANVAS_MIN = 200;
const CANVAS_MAX = 1600;
const MAX_LAYERS = 40;
// Cap on a single uploaded image's data-URL length (~0.8 MB of base64). Keeps
// houses well under MongoDB's 16 MB document limit even with many uploads.
const MAX_UPLOAD_SRC = 800000;
const DATA_IMAGE_RE = /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i;

const isFiniteNum = (n) => typeof n === "number" && Number.isFinite(n);
const clampNum = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

// Validates and normalizes a v2 `design` object. Returns { design, errors }.
// Drops/repairs out-of-range numbers rather than failing hard, but rejects
// structural problems (bad layer count, unknown assetId, missing canvas).
function validateDesign(input) {
  const errors = [];

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return { design: undefined, errors: ["design must be an object"] };
  }
  if (input.version !== 2) {
    return { design: undefined, errors: ["design.version must be 2"] };
  }

  const c = input.canvas || {};
  if (!isFiniteNum(c.width) || !isFiniteNum(c.height)) {
    errors.push("design.canvas.width/height are required numbers");
  }
  if (!Array.isArray(input.layers)) {
    errors.push("design.layers must be an array");
  } else if (input.layers.length > MAX_LAYERS) {
    errors.push(`design.layers cannot exceed ${MAX_LAYERS}`);
  }
  if (errors.length) return { design: undefined, errors };

  const canvas = {
    width: clampNum(c.width, CANVAS_MIN, CANVAS_MAX),
    height: clampNum(c.height, CANVAS_MIN, CANVAS_MAX),
    background:
      typeof c.background === "string" && HEX_COLOR.test(c.background)
        ? c.background
        : "#cfe9f2",
  };

  const num = (v, def) => (isFiniteNum(v) ? v : def);
  const layers = [];
  input.layers.forEach((l, i) => {
    if (!l || typeof l !== "object") {
      errors.push(`layer ${i} is invalid`);
      return;
    }
    if (l.type !== "asset" && l.type !== "upload") {
      errors.push(`layer ${i}: type must be "asset" or "upload"`);
      return;
    }
    if (l.type === "asset" && !ASSET_IDS.has(l.assetId)) {
      errors.push(`layer ${i}: unknown assetId "${l.assetId}"`);
      return;
    }
    if (l.type === "upload") {
      if (typeof l.src !== "string" || !DATA_IMAGE_RE.test(l.src)) {
        errors.push(`layer ${i}: upload src must be a data:image/* URL`);
        return;
      }
      if (l.src.length > MAX_UPLOAD_SRC) {
        errors.push(`layer ${i}: uploaded image is too large`);
        return;
      }
    }

    const common = {
      id: typeof l.id === "string" ? l.id.slice(0, 40) : `lyr_${i}`,
      type: l.type,
      x: num(l.x, canvas.width / 2),
      y: num(l.y, canvas.height / 2),
      width: clampNum(num(l.width, 100), 4, CANVAS_MAX),
      height: clampNum(num(l.height, 100), 4, CANVAS_MAX),
      rotation: num(l.rotation, 0) % 360,
      scaleX: clampNum(num(l.scaleX, 1), -20, 20),
      scaleY: clampNum(num(l.scaleY, 1), -20, 20),
      opacity: clampNum(num(l.opacity, 1), 0, 1),
      z: Number.isInteger(l.z) ? l.z : i,
    };

    if (l.type === "asset") {
      layers.push({
        ...common,
        assetId: l.assetId,
        tint:
          typeof l.tint === "string" && HEX_COLOR.test(l.tint) ? l.tint : null,
      });
    } else {
      layers.push({ ...common, src: l.src });
    }
  });

  if (errors.length) return { design: undefined, errors };
  return { design: { version: 2, canvas, layers }, errors: [] };
}



// Validates a partial house-customization payload. Only the provided keys are
// checked (callers send partial updates). Returns { value, errors } where
// `value` contains only the recognized, valid fields.
function validateHouseUpdate(input = {}) {
  const errors = [];
  const value = {};

  const checkColor = (key) => {
    if (input[key] === undefined) return;
    if (typeof input[key] === "string" && HEX_COLOR.test(input[key])) {
      value[key] = input[key];
    } else {
      errors.push(`${key} must be a hex color like #8B4513`);
    }
  };

  const checkEnum = (key, allowed) => {
    if (input[key] === undefined) return;
    if (allowed.includes(input[key])) {
      value[key] = input[key];
    } else {
      errors.push(`${key} must be one of: ${allowed.join(", ")}`);
    }
  };

  checkColor("roofColor");
  checkColor("wallColor");
  checkEnum("roofShape", ROOF_SHAPES);
  checkEnum("doorStyle", DOOR_STYLES);
  checkEnum("wallPattern", WALL_PATTERNS);
  checkEnum("mailboxStyle", MAILBOX_STYLES);

  if (input.gardenConfig !== undefined) {
    if (
      input.gardenConfig &&
      typeof input.gardenConfig === "object" &&
      !Array.isArray(input.gardenConfig)
    ) {
      value.gardenConfig = input.gardenConfig;
    } else {
      errors.push("gardenConfig must be an object");
    }
  }

  if (input.design !== undefined) {
    if (input.design === null) {
      value.design = null; // explicit reset back to the v1 procedural house
    } else {
      const { design, errors: designErrors } = validateDesign(input.design);
      if (designErrors.length) errors.push(...designErrors);
      else value.design = design;
    }
  }

  return { value, errors };
}

module.exports = { validateHouseUpdate, validateDesign };

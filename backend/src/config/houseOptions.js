// Allowed house-customization presets, shared by validation and (later) the API
// that feeds the frontend customization panel. Sourced from
// misc/READPLEASECONTRIBUTOR.md (6 roof shapes, no "butterfly"; wall patterns
// brick/wood/stone) and the spec in .github/copilot-instructions.md.

const ROOF_SHAPES = ["gable", "hip", "flat", "gambrel", "shed", "mansard"];
const DOOR_STYLES = ["classic", "arched", "double", "cottage", "modern"];
const WALL_PATTERNS = ["plain", "brick", "wood", "stone"];
const MAILBOX_STYLES = ["default", "rustic", "modern", "vintage"];

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

module.exports = {
  ROOF_SHAPES,
  DOOR_STYLES,
  WALL_PATTERNS,
  MAILBOX_STYLES,
  HEX_COLOR,
};

// ─────────────────────────────────────────────────────────────────────────
// DEMO DATA — edit this file to customize the accounts created on startup.
// Used when seeding is enabled (default in demo / in-memory mode). See seed.js.
//
// • users: each becomes an account + a house. `house` fields are optional and
//   accept the same values as the customization panel:
//     roofColor / wallColor : hex string (e.g. "#9e3b2e")
//     roofShape  : gable | hip | flat | gambrel | shed | mansard
//     doorStyle  : classic | arched | double | cottage | modern
//     wallPattern: plain | brick | wood | stone
//     mailboxStyle: default | rustic | modern | vintage
//
// • letters: starter mail. `from`/`to` reference usernames above.
//   Omit `to` and set `isPublic: true` for a community-board post.
//
// The villager roster comes from misc/Place.md. Default password for everyone
// is "123456" — change per person as you like.
// ─────────────────────────────────────────────────────────────────────────

const PASSWORD = "123456";

const users = [
  {
    username: "kanit",
    email: "kanit@demo.com",
    password: PASSWORD,
    house: { roofColor: "#9e3b2e", roofShape: "gambrel", wallColor: "#f0e2c4", wallPattern: "brick", doorStyle: "arched" },
  },
  {
    username: "phatcharida", // ⭐ top priority villager
    email: "phatcharida@demo.com",
    password: PASSWORD,
    house: { roofColor: "#d98aa8", roofShape: "hip", wallColor: "#fdeef2", wallPattern: "plain", doorStyle: "arched" },
  },
  {
    username: "oak",
    email: "oak@demo.com",
    password: PASSWORD,
    house: { roofColor: "#c2a06b", roofShape: "hip", wallColor: "#e8d7c3", wallPattern: "wood", doorStyle: "classic" },
  },
  {
    username: "film",
    email: "film@demo.com",
    password: PASSWORD,
    house: { roofColor: "#41607c", roofShape: "gable", wallColor: "#cfe9f2", wallPattern: "plain", doorStyle: "double" },
  },
  {
    username: "june",
    email: "june@demo.com",
    password: PASSWORD,
    house: { roofColor: "#6f9d52", roofShape: "hip", wallColor: "#eaf3df", wallPattern: "wood", doorStyle: "cottage" },
  },
  {
    username: "nun",
    email: "nun@demo.com",
    password: PASSWORD,
    house: { roofColor: "#9e9e9e", roofShape: "flat", wallColor: "#d8d8d8", wallPattern: "stone", doorStyle: "modern" },
  },
  {
    username: "panyakorn",
    email: "panyakorn@demo.com",
    password: PASSWORD,
    house: { roofColor: "#2b2a26", roofShape: "mansard", wallColor: "#b14a3a", wallPattern: "brick", doorStyle: "double" },
  },
  {
    username: "pakkard",
    email: "pakkard@demo.com",
    password: PASSWORD,
    house: { roofColor: "#d9774e", roofShape: "gable", wallColor: "#fff3da", wallPattern: "plain", doorStyle: "cottage" },
  },
  {
    username: "pleum",
    email: "pleum@demo.com",
    password: PASSWORD,
    house: { roofColor: "#e0a458", roofShape: "gambrel", wallColor: "#f6e7c4", wallPattern: "wood", doorStyle: "classic" },
  },
  {
    username: "ford",
    email: "ford@demo.com",
    password: PASSWORD,
    house: { roofColor: "#6d6d6d", roofShape: "shed", wallColor: "#9e9e9e", wallPattern: "stone", doorStyle: "modern" },
  },
];

const letters = [
  {
    from: "kanit",
    to: "phatcharida",
    subject: "Welcome to the village!",
    body: "Hi Phatcharida,\nYour house by the pond is ready — flowers and cats included. So glad you're here!\n  -- Kanit",
  },
  {
    from: "phatcharida",
    isPublic: true,
    subject: "Hello everyone",
    body: "Just settled in next to the pond. Come by for a picnic anytime!",
  },
  {
    from: "film",
    isPublic: true,
    subject: "The lake is open",
    body: "Quiet and chill spot by the lake — villagers only. Drop in.",
  },
];

module.exports = { users, letters };

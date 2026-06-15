const User = require("../models/User");
const House = require("../models/House");
const Letter = require("../models/Letter");
const { users, letters } = require("./demoData");

// Seeds demo accounts/houses/letters from demoData.js. Idempotent: existing
// users (matched by email) are left untouched, so it's safe to run on every
// boot — including against a persistent MongoDB.
const seedDemoData = async () => {
  const byUsername = {};
  let createdUsers = 0;

  for (const u of users) {
    let user = await User.findOne({ email: u.email.toLowerCase() });

    if (!user) {
      user = new User({ username: u.username, email: u.email });
      await user.setPassword(u.password);
      await user.save();
      await House.create({ userId: user._id, ...(u.house || {}) });
      createdUsers += 1;
    }

    byUsername[u.username] = user._id;
  }

  // Only seed letters when we actually created fresh users this run, to avoid
  // piling up duplicate letters on a persistent database.
  let createdLetters = 0;
  if (createdUsers > 0) {
    for (const l of letters) {
      const senderId = byUsername[l.from];
      if (!senderId) continue;

      await Letter.create({
        senderId,
        recipientId: l.isPublic ? undefined : byUsername[l.to],
        subject: l.subject,
        body: l.body,
        isPublic: Boolean(l.isPublic),
        designConfig: l.designConfig || {},
      });
      createdLetters += 1;
    }
  }

  if (createdUsers > 0) {
    console.log(
      `Demo data seeded: ${createdUsers} user(s), ${createdLetters} letter(s)`
    );
  } else {
    console.log("Demo data already present — skipped seeding");
  }
};

module.exports = seedDemoData;

# Letter Village — Implementation Plan

This plan turns the spec in `.github/copilot-instructions.md` into concrete, ordered work.
Each phase lists the files to create/change and acceptance criteria. Phases are sequenced so
each one builds on a working previous phase. Checkboxes track progress.

---

## Phase 0 — Foundation & Cleanup

Get the skeleton consistent and the data model in place before building features.

- [x] Fix `backend/.env.example` — replace the stale PostgreSQL/Prisma vars with MongoDB +
      JWT + Cloudinary vars (`MONGODB_URI`, `MONGODB_DB`, `JWT_SECRET`, `CLOUDINARY_*`).
- [x] Add `House` model (`backend/src/models/House.js`) — one-to-one with User (unique `userId`),
      fields per spec: `roofColor`, `doorStyle`, `wallColor`, `gardenConfig`, `mailboxStyle`.
- [x] Add `Letter` model (`backend/src/models/Letter.js`) — `senderId`, `recipientId` (optional),
      `subject`, `body`, `designConfig`, `isPublic`, `isRead`, `sentAt`.
- [x] Add a centralized error-handling middleware and `404` handler in `app.js`.

**Done when:** server boots, models register, `GET /api/v1/health` returns ok.

---

## Phase 1 — Auth System

- [x] Hash passwords with `bcryptjs`; add a `setPassword`/`comparePassword` helper or do it in
      the controller. Never store plaintext.
- [x] `backend/src/utils/jwt.js` — sign/verify helpers using `JWT_SECRET`.
- [x] `backend/src/controllers/auth.controller.js` — `register`, `login`, `me`.
- [x] `backend/src/middleware/auth.js` — verify `Authorization: Bearer <token>`, attach `req.user`.
- [x] `backend/src/routes/auth.routes.js` — `POST /register`, `POST /login`, `GET /me`,
      mounted at `/api/v1/auth`.
- [x] On register, auto-create the user's `House` with default customization.

**Done when:** a user can register, receive a JWT, log in, and `GET /api/v1/auth/me` returns
their profile with a valid token.

**Dependencies to add:** `bcryptjs`, `jsonwebtoken`.

---

## Phase 2 — Houses & Village Map

- [x] `house.controller.js` + `house.routes.js` (`/api/v1/houses`):
  - `GET /` — list all houses with owner username/avatar (the village map data).
  - `GET /:userId` — a single house (visit a neighbor).
  - `PUT /me` — update the authenticated user's house customization (protected).
- [x] Validate customization input (hex colors, allowed door/mailbox styles, roof shapes per
      `misc/READPLEASECONTRIBUTOR.md`: 6 roof shapes, wall patterns brick/wood/stone).
  - Added `roofShape` + `wallPattern` to the `House` model; presets live in
    `backend/src/config/houseOptions.js`; validation in `backend/src/utils/validateHouse.js`.

**Done when:** the map endpoint returns every house, and a logged-in user can update theirs.

---

## Phase 3 — Letters & Mailbox

- [x] `letter.controller.js` + `letter.routes.js` (`/api/v1/letters`, protected):
  - `POST /` — send a letter (private → requires `recipientId`; public → `isPublic: true`).
  - `GET /inbox` — letters where `recipientId == me`, newest first.
  - `GET /public` — community board (`isPublic: true`).
  - `PATCH /:id/read` — mark a received letter as read.
  - `GET /unread-count` — for the mailbox/notification badge.
- [x] Authorization: only the recipient may read/mark a private letter (`markRead` scopes the
      query to `recipientId == me`; inbox/unread-count are per-user).

**Done when:** users can send/receive private letters, post public ones, and see unread counts.

---

## Phase 4 — Frontend Foundation

- [x] Scaffold CRA entry: `frontend/public/index.html`, `src/index.js`, `src/App.js`.
- [x] `src/utils/api.js` — fetch wrapper using `REACT_APP_API_URL`, attaches JWT, unwraps the
      `{ data, message, status }` envelope.
- [x] `src/context/AuthContext.jsx` — token storage (localStorage), `login`/`logout`/`register`,
      current user.
- [x] Routing (`react-router-dom`): `/login`, `/register`, `/village`, `/house/:userId`,
      `/my-house`, `/mailbox`. Protected-route wrapper (`components/ProtectedRoute.jsx`).

**Done when:** the app runs, a user can register/log in, and protected routes redirect when
logged out.

**Dependencies to add (frontend):** `react-router-dom`.

---

## Phase 5 — Frontend Pages

- [x] Village map page — grid/map of houses from `GET /houses`, click to visit.
- [x] My House page — render house + customization panel (color pickers, presets) → `PUT /houses/me`.
- [x] Neighbor House page — view a house + letter composer.
- [x] Mailbox — inbox + community-board tabs, mark-as-read, unread badge in the nav.
- [x] Letter composer — subject, body, public/private toggle. (Design config / stickers deferred
      to Phase 6.)
- Houses render via a shared SVG `components/HouseView.jsx` (roof shape + wall pattern aware).

---

## Phase 6 — Decoration & Polish

- [x] Visual theming — **paper / stationery** aesthetic via `frontend/src/index.css`: aged-paper
      texture (SVG grain), ink/kraft/wax-seal palette, Playfair Display + EB Garamond + Caveat +
      Special Elite fonts, dashed-envelope cards, kraft mailing-strip nav, pinned-postcard village
      grid (postmark motif), and letters with a CSS postage stamp + "NEW" mark on unread. All
      decorative motifs are CSS-only (no JSX changes).
- [ ] Cloudinary integration (`backend/src/utils/cloudinary.js`) for avatars / house assets.
- [ ] Sticker/stamp/paper presets shared between front and back (letter `designConfig`).
- [ ] Mobile responsiveness (theme uses fluid grids; needs breakpoint testing).
- [ ] (Optional, if budget allows) Socket.io real-time letter notifications.

---

## Phase 7 — Themed public places (future)

Beyond personal houses, each villager has a signature **public place** in the village
(see `misc/Place.md`) — e.g. Film's lake, Panyakorn's casino, Hunter's museum, Phatcharida's
pond-side picnic garden. These are shared community spaces, distinct from the private `House`.

- [ ] New `Place` model (ownerId, name, type, description, design/config) — or extend the map
      with non-house markers.
- [ ] Village map shows places alongside houses; click to visit a place.
- [ ] Decide interactions per place (guestbook? gather? mini-board?). Start read-only.
- [ ] Seed places from `misc/Place.md` (villager → place) once the model exists.

> The villager roster (people) is already seeded as houses in `backend/src/seed/demoData.js`.
> Places are the next layer on top.

---

## Running the localhost demo

No MongoDB install required — the backend boots an in-memory MongoDB when
`USE_MEMORY_DB=true` (the default in `backend/.env`). Data resets on restart.

```bash
# terminal 1 — backend (http://localhost:5000)
cd backend && npm install && npm run dev

# terminal 2 — frontend (http://localhost:3000)
cd frontend && npm install && npm start
```

Then register two accounts in different browsers/profiles, customize a house under
**My House**, open a neighbor from **The Village**, send a letter, and read it in **Mailbox**.
To use a real MongoDB instead, set `USE_MEMORY_DB=false` and `MONGODB_URI=...` in `backend/.env`.

---

## Conventions (apply throughout)

- API prefix `/api/v1`; success `{ data, message, status }`, error `{ error, message, status }`.
- Mongoose models are the source of truth for shape/validation; relationships via `ObjectId` refs.
- Auth via `Authorization: Bearer <token>`.
- Keep secrets in `.env` (gitignored); update `.env.example` when adding new vars.

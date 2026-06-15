# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Letter Village** — a community web app where each user owns a customizable virtual "house" and sends decorated letters (public or private) to other villagers. See `.github/copilot-instructions.md` for the full product spec (pages, letter/house features, build-order priorities) and `.github/letter_village_erd.html` for the data model ERD. The `misc/` folder holds informal design notes (`READPLEASECONTRIBUTOR.md`, `Place.md`), partly in Thai.

## Current State

The project is early scaffolding. What actually exists:
- **Backend**: a minimal Express server with a health route and a single `User` Mongoose model. No auth, controllers, or House/Letter models yet.
- **Frontend**: a Create React App shell. `frontend/src/{components,context,hooks,pages,utils}` directories exist but are **empty** — there is no `index.js`/`App.js` yet.

When adding features, follow the build order in `.github/copilot-instructions.md` (Auth → Village Map → House Customization → Letters → Mailbox → Decoration).

## Commands

```bash
# Backend (from backend/)
npm install
npm run dev      # nodemon src/server.js — auto-reload dev server
npm start        # node src/server.js — production start

# Frontend (from frontend/)
npm install
npm start        # react-scripts dev server
npm run build    # production build
npm test         # react-scripts test (Jest) — runs in watch mode by default
```

There is no linter configured and no test files exist yet.

## Architecture

Monorepo with two independent npm packages: `backend/` and `frontend/`. They are not linked by a workspace — install and run each separately.

### Backend (Express 5 + Mongoose 8, CommonJS)
Startup chain, follow it to understand request flow:
- `src/server.js` — loads dotenv, calls `connectDB()`, then starts the HTTP server. Handles SIGINT/SIGTERM graceful shutdown. **DB connection must succeed before the server listens** (a failed connect exits the process).
- `src/app.js` — builds the Express app: `cors()`, `express.json()`, `morgan("dev")`, the root `/` info route, and mounts routers.
- `src/config/db.js` — `connectDB()` reads `MONGODB_URI` (required) and optional `MONGODB_DB` (passed as `dbName`).
- `src/routes/` — routers, mounted under `/api/v1/...` (currently only `health.routes.js` → `/api/v1/health`).
- `src/models/` — Mongoose models (currently only `User.js`, with `timestamps: true`).

To add an endpoint: create a router in `src/routes/`, mount it in `app.js` under the `/api/v1` prefix. The architecture intends `controllers/` and `middleware/` directories (per the spec) but they don't exist yet — create them as needed.

### Frontend (Create React App, React 19)
Standard CRA via `react-scripts`. Intended structure (dirs exist, files don't): `components/` (reusable UI), `pages/` (routed views), `hooks/`, `context/`, `utils/` (API client). The API base URL comes from `REACT_APP_API_URL`.

## API Response Conventions

Follow these envelope shapes (already used by the existing routes):
- **Success**: `{ data, message, status }`
- **Error**: `{ error, message, status }`
- All API routes are prefixed with `/api/v1`.
- Auth (when built): JWT in `Authorization: Bearer <token>`.

## Data Model

Database is **MongoDB via Mongoose**. The canonical model definitions (`User`, `House`, `Letter`) and their relationships are documented in `.github/copilot-instructions.md` — treat that as the source of truth when creating the missing models. Use `ObjectId` refs for relationships (e.g. `ref: "User"`); User↔House is one-to-one (unique `userId` on House).

## Environment Variables

⚠️ **`backend/.env.example` is stale** — it still lists PostgreSQL (`DATABASE_URL`) and Prisma, but the project uses MongoDB/Mongoose. The real backend env needs:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=letter_village
NODE_ENV=development
JWT_SECRET=...            # when auth is added
CLOUDINARY_CLOUD_NAME=... # when image storage is added
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Frontend env: `REACT_APP_API_URL=http://localhost:5000/api/v1`.

`.env`, `config.env`, and `node_modules/` are gitignored; only `.env.example` files are tracked.

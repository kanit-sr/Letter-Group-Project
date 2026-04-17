# Letter Village — Copilot Instructions

## Project Vision

**Letter Village** is a community web platform where users have customizable virtual houses and send decorated letters to each other—both privately and publicly.

**Core Value**: Combine social connection with creative expression through personalized letter-writing and house aesthetics.

---

## Core Pages & Features

### The Village (Map View)
- Interactive map showing all member houses
- House previews with customization visible
- Navigation to neighbor houses

### My House (User Profile & Mailbox)
- Personal house display with customizations
- Inbox with received letters
- Notification for unread messages
- House customization panel

### Neighbor's House
- Visit other users' houses
- Send public or private letters to that user
- View their house customizations

---

## Letter Features

**Writing Flow:**
1. Open letter editor (rich text)
2. Customize design (paper style, stickers, stamps, decorative borders)
3. Choose delivery: Private (to one person) or Public (to all villagers)
4. Send and notify recipient

**Letter Attributes:**
- `subject` — short title
- `body` — rich text content
- `design_config` — JSON for visual customization (stickers, stamps, paper pattern)
- `is_public` — boolean for public/private
- `is_read` — track if letter has been opened

---

## House Customization

Users can personalize their houses:
- **Roof**: color (hex)
- **Door**: style (preset options)
- **Walls**: color (hex)
- **Garden**: flowers, pathways, fences (stored as `garden_config` JSON)
- **Mailbox**: style and visibility of unread count

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | All UI components |
| **Backend** | Node.js + Express | REST API server |
| **Database** | MongoDB | Users, houses, letters, relationships |
| **ODM** | Mongoose | Schema modeling and queries |
| **Storage** | Cloudinary | User avatars, letter designs, house assets |
| **Auth** | JWT + bcryptjs | Session management |

---

## Database Models (MongoDB)

### `User` collection
```js
{
   _id: ObjectId,
   username: String,      // unique, required
   email: String,         // unique, required
   passwordHash: String,  // required
   avatarUrl: String,
   createdAt: Date,
   updatedAt: Date
}
```

### `House` collection
```js
{
   _id: ObjectId,
   userId: ObjectId,      // ref: User, unique, required
   roofColor: String,     // default '#8B4513'
   doorStyle: String,     // default 'classic'
   wallColor: String,     // default '#E8D7C3'
   gardenConfig: Object,  // default {}
   mailboxStyle: String,  // default 'default'
   createdAt: Date,
   updatedAt: Date
}
```

### `Letter` collection
```js
{
   _id: ObjectId,
   senderId: ObjectId,      // ref: User, required
   recipientId: ObjectId,   // ref: User, optional for public posts
   subject: String,         // required
   body: String,            // required
   designConfig: Object,    // default {}
   isPublic: Boolean,       // default false
   isRead: Boolean,         // default false
   sentAt: Date             // default Date.now
}
```

### Relationships
- **User ↔ House**: one-to-one via `userId` unique index in `House`
- **User ↔ Letter**: one-to-many as sender and one-to-many as recipient

---

## Development Conventions

### MongoDB & Mongoose
- Use **Mongoose schemas** as single source of truth for data shape and validation
- Create/update indexes in model definitions and keep migrations/scripts in source control
- Use Mongoose models in backend for all database queries
- Model relationships with `ObjectId` refs (for example: `ref: "User"`)

### Code Organization
```
letter-village/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # API client, helpers
│   └── package.json
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── config/         # Database and app config
│   │   └── utils/          # Cloudinary, JWT, etc.
│   └── package.json
└── README.md
```

### Environment Variables
Backend `.env`:
```
MONGODB_URI="mongodb://127.0.0.1:27017"
MONGODB_DB="letter_village"
JWT_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
NODE_ENV="development"
```

Frontend `.env`:
```
REACT_APP_API_URL="http://localhost:5000"
```

### API Conventions
- **Base URL**: `/api/v1` (prefix all routes)
- **Auth**: JWT token in `Authorization: Bearer <token>` header
- **Errors**: Return JSON with `{ error, message, status }`
- **Success**: Return JSON with `{ data, message, status }`

### Letter Design Config Example
```json
{
  "paper_color": "#FFF8DC",
  "border_style": "floral",
  "stickers": ["flower_01", "heart_02"],
  "stamp": "vintage_red",
  "text_color": "#333"
}
```

---

## Build Order (Priority)

1. **Auth System**
   - Sign up, login, logout
   - JWT token generation and validation
   - Password hashing (bcryptjs)

2. **Basic Village Map**
   - Display all users' houses as grid/map
   - Placeholder house designs
   - Click to visit neighbor

3. **House Customization**
   - Color picker for roof, walls, door
   - Garden presets (flowers, fences)
   - Preview updates in real-time

4. **Letter Writing & Sending**
   - Basic rich text editor (recommended: `react-quill`)
   - Send public (community board) or private
   - Store in database

5. **Mailbox & Notifications**
   - Display received letters
   - Mark as read
   - Notification badge on bell icon

6. **Letter Decoration System**
   - Sticker picker
   - Stamp selection
   - Paper pattern presets
   - Save designs with letter

7. **Polish & Performance**
   - Image optimizations (Cloudinary)
   - Real-time notifications (Socket.io if budget allows)
   - Mobile responsiveness

---

## Key Files to Know

- `.github/copilot-instructions.md` — This file; AI conventions and architecture
- `backend/src/config/db.js` — MongoDB connection setup
- `backend/src/models/` — Mongoose model definitions
- `backend/.env` — Secrets and config (never commit)
- `frontend/src/utils/api.js` — API client utility

---

---

## Common Commands

```bash
# Backend
npm install                 # Install dependencies
npm run dev                 # Start dev server (nodemon)
# MongoDB runs externally (local service or Atlas)

# Frontend
npm install
npm start                   # Start dev server

# Database

```

---

## Contributors

This project is a passion project built with ❤️ for those we love most.

---

## Next Steps to Get Started

1. Clone repository and create `frontend/` and `backend/` folders
2. Set up MongoDB locally or create a MongoDB Atlas cluster
3. Create `.env` files in both frontend and backend
4. Create Mongoose models for users, houses, and letters
5. Begin with **Auth System** (step 1 in Build Order)

Happy coding! 🏘️💌

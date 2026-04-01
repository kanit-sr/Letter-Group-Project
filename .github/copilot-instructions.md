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
| **Database** | PostgreSQL | Users, houses, letters, relationships |
| **ORM** | Prisma | Type-safe database queries |
| **Storage** | Cloudinary | User avatars, letter designs, house assets |
| **Auth** | JWT + bcryptjs | Session management |

---

## Database Schema

### `users` table
```sql
id              uuid PRIMARY KEY (DEFAULT uuid_generate_v4())
username        varchar(255) UNIQUE NOT NULL
email           varchar(255) UNIQUE NOT NULL
password_hash   varchar(255) NOT NULL
avatar_url      varchar(500)
created_at      timestamp DEFAULT now()
updated_at      timestamp DEFAULT now()
```

### `houses` table
```sql
id              uuid PRIMARY KEY (DEFAULT uuid_generate_v4())
user_id         uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
roof_color      varchar(7) DEFAULT '#8B4513'
door_style      varchar(50) DEFAULT 'classic'
wall_color      varchar(7) DEFAULT '#E8D7C3'
garden_config   jsonb DEFAULT '{}'
mailbox_style   varchar(50) DEFAULT 'default'
updated_at      timestamp DEFAULT now()
```

### `letters` table
```sql
id              uuid PRIMARY KEY (DEFAULT uuid_generate_v4())
sender_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE
recipient_id    uuid REFERENCES users(id) ON DELETE CASCADE
subject         varchar(255) NOT NULL
body            text NOT NULL
design_config   jsonb DEFAULT '{}'
is_public       boolean DEFAULT false
is_read         boolean DEFAULT false
sent_at         timestamp DEFAULT now()
```

### Relationships
- **users ↔ houses**: 1-to-1 (one house per user)
- **users ↔ letters**: 1-to-many as sender and 1-to-many as recipient

---

## Development Conventions

### PostgreSQL & Prisma
- Use **Prisma schema** as single source of truth for the database
- Run `prisma migrate dev` when changing schema
- Use Prisma Client in backend for all queries (not raw SQL)
- Model relationships explicitly in `schema.prisma`

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
│   │   ├── prisma/         # Prisma schema & migrations
│   │   └── utils/          # Cloudinary, JWT, etc.
│   └── package.json
└── README.md
```

### Environment Variables
Backend `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/letter_village"
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
- `backend/src/prisma/schema.prisma` — Database schema definition
- `backend/.env` — Secrets and config (never commit)
- `frontend/src/utils/api.js` — API client utility

---

## PostgreSQL Basics for This Project

| Concept | Usage |
|---------|-------|
| **uuid** | Globally unique IDs (type `uuid` in Prisma) |
| **REFERENCES** | Foreign key constraint (links tables) |
| **DELETE CASCADE** | Auto-delete child records when parent deleted |
| **jsonb** | Flexible JSON storage (garden_config, design_config) |
| **UNIQUE** | Column must have unique values (username, email) |

**Prisma Query Example:**
```typescript
// Get letters received by a user, including sender info
const letters = await prisma.letter.findMany({
  where: { recipient_id: userId },
  include: { sender: { select: { username: true, avatar_url: true } } },
  orderBy: { sent_at: 'desc' }
});
```

---

## Common Commands

```bash
# Backend
npm install                 # Install dependencies
npm run dev                 # Start dev server (nodemon)
npx prisma migrate dev      # Run database migrations
npx prisma studio          # Open Prisma GUI

# Frontend
npm install
npm start                   # Start dev server

# Database
psql -U postgres            # Connect to PostgreSQL (CLI)
```

---

## Contributors

This project is a passion project built with ❤️ for those we love most.

---

## Next Steps to Get Started

1. Clone repository and create `frontend/` and `backend/` folders
2. Set up PostgreSQL database locally
3. Create `.env` files in both frontend and backend
4. Initialize Prisma schema with the tables above
5. Begin with **Auth System** (step 1 in Build Order)

Happy coding! 🏘️💌

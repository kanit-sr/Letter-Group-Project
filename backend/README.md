# Backend (MongoDB Setup)

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Copy `.env.example` to `.env` and update values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=letter_village
NODE_ENV=development
```

## 3) Run backend

```bash
npm run dev
```

## 4) Test endpoints

- `GET /`
- `GET /api/v1/health`

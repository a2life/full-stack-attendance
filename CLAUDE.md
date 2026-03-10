# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Docker (recommended — runs all services together)
```bash
docker compose up --build    # Start all services (allow ~30s for MongoDB init)
docker compose down          # Stop services
docker compose down -v       # Stop and remove volumes (resets database)
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Backend (standalone)
```bash
cd backend
npm install
npm run dev      # ts-node-dev hot reload on :5000
npm run build    # compile TypeScript to dist/
npm start        # run compiled dist/index.js
```

### Frontend (standalone)
```bash
cd frontend
npm install
npm run dev      # Vite dev server on :3000
npm run build    # tsc + vite build to dist/
npm run preview  # preview production build
```

No test runner is configured in either package.

## Architecture

Two independent services coordinated via Docker Compose — no monorepo tooling.

```
Frontend (React 18 + Vite, :3000)
    ↓ Axios (VITE_API_URL=http://localhost:5000/api)
Backend (Express + TypeScript, :5000)
    ↓ Mongoose
MongoDB 7 (:27017, Docker volume)
```

### Backend (`backend/src/`)
- `index.ts` — Express app entry point; connects to MongoDB with retry logic, mounts routes under `/api`
- `models/Member.ts` — Mongoose schema: `memberId` (unique string), `name`
- `models/eventSheet.ts` — Mongoose schema: `eventName`, `eventDate` (YYYY-MM-DD), `attendance[]` (`memberId`, `memberName`, `present`, `remark`), timestamps
- `routes/members.ts` — CRUD for `/api/members`
- `routes/eventSheets.ts` — CRUD for `/api/eventsheets`

### Frontend (`frontend/src/`)
- `api/index.ts` — Axios client configured from `VITE_API_URL`; all API calls go through here
- `types/index.ts` — Shared TypeScript types: `Member`, `AttendanceEntry`, `EventSheet`, `CreateEventSheetPayload`
- `app.tsx` — BrowserRouter with 5 routes: `/`, `/new`, `/sheets`, `/sheets/:id`, `/members`
- `components/Layout.tsx` — Shared nav/header wrapper
- `pages/` — `HomePage`, `NewEventSheet`, `PastSheets`, `SheetDetail`, `ManageMembers`

### REST API
```
GET/POST        /api/members
PUT/DELETE      /api/members/:id
GET/POST        /api/eventsheets
GET/DELETE      /api/eventsheets/:id
GET             /api/health
```

### Database Seeding
`mongo-init/init.js` pre-seeds 10 members (M001–M010) on first container start. To re-seed, run `docker compose down -v` then restart.

## Environment

Backend reads from environment (set in Docker Compose for container dev):
- `MONGO_URI` — MongoDB connection string
- `PORT` — defaults to 5000

Frontend reads:
- `VITE_API_URL` — Base URL for API calls (e.g., `http://localhost:5000/api`)

For local (non-Docker) dev, create `backend/.env` with `MONGO_URI` and `PORT`.

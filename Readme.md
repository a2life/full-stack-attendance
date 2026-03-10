# Attendance Manager

A full-stack attendance tracking app built with MongoDB, Node.js/Express (TypeScript), and React (TypeScript), orchestrated via Docker Compose.

## Stack
- **Database**: MongoDB 7 (pre-seeded with 10 members)
- **Backend**: Node.js + Express + TypeScript (ts-node-dev for hot reload)
- **Frontend**: React + TypeScript + Vite

## Features
- Create event sheets with a custom name and auto-filled current date
- Mark each member present/absent via checkbox
- Add a remark per member
- Save sheet with a timestamp to MongoDB
- View all past sheets with attendance rate visualization
- View full detail of any past sheet
- Delete sheets
- Manage members: add, edit, and delete members from the roster

## Quick Start

### Prerequisites
- Docker & Docker Compose installed

### Run
```bash
docker compose up --build
```

Wait ~30 seconds for all services to initialize, then open:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Mongo Express remove for production** (DB UI): http://localhost:8081
- **MongoDB**: localhost:27017

### Stop
```bash
docker compose down
```

### Stop and remove data
```bash
docker compose down -v
```

## API Endpoints

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | /api/members          | List all members       |
| POST   | /api/members          | Add a member           |
| PUT    | /api/members/:id      | Update a member        |
| DELETE | /api/members/:id      | Delete a member        |
| GET    | /api/eventsheets      | List all event sheets  |
| GET    | /api/eventsheets/:id  | Get one sheet          |
| POST   | /api/eventsheets      | Create a sheet         |
| DELETE | /api/eventsheets/:id  | Delete a sheet         |
| GET    | /api/health           | Health check           |

## Project Structure
```
attendance-app/
├── docker-compose.yml
├── mongo-init/
│   └── init.js          # Seed 10 members
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── models/
│       │   ├── Member.ts
│       │   └── EventSheet.ts
│       └── routes/
│           ├── members.ts
│           └── eventSheets.ts
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── api/index.ts
        ├── types/index.ts
        ├── components/Layout.tsx
        └── pages/
            ├── HomePage.tsx
            ├── NewEventSheet.tsx
            ├── PastSheets.tsx
            ├── SheetDetail.tsx
            └── ManageMembers.tsx
```

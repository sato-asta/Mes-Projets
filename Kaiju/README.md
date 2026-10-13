# Kaiju

Disaster-response coordination platform for the city of Tokyork. Quarter Coordinators, Logistics Coordinators and the City Director track resources, request and approve transfers between quarters, and get real-time updates as the situation evolves.

## Live deployment

- **App:** [kaiju-beta.vercel.app](https://kaiju-beta.vercel.app/)
- **API:** [kaiju-backend-8zhu.onrender.com](https://kaiju-backend-8zhu.onrender.com)
- **API documentation (OpenAPI/Swagger):** [kaiju-backend-8zhu.onrender.com/docs](https://kaiju-backend-8zhu.onrender.com/docs)
- **OpenAPI schema (raw JSON):** [kaiju-backend-8zhu.onrender.com/openapi.json](https://kaiju-backend-8zhu.onrender.com/openapi.json)

The backend is on a free Render instance, so the first request after a period of inactivity can take a few seconds to wake it up.

## Stack

- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT auth, WebSockets for real-time events.
- **Frontend:** React (Vite), React Router.

## Running locally

### Backend

```bash
cd Kaiju_backend
python -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
# create a .env with DATABASE_URL and JWT_SECRET
python -m scripts.seed
uvicorn app.main:app --reload
```

### Frontend

```bash
cd Kaiju_frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Roles

| Role | Scope | Responsibilities |
|---|---|---|
| Quarter Coordinator (QC) | Single quarter | Manages own resources, approves/denies incoming requests, initiates requests to adjacent quarters |
| Logistics Coordinator (LC) | Multi-quarter | Organizes transfers and transit chains across non-adjacent quarters |
| City Director (CD) | City-wide | Full authority, can requisition resources, only role able to lower retention thresholds |

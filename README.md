# Aditya Tuition Centre

A premium educational notes platform for Classes 9–12.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind + Framer Motion
- Backend: FastAPI + SQLAlchemy + PostgreSQL-ready SQLite development database
- Auth: JWT + bcrypt
- Payments: UPI reference flow with backend verification pattern

## Local setup

1. Backend
   - cd backend
   - python -m pip install -r requirements.txt
   - copy .env.example to .env and adjust values
   - python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2. Frontend
   - cd frontend
   - npm install
   - npm run dev -- --host 0.0.0.0 --port 5173

## Admin account

- Email: admin@adityatuition.in
- Password: admin123

## Notes flow

- Choose class
- Choose subject
- Choose chapter
- Unlock with payment flow
- Access protected viewer after authentication and purchase verification

## Important

This project uses a backend-first payment and access model; the frontend never determines payment success by itself.

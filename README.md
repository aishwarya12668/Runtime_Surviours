# Nivara - AI-Powered Integrated Breast Cancer Care Platform

## Stack
- Frontend: React + Vite + Framer Motion
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas
- AI: OpenAI Chat Completions API

## Setup
### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Required Env Vars
Backend `.env`
- MONGO_URI
- JWT_SECRET
- OPENAI_API_KEY
- PORT (optional)

Frontend `.env`
- VITE_API_URL=http://localhost:5000

## APIs
- POST /signup
- POST /login
- POST /risk
- POST /appointments
- GET /appointments
- POST /reports/upload
- GET /reports
- POST /chat/message
- POST /chat/upload
- GET /chat/messages
- GET /dashboard
- POST /reminders
- GET /doctors

## Notes
- Appointment conflict protection is enforced with a unique index on doctor + date.
- Uploads are stored in local `backend/uploads` and file URL metadata in MongoDB.
- Dashboard computes care continuity score and dropout risk alerts.

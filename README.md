# Placement Management System

A clean, professional MERN-stack placement portal with three separate profiles:

- Student
- Company
- Administrator

## Features

### Student
- Register and login
- Dashboard with branch, year, CGPA and backlogs
- View eligible placement drives
- Apply to opportunities
- Track application status
- Manage profile

### Company
- Register and login
- Company dashboard
- Post placement opportunities with eligibility criteria
- View posted opportunities
- View applicants
- Shortlist, reject or select applicants

### Administrator
- Secure admin login
- Dashboard statistics
- View students and companies
- View all applications
- Update final application/result status

## Project structure

```text
placement-management-system/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── vercel.json
└── README.md
```

## Run locally

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env` from `.env.example`.

Put your MongoDB URI in:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/placementDB?retryWrites=true&w=majority&appName=Cluster0
```

Then:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2. Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Admin login

The backend automatically creates the admin account from these environment variables:

```env
ADMIN_NAME=Placement Administrator
ADMIN_EMAIL=admin@placementhub.com
ADMIN_PASSWORD=Admin@12345
```

Use those credentials on the Admin login profile.

## Important

Never upload `.env` to GitHub or include MongoDB credentials in frontend code.

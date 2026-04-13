# 💼 Online Resume Builder & Job Portal System

A full stack web application for managing job postings, resumes, and applications with role-based access control.

## 🚀 Live Demo
- Frontend: https://job-portal-system.vercel.app
- Backend: https://job-portal-backend.onrender.com

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT + bcryptjs
- **Deployment:** Vercel + Render + Supabase

## ✨ Features
- 🔐 Role-based auth (Admin, Recruiter, JobSeeker)
- 📋 Post and manage job listings
- 📄 Build and manage resumes
- 📩 Apply for jobs and track application status
- 👥 Recruiter dashboard to manage applicants
- ⚙️ Admin panel for users, skills and salary management
- 🔢 Auto vacancy decrement on acceptance

## 🗄️ Database
10 tables — roles, users, login, permission, job, skills, job_skills, resume, salary, applications

## 📁 Project Structure
\`\`\`
Job_Portal_System/
├── Backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── routes/
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── utils/
└── database/schema.sql
\`\`\`

## ⚙️ Setup

**Backend**
\`\`\`bash
cd Backend
npm install
npm run dev
\`\`\`

**.env**
\`\`\`
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/Job_Portal
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
\`\`\`

**Frontend**
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`|
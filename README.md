# 🗂️ Team Task Manager

A full-stack team task management application built with React, Node.js, Express, and MongoDB.

## 🔗 Live Demo

**App URL:** https://team-task-manager-production-45e9.up.railway.app

---

## 🔐 Test Credentials

| Name | Email | Password | Role |
|------|-------|----------|------|
| Rahul Sharma | rahul.admin@gmail.com | Admin@123 | Admin |
| Priya Patel | priya.patel@gmail.com | Member@123 | Member |
| Arjun Mehta | arjun.mehta@gmail.com | Member@123 | Member |
| Sneha Verma | sneha.verma@gmail.com | Member@123 | Member |

> **Admin** can create/edit/delete projects, assign members, manage all tasks and view full dashboard.

> **Member** can view assigned projects, create and update tasks within their projects.

---

## 👤 Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Create/edit/delete projects, assign members, view all tasks & dashboard |
| **Member** | View assigned projects, create/update/delete own tasks |

---

## ✨ Features

- JWT based authentication (Register / Login)
- Role based access control (Admin / Member)
- Create and manage projects with team members
- Create tasks with title, description, status, priority and due date
- Assign tasks to project members
- Dashboard with task stats (Total, Todo, In Progress, Done, Overdue)
- Fully responsive UI

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Railway |

---

## 🚀 Local Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account or local MongoDB

### Backend
```bash
cd backend
npm install
# create .env file with:
# PORT=4000
# JWT_SECRET=your-secret
# MONGODB_URI=your-mongodb-uri
npm start
```

### Frontend
```bash
cd frontend
npm install
# create .env file with:
# VITE_API_URL=http://localhost:4000/api
npm run dev
```

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── controllers/  # Auth, Project, Task logic
│   │   ├── middleware/   # JWT auth, role check
│   │   ├── models/       # User, Project, Task schemas
│   │   └── routes/       # API routes
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios config
        ├── components/   # Navbar, TaskCard, PrivateRoute
        ├── context/      # Auth context
        └── pages/        # Login, Register, Dashboard, Projects
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create project (admin) |
| GET | /api/projects/:id | Get project details |
| PUT | /api/projects/:id | Update project (admin) |
| DELETE | /api/projects/:id | Delete project (admin) |
| GET | /api/projects/users | Get all users (admin) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects/:id/tasks | Get project tasks |
| POST | /api/projects/:id/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/dashboard | Get dashboard stats |

---

Built by **Ayush Trikmani** for Ethara AI Software Engineer Assessment

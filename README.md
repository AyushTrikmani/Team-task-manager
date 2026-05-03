# ⚡ TaskFlow - Premium Team Task Manager

TaskFlow is a full-featured, professional Team Task Management web application built with the MERN stack (MongoDB, Express, React, Node.js). 

It is designed to help teams organize projects, track progress via Kanban boards, and communicate efficiently in a sleek, modern, and dark-mode-first environment.

---

## ✨ Features

- **🔐 Role-Based Access Control (RBAC):** Admin users can create projects, assign tasks, and manage team members. Members have focused access to their assigned work.
- **📋 Interactive Kanban Boards:** Visually track tasks across *Todo*, *In Progress*, and *Done* columns with dynamic progress bars.
- **💬 Task Comments:** Real-time collaboration. Team members can discuss specifics directly within the task cards.
- **📊 Admin Dashboard & User Management:** Comprehensive views of project statistics, overdue tasks, and a dedicated panel for admins to promote/demote user roles.
- **👤 Centralized "My Tasks":** A dedicated page for users to view all tasks assigned to them across every single project they are a part of.
- **🎨 Premium UI/UX:** A stunning dark-mode interface featuring glassmorphism, smooth animations, skeleton loading states, and custom toast notifications.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Custom Vanilla CSS (Modern CSS Variables, Flexbox/Grid)
- **HTTP Client:** Axios

### Backend (API)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for password hashing
- **Security:** Helmet, CORS

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js installed (v18+ recommended)
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Setup the Backend
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Seed the database with demo users, projects, and tasks:
```bash
node src/seed.js
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (optional for local testing, required for deployment):
```env
VITE_API_URL=http://localhost:4000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🔑 Demo Credentials

If you ran the `seed.js` script, you can log in using the following test accounts, or just click the "Quick Fill" buttons on the login page:

**Admin Account:**
- **Email:** `ayush.admin@gmail.com`
- **Password:** `Admin@123`

**Member Account:**
- **Email:** `arjun.mehta@gmail.com`
- **Password:** `Member@123`

---

## ☁️ Deployment

This project is fully configured for deployment on **Railway**. 

1. Connect your GitHub repository to Railway.
2. Deploy the `backend` folder as a Web Service. Set the `FRONTEND_URL` environment variable to your live frontend URL.
3. Deploy the `frontend` folder as a Static Site. Set the `VITE_API_URL` environment variable to your live backend API URL.

---

<div align="center">
  <p>Built with 💻 by <strong>Ayush Trikmani</strong></p>
</div>

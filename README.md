# TaskFlow — Project Management Tool

A modern, full-stack **Project Management SaaS application** where users can create projects, assign tasks, set deadlines, track progress, and manage project activities — similar in concept to **Trello / Asana / Jira**, but with an original TaskFlow design.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Stack](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)
![Stack](https://img.shields.io/badge/Express-4-000000?logo=express)
![Stack](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Stack](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)

---

## 1. Project Overview

TaskFlow is a complete **Project Management Tool** built as a real, working full-stack application. It allows teams to:

- Create and manage **projects** with statuses, priorities, and deadlines
- Break projects down into **tasks** organized on a drag-and-drop **Kanban board**
- Assign tasks to **team members**
- Automatically calculate **project progress** based on completed tasks
- Track **deadlines** and receive notifications for **upcoming and overdue** tasks
- View rich **analytics and charts** on the dashboard
- Log every **project activity** for full transparency

The application is **fully responsive** (desktop, tablet, mobile), **secure** (JWT + bcrypt), and **deployment-ready** for free hosting platforms.

---

## 2. Features

### Authentication
- Secure register & login with JWT
- bcrypt password hashing
- Protected routes & dashboard
- User profile with password change

### Dashboard
- Total / Active / Completed projects
- Total / Pending / Completed / Overdue tasks
- Progress charts (tasks by status, by priority, project completion)
- Recent projects & tasks
- Upcoming deadlines with overdue highlighting
- Task completion percentage

### Project Management
- Full CRUD: create, edit, delete, view
- Name, description, start date, deadline, status, priority
- Statuses: Planning, In Progress, On Hold, Completed
- Priorities: Low, Medium, High
- Team member management (owner features)

### Task Management
- Full CRUD on tasks
- Assign to team members
- Priority, deadline, description, status
- **Kanban board** (To Do | In Progress | Review | Completed) with **drag-and-drop**
- Automatic project progress calculation

### Progress & Analytics
- Progress bars with percentage
- Circular / donut charts (Recharts)
- Tasks by status, priority, and assignee

### Deadline & Notifications
- Upcoming deadlines section
- Overdue task highlighting
- Notification bell with unread counts
- Notifications for assignments, updates, deadlines, and overdue items

### Search & Filter
- Search projects and tasks
- Filter by status, priority, deadline, and assignee

### Activity Log
- Track project creation, task creation/assignment/status changes/completion, project updates

---

## 3. Technologies Used

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, React Router 6, Axios, Recharts, Lucide React |
| **Backend** | Node.js, Express.js, REST API |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **Other** | CORS, Morgan, dotenv, Nodemon (dev) |

---

## 4. Folder Structure

```
taskflow/
├── client/                      # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── charts.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── context/             # React Context (Auth, Toast)
│   │   ├── hooks/
│   │   ├── layouts/             # AppLayout (sidebar + top nav)
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Projects, ProjectDetail, Profile
│   │   ├── services/            # Axios API layer
│   │   ├── utils/               # formatting helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   ├── vercel.json
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Node.js/Express backend
│   ├── config/db.js             # MongoDB connection
│   ├── controllers/             # auth, user, project, task, notification
│   ├── demo/seed.js             # Demo data seeder
│   ├── middleware/              # auth (JWT), errorHandler
│   ├── models/                  # User, Project, Task, Notification, Activity
│   ├── routes/                  # auth, user, project, task, notification
│   ├── utils/                   # appError, helpers
│   ├── .env.example
│   └── server.js                # Entry point
│
├── render.yaml                  # Render.com blueprint
├── netlify.toml                 # Netlify build config (base=client) + SPA fallback routing
├── package.json                 # Root scripts (run both)
└── README.md
```

---

## 5. Installation

### Prerequisites
- **Node.js** (v18 or later)
- **npm** (bundled with Node)
- **MongoDB** (local install or **MongoDB Atlas** account)

### Step 1: Clone & install dependencies
```bash
git clone <your-repo-url> taskflow
cd taskflow

# Install root scripts helper
npm install

# Install server + client dependencies
npm run install:all
```

---

## 6. MongoDB Configuration

### Option A — Local MongoDB
1. Install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB (usually runs automatically as a service):
   ```bash
   mongod
   ```
3. Your local connection URI (default):
   ```
   mongodb://127.0.0.1:27017/taskflow
   ```

### Option B — MongoDB Atlas (cloud, recommended for deployment)
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user (username + password)
3. Whitelist your IP (or `0.0.0.0/0` for any)
4. Copy the connection string, e.g.:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskflow
   ```

---

## 7. Environment Variables

### Backend — `server/.env`
```env
# Local MongoDB or Atlas URI
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
# For Atlas: mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/taskflow

# JWT secret — use a long random string in production
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
JWT_EXPIRE=7d

# Server port
PORT=5000

# Frontend origin (for CORS)
CLIENT_URL=http://localhost:5173
```

> Copy `server/.env.example` → `server/.env` and fill in your values.

### Frontend — `client/.env`
```env
# Leave as /api for local dev (Vite proxies to backend)
VITE_API_URL=/api
# For production, point to your deployed backend:
# VITE_API_URL=https://your-backend.onrender.com/api
```

> Copy `client/.env.example` → `client/.env`.

**Important:** Never commit real `.env` files with secrets to version control.

---

## 8. How to Run the Frontend

```bash
cd client
npm run dev
```
The Vite dev server runs at **http://localhost:5173**. It proxies `/api` requests to the backend on port 5000 automatically.

---

## 9. How to Run the Backend

```bash
cd server
npm run dev        # development (with nodemon auto-restart)
# or
npm start          # production-style start
```
The API runs at **http://localhost:5000**. Health check: `GET http://localhost:5000/api/health`.

### Run both together (from project root)
```bash
npm run dev
```
This uses `concurrently` to run the server and client at the same time.

---

## 10. Seed Demo Data

To populate the app with realistic demo data (5 users, 4 projects, 20+ tasks, activities & notifications):

```bash
cd server
npm run seed
```

**Demo users** (password for all: `password123`):

| Role  | Email               |
|-------|---------------------|
| admin | sarah@taskflow.app  |
| user  | jordan@taskflow.app |
| user  | alex@taskflow.app   |
| user  | priya@taskflow.app  |
| user  | mark@taskflow.app   |

---

## 11. Deployment Steps

### Backend → Render (free)

1. Push the project to a GitHub repository.
2. On [render.com](https://render.com), click **New → Web Service**.
3. Connect your repo, set **Root Directory** to `server`.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add environment variables in the service settings:
   - `MONGO_URI` (Atlas URI)
   - `JWT_SECRET` (strong random value)
   - `CLIENT_URL` (your deployed frontend URL, no trailing slash)
   - `NODE_ENV=production`
7. Deploy → note your backend URL (e.g. `https://taskflow-api.onrender.com`).

> Alternative free hosts: **Railway**, **Cyclic.sh**, **Fly.io**. You can also use the included `render.yaml` blueprint ("New → Blueprint").

### Frontend → Vercel / Netlify

**Vercel**
1. Import the repository.
2. **Root Directory** → `client`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. Add environment variable `VITE_API_URL` = your deployed backend URL + `/api`.
6. Deploy. The included `vercel.json` handles SPA routing.

**Netlify**
1. Import the repository.
2. Add env var `VITE_API_URL`.
3. Deploy. The root `netlify.toml` already sets the base directory (`client`), build command, and publish directory, and handles SPA fallback routing — no manual dashboard configuration needed.

### Database
Use **MongoDB Atlas** (free tier). Update `MONGO_URI` on your backend host to your cluster connection string.

---

## 12. Screenshots

Screenshots to add here (these were created during development):

- **Landing Page** — hero, features, benefits
- **Login / Register** — auth screens with demo account quick-fill
- **Dashboard** — stat cards, donut & bar charts, recent projects, upcoming deadlines
- **Projects Grid** — project cards with progress, search & filters
- **Project Detail** — progress, task stats, team members, **Kanban board**, activity log
- **Profile** — edit profile, change password, assigned tasks
- **Mobile view** — mobile sidebar/menu, horizontally scrollable Kanban

---

## 13. Future Enhancements

- **Real-time collaboration** with WebSockets/Socket.io (live board updates)
- **Gantt chart** and calendar view
- **File attachments** and comments on tasks
- **Email notifications** for assignments & deadlines
- **Custom tags/labels** and task dependencies
- **In-app activity feed** with live updates
- **More detailed analytics** (burndown charts, team workload)
- **Dark mode** support
- **Two-factor authentication** and OAuth (Google/GitHub sign-in)
- **Workspace / organization** multi-tenant support

---

## License

MIT © TaskFlow

---

Built as a college / internship project demonstration of a real-world full-stack SaaS application.

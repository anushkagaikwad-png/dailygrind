# ⚡ Daily Grind Tracker

A modern web application to track, reflect, and optimize your daily coding grind. Log your DSA questions solved, core subject study hours, development hours, sleep, and notes.

## 🚀 Live Demo
- **Frontend (React)**: [https://dailygrind-nu.vercel.app/](https://dailygrind-nu.vercel.app/)
- **Backend API (Express)**: [https://dailygrind-production.up.railway.app/api/logs](https://dailygrind-production.up.railway.app/api/logs)

---

## 🛠️ Tech Stack
- **Frontend**: React (hosted on Vercel)
- **Backend**: Node.js & Express (hosted on Railway)
- **Database**: MySQL (hosted on Railway)

---

## 📁 Repository Structure
This repository is structured as a monorepo:
```
dailygrind/
├── daily-tracker-frontend/  # React Frontend (configured for Vercel)
│   ├── src/                 # Application source files
│   └── package.json
├── daily-tracker-backend/   # Express Backend & API (configured for Railway)
│   ├── server.js            # Main server entrypoint (uses environment variables & trims)
│   └── package.json
└── README.md                # Project documentation
```

---

## 💾 Database Schema
The MySQL database stores records in a table named `daily_logs`. The backend automatically initializes this schema on startup:

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `INT` | Auto-incrementing primary key |
| `date` | `VARCHAR(255)` | Unique date index (prevents duplicate logs for the same day) |
| `dsa_questions` | `INT` | Number of DSA questions solved (Default: `0`) |
| `core_subject` | `VARCHAR(255)` | Subject studied (e.g. OS, DBMS, CN, DSA) |
| `core_hours` | `DECIMAL(5,2)` | Hours spent on core study |
| `development_hours` | `DECIMAL(5,2)`| Hours spent building projects |
| `sleep_hours` | `DECIMAL(5,2)` | Hours of sleep |
| `notes` | `TEXT` | Reflection notes or blockers |

---

## 💻 Running Locally

### 1. Run the Backend
1. Go to the backend folder:
   ```bash
   cd daily-tracker-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   npm start
   ```
   *The server runs by default on `http://localhost:3001`.*

### 2. Run the Frontend
1. Go to the frontend folder:
   ```bash
   cd daily-tracker-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The React app will open automatically at `http://localhost:3000`.*

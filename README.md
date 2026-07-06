# NOVA AI

NOVA AI is a full-stack AI chat assistant application. It has a glowing animated "orb" interface, voice input support, chat history with pin/rename/delete, light & dark themes, and secure JWT-based authentication.

Built with the **MERN** stack (MongoDB, Express, React, Node.js) and deployed using **Render** (server) + **Vercel** (client).

**Live app:**https://nova-ai-lilac-five.vercel.app/

---

## 🧠 What This Project Does

1. User signs up / logs in (JWT authentication).
2. User lands on the Home screen with an animated AI orb.
3. User types or speaks a message to NOVA.
4. Message is sent to the backend, which calls **OpenRouter AI** (GPT-3.5-turbo) to generate a reply.
5. The conversation is saved to **MongoDB**, so chat history persists across sessions.
6. User can view, search, rename, pin, or delete past chats from the sidebar.
7. User can switch between **Dark** and **Light** theme from Settings.

---

## 📁 Project Structure

```
nova-ai/
├── client/                  # React (Vite) frontend
│   ├── src/
│   │   ├── pages/           # Login, Signup, ForgotPassword, Settings
│   │   ├── layouts/         # MainLayout.jsx (core chat screen)
│   │   ├── components/      # Header, Sidebar, VoiceButton, AICore, ControlPanel
│   │   ├── styles/          # CSS per page/component
│   │   ├── config/api.js    # Central API_URL config
│   │   └── main.jsx         # App entry point
│   ├── vercel.json          # SPA routing fix for Vercel
│   └── package.json
│
├── server/                  # Node.js + Express backend
│   ├── controllers/
│   │   └── authControllers.js   # signup, login, forgot password, chat CRUD
│   ├── models/
│   │   ├── User.js          # name, email, password (hashed)
│   │   └── Chat.js          # userId, title, pinned, messages[]
│   ├── routes/
│   │   └── auth.js          # /api/auth/* routes
│   ├── config/db.js         # MongoDB connection
│   ├── index.js             # Express app entry + /chat AI route
│   └── package.json
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| Frontend       | React 19, Vite, React Router 7, Framer Motion    |
| Backend        | Node.js, Express 5                                |
| Database       | MongoDB (Mongoose)                                |
| Auth           | JWT + bcryptjs (password hashing)                |
| AI Model       | OpenRouter API — `openai/gpt-3.5-turbo`           |
| Hosting        | Client → Vercel, Server → Render, DB → MongoDB Atlas |

---

## 🔑 Environment Variables

### `server/.env`
```
MONGO_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

### `client/.env`
```
VITE_API_URL=https://nova-ai-txaw.onrender.com
```

⚠️ Never commit `.env` files. Both are already in `.gitignore`.

---

## 🚀 Running Locally

### 1. Clone & install
```bash
git clone https://github.com/Kavisri-Fullstack/Nova-AI.git
cd nova-ai
```

### 2. Backend
```bash
cd server
npm install
npm run dev        # nodemon (auto-restart)
```
Server runs at `http://localhost:5000`

### 3. Frontend
```bash
cd client
npm install
npm run dev
```
Client runs at `http://localhost:5173` (Vite default)

Make sure `client/.env` has:
```
VITE_API_URL=http://localhost:5000
```
for local development.

---

## 🌐 API Routes (Backend)

| Method | Route                              | Purpose                     |
|--------|-------------------------------------|------------------------------|
| POST   | `/api/auth/signup`                  | Create new user account      |
| POST   | `/api/auth/login`                   | Login, returns JWT token      |
| POST   | `/api/auth/forgot`                  | Forgot password flow         |
| GET    | `/api/auth/chat/:userId`            | Get all chats for a user     |
| DELETE | `/api/auth/chat/:userId`            | Clear all chat history       |
| DELETE | `/api/auth/chat/delete/:chatId`     | Delete a single chat         |
| PUT    | `/api/auth/chat/rename/:chatId`     | Rename a chat                |
| PATCH  | `/api/auth/chat/pin/:chatId`        | Pin / unpin a chat           |
| POST   | `/chat`                             | Send message → get AI reply  |

---

## 🎨 Frontend Pages & Components

- **Login / Signup / ForgotPassword** — auth screens with JWT stored in `localStorage`
- **MainLayout** — the core screen: AI orb, chat box (toggles between compact & full view on tap), voice button, sidebar
- **Sidebar** — new chat, recent chats (search, pin, rename, delete), settings, logout
- **Settings** — theme toggle (dark/light)
- **VoiceButton** — speech-to-text input using browser Web Speech API

---

## 🚢 Deployment Notes

- **Server (Render):** Root directory `server`, Start Command `npm start` (not `npm run dev` — that runs nodemon, which fails in production)
- **Client (Vercel):** Root directory `client`, needs `vercel.json` with SPA rewrite rule so routes like `/home` don't 404 on refresh:
  ```json
  {
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- CORS is open (`cors()` with no restrictions) on the server — fine for now, can be locked to the Vercel domain later for extra security.

---

## 📌 Known Notes / Things to Improve Later

- `node_modules` got committed in an early push — safe to remove from git tracking later with `git rm -r --cached node_modules`.
- CORS currently allows all origins; can be restricted to the Vercel URL for production hardening.
- OpenRouter API key and JWT secret must be rotated if ever exposed (already handled once during initial GitHub push-protection block).

---

## 👩‍💻 Author

Built by **Kavisri** — full-stack fresher project, MERN stack, deployed end-to-end (Vercel + Render + MongoDB Atlas).
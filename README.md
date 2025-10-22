
# QUICKGPT

## Project overview

**QUICKGPT** is a full-stack chat application that integrates OpenAI-like capabilities for AI responses, user authentication, message history, and payment/credit management (Stripe). It’s split into two parts:

- `Client/` — Vite-powered frontend (React).
- `server/` — Node.js backend (Express-style, ES modules) with MongoDB (Mongoose).

## Tech stack

- Frontend: Vite + React (client/)
- Backend: Node.js, Express-style routing (server/)
- Database: MongoDB (Mongoose)
- Auth: JWT
- Payments: Stripe (webhooks)
- Webhooks: svix 
- Other: OpenAI integration (server-side), bcryptjs for password hashing

## Core features

- User registration & login (JWT-based)
- Real-time-ish chat/message endpoints
- Credit / payment system (Stripe)
- Integration with OpenAI APIs for AI-driven responses
- Admin / webhook handling for payment events

## Quick start — prerequisites

- Node.js (v18+ recommended) and npm
- MongoDB (local or hosted; connection string)
- Stripe account (for secret key and webhook secret)
- OpenAI API key (if using OpenAI features)
- (Optional) svix credentials for secure webhook delivery

---

## Environment variables

Create a `.env` file inside the `server/` directory with at least the following variables (example):

```
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/yourDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
SVIX_TOKEN=svx_...
```

> **Security note:** Never commit `.env` to git. Add `.env` to `.gitignore` if not present.

---

## Install & run (development)

From the root of the project (where `Client/` and `server/` live):

1. Install & run the server
```bash
cd server
npm install
# development
npm run server       # runs nodemon server.js
# or for production
npm start
```

2. Install & run the client
```bash
cd ../Client
npm install
npm run dev
```

3. Open the client dev server URL (usually http://localhost:5173) and ensure your backend `PORT` (e.g., 3000) matches the client API base URL configuration.

---

## Build & deploy (production)

1. Build the client
```bash
cd Client
npm run build
```

2. Serve the built client with a static server or integrate into your Node server (optional). Deploy server to a Node-capable host and set `NODE_ENV=production` and proper environment variables.

3. Configure Stripe webhooks:
- Create a webhook endpoint in your Stripe dashboard pointing to `/api/strive` (as found in server code).
- Use the `STRIPE_WEBHOOK_SECRET` value in your `.env`.

---

## Project structure (detected)

```
/Client                # Vite React frontend
/server                # Node.js backend
  server.js            # Entry point
  /routes              # API routes (user, chat, message, credit)
  /controllers         # Business logic & webhook handler
  /configs/db.js       # MongoDB connection helper
```




## Contributors

- **Twinkle Sharma & Manish Nainwal**


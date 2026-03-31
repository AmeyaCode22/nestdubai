# 🏠 NestDubai — Student Accommodation Platform

A full-stack web application for student accommodation booking in Dubai. Built with Node.js, Express, EJS, and SQLite.

---

## Tech Stack

- **Backend:** Node.js + Express.js
- **Views:** EJS (server-rendered HTML)
- **Database:** SQLite (via better-sqlite3)
- **Auth:** bcryptjs + express-session
- **Security:** helmet.js, httpOnly cookies, input sanitization
- **Payments:** Stripe (test mode) with demo fallback
- **CSS:** Custom (no frameworks) — Playfair Display + DM Sans

---

## Local Setup

### 1. Prerequisites
- Node.js 18+ — https://nodejs.org
- Git — https://git-scm.com

### 2. Clone & Install

```bash
git clone https://github.com/AmeyaCode22/nestdubai.git
cd nestdubai
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
NODE_ENV=development
SESSION_SECRET=any-long-random-string-here
STRIPE_SECRET_KEY=sk_test_...      # from stripe.com (optional)
STRIPE_PUBLISHABLE_KEY=pk_test_... # from stripe.com (optional)
ADMIN_EMAIL=admin@nestdubai.com
ADMIN_PASSWORD=NestAdmin2025!
```

> Stripe is optional — the app runs in demo mode without it.

### 4. Run

```bash
npm start
# OR for development with auto-restart:
npm run dev
```

Visit: **http://localhost:3000**

---

## Demo Accounts

| Role    | Email                  | Password       |
|---------|------------------------|----------------|
| Student | demo@student.com       | Demo1234!      |
| Admin   | admin@nestdubai.com    | NestAdmin2025! |

---

## Features

- 4 Dubai properties (Barsha Heights, TECOM, Discovery Gardens, Al Barsha)
- 3 room types: Studio, Partition, Bedspace
- Real-time vacancy tracking (polling API every 30s)
- Student registration & login with bcrypt encryption
- Secure session management
- Booking flow with property + room + date selection
- Payment integration (Stripe test mode / demo fallback)
- Student dashboard with booking history
- Admin panel with full booking & student management
- Fully responsive mobile design
- Semantic HTML + accessibility (ARIA, landmark regions)
- MVC architecture with Express routing

---

## Project Structure

```
nestdubai/
├── app.js              # Express entry point
├── database/           # SQLite DB + seed data
├── models/             # Data access layer
├── controllers/        # Business logic
├── routes/             # URL routing
├── views/              # EJS templates
├── public/             # CSS, JS, images
└── middleware/         # Auth checks
```


ation Development
**Assignment:** Web Project — 4 video demonstrations

<div align="center">

# Campus Ride

**University-exclusive ride sharing web app**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*A full-stack MERN project*

</div>

---

## What is CampusRide?

CampusRide lets **university students share rides with each other**, and only with each other. Sign-up is locked to your university email domain, so every person on the platform is a verified student.

Students with empty seats post a **Ride Offer**. Students who need a ride post a **Ride Request**. Offers, requests, notifications and chat all update in real time. Coordination happens with a phone call or in-app chat. No payments, no complicated matching.

## Features

- Email OTP verification restricted to a university domain
- Ride offers and ride requests with direction (to / from campus), route (R1-R4) and vehicle
- Route demand tiles and direction / route filters on the dashboard
- Seat request workflow: riders accept or reject, accepted rides complete and award points
- Interactive map (Leaflet + OpenStreetMap) for pickup location
- Real-time chat, notifications and live dashboard updates via Socket.IO
- Leaderboard with podium
- Profile editing
- Admin panel: stats, user ban / unban, ride and request moderation

## Screenshots

Add your screenshots to `docs/screenshots/` and they will show up here.

<p align="center">
  <img src="docs/screenshots/login.png" width="235" alt="Login"/>
  <img src="docs/screenshots/register.png" width="235" alt="Register"/>
  <img src="docs/screenshots/dashboard.png" width="235" alt="Dashboard"/>

  <img src="docs/screenshots/ride_detail.png" width="235" alt="Ride Detail"/>
  <img src="docs/screenshots/leaderboard.png" width="235" alt="Leaderboard"/>
  <img src="docs/screenshots/chat.png" width="235" alt="Chat"/>

  <img src="docs/screenshots/profile.png" width="235" alt="Profile"/>
  <img src="docs/screenshots/admin_panel.png" width="235" alt="Admin Panel"/>
  <img src="docs/screenshots/notifications.png" width="235" alt="Notifications"/>
</p>

## Getting started

Requirements: Node 18+ and MongoDB (local or Atlas).

```bash
# API
cd server
cp .env.example .env     # set JWT_SECRET and MONGO_URI
npm install
npm run dev              # http://localhost:5000

# Web app (second terminal)
cd client
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

In development the OTP is printed in the server terminal. To make an admin, set `role: "admin"` on a user in MongoDB. A deeper walkthrough and the API table are in [docs/GUIDE.md](docs/GUIDE.md).

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, Leaflet, lucide-react |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt, Nodemailer |
| Realtime | Socket.IO |
| Database | MongoDB |

## Roadmap

- [x] Ride request workflow with accept / reject and points
- [x] Direction and route filter chips on the dashboard
- [x] Female-only ride option
- [ ] Geofence validation of ride direction using GPS coordinates
- [ ] Notification preferences by route and gender
- [ ] Web push notifications
- [ ] Post-ride rating and review system
- [ ] Report user / abuse flagging
- [ ] Seasonal leaderboard resets (weekly / monthly)
- [ ] Production readiness: rate limiting, validation, monitoring, tests, deployment

---

<div align="center">

Inspired by the [CampusRide](https://github.com/sabbirahmedfahim/campusride) mobile app (Flutter + Supabase).
Department of Computer Science & Engineering

</div>

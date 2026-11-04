# CampusRide (MERN)

University-only ride sharing web app. Students post **Ride Offers** (empty seats) or **Ride Requests** (need a lift). Everything updates in real time; coordination happens by phone call and chat.

**Stack:** MongoDB + Express + React (Vite) + Node, Socket.IO for realtime, JWT auth, OTP email verification.

## 1. Run it

Prerequisites: Node 18+, MongoDB running locally (or a MongoDB Atlas URI).

```bash
# terminal 1 - API
cd server
cp .env.example .env      # set JWT_SECRET, MONGO_URI
npm install
npm run dev               # http://localhost:5000

# terminal 2 - web app
cd client
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

In dev, SMTP is empty so the **OTP is printed in the server console**. Register with any `you@lus.ac.bd` address (change `ALLOWED_EMAIL_DOMAIN` for your own university), copy the code from the terminal, and you are in.

To make an admin: open MongoDB (Compass/mongosh) and set `role: "admin"` on your user.

## 2. Project map

```
server/src
  index.js            Express + Socket.IO bootstrap, route mounting
  models/             User, Ride, RideRequest, Message, Notification
  routes/auth.js      register -> OTP -> verify -> JWT, login, /me
  routes/rides.js     list/filter, demand per route, create, complete, cancel
  routes/requests.js  passenger requests seat, rider accepts/rejects (awards points)
  routes/chat.js      conversations + 1:1 messages (pushed live via socket)
  routes/misc.js      notifications, leaderboard, admin (stats, ban users)
  utils/notify.js     save notification + emit to user's socket room
client/src
  api.js              axios instance with JWT header
  socket.js           socket.io client (authenticated)
  context/AuthContext session + socket lifecycle
  pages/              Login, Register(+OTP), Dashboard, OfferRide
```

**Realtime design:** every logged-in user joins a private room `user:<id>`. The server emits `notification` and `message` to that room, and broadcasts `ride:new` / `ride:update` so dashboards refetch.

## 3. API reference (all under /api, JWT required except auth)

| Method | Path | Purpose |
|---|---|---|
| POST | /auth/register, /auth/verify-otp, /auth/login | onboarding |
| GET | /auth/me | current user |
| GET | /rides?type=&direction=&route= | active rides |
| GET | /rides/demand | request count per route |
| POST | /rides | create offer/request |
| PATCH | /rides/:id/complete | mark booked, +10 points |
| DELETE | /rides/:id | cancel own ride |
| POST | /requests/ride/:rideId | ask for a seat |
| GET | /requests/incoming | requests on my rides |
| PATCH | /requests/:id `{status}` | accept / reject |
| GET/POST | /chat, /chat/:userId | conversations, messages |
| GET, PATCH | /notifications, /notifications/read-all | inbox |
| GET | /leaderboard | top users by points |
| GET/PATCH/DELETE | /admin/stats, /admin/users, /admin/users/:id/ban | admin panel |

## 4. Build order (suggested)

1. **Get auth working end to end** (already scaffolded). Test with the OTP in the console.
2. **Ride detail page** `/rides/:id`: call button (`tel:` link), "Chat with rider", map.
3. **Chat + Messages pages** using `/chat` and the `message` socket event.
4. **Notifications page** + unread badge (fetch `/notifications`, PATCH `read-all`).
5. **Incoming requests screen** for riders (accept/reject).
6. **Leaderboard** (podium for top 3, list for the rest).
7. **Profile** and **Admin panel** (tabs: Stats, Users, Rides, Requests).
8. **Map**: use Leaflet + OpenStreetMap (free, no API key) via `react-leaflet`; store `location {lat,lng}` on the ride.
9. **Polish:** loading/empty states, toasts instead of `alert`, mobile layout, then deploy.

## 5. Roadmap ideas (from the original app)

- Geofence check: only allow "From University" rides posted near campus (Haversine distance on `location`).
- Notification preferences by route and gender.
- Female-only filter (`femaleOnly` field already on the Ride model).
- Post-ride ratings, report/abuse flagging, seasonal leaderboard resets.
- Web push notifications (Firebase Cloud Messaging or Web Push).

## 6. Hardening before real users

- Add `express-rate-limit` on `/auth/*`, `helmet`, and input validation (zod/joi).
- Never trust `req.body` spread into models in production; whitelist fields in `POST /rides`.
- Store JWT in an httpOnly cookie instead of localStorage if you want stronger XSS protection.
- Deploy: API on Render/Railway, client on Vercel/Netlify, DB on MongoDB Atlas. Set `CLIENT_URL` and `VITE_SOCKET_URL`, and replace the Vite proxy with a full API base URL.

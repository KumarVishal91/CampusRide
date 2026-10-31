# 🚗 CampusRide – University-Based Ride Sharing Platform

<p align="center">
  A university-exclusive ride-sharing platform that connects students traveling in the same direction, making campus transportation easier, safer, and more convenient.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" />
  <img src="https://img.shields.io/badge/Express.js-API-black?logo=express" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socket.io" />
  <img src="https://img.shields.io/badge/License-MIT-blue" />
</p>

---

## 📌 Overview

**CampusRide** is a full-stack ride-sharing web application built exclusively for university students.

It provides a centralized platform where students can share available seats in their vehicles or request rides from other students traveling along similar routes.

Unlike traditional ride-sharing platforms, CampusRide focuses on university communities. Registration is restricted to approved university email domains, helping ensure that the platform remains student-exclusive.

The application supports ride offers, ride requests, real-time communication, notifications, interactive maps, and administrative moderation.

## ✨ Key Features

### 🔐 Authentication & Security
- University email-based registration.
- OTP verification through email.
- JWT-based authentication and protected routes.
- Password hashing using bcrypt.
- Role-based access for students and administrators.

### 🚘 Ride Management
- Create and manage ride offers.
- Publish ride requests when transportation is needed.
- Specify vehicle details, available seats, pickup location, and destination.
- Select travel direction: To Campus or From Campus.
- Organize journeys using predefined routes (R1–R4).
- Accept or reject incoming seat requests.
- Complete accepted rides and earn reward points.

### ⚡ Real-Time Communication
- Real-time messaging using Socket.IO.
- Instant ride notifications.
- Live dashboard updates.
- Chat between students to coordinate pickup and travel details.

### 🗺️ Interactive Maps
- Interactive maps powered by Leaflet.
- OpenStreetMap integration.
- Visualize pickup locations.
- Help students coordinate meeting points.

### 🏆 Leaderboard & Rewards
- Points-based reward system.
- Student leaderboard.
- Top-three podium display.
- Encourage participation and community engagement.

### 👤 Profile Management
- View and update personal profile information.
- Manage student details.
- Access ride-related activity.

### 🛡️ Admin Dashboard
- View platform statistics.
- Manage registered users.
- Ban and unban accounts.
- Moderate ride offers and requests.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling & Icons | CSS, Lucide React |
| HTTP Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Real-Time Communication | Socket.IO |
| Email Service | Nodemailer |
| Maps | Leaflet, OpenStreetMap |

---

## 🏗️ Application Architecture

CampusRide follows a client-server architecture.

```text
                  CAMPUSRIDE
                      |
          +-----------+-----------+
          |                       |
      React Client           Express Server
          |                       |
     React Router           REST API Routes
          |                       |
     Axios Requests        Middleware
          |                       |
     UI Components         Controllers
          |                       |
          |                   Mongoose
          |                       |
          |                    MongoDB
          |
          +------ Socket.IO ------+
                     |
              Real-Time Events
                     |
          Chat / Notifications /
             Dashboard Updates
```

### Application Workflow

1. A student registers using their university email.
2. The email is verified through an OTP.
3. The student logs in and accesses the dashboard.
4. Students can publish ride offers or ride requests.
5. Other students can discover relevant rides using route and direction filters.
6. A student can request a seat in an available ride.
7. The ride owner accepts or rejects the request.
8. Students coordinate through real-time chat and notifications.
9. Completed rides contribute to the student's reward points.

---

## 📂 Project Structure

```text
CampusRide/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── sockets/
│   ├── utils/
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── GUIDE.md
│
├── .gitignore
└── README.md
```

*Note: The folder structure above is a logical overview. Adjust individual directory names if your actual source structure differs.*

---

## ⚙️ Getting Started

Follow these steps to run CampusRide locally.

### Prerequisites

Make sure you have installed:

- Node.js (v18 or above)
- npm
- MongoDB (Local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/KumarVishal91/CampusRide.git

cd CampusRide
```

### 2. Configure the Backend

```bash
cd server

npm install
```

Create a `.env` file using `.env.example`.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Add the email configuration variables required by your Nodemailer implementation.

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd client

npm install
```

Create a `.env` file using `.env.example` and configure the backend API URL.

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 4. Development OTP

During local development, the OTP is printed in the backend terminal.

### 5. Admin Access

To create an administrator account, update the user's role to `admin` in the MongoDB database.

---

## 🔄 Core Modules

| Module | Responsibility |
|---|---|
| Authentication | Registration, OTP verification, login |
| Ride Offers | Create and manage available rides |
| Ride Requests | Request seats and manage approvals |
| Dashboard | Discover rides and filter by routes |
| Real-Time Chat | Student-to-student communication |
| Notifications | Inform users about ride activities |
| Maps | Display pickup locations |
| Leaderboard | Track points and student rankings |
| Admin | User management and content moderation |

---

## 🚀 Future Enhancements

The following improvements are planned for future releases:

- GPS-based geofence validation for ride directions.
- Female-only ride preferences.
- Browser push notifications.
- Post-ride ratings and reviews.
- User reporting and abuse detection.
- Route-based and gender-based notification preferences.
- Weekly and monthly leaderboard resets.
- API rate limiting and enhanced request validation.
- Automated testing and CI/CD integration.
- Production deployment and monitoring.

---

## 🎯 Project Goals

CampusRide aims to:
- Simplify transportation for university students.
- Encourage students to share available vehicle seats.
- Reduce individual transportation costs.
- Improve coordination through real-time communication.
- Build a trusted and student-exclusive transportation community.

---

## 👨‍💻 Author

**Vishal Kumar**

B.Tech – Computer Science and Engineering (AI & ML)

- GitHub: [KumarVishal91](https://github.com/KumarVishal91)

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <b>Built to make campus commuting smarter, simpler, and more connected. 🚗</b>
</p>

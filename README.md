# 🚖 CampusRide – Campus Cab Booking & Ride-Sharing Platform

CampusRide is a campus-focused cab booking platform that allows students to book rides from one location to another within or around their university. Students can select pickup and drop-off locations, view nearby drivers on an interactive map, and request rides. Drivers can view incoming ride requests, accept suitable bookings, and navigate towards the pickup location.

The platform provides real-time GPS tracking, distance-based driver matching, and live ride updates to make campus transportation easier, faster, and more convenient.

## ✨ Key Features

### 👨‍🎓 Student / User
- **User Authentication:** Secure registration and login using JWT-based authentication.
- **Book a Ride:** Select pickup and destination locations to request a cab.
- **Interactive Pickup Map:** Choose pickup and drop-off points using an interactive map.
- **Nearby Driver Discovery:** Find available drivers based on their distance from the pickup location.
- **Ride Requests:** Send ride requests to available drivers.
- **Ride Status Tracking:** View ride status, including requested, accepted, ongoing, and completed.
- **Live GPS Tracking:** Track the driver's real-time location after ride acceptance.
- **Route and Direction Filters:** View and filter ride options based on pickup, destination, and route preferences.
- **Notifications and Chat:** Receive ride updates and communicate through real-time messaging.

### 🚗 Driver
- **Driver Dashboard:** Manage availability and view incoming ride requests.
- **Ride Offers:** Receive ride offers based on pickup location and distance.
- **Accept / Reject Requests:** Choose whether to accept an incoming ride request.
- **Location Sharing:** Share live GPS coordinates with the platform.
- **Navigation:** View pickup and destination locations on the map.
- **Ride Management:** Update ride status throughout the journey.

### 🛡️ Admin
- **Admin Dashboard:** Monitor platform activity and registered users.
- **User Management:** Manage student and driver accounts.
- **Driver Management:** Monitor driver activity and availability.
- **Ride Monitoring:** View and manage ride requests and their statuses.
- **Platform Moderation:** Handle user-related issues and maintain platform operations.

## 🔄 How It Works

1. **User Login:** A student logs into CampusRide using their account.
2. **Select Locations:** The student chooses a pickup point and destination on the interactive map.
3. **Find Nearby Drivers:** The system identifies available drivers near the pickup location using distance-based matching.
4. **Send Ride Request:** The student submits a ride request with pickup and destination details.
5. **Driver Accepts:** Available drivers receive ride offers and can accept the request.
6. **Live Tracking:** After acceptance, the student can track the driver's live GPS location.
7. **Complete Ride:** The driver updates the ride status after reaching the destination.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database |
| Socket.IO | Real-time communication, chat and ride updates |
| Leaflet | Interactive maps and location visualization |
| JWT | Authentication and authorization |
| Cloudinary | Image upload and storage |

## 🏗️ System Architecture

CampusRide follows a MERN-based client-server architecture.

- **Frontend:** Handles user interaction, location selection, maps, and ride dashboards.
- **Backend:** Processes authentication, ride requests, driver matching, and ride management.
- **Database:** Stores user, driver, and ride-related information.
- **Real-Time Layer:** Uses Socket.IO to exchange live location updates, notifications, and messages.
- **Map Integration:** Uses Leaflet to display pickup points, destinations, and driver locations.

## 📍 Driver Matching Logic

CampusRide uses distance-based matching to identify suitable drivers for a ride request.

1. Get the student's selected pickup coordinates.
2. Retrieve drivers who are currently available.
3. Calculate the distance between each available driver and the pickup location.
4. Filter and prioritize drivers based on proximity.
5. Send ride offers to suitable drivers.
6. Update the ride once a driver accepts it.

The matching approach was validated using 100+ simulated ride requests.

## 🔐 Security and Access Control

- JWT-based authentication.
- Role-based access for students, drivers, and admins.
- Protected backend routes.
- Input validation for ride-related requests.
- Controlled access to role-specific features.

## 🚀 Future Improvements

- Ride fare estimation based on distance.
- Ride booking and scheduling.
- Ride history and ratings.
- Improved driver matching using traffic and estimated arrival time.
- Emergency SOS and ride-sharing safety features.

## 🎯 Project Objective

The goal of CampusRide is to simplify campus transportation by connecting students with nearby drivers through a location-aware cab booking system. It combines interactive maps, distance-based matching, and real-time communication to provide a convenient ride-booking experience.


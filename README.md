# 🥗 Donatly - Food Donation & Community Coordination Platform

Donatly is a premium, real-time platform designed to bridge the gap between surplus food and those in need. Built with a focus on modern UI/UX and real-time coordination, Donatly empowers donors, trusts, and volunteers to work together seamlessly to reduce food waste and support communities.

---

## 🌟 Key Features

### 🏢 Role-Based Dashboards
- **Donors**: Easily list surplus food with locations, photos, and expiry times. Track the status of donations in real-time.
- **Trusts/NGOs**: Discover nearby donations on an interactive map. Accept donations and coordinate logistics by assigning volunteers.
- **Volunteers**: Receive mission assignments, navigate to pickup locations, and update delivery status—all in real-time.

### 📍 Intelligent Mapping
- **Interactive Regional View**: Powered by Leaflet and OpenStreetMap.
- **Custom Markers**: Distinct visual cues for donors (Lime), trusts (Emerald), and search locations.
- **Nearby Search**: Filter donations by distance radius from your current location.

### ⚡ Real-Time Coordination
- **Instant Notifications**: Non-intrusive toast alerts for new donations, assignment updates, and status changes.
- **Live Sync**: Dashboards update automatically using Socket.io without requiring page refreshes.

---

## 🚀 Technology Stack

### Frontend
- **React.js**: Modern component-based architecture.
- **Framer Motion**: Premium micro-animations and smooth transitions.
- **Lucide React**: Clean, consistent iconography.
- **Leaflet & React-Leaflet**: Robust mapping and geolocation features.
- **Socket.io-Client**: Real-time websocket communication.

### Backend
- **Node.js & Express**: High-performance server-side logic.
- **MongoDB & Mongoose**: Flexible, document-based data persistence.
- **Socket.io**: Real-time event emission and room management.
- **Firebase Auth**: Secure, scalable user authentication.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance
- Firebase Project for Authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zerowaste
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5001
   # MONGO_URI=<your-mongodb-uri>
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with your Firebase and API configurations
   npm run dev
   ```

---

## 📁 Project Structure

```text
zerowaste/
├── backend/
│   ├── config/         # Database and server config
│   ├── models/         # Mongoose schemas (User, FoodPost, Request)
│   ├── routes/         # Express API routes
│   └── server.js       # Socket.io & server entry point
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI & Map components
    │   ├── contexts/   # Auth and Socket state management
    │   ├── pages/      # Role-based dashboards & Landing
    │   └── assets/     # Images and global styles
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request or open an issue for bug reports and feature requests.

---

## 📄 License

This project is licensed under the MIT License.

---

*"Turning surplus into support—one meal at a time."*

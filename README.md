# 🎨 Collaborative Whiteboard App

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

A next-generation real-time collaborative whiteboard application designed for seamless team brainstorming, ideation, and visualization. Built with performance and user experience at its core, featuring buttery-smooth drawing, real-time synchronization, and a premium modern UI.

---

## 📸 Screenshots & Demo

> **Note:** Screenshots coming soon!

<!-- PLACEHOLDER: Main Dashboard View -->
<!-- <img src="path/to/dashboard-screenshot.png" alt="Dashboard View" width="100%"> -->

<!-- PLACEHOLDER: Whiteboard Drawing Experience -->
<!-- <img src="path/to/whiteboard-screenshot.png" alt="Whiteboard Experience" width="100%"> -->

<!-- PLACEHOLDER: Real-time Collaboration Demo (GIF) -->
<!-- <img src="path/to/collaboration-demo.gif" alt="Real-time Collaboration" width="100%"> -->

---

## ✨ Key Features

- **Real-Time Collaboration**: Instant synchronization of drawings and cursor movements using Socket.io.
- **High-Performance Drawing**: Powered by `perfect-freehand` for smooth, natural digital ink.
- **Tools & Shapes**: Pen, eraser, rectangle, circle, and more tools for versatile diagramming.
- **Infinite Canvas**: Pan and zoom freely to organize your ideas without limits.
- **Room Management**: Create and join unique rooms to collaborate with specific teams.
- **Modern UI/UX**: A highly responsive, accessible, and aesthetically pleasing interface built with Tailwind CSS and Radix UI.
- **Smooth Animations**: Enhanced user interactions with Framer Motion.
- **State Management**: Robust local application state handling with Zustand.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Drawing**: [Perfect-Freehand](https://github.com/steveruizok/perfect-freehand)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide React](https://lucide.dev/)
- **Real-Time Client**: [Socket.io-client](https://socket.io/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Real-Time Server**: [Socket.io](https://socket.io/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas connection string)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/white-board-collabration-app.git
cd white-board-collabration-app
```

#### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whiteboard
CORS_ORIGIN=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

#### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

---

## 📖 Usage

1.  **Create a Room**: Open the app and click "Create Room" to start a new session.
2.  **Share**: Copy the Room ID or URL and send it to your teammates.
3.  **Collaborate**: Select tools from the toolbar (Pen, Shapes, etc.) and start drawing!
4.  **Save**: Use the maximize/save options to export your work (if implemented).

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Developer** - [Your Name](https://github.com/vishal-tambi)

Project Link: [https://github.com/vishal-tambi/white-board-collabration-app](https://github.com/vishal-tambi/white-board-collabration-app)

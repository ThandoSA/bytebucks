const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ====== MIDDLEWARE ======
app.use(express.json());

// ✅ Allow local & hosted frontend to access the backend
app.use(cors({
  origin: [
    "http://127.0.0.1:5500", // local testing
    "http://localhost:5500", // alternative local URL
    "https://thandosa.github.io", // your GitHub Pages frontend
    "https://bytebucks-api.onrender.com" // your backend itself
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ====== ROUTES ======
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Default route (for testing)
app.get("/", (req, res) => {
  res.send("✅ Welcome to the Side Hustle Hub backend is live!");
});

// ====== DATABASE CONNECTION ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ====== SOCKET.IO SETUP ======
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "https://thandosa.github.io",
      "https://bytebucks-api.onrender.com"
    ],
    methods: ["GET", "POST"]
  }
});

const onlineUsers = {}; // track online users per room

io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  socket.on("joinRoom", ({ room, user }) => {
    socket.join(room);
    if (!onlineUsers[room]) onlineUsers[room] = [];
    if (!onlineUsers[room].includes(user)) onlineUsers[room].push(user);

    io.to(room).emit("updateUsers", { room, users: onlineUsers[room] });
  });

  socket.on("chatMessage", ({ room, sender, message }) => {
    const time = new Date();
    io.to(room).emit("chatMessage", { room, sender, message, time });
  });

  socket.on("disconnecting", () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if (onlineUsers[room]) {
        onlineUsers[room] = onlineUsers[room].filter(u => u !== socket.username);
        io.to(room).emit("updateUsers", { room, users: onlineUsers[room] });
      }
    });
  });
});

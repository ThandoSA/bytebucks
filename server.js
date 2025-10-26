const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Side Hustle Hub backend!");
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ===== SOCKET.IO SETUP =====
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" } // allow all origins for dev
});

const onlineUsers = {}; // track online users per job room

io.on("connection", (socket) => {
  console.log("⚡ New socket connected:", socket.id);

  // Join a job chat room
  socket.on("joinRoom", ({ room, user }) => {
    socket.join(room);
    if (!onlineUsers[room]) onlineUsers[room] = [];
    if (!onlineUsers[room].includes(user)) onlineUsers[room].push(user);

    // Broadcast updated online users
    io.to(room).emit("updateUsers", { room, users: onlineUsers[room] });
  });

  // Handle chat messages
  socket.on("chatMessage", ({ room, sender, message }) => {
    const time = new Date();
    io.to(room).emit("chatMessage", { room, sender, message, time });
  });

  // Handle disconnect
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

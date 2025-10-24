const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Simple route
app.get('/', (req, res) => {
  res.send('Welcome to ByteBucks API 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

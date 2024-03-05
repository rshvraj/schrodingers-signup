const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB

// Middleware

// Routes
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;

  const newUser = { name, email, password };

  res.json({ message: "User registered successfully", user: newUser });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

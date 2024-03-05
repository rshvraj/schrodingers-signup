import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

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

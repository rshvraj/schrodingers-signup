import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

let signupQueue = [];

const processOfflineSignups = async () => {
  while (signupQueue.length > 0) {
    const { username, email, password } = signupQueue.shift();
    await saveUserToDatabase(username, email, password);
  }
};

const saveUserToDatabase = async (username, email, password) => {
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    console.log("User created successfully!");
  } catch (error) {
    console.error("Error saving user:", error.message);
  }
};

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (navigator.onLine) {
    try {
      // Process signup request immediately if online
      await saveUserToDatabase(username, email, password);
      res.status(201).json("User created successfully!");
    } catch (error) {
      next(error);
    }
  } else {
    // Queue signup request if offline
    signupQueue.push({ username, email, password });
    res
      .status(200)
      .json("Signup request queued. User will be created when back online.");
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));
    await processOfflineSignups();

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

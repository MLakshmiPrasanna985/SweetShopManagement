import express from "express";
import { loginUser } from "./services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User";

const app = express();
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );

  res.status(201).json({ token });
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const token = await loginUser(email, password);
    res.json({ token });
  } catch {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default app;

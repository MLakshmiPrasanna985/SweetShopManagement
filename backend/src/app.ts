import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User";
import Sweet from "./models/Sweet";
import { loginUser } from "./services/auth.service";
import { authMiddleware, AuthRequest } from "./middleware/auth.middleware";

const app = express();
app.use(express.json());

// Health check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: role || "USER" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );

  res.status(201).json({ token });
});

// Login endpoint
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

// Protected route
app.get("/api/protected", authMiddleware, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.status(200).json({ userId: req.user.id });
});

// List all sweets (public)
app.get("/api/sweets", async (_req, res) => {
  const sweets = await Sweet.findAll();
  res.status(200).json(sweets);
});

// Admin create sweet
app.post("/api/sweets", authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  const sweet = await Sweet.create(req.body);
  res.status(201).json(sweet);
});

// Admin update sweet
app.put("/api/sweets/:id", authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  const sweet = await Sweet.updateById(req.params.id, req.body);
  if (!sweet) return res.status(404).json({ error: "Sweet not found" });
  res.status(200).json(sweet);
});

// Admin delete sweet
app.delete("/api/sweets/:id", authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });
  const deleted = await Sweet.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Sweet not found" });
  res.status(200).json({ message: "Sweet deleted" });
});

// Purchase sweet (user)
app.post("/api/sweets/:id/purchase", authMiddleware, async (req: AuthRequest, res) => {
  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ error: "Sweet not found" });
  if (sweet.quantity <= 0) return res.status(400).json({ error: "Out of stock" });

  sweet.quantity -= 1;
  res.status(200).json(sweet);
});

// Restock sweet (admin)
app.post("/api/sweets/:id/restock", authMiddleware, async (req: AuthRequest, res) => {
  if (req.user?.role !== "ADMIN") return res.status(403).json({ error: "Forbidden" });

  const { quantity } = req.body;
  if (!quantity || quantity <= 0) return res.status(400).json({ error: "Invalid quantity" });

  const sweet = await Sweet.findById(req.params.id);
  if (!sweet) return res.status(404).json({ error: "Sweet not found" });

  sweet.quantity += quantity;
  res.status(200).json(sweet);
});
// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, role: role || "USER" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1h" }
  );

  res.status(201).json({ token });
});

export default app;

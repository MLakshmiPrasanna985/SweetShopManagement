import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import jwt from "jsonwebtoken";

let adminToken: string;
let userToken: string;

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");

  // Clear users collection
  await User.deleteMany({});

  // Create admin user
  const admin = await User.create({
    email: "admin@example.com",
    password: "hashedpassword", // You can hash manually if needed
    role: "ADMIN",
  });

  adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || "dev_secret");

  // Create regular user
  const user = await User.create({
    email: "user@example.com",
    password: "hashedpassword",
    role: "USER",
  });

  userToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev_secret");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/sweets", () => {
  it("should return 401 if no token provided", async () => {
    const res = await request(app).post("/api/sweets").send({ name: "Ladoo", price: 50 });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("should return 403 if user is not admin", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ name: "Ladoo", price: 50 });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ error: "Forbidden" });
  });

  it("should create a sweet if admin token provided", async () => {
    const res = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Barfi", price: 60 });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id"); 
    expect(res.body.name).toBe("Barfi");
    expect(res.body.price).toBe(60);
  });
});

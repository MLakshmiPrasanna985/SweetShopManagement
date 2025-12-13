import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should return 401 if user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@test.com", password: "pass123" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  it("should return 401 if password is incorrect", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    await User.create({
      email: "test@test.com",
      password: hashed,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  it("should return JWT token for valid credentials", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    await User.create({
      email: "test@test.com",
      password: hashed,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

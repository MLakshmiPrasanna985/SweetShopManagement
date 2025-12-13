import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/auth/register", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should return 400 if email or password missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "" });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Email and password required" });
  });

  it("should return 201 and JWT token for valid registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "newuser@test.com",
      password: "password123",
      role: "USER",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
  });
});

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
  it("should login user and return JWT", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    await User.create({
      email: "login@test.com",
      password: hashedPassword,
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "login@test.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

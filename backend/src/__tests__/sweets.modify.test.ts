import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import jwt from "jsonwebtoken";
import Sweet from "../models/Sweet";

let adminToken: string;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
  }
});

beforeEach(async () => {
  // ✅ Clean state safely (NO dropDatabase)
  await User.deleteMany({});
  await Sweet.clear();

  const admin = await User.create({
    email: "admin_modify@test.com",
    password: "hashedpassword",
    role: "ADMIN",
  });

  adminToken = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || "dev_secret"
  );
});

afterAll(async () => {
  // ✅ Just close connection, never drop DB
  await mongoose.connection.close();
});

describe("PUT /api/sweets/:id", () => {
  it("should update a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Gulab Jamun",
      price: 40,
      quantity: 10,
    });

    const res = await request(app)
      .put(`/api/sweets/${sweet.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 45 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(45);
  });
});

describe("DELETE /api/sweets/:id", () => {
  it("should delete a sweet", async () => {
    const sweet = await Sweet.create({
      name: "Rasgulla",
      price: 35,
      quantity: 5,
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Sweet deleted" });
  });
});

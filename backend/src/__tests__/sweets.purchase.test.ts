import request from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../app";
import User from "../models/User";
import Sweet from "../models/Sweet";

let userToken: string;
let adminToken: string;
let sweetId: string;

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/sweetshop_test");
});

beforeEach(async () => {
  // 🔥 VERY IMPORTANT: clean DB before each test
  await User.deleteMany({});
  await Sweet.clear();

  // create USER
  const user = await User.create({
    email: "user_purchase@test.com",
    password: "hashedpassword",
    role: "USER",
  });

  userToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

  // create ADMIN
  const admin = await User.create({
    email: "admin_purchase@test.com",
    password: "hashedpassword",
    role: "ADMIN",
  });

  adminToken = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET);

  // create sweet
  const sweet = await Sweet.create({
    name: "Kaju Katli",
    price: 100,
    quantity: 2,
  });

  sweetId = sweet._id.toString();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("POST /api/sweets/:id/purchase", () => {
  it("should reduce quantity by 1 on purchase", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(1);
  });

  it("should return 400 if sweet out of stock", async () => {
    // reduce stock to 0
    await Sweet.updateById(sweetId, { quantity: 0 });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Out of stock");
  });
});

describe("POST /api/sweets/:id/restock", () => {
  it("should allow admin to increase quantity", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(7);
  });

  it("should forbid non-admin users", async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe("Forbidden");
  });
});

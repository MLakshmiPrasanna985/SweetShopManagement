import request from "supertest";
import app from "../app";
import Sweet from "../models/Sweet";

beforeEach(async () => {
  await Sweet.clear();

  await Sweet.create({ name: "Ladoo", price: 50, quantity: 10, category: "Traditional" });
  await Sweet.create({ name: "Barfi", price: 60, quantity: 5, category: "Milk" });
  await Sweet.create({ name: "Rasgulla", price: 40, quantity: 8, category: "Milk" });
});

describe("GET /api/sweets/search", () => {
  it("should return sweets matching name query", async () => {
    const res = await request(app).get("/api/sweets/search?name=Barfi");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe("Barfi");
  });

  it("should return sweets matching category query", async () => {
    const res = await request(app).get("/api/sweets/search?category=Milk");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it("should return all sweets if no query provided", async () => {
    const res = await request(app).get("/api/sweets/search");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
});

import request from "supertest";
import app from "../app";

describe("GET /api/sweets", () => {
  it("should return empty list initially", async () => {
    const res = await request(app).get("/api/sweets");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should return list of sweets", async () => {
    // NOTE: this test will pass after model + seed logic
    const res = await request(app).get("/api/sweets");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

describe("Auth Middleware", () => {
  it("should return 401 if no token provided", async () => {
    const res = await request(app).get("/api/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("should return 401 if token is invalid", async () => {
    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
  });

  it("should allow access with valid token", async () => {
    const token = jwt.sign({ id: "user123" }, JWT_SECRET);

    const res = await request(app)
      .get("/api/protected")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: "user123" });
  });
});

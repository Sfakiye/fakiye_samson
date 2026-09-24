import request from "supertest";
import app from "../src/app";

describe("Health Check Endpoint", () => {
  it("should return status ok and a version number", async () => {
    const response: request.Response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.version).toBeDefined();
  });
});
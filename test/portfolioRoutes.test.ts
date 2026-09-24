import request from "supertest";
import app from "../src/app";

describe("Portfolio Performance Endpoint", () => {
  it("should return calculated performance for valid input", async () => {
    const response: request.Response = await request(app)
      .post("/api/v1/portfolio/performance")
      .send({ initialInvestment: 10000, currentValue: 12000 });

    expect(response.status).toBe(200);
    expect(response.body.profitOrLoss).toBe(2000);
  });

  it("should return 400 for invalid input", async () => {
    const response: request.Response = await request(app)
      .post("/api/v1/portfolio/performance")
      .send({ initialInvestment: "abc", currentValue: 12000 });

    expect(response.status).toBe(400);
  });
});
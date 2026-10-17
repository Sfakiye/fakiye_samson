import request from "supertest";
import app from "../src/app";

describe("Ticket Routes", () => {
  it("GET /api/v1/tickets should return all tickets", async () => {
    const response = await request(app).get("/api/v1/tickets");
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  it("GET /api/v1/tickets/:id should return 404 for missing ticket", async () => {
    const response = await request(app).get("/api/v1/tickets/999");
    expect(response.status).toBe(404);
  });

  it("POST /api/v1/tickets should create a ticket with valid data", async () => {
    const response = await request(app).post("/api/v1/tickets").send({
      title: "New bug",
      description: "Something broke",
      priority: "medium",
    });
    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("open");
  });

  it("POST /api/v1/tickets should return 400 for missing title", async () => {
    const response = await request(app).post("/api/v1/tickets").send({
      description: "No title here",
      priority: "medium",
    });
    expect(response.status).toBe(400);
  });

  it("PUT /api/v1/tickets/:id should update an existing ticket", async () => {
    const response = await request(app)
      .put("/api/v1/tickets/1")
      .send({ status: "in-progress" });
    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe("in-progress");
  });

  it("DELETE /api/v1/tickets/:id should return 404 for a non-existent ticket", async () => {
    const response = await request(app).delete("/api/v1/tickets/999");
    expect(response.status).toBe(404);
  });

  it("GET /api/v1/tickets/:id/urgency should return urgency data", async () => {
    const response = await request(app).get("/api/v1/tickets/1/urgency");
    expect(response.status).toBe(200);
    expect(response.body.data.urgencyScore).toBeDefined();
  });
});
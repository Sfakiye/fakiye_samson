import { calculateTicketUrgency } from "../src/api/v1/services/ticketService";

describe("calculateTicketUrgency", () => {
  it("should return urgencyScore 0 and resolved message for a resolved ticket", () => {
    const result = calculateTicketUrgency(7);
    expect(result?.urgencyScore).toBe(0);
    expect(result?.urgencyLevel).toBe("Minimal. Ticket resolved.");
  });

  it("should return undefined for a ticket that does not exist", () => {
    const result = calculateTicketUrgency(999);
    expect(result).toBeUndefined();
  });

  it("should calculate a critical urgency score correctly", () => {
    const result = calculateTicketUrgency(6);
    expect(result?.urgencyLevel).toBe("Critical. Immediate attention required.");
  });
});
import { calculateTicketUrgency, createTicket, TicketUrgency } from "../src/api/v1/services/ticketService";
import { Ticket } from "../src/api/v1/models/ticketModel";

describe("calculateTicketUrgency", () => {
  it("should return urgencyScore 0 and resolved message for a resolved ticket", () => {
    const result: TicketUrgency | undefined = calculateTicketUrgency(7);
    expect(result?.urgencyScore).toBe(0);
    expect(result?.urgencyLevel).toBe("Minimal. Ticket resolved.");
  });

  it("should return undefined for a ticket that does not exist", () => {
    const result: TicketUrgency | undefined = calculateTicketUrgency(999);
    expect(result).toBeUndefined();
  });

  it("should calculate a critical urgency score correctly", () => {
    const result: TicketUrgency | undefined = calculateTicketUrgency(6);
    expect(result?.urgencyLevel).toBe("Critical. Immediate attention required.");
  });

  it("should place a brand-new high priority ticket exactly on the moderate threshold", () => {
    const newTicket: Ticket = createTicket({
      title: "Threshold check",
      description: "Should score exactly 30",
      priority: "high",
    });
    const result: TicketUrgency | undefined = calculateTicketUrgency(newTicket.id);
    expect(result?.urgencyScore).toBe(30);
    expect(result?.urgencyLevel).toBe("Moderate. Schedule for attention.");
  });
});

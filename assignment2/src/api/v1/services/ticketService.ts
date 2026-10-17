import { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/ticketData";

export const getAllTickets = (): Ticket[] => {
  return tickets;
};

export const getTicketById = (id: number): Ticket | undefined => {
  return tickets.find((ticket) => ticket.id === id);
};

export const createTicket = (
  ticketInput: Pick<Ticket, "title" | "description" | "priority">
): Ticket => {
  const newId: number =
    tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1;

  const newTicket: Ticket = {
    id: newId,
    title: ticketInput.title,
    description: ticketInput.description,
    priority: ticketInput.priority,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  tickets.push(newTicket);
  return newTicket;
};

export const updateTicket = (
  id: number,
  updates: Partial<Pick<Ticket, "title" | "description" | "priority" | "status">>
): Ticket | undefined => {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return undefined;

  Object.assign(ticket, updates);
  return ticket;
};

export const deleteTicket = (id: number): boolean => {
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tickets.splice(index, 1);
  return true;
};

const BASE_URGENCY_SCORES: Record<Ticket["priority"], number> = {
  critical: 50,
  high: 30,
  medium: 20,
  low: 10,
};

export interface TicketUrgency {
  id: number;
  title: string;
  priority: Ticket["priority"];
  status: Ticket["status"];
  createdAt: string;
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}

export const calculateTicketUrgency = (id: number): TicketUrgency | undefined => {
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return undefined;

  const createdDate = new Date(ticket.createdAt);
  const now = new Date();
  const ticketAge: number = Math.floor(
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (ticket.status === "resolved") {
    return {
      id: ticket.id,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      ticketAge,
      urgencyScore: 0,
      urgencyLevel: "Minimal. Ticket resolved.",
    };
  }

  const urgencyScore: number = BASE_URGENCY_SCORES[ticket.priority] + ticketAge * 5;

  let urgencyLevel: string;
  if (urgencyScore < 30) {
    urgencyLevel = "Low urgency. Address when capacity allows.";
  } else if (urgencyScore < 55) {
    urgencyLevel = "Moderate. Schedule for attention.";
  } else if (urgencyScore < 80) {
    urgencyLevel = "High urgency. Prioritize resolution.";
  } else {
    urgencyLevel = "Critical. Immediate attention required.";
  }

  return {
    id: ticket.id,
    title: ticket.title,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
    ticketAge,
    urgencyScore,
    urgencyLevel,
  };
};
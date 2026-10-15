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
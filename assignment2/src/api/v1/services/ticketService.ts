import { Ticket } from "../models/ticketModel";
import { tickets } from "../../../data/ticketData";

export const getAllTickets = (): Ticket[] => {
  return tickets;
};

export const getTicketById = (id: number): Ticket | undefined => {
  return tickets.find((ticket) => ticket.id === id);
};
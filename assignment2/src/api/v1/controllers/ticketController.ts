import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { getAllTickets, getTicketById } from "../services/ticketService";

export const getTickets = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const tickets = getAllTickets();
    res.status(HTTP_STATUS.OK).json({
      message: "Tickets retrieved",
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicket = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id: number = Number(req.params.id);
    const ticket = getTicketById(id);

    if (!ticket) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ message: "Ticket retrieved", data: ticket });
  } catch (error) {
    next(error);
  }
};
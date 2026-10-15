import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../services/ticketService";

const VALID_PRIORITIES = ["critical", "high", "medium", "low"];
const VALID_STATUSES = ["open", "in-progress", "resolved"];

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

export const postTicket = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { title, description, priority } = req.body;

    if (!title) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: title" });
      return;
    }
    if (!description) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Missing required field: description" });
      return;
    }
    if (!priority || !VALID_PRIORITIES.includes(priority)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
      return;
    }

    const newTicket = createTicket({ title, description, priority });
    res.status(HTTP_STATUS.CREATED).json({ message: "Ticket created", data: newTicket });
  } catch (error) {
    next(error);
  }
};

export const putTicket = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id: number = Number(req.params.id);
    const { title, description, priority, status } = req.body;

    if (priority && !VALID_PRIORITIES.includes(priority)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid priority. Must be one of: critical, high, medium, low",
      });
      return;
    }
    if (status && !VALID_STATUSES.includes(status)) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Invalid status. Must be one of: open, in-progress, resolved",
      });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;

    const updated = updateTicket(id, updates);
    if (!updated) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ message: "Ticket updated", data: updated });
  } catch (error) {
    next(error);
  }
};

export const removeTicket = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const id: number = Number(req.params.id);
    const deleted = deleteTicket(id);

    if (!deleted) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({ message: "Ticket deleted" });
  } catch (error) {
    next(error);
  }
};
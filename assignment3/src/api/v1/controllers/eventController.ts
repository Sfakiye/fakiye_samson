import { Request, Response, NextFunction } from "express";
import * as eventService from "../services/eventService";
import { Event } from "../models/eventModel";
import { successResponse, messageResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const NOT_FOUND_MESSAGE: string = "Event not found";

export const getAllEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const events: Event[] = await eventService.getAllEvents();
        res.status(HTTP_STATUS.OK).json({
            message: "Events retrieved",
            count: events.length,
            data: events,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getEventById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = String(req.params.id);
        const event: Event | null = await eventService.getEventById(id);

        if (!event) {
            res.status(HTTP_STATUS.NOT_FOUND).json(messageResponse(NOT_FOUND_MESSAGE));
            return;
        }

        res.status(HTTP_STATUS.OK).json(successResponse(event, "Event retrieved"));
    } catch (error: unknown) {
        next(error);
    }
};

export const createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const event: Event = await eventService.createEvent(req.body);
        res.status(HTTP_STATUS.CREATED).json(successResponse(event, "Event created"));
    } catch (error: unknown) {
        next(error);
    }
};

export const updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = String(req.params.id);
        const event: Event | null = await eventService.updateEvent(id, req.body);

        if (!event) {
            res.status(HTTP_STATUS.NOT_FOUND).json(messageResponse(NOT_FOUND_MESSAGE));
            return;
        }

        res.status(HTTP_STATUS.OK).json(successResponse(event, "Event updated"));
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = String(req.params.id);
        const deleted: boolean = await eventService.deleteEvent(id);

        if (!deleted) {
            res.status(HTTP_STATUS.NOT_FOUND).json(messageResponse(NOT_FOUND_MESSAGE));
            return;
        }

        res.status(HTTP_STATUS.OK).json(messageResponse("Event deleted"));
    } catch (error: unknown) {
        next(error);
    }
};

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { messageResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json(messageResponse(err.message));
        return;
    }

    if (err instanceof SyntaxError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            messageResponse("Request body contains invalid JSON")
        );
        return;
    }

    const message: string = err instanceof Error ? err.message : "Unknown error";
    console.error(message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        messageResponse("An unexpected error occurred")
    );
};

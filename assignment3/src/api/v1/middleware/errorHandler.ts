import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import { errorResponse } from "../models/responseModel";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message });
        return;
    }

    if (err instanceof SyntaxError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json(
            errorResponse("Request body contains invalid JSON")
        );
        return;
    }

    const message: string = err instanceof Error ? err.message : "Unknown error";
    console.error(message);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
        errorResponse("An unexpected error occurred", "INTERNAL_SERVER_ERROR")
    );
};
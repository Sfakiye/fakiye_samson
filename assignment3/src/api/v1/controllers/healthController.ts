import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Handles GET /api/v1/health - reports that the server is running.
 * @param {Request} _req - The request object (unused).
 * @param {Response} res - The response object.
 * @returns {void}
 */
export const getHealth = (_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.OK).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
};
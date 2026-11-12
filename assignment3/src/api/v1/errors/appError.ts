import { HTTP_STATUS } from "../../../constants/httpConstants";

export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST) {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
    }
}
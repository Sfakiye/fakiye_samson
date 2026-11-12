import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { eventSchemas } from "../src/api/v1/validation/eventSchemas";
import { MiddlewareFunction } from "../src/api/v1/types/expressTypes";

describe("validateRequest middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = { body: {}, params: {}, query: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should call next and apply defaults for a valid create body", () => {
        mockReq.body = {
            name: "ABC",
            date: "2025-12-25T09:00:00.000Z",
            capacity: 100,
        };
        const middleware: MiddlewareFunction = validateRequest(eventSchemas.create);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockReq.body.status).toBe("active");
    });

    it("should return 400 with all validation messages for an invalid body", () => {
        mockReq.body = { name: "AB", capacity: 100 };
        const middleware: MiddlewareFunction = validateRequest(eventSchemas.create);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message:
                'Validation error: "name" length must be at least 3 characters long, "date" is required',
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
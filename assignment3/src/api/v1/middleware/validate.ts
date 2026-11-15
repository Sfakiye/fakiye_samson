import { Request, Response, NextFunction } from "express";
import { ObjectSchema, ValidationError, ValidationErrorItem } from "joi";
import { MiddlewareFunction } from "../types/expressTypes";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchemas {
    body?: ObjectSchema;
    params?: ObjectSchema;
    query?: ObjectSchema;
}

interface ValidationOptions {
    stripBody?: boolean;
    stripQuery?: boolean;
    stripParams?: boolean;
}

export const validateRequest = (
    schemas: RequestSchemas,
    options: ValidationOptions = {}
): MiddlewareFunction => {
    const settings: Required<ValidationOptions> = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options,
    };

    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const errors: string[] = [];

            const validatePart = (
                schema: ObjectSchema,
                data: unknown,
                shouldStrip: boolean
            ): unknown => {
                const result: { error?: ValidationError; value: unknown } =
                    schema.validate(data, {
                        abortEarly: false,
                        stripUnknown: shouldStrip,
                    });

                if (result.error) {
                    errors.push(
                        ...result.error.details.map(
                            (detail: ValidationErrorItem) => detail.message
                        )
                    );
                    return data;
                }
                return result.value;
            };

            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body ?? {},
                    settings.stripBody
                );
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    settings.stripParams
                ) as Request["params"];
            }

            if (schemas.query) {
                const validatedQuery: unknown = validatePart(
                    schemas.query,
                    req.query,
                    settings.stripQuery
                );
                Object.defineProperty(req, "query", {
                    value: validatedQuery,
                    writable: true,
                    configurable: true,
                });
            }

            if (errors.length > 0) {
                res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: `Validation error: ${errors.join(", ")}`,
                });
                return;
            }

            next();
        } catch (error: unknown) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: error instanceof Error ? error.message : "Invalid request",
            });
        }
    };
};
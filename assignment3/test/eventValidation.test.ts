import { ValidationResult } from "joi";
import { eventSchemas } from "../src/api/v1/validation/eventSchemas";

const EVENT_DATE: string = "2025-12-25T09:00:00.000Z";

describe("Event create validation schema", () => {
    it("should accept a valid event and apply default values", () => {
        const body: Record<string, unknown> = {
            name: "ABC",
            date: EVENT_DATE,
            capacity: 100,
        };

        const result: ValidationResult = eventSchemas.create.body.validate(body, {
            abortEarly: false,
        });

        expect(result.error).toBeUndefined();
        expect(result.value.registrationCount).toBe(0);
        expect(result.value.status).toBe("active");
        expect(result.value.category).toBe("general");
        expect(result.value.date).toBeInstanceOf(Date);
    });

    it("should reject a request with the required name missing", () => {
        const body: Record<string, unknown> = {
            date: EVENT_DATE,
            capacity: 200,
        };

        const result: ValidationResult = eventSchemas.create.body.validate(body, {
            abortEarly: false,
        });

        expect(result.error?.details[0].message).toBe('"name" is required');
    });

    it("should reject a capacity below the minimum", () => {
        const body: Record<string, unknown> = {
            name: "Small Event",
            date: EVENT_DATE,
            capacity: 4,
        };

        const result: ValidationResult = eventSchemas.create.body.validate(body, {
            abortEarly: false,
        });

        expect(result.error?.details[0].message).toBe(
            '"capacity" must be greater than or equal to 5'
        );
    });

    it("should reject a registrationCount greater than capacity", () => {
        const body: Record<string, unknown> = {
            name: "Overbooked Event",
            date: EVENT_DATE,
            capacity: 100,
            registrationCount: 150,
        };

        const result: ValidationResult = eventSchemas.create.body.validate(body, {
            abortEarly: false,
        });

        expect(result.error?.details[0].message).toBe(
            '"registrationCount" must be less than or equal to ref:capacity'
        );
    });

    it("should reject an invalid status value", () => {
        const body: Record<string, unknown> = {
            name: "Test Event",
            date: EVENT_DATE,
            capacity: 100,
            status: "pending",
        };

        const result: ValidationResult = eventSchemas.create.body.validate(body, {
            abortEarly: false,
        });

        expect(result.error?.details[0].message).toBe(
            '"status" must be one of [active, cancelled, completed]'
        );
    });
});
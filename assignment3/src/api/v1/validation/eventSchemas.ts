import Joi, { ObjectSchema } from "joi";
import { EVENT_CATEGORIES, EVENT_STATUSES } from "../models/eventModel";

interface EventSchemas {
    create: { body: ObjectSchema };
    getById: { params: ObjectSchema };
    update: { params: ObjectSchema; body: ObjectSchema };
    delete: { params: ObjectSchema };
}

const idParams: ObjectSchema = Joi.object({
    id: Joi.string().trim().required(),
});

export const eventSchemas: EventSchemas = {
    create: {
        body: Joi.object({
            name: Joi.string().trim().min(3).required(),
            date: Joi.date().iso().required(),
            capacity: Joi.number().integer().min(5).required(),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .max(Joi.ref("capacity"))
                .default(0),
            status: Joi.string()
                .valid(...EVENT_STATUSES)
                .default("active"),
            category: Joi.string()
                .valid(...EVENT_CATEGORIES)
                .default("general"),
        }),
    },

    getById: {
        params: idParams,
    },

    update: {
        params: idParams,
        body: Joi.object({
            name: Joi.string().trim().min(3),
            date: Joi.date().iso(),
            capacity: Joi.number().integer().min(5),
            registrationCount: Joi.number()
                .integer()
                .min(0)
                .when("capacity", {
                    is: Joi.exist(),
                    then: Joi.number().max(Joi.ref("capacity")),
                }),
            status: Joi.string().valid(...EVENT_STATUSES),
            category: Joi.string().valid(...EVENT_CATEGORIES),
        }).min(1),
    },

    delete: {
        params: idParams,
    },
};
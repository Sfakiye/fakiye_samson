import { Router } from "express";
import { validateRequest } from "../middleware/validate";
import * as eventController from "../controllers/eventController";
import { eventSchemas } from "../validation/eventSchemas";

const router: Router = Router();

router.get("/", eventController.getAllEvents);

router.get(
    "/:id",
    validateRequest(eventSchemas.getById),
    eventController.getEventById
);

router.post(
    "/",
    validateRequest(eventSchemas.create),
    eventController.createEvent
);

router.put(
    "/:id",
    validateRequest(eventSchemas.update),
    eventController.updateEvent
);

router.delete(
    "/:id",
    validateRequest(eventSchemas.delete),
    eventController.deleteEvent
);

export default router;
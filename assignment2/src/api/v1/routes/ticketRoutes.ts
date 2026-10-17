import { Router } from "express";
import {
  getTickets,
  getTicket,
  postTicket,
  putTicket,
  removeTicket,
  getTicketUrgency,
} from "../controllers/ticketController";

const router: Router = Router();

router.get("/", getTickets);
router.get("/:id/urgency", getTicketUrgency);
router.get("/:id", getTicket);
router.post("/", postTicket);
router.put("/:id", putTicket);
router.delete("/:id", removeTicket);

export default router;
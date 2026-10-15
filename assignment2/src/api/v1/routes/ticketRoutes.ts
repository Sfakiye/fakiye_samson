import { Router } from "express";
import {
  getTickets,
  getTicket,
  postTicket,
  putTicket,
  removeTicket,
} from "../controllers/ticketController";

const router: Router = Router();

router.get("/", getTickets);
router.get("/:id", getTicket);
router.post("/", postTicket);
router.put("/:id", putTicket);
router.delete("/:id", removeTicket);

export default router;
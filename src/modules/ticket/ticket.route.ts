import { Router } from "express";
import ticketController from "./ticket.controller";
import { verifyUserAdmin } from "../../middleware/verifyToken";

const router = Router();

router.post("/tickets", verifyUserAdmin, ticketController.create);
router.put("/tickets", verifyUserAdmin, ticketController.update);
router.get("/tickets", verifyUserAdmin, ticketController.getAll);
router.delete("/tickets/:id", verifyUserAdmin, ticketController.deleteOne);

export default router;

import { Router } from "express";
import cartController from "./cart.controller";
import { verifyUserAdmin } from "../../middleware/verifyToken";

const router = Router();

router.post("/carts", cartController.create);
router.put("/carts", verifyUserAdmin, cartController.update);
router.put("/carts/status", verifyUserAdmin, cartController.updateStatus);
router.get("/carts", verifyUserAdmin, cartController.getAll);
router.delete("/carts/:id", verifyUserAdmin, cartController.deleteOne);
router.get("/carts/:bookingId/:userCredential", cartController.getOne);

export default router;

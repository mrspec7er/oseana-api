import { Router } from "express";
import cartController from "./cart.controller";
import { verifyUserAdmin } from "../../middleware/verifyToken";

const router = Router();

router.post("/carts", verifyUserAdmin, cartController.create);
router.put("/carts", verifyUserAdmin, cartController.update);
router.get("/carts", verifyUserAdmin, cartController.getAll);
router.delete("/carts/:id", verifyUserAdmin, cartController.deleteOne);
router.get("/carts/:id", verifyUserAdmin, cartController.getOne);

export default router;
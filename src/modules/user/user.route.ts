import { Router } from "express";
import userController from "./user.controller";

const router = Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.post("/users/login", userController.login);
router.post("/users/token", userController.getAccessToken);
router.post("/users/verified", userController.verifiedUserEmail);

export default router;

import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authController.register);                             // Register route
router.post("/login", authController.login);                                   // Login route
router.get("/logout", verifyToken, authController.logout);                     // Logout route
router.post("/refresh-token", authController.refreshToken);                    // Refresh token route

export default router;
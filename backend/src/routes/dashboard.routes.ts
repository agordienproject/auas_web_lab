import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, (req, res) => {                    // Test route
    res.send("Hello from auth service");
});
router.post("/register", register);                             // Register route
router.post("/login", login);                                   // Login route
router.get("/logout", verifyToken, logout);                     // Logout route
router.post("/refresh-token", refreshToken);                    // Refresh token route

export default router;
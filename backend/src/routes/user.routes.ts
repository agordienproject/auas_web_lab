import { Router } from "express";
import { register, login, logout, validateAccount, resendValidationAccount, refreshToken } from "../controllers/auth.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, (req, res) => {                    // Route de test
    res.send("Hello from auth service");
});
router.post("/register", register);                             // Route de création de compte
router.get("/verify", validateAccount);                         // Route de validation de compte
router.post("/resend-validation", resendValidationAccount);      // Route de renvoi de mail de validation
router.post("/login", login);                                   // Route de connexion
router.get("/logout", verifyToken, logout);                     // Route de déconnexion 
router.post("/refresh-token", refreshToken);

export default router;
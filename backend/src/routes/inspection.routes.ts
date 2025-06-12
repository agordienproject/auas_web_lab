import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/user.middleware";
import { verifyUserInInspection } from "../middlewares/inspection.middleware";
import { getInspections, getInspection, createInspection, updateInspection, deleteInspection, validateInspection } from "../controllers/inspection.controller";

const router = Router();

router.get("/", verifyToken, getInspections);                                           // Route to get all inspections
router.get("/:id", verifyToken, getInspection);                                         // Route to get inspection by id
router.post("/", verifyToken, createInspection);                                        // Route to create inspection
router.put("/:id", verifyToken, verifyUserInInspection, updateInspection);              // Route to update inspection by id
router.put("/:id/validate", verifyToken, verifyRole, validateInspection);               // Route to validate inspection by id
router.delete("/:id", verifyToken, verifyRole, deleteInspection);                       // Route to delete inspection by id


export default router;
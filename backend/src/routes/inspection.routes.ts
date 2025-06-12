import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/user.middleware";
import { verifyUserInInspection } from "../middlewares/inspection.middleware";
import * as inspectionController from "../controllers/inspection.controller";

const router = Router();

router.get("/", verifyToken, inspectionController.getInspections);                                           // Route to get all inspections
router.get("/:id", verifyToken, inspectionController.getInspection);                                         // Route to get inspection by id
router.post("/", verifyToken, inspectionController.createInspection);                                        // Route to create inspection
router.put("/:id", verifyToken, verifyUserInInspection, inspectionController.updateInspection);              // Route to update inspection by id
router.put("/:id/validate", verifyToken, verifyRole, inspectionController.validateInspection);               // Route to validate inspection by id
router.delete("/:id", verifyToken, verifyRole, inspectionController.deleteInspection);                       // Route to delete inspection by id


export default router;
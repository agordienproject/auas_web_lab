import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/user.middleware";
import { verifyUserInInspection } from "../middlewares/inspection.middleware";
import * as inspectionController from "../controllers/inspection.controller";

const router = Router();
router.use(verifyToken);

// Classify routes for inspections
router.get("/", inspectionController.getInspections);                                           // Route to get all inspections
router.get("/:id", inspectionController.getInspection);                                         // Route to get inspection by id
router.post("/", inspectionController.createInspection);                                        // Route to create inspection
router.put("/:id", verifyUserInInspection, inspectionController.updateInspection);              // Route to update inspection by id
router.put("/:id/status", verifyRole, inspectionController.updateInspectionStatus);             // Route to update inspection status
router.delete("/:id", verifyRole, inspectionController.deleteInspection);                       // Route to delete inspection by id
router.get("/recent", inspectionController.getRecentInspections); // Route to get recent inspections

export default router;
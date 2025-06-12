import express from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { verifyRole } from "../middlewares/user.middleware";

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(verifyToken);

// Get all dashboard data in one call
router.get("/", dashboardController.getDashboardData);

// Individual endpoints for specific dashboard sections
router.get("/stats", dashboardController.getInspectionStats);
router.get("/pieces", dashboardController.getCurrentPieceStates);
router.get("/inspectors", dashboardController.getInspectorPerformance);
router.get("/trends", dashboardController.getDailyTrends);
router.get("/piece-history", dashboardController.getPieceHistory);
router.get("/piece-history/:ref_piece", dashboardController.getPieceHistory);

export default router;
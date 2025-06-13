import { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

const convertBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));
};

// Get overall dashboard data
export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const [
            inspectionStats,
            currentPieceStates,
            inspectorPerformance,
            dailyTrends,
            pieceHistory
        ] = await Promise.all([
            dashboardService.getInspectionStats(),
            dashboardService.getCurrentPieceStates(),
            dashboardService.getInspectorPerformance(),
            dashboardService.getDailyInspectionTrends(),
            dashboardService.getPieceHistorySummary()
        ]);

        res.status(200).json(convertBigIntToString({
            inspectionStats,
            currentPieceStates,
            inspectorPerformance,
            dailyTrends,
            pieceHistory
        }));
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};

// Get inspection statistics
export const getInspectionStats = async (req: Request, res: Response) => {
    try {
        const stats = await dashboardService.getInspectionStats();
        res.status(200).json(convertBigIntToString(stats));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch inspection statistics" });
    }
};

// Get current piece states
export const getCurrentPieceStates = async (req: Request, res: Response) => {
    try {
        const pieces = await dashboardService.getCurrentPieceStates();
        res.status(200).json(convertBigIntToString(pieces));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch current piece states" });
    }
};

// Get inspector performance
export const getInspectorPerformance = async (req: Request, res: Response) => {
    try {
        const performance = await dashboardService.getInspectorPerformance();
        res.status(200).json(convertBigIntToString(performance));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch inspector performance" });
    }
};

// Get daily inspection trends
export const getDailyTrends = async (req: Request, res: Response) => {
    try {
        const days = req.query.days ? parseInt(req.query.days as string) : 30;
        const trends = await dashboardService.getDailyInspectionTrends(days);
        res.status(200).json(convertBigIntToString(trends));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch daily trends" });
    }
};

// Get piece history summary
export const getPieceHistory = async (req: Request, res: Response) => {
    try {
        const ref_piece = req.params.ref_piece;
        if (ref_piece) {
            const history = await dashboardService.getPieceHistorySummaryByRef(ref_piece);
            res.status(200).json(convertBigIntToString(history));
        } else {
            const history = await dashboardService.getPieceHistorySummary();
            res.status(200).json(convertBigIntToString(history));
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch piece history" });
    }
};

// Controller to get validation time distribution
export const getValidationTimeDistribution = async (req: Request, res: Response) => {
    try {
        const from = typeof req.query.from === 'string' ? req.query.from : undefined;
        const to = typeof req.query.to === 'string' ? req.query.to : undefined;
        let groupBy = typeof req.query.groupBy === 'string' ? req.query.groupBy : undefined;
        if (typeof req.query.groupBy === 'string' && ['day','week','month','year'].includes(req.query.groupBy)) {
            groupBy = req.query.groupBy;
        }
        const data = await dashboardService.getValidationTimeDistribution(from, to, groupBy as 'day'|'week'|'month'|'year');
        res.status(200).json(convertBigIntToString(data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
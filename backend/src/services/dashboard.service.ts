import { prismaPSQL } from "../prisma/client_psql";

// Get overall inspection statistics
export const getInspectionStats = async () => {
    console.log("Getting inspection stats");
    console.log("Inspection stats: ", await prismaPSQL.vW_INSPECTION_STATS.findFirst());
    return await prismaPSQL.vW_INSPECTION_STATS.findFirst();
};
// Get current state of all pieces
export const getCurrentPieceStates = async () => {
    return await prismaPSQL.vW_PIECE_CURRENT_STATE.findMany();
};

// Get inspector performance metrics
export const getInspectorPerformance = async () => {
    return await prismaPSQL.vW_INSPECTOR_PERFORMANCE.findMany();
};

// Get daily inspection trends
export const getDailyInspectionTrends = async (days: number = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await prismaPSQL.vW_DAILY_INSPECTION_TRENDS.findMany({
        where: {
            inspection_day: {
                gte: startDate
            }
        },
        orderBy: {
            inspection_day: 'desc'
        }
    });
};

// Get piece history summary
export const getPieceHistorySummary = async () => {
    return await prismaPSQL.vW_PIECE_HISTORY_SUMMARY.findMany();
};

// Get piece history summary for a specific piece
export const getPieceHistorySummaryByRef = async (ref_piece: string) => {
    return await prismaPSQL.vW_PIECE_HISTORY_SUMMARY.findUnique({
        where: {
            ref_piece: ref_piece
        }
    });
}; 
import { Request, Response } from "express";
import { getAllInspections, getInspectionById, createInspectionInfos, updateInspectionById, validateInspectionById, deleteInspectionById, createHistoricalData } from "../services/inspection.service";

const convertBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));
};

// Function to get all inspections
export const getInspections = async (req: Request, res: Response) => {
    try {
        const response = await getAllInspections();
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to get inspection by id
export const getInspection = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const response = await getInspectionById(id);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to create inspection
export const createInspection = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const user_id = req.user.id;
        const response = await createInspectionInfos(data, user_id);
        // Create historical data after inspection creation
        await createHistoricalData(response.ref_piece, response, user_id);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to update inspection by id
export const updateInspection = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user_id = req.user.id;
        const response = await updateInspectionById(id, data, user_id);
        // Create historical data after inspection update
        await createHistoricalData(response.ref_piece, response, user_id);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to validate inspection by id
export const validateInspection = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user_id = req.user.id;
        const response = await validateInspectionById(id, user_id);
        // Create historical data after inspection validation
        await createHistoricalData(response.ref_piece, response, user_id);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to delete inspection by id
export const deleteInspection = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const user_id = req.user.id;
        const response = await deleteInspectionById(id, user_id);
        // Create historical data after inspection deletion
        await createHistoricalData(response.ref_piece, response, user_id);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}






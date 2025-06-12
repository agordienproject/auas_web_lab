import { Request, Response } from "express";
import { registerUser, getAllUsers, getUserInfosById, modifyUserInfosById, deleteUserById, modifyUserPasswordById, modifyUserRoleById } from "../services/user.service";

// Function to convert BigInt to String
const convertBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));
};

// Function to create user
export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        console.log("Data: ", data);
        const response = await registerUser(data);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to get all users information
export const getUsersInfos = async (req: Request, res: Response) => {
    try {
        const response = await getAllUsers();
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to get user information by id
export const getUserInfos = async (req: Request, res: Response) => {
    try {
        // Get user id from url
        const id = req.params.id;
        console.log("User id: ", id);
        const response = await getUserInfosById(id);
        console.log("User found");
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Function to modify user information by id
export const modifyUserInfos = async (req: Request, res: Response) => {
    try {
        // Get user id from url
        const id = req.params.id;
        const data = req.body;
        console.log("User id: ", id);
        const response = await modifyUserInfosById(id, data);
        console.log("User modified");
        console.log("Modification response: ", response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to modify user password by id
export const modifyUserPassword = async (req: Request, res: Response) => {
    try {
        // Get user id from url
        const id = req.params.id;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        console.log("User id: ", id);
        const response = await modifyUserPasswordById(id, oldPassword, newPassword);
        console.log("User password modified");
        console.log("Modification response: ", response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to modify user role by id
export const modifyUserRole = async (req: Request, res: Response) => {
    try {
        // Get user id from url
        const id = req.params.id;
        const data = req.body;
        console.log("User id: ", id);
        const response = await modifyUserRoleById(id, data.role);
        console.log("User role modified");
        console.log("Modification response: ", response);
        res.status(200).json(convertBigIntToString(response));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


// Function to delete user by id
export const deleteUser = async (req: Request, res: Response) => {
    try {
        // Get user id from url
        const id = req.params.id;
        console.log("User id: ", id);
        // Delete user
        await deleteUserById(id);
        console.log("User deleted");
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

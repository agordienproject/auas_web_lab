import { Request, Response } from "express";
import { registerUser, authenticateUser } from "../services/auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

const convertBigIntToString = (obj: any) => {
    return JSON.parse(JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
    ));
};

export const register = async (req: Request, res: Response) => {
    try {
        const response = await registerUser(req.body);
        console.log("Utilisateur enregistré");
        res.status(201).json(convertBigIntToString(response));
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        console.log("Lancement de la connexion");
        let response = await authenticateUser(req.body);
        response = convertBigIntToString(response);

        const isProduction = process.env.NODE_ENV === 'prod';
        
        // Placer le token dans les cookies
        res.cookie("token", response.token, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        // Rajouter l'ID de l'utilisateur dans le cookie
        res.cookie("userId", response.id_user, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        // Rajouter le rôle de l'utilisateur dans le cookie
        res.cookie("role", response.role, {
            maxAge: 3600000,
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax"
        });
        console.log("Cookies placés");
        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const logout = async (req: Request, res: Response) => {
    try {
        console.log("Déconnexion");
        // Supprimer le cookie
        res.clearCookie('token');
        
        // Dire que la personne est déconnectée
        res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const oldToken = req.cookies.token;
        
        if (!oldToken) {
            res.status(401).json({ error: 'No token provided' });
        }

        try {
            // Verify the old token
            const decoded = jwt.verify(oldToken, JWT_SECRET) as JwtPayload;
            
            // Generate new token
            const newToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Set the new token in cookies
            const isProduction = process.env.NODE_ENV === 'prod';
            res.cookie("token", newToken, {
                maxAge: 3600000,
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax"
            });

            res.status(200).json({
                message: "Token refreshed successfully",
                token: newToken
            });
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


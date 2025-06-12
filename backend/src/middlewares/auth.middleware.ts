import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        user?: string | JwtPayload;
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    console.log("Entée dans la fonction verifyToken");
    const token = req.cookies.token;
    console.log("Token: ", token);
    if (!token) {
        console.log("Token non trouvé");
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }
    console.log("Vérification du token");

    try {
        console.log("Décodage du token");
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        console.log("Token valide");
        next();
    } catch (error) {
        console.log("Token invalide");
        res.status(400).json({ error: 'Invalid token.' });
    }
};
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

export const ipFilter = (VALID_NGINX_IP: any) => (req: any, res: any, next: any) => {
    const nginxIp = req.headers["x-nginx-ip"] as string;  // IP de Nginx envoyée par Nginx lui-même
    const forwardedFor = req.headers["x-forwarded-for"];
    const clientIp = forwardedFor ? (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0]) : req.socket.remoteAddress;

    req.nginxIp = nginxIp || "";  // Stocke l'IP de Nginx
    req.clientIp = clientIp;  // Stocke l'IP du client final

    console.log(`Client IP: ${clientIp}, Nginx IP: ${nginxIp}`);

    // Vérification si la requête passe bien par Nginx
    if (VALID_NGINX_IP !== "all") {
        if (nginxIp !== VALID_NGINX_IP) {
            console.log("Accès interdit : la requête ne vient pas de Nginx !");
            return res.status(403).json({ error: "Forbidden: Bad Proxy" });
        }
    }
    next();
};
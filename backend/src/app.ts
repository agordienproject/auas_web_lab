import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { ipFilter } from "./middlewares/auth.middleware";
import cors from "cors";

const app = express();

const FRONT_END_URL = process.env.FRONTEND_URL || 'http://20.199.88.69:4000';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: FRONT_END_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));

// utiliser les cookies

declare global {
    namespace Express {
        interface Request {
            clientIp?: string;
            nginxIp?: string;
        }
    }
}

const VALID_NGINX_IP = process.env.VALID_IP || '127.0.0.1';
console.log(`Valid Nginx IP: ${VALID_NGINX_IP}`);

// Custom Middleware
app.use(ipFilter(VALID_NGINX_IP));

// Error handler
app.use((err, req, res, next) => {
    console.log('Error handler', err);
    res.status(err.status || 500);
    res.send("Something broke");
});

app.use("/", authRoutes);

export default app;
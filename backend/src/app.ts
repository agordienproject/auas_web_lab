import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import inspectionRoutes from "./routes/inspection.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import cors from "cors";

const app = express();

const FRONT_END_URL = process.env.FRONTEND_URL || 'http://127.0.0.1:4000';

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: FRONT_END_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));

app.use("/api/auth", authRoutes);
app.use("/api/inspections", inspectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboards", dashboardRoutes);


export default app;
import express, { Application } from "express";
import morgan from "morgan";
import healthRoutes from "./api/v1/routes/healthRoutes";
import ticketRoutes from "./api/v1/routes/ticketRoutes";

const app: Application = express();

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/tickets", ticketRoutes);

export default app;
import express, { Application } from "express";
import healthRoutes from "./api/v1/routes/healthRoutes";
import portfolioRoutes from "./api/v1/routes/portfolioRoutes";

const app: Application = express();

app.use(express.json());
app.use("/api/v1", healthRoutes);
app.use("/api/v1", portfolioRoutes);

export default app;
import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";

export function registerRoutes(app:Application, prefix="/api/profile") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Profile Server is healthy 🚀")
    })
    // app.use(`${prefix}`, userRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler);
}
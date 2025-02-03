import { Application } from "express";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { seekerRoutes } from "../../modules/seeker/seeker.routes";
import { companyRoutes } from "../../modules/company/company.routes";
import { followerRoutes } from "../../modules/follower/followers.routes";
import { followRequestRoutes } from "../../modules/follower copy/followrequest.routes";

export function registerRoutes(app:Application, prefix="/api/profile") {
    app.get(`${prefix}/health`, (req, res) => {
        res.json("Profile Server is healthy 🚀")
    })
    app.use(`${prefix}/seeker`, seekerRoutes);
    app.use(`${prefix}/company`, companyRoutes);
    app.use(`${prefix}/followers`, followerRoutes);
    app.use(`${prefix}/follow-request`, followRequestRoutes);
    app.use(notFoundHandler);
    app.use(errorHandler);
}
import { Router } from "express";
import { seekerProfileRoutes } from "./profile/seeker.profile.routes";

// base: /api/profile/seeker
const router = Router();

router.use('/', seekerProfileRoutes);

export const seekerRoutes = router;
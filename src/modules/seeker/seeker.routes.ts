import { Router } from "express";
import { seekerProfileRoutes } from "./profile/seeker.profile.routes";
import { seekerEducationRoutes } from "./education/seeker.education.routes";

// base: /api/profile/seeker
const router = Router();

router.use('/education', seekerEducationRoutes);
router.use('/', seekerProfileRoutes);

export const seekerRoutes = router;
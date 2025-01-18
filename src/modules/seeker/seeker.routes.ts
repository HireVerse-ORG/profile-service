import { Router } from "express";
import { seekerProfileRoutes } from "./profile/seeker.profile.routes";
import { seekerEducationRoutes } from "./education/seeker.education.routes";
import { seekerPortfolioRoutes } from "./portfolio/seeker.portfolio.routes";
import { seekerExperienceRoutes } from "./experience/seeker.experience.routes";

// base: /api/profile/seeker
const router = Router();

router.use('/experience', seekerExperienceRoutes);
router.use('/education', seekerEducationRoutes);
router.use('/portfolio', seekerPortfolioRoutes);
router.use('/', seekerProfileRoutes);

export const seekerRoutes = router;
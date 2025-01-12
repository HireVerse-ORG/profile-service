import { Router } from "express";
import { companyProfileRoutes } from "./profile/company.profile.routes";

// base: /api/profile/company
const router = Router();

router.use('/', companyProfileRoutes)

export const companyRoutes = router;
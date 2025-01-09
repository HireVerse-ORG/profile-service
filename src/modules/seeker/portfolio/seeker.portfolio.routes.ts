import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { SeekerPortfolioController } from "./seeker.portfolio.controller";

const controller = container.get<SeekerPortfolioController>(TYPES.SeekerPortfolioController);

// base: /api/profile/seeker/portfolio
const router = Router();

router.get('/', allowedRoles("seeker"), controller.listPortfolioForUser);
router.post('/', allowedRoles("seeker"), controller.createPortfolio);
router.put('/:id', allowedRoles("seeker"), controller.updatePortfolio);
router.delete('/:id', allowedRoles("seeker"), controller.deletePortfolio);

router.get('/:username', controller.listPortfolioForUsername);

export const seekerPortfolioRoutes = router;
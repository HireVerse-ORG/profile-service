import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { SeekerExperienceController } from "./seeker.experience.controller";

const controller = container.get<SeekerExperienceController>(TYPES.SeekerExperienceController);

// base: /api/profile/seeker/experience
const router = Router();

router.get('/', allowedRoles("seeker"), controller.listExperienceForUser);
router.post('/', allowedRoles("seeker"), controller.createExperience);
router.put('/:id', allowedRoles("seeker"), controller.updateExperience);
router.delete('/:id', allowedRoles("seeker"), controller.deleteExperience);

router.get('/:username', controller.listExperienceForUsername);

export const seekerExperienceRoutes = router;
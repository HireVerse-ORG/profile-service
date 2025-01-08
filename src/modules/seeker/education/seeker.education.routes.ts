import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { SeekerEducationController } from "./seeker.education.controller";

const controller = container.get<SeekerEducationController>(TYPES.SeekerEducationController);

// base: /api/profile/seeker/education
const router = Router();

router.get('/', allowedRoles("seeker"), controller.listEducationForUser);
router.post('/', allowedRoles("seeker"), controller.createEducation);
router.put('/:id', allowedRoles("seeker"), controller.updateEducation);
router.delete('/:id', allowedRoles("seeker"), controller.deleteEducation);

router.get('/:username', controller.listEducationForUsername);

export const seekerEducationRoutes = router;
import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { SeekerProfileController } from "./controllers/seeker.profile.controller";

const controller = container.get<SeekerProfileController>(TYPES.SeekerProfileController);

// base: /api/profile/seeker
const router = Router();

router.post("/", controller.createProfile);
router.get("/", allowedRoles("seeker"), controller.getProfile);
router.put("/", allowedRoles("seeker"), controller.updateProfile);
router.put("/skills", allowedRoles("seeker"), controller.updateProfileSkills);
router.delete("/skills/:id", allowedRoles("seeker"), controller.removeProfileSkill);

router.get("/username-exist/:username", controller.checkUsernameExist);
router.get("/:userName", controller.getProfileFromUsername);

export const seekerProfileRoutes = router;
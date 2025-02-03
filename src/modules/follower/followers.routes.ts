import { Router } from "express";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { FollowersController } from "./followers.controller";
import { allowedRoles } from "@hireverse/service-common/dist/token/user/userMiddleware";

const controller = container.get<FollowersController>(TYPES.FollowersController);

// base: /api/profile/followers
const router = Router();

router.get('/', allowedRoles("company", "seeker"), controller.getFollowers);
router.get('/:userId/count', allowedRoles("company", "seeker"), controller.getFollowersCount);
router.get('/isFollowing/:followedUserId', allowedRoles("company", "seeker"), controller.isFollowing);
router.delete('/:followedUserId', allowedRoles("company", "seeker"), controller.removeFollower);

export const followerRoutes = router;
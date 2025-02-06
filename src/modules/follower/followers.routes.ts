import { Router } from "express";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { FollowersController } from "./controllers/followers.controller";
import { allowedRoles } from "@hireverse/service-common/dist/token/user/userMiddleware";

const controller = container.get<FollowersController>(TYPES.FollowersController);

// base: /api/profile
const router = Router();

router.post('/follow-request', allowedRoles("company", "seeker"), controller.sendFollowRequest);
router.get('/follow-request', allowedRoles("company", "seeker"), controller.getMyFollowRequests);
router.get('/follow-request/count', allowedRoles("company", "seeker"), controller.getFollowRequestCount);
router.put('/follow-request/:id/accept', allowedRoles("company", "seeker"), controller.acceptRequest);
router.put('/follow-request/:id/reject', allowedRoles("company", "seeker"), controller.rejectRequest);

router.get('/followers/:userId/list', allowedRoles("company", "seeker"), controller.getFollowersList);
router.get('/followers/:userId/count', allowedRoles("company", "seeker"), controller.getFollowersCount);
router.get('/follow-details/:followedUserId', allowedRoles("company", "seeker"), controller.getFollowDetails);
router.delete('/follower/:followedUserId', allowedRoles("company", "seeker"), controller.removeFollower);

export const followerRoutes = router;
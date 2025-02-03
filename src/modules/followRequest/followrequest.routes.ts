import { Router } from "express";
import { container } from "../../core/container";
import TYPES from "../../core/container/container.types";
import { FollowRequestController } from "./followrequest.controller";
import { allowedRoles } from "@hireverse/service-common/dist/token/user/userMiddleware";

const controller = container.get<FollowRequestController>(TYPES.FollowRequestController);

// base: /api/profile/follow-request
const router = Router();

router.post("/", allowedRoles("seeker", "company"), controller.sendRequest);
router.get("/list", allowedRoles("seeker", "company"), controller.getListOfRequests);
router.get("/count", allowedRoles("seeker", "company"), controller.getRequestsCount);
router.put("/:id/accept", allowedRoles("seeker", "company"), controller.acceptRequest);
router.put("/:id/reject", allowedRoles("seeker", "company"), controller.rejectRequest);

export const followRequestRoutes = router;
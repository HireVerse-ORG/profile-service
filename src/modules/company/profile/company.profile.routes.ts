import { Router } from "express";
import { container } from "../../../core/container";
import TYPES from "../../../core/container/container.types";
import {allowedRoles} from "@hireverse/service-common/dist/token/user/userMiddleware";
import { CompanyProfileController } from "./controllers/company.profile.controller";

const controller = container.get<CompanyProfileController>(TYPES.CompanyProfileController);

// base: /api/profile/company
const router = Router();

router.post("/", allowedRoles("company"), controller.createProfile);
router.put("/", allowedRoles("company"), controller.updateProfile);
router.get("/", allowedRoles("company"), controller.getProfile);

router.put("/workplace-image", allowedRoles("company"), controller.addWorksplaceImage);
router.delete("/workplace-image", allowedRoles("company"), controller.removeWorksplaceImage);

router.get("/companyId-exist/:companyId", controller.checkCompanyIdExist);

router.put("/:companyId/accept", allowedRoles("admin"), controller.acceptCompany);
router.put("/:companyId/reject", allowedRoles("admin"), controller.rejectCompany);

router.get("/:companyId", controller.getProfileByCompanyId);

export const companyProfileRoutes = router;
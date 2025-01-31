import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { Request, Response } from 'express';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { BaseController } from "../../../../core/base.controller";
import { ICompanyProfileService } from "../interface/company.profile.service.interface";
import { CompanyProfileDTO, CompanySearchFilters, CreateCompanyProfileDTO, UpdateCompanyProfileDTO } from "../../dto/company.profile.dto";
import { CompanyProfileStatus } from "../company.profile.entity";

@injectable()
export class CompanyProfileController extends BaseController {
    @inject(containerTypes.CompanyProfileService) private companyProfileService!: ICompanyProfileService;

    /**
     * @route POST /api/profile/company
     * @scope Company
    **/
    public createProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const { name, companyType, email, industry,
            phone, bio, employeeCount, founded, image,
            location, socialLinks, website } = req.body as CreateCompanyProfileDTO;

        if (!name || !industry || !companyType || !email || !phone) {
            return res.status(400).json({
                message: "Missing required fields: name, industry, companyType, email, and phone are mandatory.",
            });
        }

        const profile = await this.companyProfileService.createProfile({
            userId, name, companyType, email, industry,
            phone, bio, employeeCount, founded, image, location, socialLinks, website
        });

        res.status(201).json({
            message: "Company profile created successfully.",
            profile,
        });
    });

    /**
     * @route PUT /api/profile/company
     * @scope Company
    **/
    public updateProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { name, companyType, email, industry,
            phone, bio, employeeCount, founded, image,
            location, socialLinks, website } = req.body as UpdateCompanyProfileDTO;
        const userid = req.payload!.userId;

        const profile = await this.companyProfileService.updateProfileByUserId(userid, {
            name, companyType, email, industry,
            phone, bio, employeeCount, founded, image, location, socialLinks, website
        });

        res.status(200).json({
            message: "Company profile updated successfully.",
            profile,
        });
    });

    /**
     * @route GET /api/profile/company
     * @scope Company
    **/
    public getProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userid = req.payload!.userId;

        const profile = await this.companyProfileService.getProfileByUserId(userid);

        if (!profile) {
            return res.status(404).json("Profile not found");
        }
        res.status(200).json(profile);
    });

    /**
     * @route GET /api/profile/company/:companyId
     * @scope Company
    **/
    public getProfileByCompanyId = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        const profile = await this.companyProfileService.getProfileByCompanyId(companyId);

        if (!profile) {
            return res.status(404).json("Profile not found");
        }
        res.status(200).json(profile);
    });

    /**
     * @route GET /api/profile/company/list?query=""&companyTypes=""&industries=""&country=""&city=""&place=""
     * @scope Public
    **/
    public listCompanies = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const query = req.query.query as string || undefined;

        const companyTypes = req.query.companyTypes ? (req.query.companyTypes as string).split(',') : [];
        const industries = req.query.industries ? (req.query.industries as string).split(',') : [];

        let location;

        if (req.query.country || req.query.city) {
            location = {
                country: req.query.country as string || undefined,
                city: req.query.city as string || undefined,
            };
        } else if (req.query.place) {
            location = req.query.place as string;
        }

        const filters: CompanySearchFilters = {
            query,
            companyTypes,
            industries,
            location,
            status: CompanyProfileStatus.VERIFIED
        };

        // Call the service method with filters
        const companies = await this.companyProfileService.listCompanies(page, limit, filters);

        res.status(200).json(companies);
    });



    /**
     * @route GET /api/profile/company/companyId-exist/:companyId?exclude=userid
     * @scope Public
    **/
    public checkCompanyIdExist = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        const { exclude } = req.query;
        let exist = false;

        if (exclude) {
            exist = await this.companyProfileService.profileExist(companyId, exclude.toString());
        } else {
            exist = await this.companyProfileService.profileExist(companyId);
        }
        return res.json({ exist })
    });

    /**
     * @route PUT /api/profile/company/workplace-image
     * @scope Company
    **/
    public addWorksplaceImage = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const { image } = req.body;
        await this.companyProfileService.addWorkplaceImage(image, userId);
        res.status(200).json({ message: "Worksplace image added sucesfully" });
    });

    /**
     * @route DELETE /api/profile/company/workplace-image
     * @scope Company
    **/
    public removeWorksplaceImage = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const { image } = req.body;
        await this.companyProfileService.removeWorkplaceImage(image, userId);
        res.status(200).json({ message: "Worksplace image removed sucesfully" });
    });

    // Admin Controllers
    /**
     * @route PUT /api/profile/company/admin/list?status="pending/rejected/verified"&page=1&limit=10
     * @scope Admin
    **/
    public listForAdmin = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { status } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        let validStatus: CompanyProfileStatus | undefined;
        if (status) {
            if (status === "pending") {
                validStatus = CompanyProfileStatus.PENDING;
            } else if (status === "rejected") {
                validStatus = CompanyProfileStatus.REJECTED;
            } else if (status === "verified") {
                validStatus = CompanyProfileStatus.VERIFIED;
            } else {
                validStatus
            }
        }
        const companies = await this.companyProfileService.listCompanies(page, limit, { status: validStatus })
        res.status(200).json(companies);
    });

    /**
     * @route PUT /api/profile/company:companyId/accept
     * @scope Admin
    **/
    public acceptCompany = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        await this.companyProfileService.acceptProfile(companyId);
        res.status(200).json({ message: "Profile accepted successfully" });
    });

    /**
     * @route PUT /api/profile/company:companyId/reject
     * @scope Admin
    **/
    public rejectCompany = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        await this.companyProfileService.rejectProfile(companyId);
        res.status(200).json({ message: "Profile accepted successfully" });
    });

}
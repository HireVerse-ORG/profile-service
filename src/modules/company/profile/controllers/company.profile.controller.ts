import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { Request, Response } from 'express';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { BaseController } from "../../../../core/base.controller";
import { ICompanyProfileService } from "../interface/company.profile.service.interface";
import { CompanyProfileDTO, CreateCompanyProfileDTO, UpdateCompanyProfileDTO } from "../../dto/company.profile.dto";

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
     * @scope Public
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
     * @route GET /api/profile/companyId-exist/:companyId?exclude=userid
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
     * @route PUT /api/profile/:companyId/accept
     * @scope Admin
    **/
    public acceptCompany = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        console.log(companyId);
        await this.companyProfileService.acceptProfile(companyId);
        res.status(200).json({ message: "Profile accepted successfully" });
    });

    /**
     * @route PUT /api/profile/:companyId/reject
     * @scope Admin
    **/
    public rejectCompany = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { companyId } = req.params
        await this.companyProfileService.rejectProfile(companyId);
        res.status(200).json({ message: "Profile accepted successfully" });
    });

}
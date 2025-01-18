import { inject, injectable } from "inversify";
import { BaseController } from "../../../core/base.controller";
import containerTypes from "../../../core/container/container.types";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { Request, Response } from 'express';
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { ISeekerProfileService } from "../profile/interface/seeker.profile.service.interface";
import { ISeekerExperienceService } from "./interface/seeker.experience.service.interface";
import { CreateSeekerExperienceDTO, SeekerExperienceDTO } from "../dto/seeker.experience.dto";
import { ICompanyProfileService } from "../../company/profile/interface/company.profile.service.interface";
import { CompanyProfileDTO } from "../../company/dto/company.profile.dto";

@injectable()
export class SeekerExperienceController extends BaseController {
    @inject(containerTypes.SeekerExperienceService) private service!: ISeekerExperienceService;
    @inject(containerTypes.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;
    @inject(containerTypes.CompanyProfileService) private companyProfileService!: ICompanyProfileService;

    /**
    * @route POST /api/profile/seeker/experience
    * @scope Seeker
    **/
    public createExperience = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const { title,
            startMonth, startYear,
            endMonth, endYear,
            currentlyWorking, location, description, company, employmentType } = req.body as CreateSeekerExperienceDTO;

        const profile = await this.seekerProfileService.getProfileByUserId(userId);

        if (!profile) {
            return res.status(404).json({ message: "You dont have profile" });
        }

        let Company: CompanyProfileDTO | null = null;
        if (company.companyId) {
            const fetchedCompany = await this.companyProfileService.getProfileById(
                company.companyId
            );
            if (!fetchedCompany || fetchedCompany.status === "rejected" || fetchedCompany.status === "pending") {
                return res.status(404).json({ message: "Invalid company profile ID" });
            }
            Company = fetchedCompany;
        }

        const newExperience = await this.service.createExperience({
            userId,
            profileId: profile.id,
            title,
            currentlyWorking,
            startMonth,
            startYear,
            endMonth,
            endYear,
            location,
            description,
            employmentType,
            company: company.companyId
                ? { companyId: company.companyId }
                : { name: company.name },
        });

        const responseExperience = {
            ...newExperience,
            company: Company
                ? {
                    companyId: Company.id,
                    name: Company.name,
                    image: Company.image || null,
                }
                : {
                    companyId: null,
                    name: company.name || "",
                    image: null,
                },
        };

        return res.status(201).json(responseExperience);
    });

    /**
    * @route PUT /api/profile/seeker/experience/:id
    * @scope Seeker
    **/
    public updateExperience = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const { title,
            startMonth, startYear,
            endMonth, endYear,
            employmentType,
            currentlyWorking, location, description, company } = req.body;
        
        
        const experienceExist = await this.service.getExperienceById(id);

        if(!experienceExist){
            return res.status(404).json({message: "Experience not forund"});
        }

        let Company: CompanyProfileDTO | null = null;
        if (company.companyId && experienceExist.company.companyId !== company.companyId) {
            const fetchedCompany = await this.companyProfileService.getProfileById(
                company.companyId
            );
            if (!fetchedCompany || fetchedCompany.status === "rejected" || fetchedCompany.status === "pending") {
                return res.status(404).json({ message: "Invalid company profile ID" });
            }
            Company = fetchedCompany;
        }


        const updatedExperience = await this.service.updateExperience(id, {
            title,
            employmentType,
            startMonth, startYear, endMonth, endYear, 
            currentlyWorking, location, description,
            company
        });

        if (!Company && updatedExperience.company.companyId) {
            const fetchedCompany = await this.companyProfileService.getProfileById(
                updatedExperience.company.companyId
            );
            if (!fetchedCompany || fetchedCompany.status === "rejected" || fetchedCompany.status === "pending") {
                return res.status(404).json({ message: "Invalid company profile ID" });
            }
            Company = fetchedCompany;
        }

        const responseExperience = {
            ...updatedExperience,
            company: Company
                ? {
                    companyId: Company.id,
                    name: Company.name,
                    image: Company.image || null,
                }
                : {
                    companyId: null,
                    name: company.name || "",
                    image: null,
                },
        };

        return res.json(responseExperience)
    });

    /**
    * @route PUT /api/profile/seeker/experience/:id
    * @scope Seeker
    **/
    public deleteExperience = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { id } = req.params;
        const deleted = await this.service.deleteExperience(id);
        return res.json({ deleted });
    });

    /**
    * @route GET /api/profile/seeker/experience
    * @scope Seeker
    **/
    public listExperienceForUser = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const experiences = await this.service.listExperiencesByUser(userId);
        const processedExperience = await this.processExperience(experiences);
        return res.json(processedExperience)
    });
    /**
    * @route GET /api/profile/seeker/experience/:username
    * @scope public
    **/
    public listExperienceForUsername = asyncWrapper(async (req: Request, res: Response) => {
        const { username } = req.params;
        const profile = await this.seekerProfileService.getProfileByUserName(username);
        if (!profile) {
            return res.status(404).json({ message: "You dont have profile" });
        }
        const experiences = await this.service.listExperiencesByPrfoile(profile.id);
        const peocessedExperience = await this.processExperience(experiences);
        return res.json(peocessedExperience)
    });

    private async processExperience(experiences: SeekerExperienceDTO[]) {
        const processedExperiences = await Promise.all(
            experiences.map(async (experience) => {
                if (experience.company?.companyId) {
                    const company = await this.companyProfileService.getProfileById(
                        experience.company.companyId
                    );
                    return {
                        ...experience,
                        company: {
                            companyId: company?.id,
                            name: company?.name,
                            image: company?.image || null,
                        },
                    };
                } else {
                    return {
                        ...experience,
                        company: {
                            companyId: null,
                            name: experience.company.name || "",
                            image: null,
                        },
                    };
                }
            })
        );

        return processedExperiences;
    }
}
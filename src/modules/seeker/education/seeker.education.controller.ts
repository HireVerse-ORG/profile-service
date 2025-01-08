import { inject, injectable } from "inversify";
import { BaseController } from "../../../core/base.controller";
import containerTypes from "../../../core/container/container.types";
import { ISeekerEducationService } from "./interface/seeker.education.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { Request, Response } from 'express';
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { ISeekerProfileService } from "../profile/interface/seeker.profile.service.interface";

@injectable()
export class SeekerEducationController extends BaseController {
    @inject(containerTypes.SeekerEducationService) private service!: ISeekerEducationService;
    @inject(containerTypes.SeekerProfileService) private profileService!: ISeekerProfileService;

    /**
    * @route POST /api/profile/seeker/education
    * @scope Seeker
    **/
    public createEducation = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const { school, fieldOfStudy,
            startMonth, startYear,
            endMonth, endYear,
            currentlyPursuing, location, description } = req.body;
        
        const profile = await this.profileService.getProfileByUserId(userId);

        if(!profile){
            return res.status(404).json({message: "You dont have profile"});
        }

        const education = await this.service.createEducation({ userId, profileId: profile.id, school, fieldOfStudy,
                 startMonth, startYear, endMonth, endYear, currentlyPursuing, location, description });
        return res.status(201).json(education)
    });

    /**
    * @route PUT /api/profile/seeker/education/:id
    * @scope Seeker
    **/
    public updateEducation = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {id} = req.params;
        const { school, fieldOfStudy,
            startMonth, startYear,
            endMonth, endYear,
            currentlyPursuing, location, description } = req.body;

        const education = await this.service.updateEducation(id, {school, fieldOfStudy,
                 startMonth, startYear, endMonth, endYear, currentlyPursuing, location, description });
        return res.json(education)
    });

    /**
    * @route PUT /api/profile/seeker/education/:id
    * @scope Seeker
    **/
    public deleteEducation = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {id} = req.params;
        const deleted = await this.service.deleteEducation(id);
        return res.json({deleted});
    });

    /**
    * @route GET /api/profile/seeker/education
    * @scope Seeker
    **/
    public listEducationForUser = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const education = await this.service.listEducationsByUser(userId);
        return res.json(education)
    });
    /**
    * @route GET /api/profile/seeker/education/:username
    * @scope public
    **/
    public listEducationForUsername = asyncWrapper(async (req: Request, res: Response) => {
        const {username} = req.params;
        const profile = await this.profileService.getProfileByUserName(username);
        if(!profile){
            return res.status(404).json({message: "You dont have profile"});
        }
        const education = await this.service.listEducationsByPrfoile(profile.id);
        return res.json(education)
    });
}
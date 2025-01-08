import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerProfileService } from "../interface/seeker.profile.service.interface";
import { Request, Response } from 'express';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { BaseController } from "../../../../core/base.controller";

@injectable()
export class SeekerProfileController extends BaseController {
    @inject(containerTypes.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;

    /**
    * @route Post /api/profile/seeker
    * @scope Public
    **/
    public createProfile = asyncWrapper(async (req: Request, res: Response) => {
        let { profileName, userId, profileUsername } = req.body;
        if (!profileUsername) {
            profileUsername = await this.seekerProfileService.generateUniqueProfileUsername(profileName);
        }
        await this.seekerProfileService.createProfile({profileName, userId, profileUsername})
        return res.sendStatus(201)
    });

    /**
    * @route GET /api/profile/seeker?field=bio/profile/username
    * @scope Seeker
    **/
    public getProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const { field } = req.query;
        const userid = req.payload!.userId;
        const profile = await this.seekerProfileService.getProfileByUserId(userid);
        if (field === "bio") {
            return res.json(profile?.bio);
        } else if (field === "username") {
            return res.json(profile?.profileUsername);
        }
        return res.json(profile);
    });

    /**
    * @route GET /api/profile/seeker/:userName?field=bio/profile/username
    * @scope Public
    **/
    public getProfileFromUsername = asyncWrapper(async (req: Request, res: Response) => {
        const {userName} = req.params;
        const { field } = req.query;

        const profile = await this.seekerProfileService.getProfileByUserName(userName);
        if (field === "bio") {
            return res.json(profile?.bio);
        } else if (field === "username") {
            return res.json(profile?.profileUsername);
        }
        return res.json(profile);
    });

    /**
    * @route PUT /api/profile/seeker
    * @scope Seeker
    **/
    public updateProfile = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const {profileName, title, location, isOpenToWork, bio, profileUsername, image, coverImage} = req.body
        const userid = req.payload!.userId;
        const profile = await this.seekerProfileService.updateProfileByUserId(userid, {profileName, title, location, isOpenToWork, bio, profileUsername, image, coverImage });
        return res.json(profile);
    });

    /**
    * @route GET /api/profile/seeker/username-exist/:username?exclude=userid
    * @scope Public
    **/
    public checkUsernameExist = asyncWrapper(async (req: Request, res: Response) => {
        const {username} = req.params;
        const {exclude} = req.query;
        let exist = false;

        if(exclude){
            exist = await this.seekerProfileService.usernameExist(username, exclude.toString());
        } else {
            exist = await this.seekerProfileService.usernameExist(username);
        } 
        return res.json({exist})
    })
}
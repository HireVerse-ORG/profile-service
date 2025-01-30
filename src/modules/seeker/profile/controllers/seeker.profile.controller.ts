import { inject, injectable } from "inversify";
import containerTypes from "../../../../core/container/container.types";
import { ISeekerProfileService } from "../interface/seeker.profile.service.interface";
import { Request, Response } from 'express';
import { AuthRequest } from '@hireverse/service-common/dist/token/user/userRequest';
import asyncWrapper from '@hireverse/service-common/dist/utils/asyncWrapper';
import { BaseController } from "../../../../core/base.controller";
import { IJobSkillService } from "../../../external/job/skill.service.interface";

@injectable()
export class SeekerProfileController extends BaseController {
    @inject(containerTypes.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;
    @inject(containerTypes.JobSkillService) private jobSkillService!: IJobSkillService;

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
    * @route GET /api/profile/seeker?field=[bio/profile/username/skills]
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
        } else if(field === "skills"){
            let Skills = [];
            if(profile && profile.skills.length > 0){
                try {
                    Skills = (await this.jobSkillService.getSkillFromIds(profile.skills)).message?.skills;
                } catch (error) {
                    Skills = []
                }
            }
            return res.json(Skills);
        }
        return res.json(profile);
    });

    /**
    * @route GET /api/profile/seeker/:userName?field=[bio/profile/username/skills]
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
        } else if(field === "skills"){
            let Skills = [];
            if(profile && profile.skills.length > 0){
                try {
                    Skills = (await this.jobSkillService.getSkillFromIds(profile.skills)).message?.skills;
                } catch (error) {
                    Skills = []
                }
            }
            return res.json(Skills);
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
    * @route PUT /api/profile/seeker/skills
    * @scope Seeker
    **/
    public updateProfileSkills = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userid = req.payload!.userId;
        const {skill} = req.body;
        try {
            let fetchedSkill = (await this.jobSkillService.getSkillFromName(skill)).message?.skill;
            if(!fetchedSkill){
                fetchedSkill = (await this.jobSkillService.createSkill(skill, true)).message?.skill;
            }
            const status = await this.seekerProfileService.addSkill(fetchedSkill.id, userid);
            return res.json({skill: fetchedSkill, status});
        } catch (error) {
            return res.status(400).json({message: "Failed to update skills"});
        }
    });

    /**
    * @route DELETE /api/profile/seeker/skills/:id
    * @scope Seeker
    **/
    public removeProfileSkill = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userid = req.payload!.userId;
        const {id} = req.params;
        const status = await this.seekerProfileService.removeSkill(id, userid);
        console.log({status});
        res.json(status);
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
import { inject, injectable } from "inversify";
import TYPES from "../../../core/container/container.types";
import { IFollowersService } from "../interfaces/followers.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { FollowRequestStatus } from "../followers.entity";
import { ISeekerProfileService } from "../../seeker/profile/interface/seeker.profile.service.interface";
import { ICompanyProfileService } from "../../company/profile/interface/company.profile.service.interface";
import { EventService } from "../../event/event.service";

@injectable()
export class FollowersController {
    @inject(TYPES.FollowersService) private followersService!: IFollowersService;
    @inject(TYPES.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;
    @inject(TYPES.CompanyProfileService) private companyProfileService!: ICompanyProfileService;
    @inject(TYPES.EventService) private eventService!: EventService;

    /**
    * @route POST /api/profile/follow-request
    * @scope Private
    **/
    public sendFollowRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const followerId = req.payload!.userId;
        const followerUserType = req.payload!.role;
        const followedUserId = req.body.followedUserId as string;
        const followedUserType = req.body.followedUserType;

        const request = await this.followersService.follow({ followerId, followedUserId, followedUserType, followerUserType })
        await this.eventService.followRequestedEvent({
            requestId: request.id,
            followerId,
            followerUserType,
            followedUserId,
            followedUserType,
            timestamp: request.createdAt
        })
        return res.json(request)
    });

    /**
    * @route GET /api/profile/followers/:followerId/list?page=&limit&status
    * @scope Private
    **/
    public getFollowersList = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload?.userId!;
        const followedUserId = req.params.userId;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const query = req.query.query ? req.query.query as string : undefined;

        const followers = await this.followersService.getFollowers({
            followerId: userId,
            followedUserId, 
            checkMutual: true,
            page, 
            limit,
            query 
        });

        return res.json(followers)
    });

    /**
    * @route GET /api/profile/follow-request?page=&limit
    * @scope Private
    **/
    public getMyFollowRequests = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const followedUserId = req.payload?.userId!;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

        const followers = await this.followersService.getFollowRequests(followedUserId, page, limit);

        const followersWithProfiles = await Promise.all(
            followers.data.map(async (data) => {
                let followedUserProfile = null;
                if (data.followerUserType === "seeker") {
                    const profile = await this.seekerProfileService.getProfileByUserId(data.followerId);
                    if (profile) {
                        followedUserProfile = {
                            id: profile.id,
                            name: profile.profileName,
                            type: data.followerUserType,
                            publicId: profile.profileUsername,
                            image: profile.image,
                        }
                    }
                } else if (data.followerUserType === "company") {
                    const profile = await this.companyProfileService.getProfileByUserId(data.followerId);
                    if (profile) {
                        followedUserProfile = {
                            id: profile.id,
                            name: profile.name,
                            type: data.followerUserType,
                            publicId: profile.companyId,
                            image: profile.image,
                        }
                    }
                }
                return { ...data, followedUserProfile };
            })
        );

        return res.json({ ...followers, data: followersWithProfiles })
    });

    /**
    * @route PUT /api/profile/follow-request/:id/accept
    * @scope Private
    **/
    public acceptRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const requestId = req.params.id;
        const request = await this.followersService.changeStatus(requestId, FollowRequestStatus.Accepted);
        await this.eventService.followRequestAcceptedEvent({
            requestId: request.id,
            followerId: request.followerId,
            followerUserType: request.followerUserType,
            followedUserId: request.followedUserId,
            followedUserType: request.followedUserType,
            timestamp: request.updatedAt
        })
        return res.json(request)
    });

    /**
    * @route PUT /api/profile/follow-request/:id/reject
    * @scope Private
    **/
    public rejectRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const requestId = req.params.id;
        const request = await this.followersService.changeStatus(requestId, FollowRequestStatus.Rejected);
        return res.json(request)
    });

    /**
    * @route GET /api/profile/follow-request/count
    * @scope Private
    **/
    public getFollowRequestCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const followedUserId = req.payload?.userId!;
        const count = await this.followersService.getUserFollowRequestCount(followedUserId);
        return res.json({ count })
    });

    /**
    * @route GET /api/profile/followers/:userId/count
    * @scope Private
    **/
    public getFollowersCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.params.userId;
        const count = await this.followersService.getUserFollowerCount(userId);
        return res.json({ count })
    });

    /**
    * @route GET /api/profile/follow-details/:followedUserId
    * @scope Private
    **/
    public getFollowDetails = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const followedUserId = req.params.followedUserId;
        const followDetails = await this.followersService.getFollowDetails(userId, followedUserId);
        return res.json({ followDetails })
    });

    /**
    * @route DELETE /api/profile/follower/:followedUserId
    * @scope Private
    **/
    public removeFollower = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const followedUserId = req.params.followedUserId;
        await this.followersService.unfollow({ followerId: userId, followedUserId: followedUserId });
        return res.sendStatus(200);
    });
}
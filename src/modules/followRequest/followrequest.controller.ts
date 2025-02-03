import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";
import { IFollowRequestService } from "./interfaces/followrequest.service.interface";
import { FollowRequestStatus } from "./followrequest.entity";
import { IFollowersService } from "../follower/interfaces/followers.service.interface";
import { EventService } from "../../event/event.service";
import { ICompanyProfileService } from "../company/profile/interface/company.profile.service.interface";
import { ISeekerProfileService } from "../seeker/profile/interface/seeker.profile.service.interface";

@injectable()
export class FollowRequestController {
    @inject(TYPES.FollowRequestService) private followRequestService!: IFollowRequestService;
    @inject(TYPES.FollowersService) private followersService!: IFollowersService;
    @inject(TYPES.SeekerProfileService) private seekerProfileService!: ISeekerProfileService;
    @inject(TYPES.CompanyProfileService) private companyProfileService!: ICompanyProfileService;
    @inject(TYPES.EventService) private eventService!: EventService;

    /**
    * @route POST /api/profile/follow-request
    * @scope Private
    **/
    public sendRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const requesterType = req.payload!.role;
        const targetUserId = req.body.targetUserId as string;
        const targetUserType = req.body.targetUserType;

        const request = await this.followRequestService.sendFollowRequest({ requesterId: userId, targetUserId, requesterType, targetUserType })
        await this.eventService.followRequestedEvent({
            requestId: request.id,
            requesterId: request.requesterId,
            requesterType: request.requesterType,
            targetUserId: request.targetUserId,
            targetUserType: request.targetUserType,
            timestamp: request.createdAt
        })
        return res.json(request)
    });

    /**
    * @route PUT /api/profile/follow-request/:id/accept
    * @scope Private
    **/
    public acceptRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const requestId = req.params.id;
        const request = await this.followRequestService.updateFollowRequest({ requestId, status: FollowRequestStatus.Accepted });
        await this.followersService.follow({
            followerId: request.requesterId,
            followedUserId: request.targetUserId,
            followedUserType: request.requesterType,
            followerUserType: request.targetUserType
        });
        await this.eventService.followRequestedEvent({
            requestId: request.id,
            requesterId: request.requesterId,
            requesterType: request.requesterType,
            targetUserId: request.targetUserId,
            targetUserType: request.targetUserType,
            timestamp: request.createdAt
        })
        return res.json(request)
    });

    /**
    * @route PUT /api/profile/follow-request/:id/reject
    * @scope Private
    **/
    public rejectRequest = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const requestId = req.params.id;
        const request = await this.followRequestService.updateFollowRequest({ requestId, status: FollowRequestStatus.Rejected });
        return res.json(request)
    });

    /**
    * @route GET /api/profile/follow-request/count?status=
    * @scope Private
    **/
    public getRequestsCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const status = req.query.status ? req.query.status as FollowRequestStatus : undefined;
        const count = await this.followRequestService.getUserRequestCount(userId, status);
        return res.json({count});
    });

    /**
    * @route GET /api/profile/follow-request/list?status=''&page=''&limit=''
    * @scope Private
    **/
    public getListOfRequests = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const status = req.query.status ? req.query.status as FollowRequestStatus : undefined;
        const requests = await this.followRequestService.getFollowRequests(userId, page, limit, status);

        const requestsWithProfiles = await Promise.all(
            requests.data.map(async (data) => {
                let targetProfile = null;
                if (data.targetUserType === "seeker") {
                    const profile = await this.seekerProfileService.getProfileByUserId(data.targetUserId);
                    if (profile) {
                        targetProfile = {
                            id: profile.id,
                            name: profile.profileName,
                            type: data.targetUserType,
                            uniqueid: profile.profileUsername,
                            image: profile.image,
                        }
                    }
                } else if (data.targetUserType === "company") {
                    const profile = await this.companyProfileService.getProfileByUserId(data.targetUserId);
                    if (profile) {
                        targetProfile = {
                            id: profile.id,
                            name: profile.name,
                            type: data.targetUserType,
                            uniqueid: profile.companyId,
                            image: profile.image,
                        }
                    }
                }
                return { ...data, targetProfile };
            })
        );

        return res.json({ ...requests, data: requestsWithProfiles });
    });

}
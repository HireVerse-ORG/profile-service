import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IFollowersService } from "./interfaces/followers.service.interface";
import asyncWrapper from "@hireverse/service-common/dist/utils/asyncWrapper";
import { AuthRequest } from "@hireverse/service-common/dist/token/user/userRequest";
import { Response } from "express";

@injectable()
export class FollowersController {
    @inject(TYPES.FollowersService) private followersService!: IFollowersService;

    /**
    * @route GET /api/profile/followers?page=&limit
    * @scope Private
    **/
    public getFollowers = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const followers = await this.followersService.getFollowers(userId, page, limit)
        return res.json(followers)
    });

    /**
    * @route GET /api/profile/followers/:userId/count
    * @scope Private
    **/
    public getFollowersCount = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.params.userId;
        const count = await this.followersService.getUserFollowerCount(userId);
        return res.json({count})
    });


    /**
    * @route GET /api/profile/followers/isFollowing/:followedUserId
    * @scope Private
    **/
    public isFollowing = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const followedUserId = req.params.followedUserId;
        const isFollowing = await this.followersService.isFollowing(userId, followedUserId);
        return res.json({isFollowing})
    });

    /**
    * @route DELETE /api/profile/followers/:followedUserId
    * @scope Private
    **/
    public removeFollower = asyncWrapper(async (req: AuthRequest, res: Response) => {
        const userId = req.payload!.userId;
        const followedUserId = req.params.followedUserId;
        await this.followersService.unfollow({followerId: userId, followedUserId: followedUserId});
        return res.sendStatus(200);
    });
}
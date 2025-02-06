import { inject, injectable } from "inversify";
import { grpcWrapper } from "../../../core/utils/grpcWrapper";
import TYPES from "../../../core/container/container.types";
import { IFollowersService } from "../interfaces/followers.service.interface";

@injectable()
export class FollowersGrpcController {
    @inject(TYPES.FollowersService) private followersService!: IFollowersService;

    public getProcedures() {
        return {
            CheckIsFollowing: this.checkisFollowing.bind(this),
        }
    }

    private checkisFollowing = grpcWrapper(async (call: any, callback: any) => {
        let { followerId, followingId } = call.request;

        const isFollowing = await this.followersService.isFollowing(followerId, followingId);
        callback(null, {isFollowing})
    })
}
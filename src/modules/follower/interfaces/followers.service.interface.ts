import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FollowersDto, FollowRequestDto, UnfollowRequestDto } from "../dto/followers.dto";

export interface IFollowersService {
  follow(dto: FollowRequestDto): Promise<FollowersDto>;
  unfollow(dto: UnfollowRequestDto): Promise<void>;
  isFollowing(followerId: string, followedUserId: string): Promise<boolean>;
  getFollowers(userId: string, page: number, limit: number): Promise<IPaginationResponse<FollowersDto>>;
  getUserFollowerCount(userId: string): Promise<number>
}

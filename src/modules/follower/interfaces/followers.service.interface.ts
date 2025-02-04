import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FollowersDto, FollowRequestDto, UnfollowRequestDto } from "../dto/followers.dto";
import { FollowRequestStatus } from "../followers.entity";

export interface IFollowersService {
  follow(dto: FollowRequestDto): Promise<FollowersDto>;
  unfollow(dto: UnfollowRequestDto): Promise<void>;
  isFollowing(followerId: string, followedUserId: string): Promise<boolean>;
  getFollowDetails(followerId: string, followedUserId: string): Promise<FollowersDto | null>;
  getFollowers(followerId: string, page: number, limit: number, status?: FollowRequestStatus): Promise<IPaginationResponse<FollowersDto>>;
  getFollowRequests(followedUserId: string, page: number, limit: number): Promise<IPaginationResponse<FollowersDto>>;
  getUserFollowerCount(followedUserId: string): Promise<number>;
  getUserFollowRequestCount(followedUserId: string): Promise<number>;
  changeStatus(id: string, status: FollowRequestStatus): Promise<FollowersDto>;
}

import { UserRole } from "@hireverse/service-common/dist/token/user/userPayload";
import { FollowRequestStatus } from "../followers.entity";

export interface FollowRequestDto {
    followerId: string,
    followerUserType: UserRole;
    followedUserId: string;
    followedUserType: UserRole;
}

export interface UnfollowRequestDto {
    followerId: string,
    followedUserId: string;
}

export interface FollowersDto {
    id: string;
    followerId: string,
    followerUserType: UserRole;
    followedUserId: string;
    followedUserType: UserRole;
    requestStatus: FollowRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

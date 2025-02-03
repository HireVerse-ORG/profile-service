import { UserRole } from "@hireverse/service-common/dist/token/user/userPayload";

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
    createdAt: Date;
    updatedAt: Date;
}

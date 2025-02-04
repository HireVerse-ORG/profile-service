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

export interface FindFollowersFilter {
    followedUserId: string;
    followerId: string; 
    checkMutual: boolean;
    query?:string;
    page: number; 
    limit: number; 
}

export interface FindFollowerDTO {
    followId: string;
    name: string,
    title: string,
    image: string,
    userType: string,
    userId: string,
    publicId: string,
    isMutual: string, 
}
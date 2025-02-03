import { UserRole } from "@hireverse/service-common/dist/token/user/userPayload";
import { FollowRequestStatus } from "../followrequest.entity";

export interface SendFollowRequestDto {
    requesterId: string;
    requesterType: UserRole;
    targetUserId: string;
    targetUserType: UserRole;
}

export interface UpdateFollowRequestDto {
    requestId: string;
    status: FollowRequestStatus;
}

export interface FollowRequestDto {
    id: string;
    requesterId: string;
    requesterType: UserRole;
    targetUserId: string;
    targetUserType: UserRole;
    status: FollowRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}
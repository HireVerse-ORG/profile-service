import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FollowRequestDto, SendFollowRequestDto, UpdateFollowRequestDto } from "../dto/followrequest.dto";
import { FollowRequestStatus } from "../followrequest.entity";

export interface IFollowRequestService {
    sendFollowRequest(dto: SendFollowRequestDto): Promise<FollowRequestDto>;
    updateFollowRequest(dto: UpdateFollowRequestDto): Promise<FollowRequestDto>;
    getFollowRequests(userId: string, page: number, limit: number, status?: FollowRequestStatus): Promise<IPaginationResponse<FollowRequestDto>>;
    getUserRequestCount(userId: string, status?: FollowRequestStatus): Promise<number>;
    cancelFollowRequest(requestId: string): Promise<void>;
}

import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IFollowRequestService } from "./interfaces/followrequest.service.interface";
import { IFollowRequestRepository } from "./interfaces/followrequest.repository.interface";
import { SendFollowRequestDto, FollowRequestDto, UpdateFollowRequestDto } from "./dto/followrequest.dto";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { FollowRequestStatus, IFollowRequest } from "./followrequest.entity";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FilterQuery } from "mongoose";

@injectable()
export class FollowRequestService implements IFollowRequestService {
    @inject(TYPES.FollowRequestRepository) private repo!: IFollowRequestRepository;

    async sendFollowRequest(dto: SendFollowRequestDto): Promise<FollowRequestDto> {
        const existingRequest = await this.repo.findOne({
            requesterId: dto.requesterId,
            targetUserId: dto.targetUserId
        });
        
        if (existingRequest) {
            if (existingRequest.status === FollowRequestStatus.Rejected) {
                const updated = await this.repo.update(existingRequest.id, { status: FollowRequestStatus.Pending });
                if(!updated){
                    throw new BadRequestError("Failed to update follow request");
                }
                return this.toDTO(updated);
            } else {
                throw new BadRequestError("A follow request is already in progress or has been accepted.");
            }
        }
        
        const request = await this.repo.create(dto);
        return this.toDTO(request);
        
    }

    async updateFollowRequest(dto: UpdateFollowRequestDto): Promise<FollowRequestDto> {
        if (!await this.repo.findById(dto.requestId)) {
            throw new NotFoundError("Request not found");
        }

        const updated = await this.repo.update(dto.requestId, {status: dto.status});

        if(!updated){
            throw new BadRequestError("Failed to update request");
        }

        return this.toDTO(updated);
    }

    async getFollowRequests(userId: string, page: number, limit: number, status?: FollowRequestStatus): Promise<IPaginationResponse<FollowRequestDto>> {
        const filterQuery:FilterQuery<IFollowRequest> = {requesterId: userId};
        if(status){
            filterQuery.status = status;
        } 
        const requests = await this.repo.paginate(filterQuery, page, limit);
        return {...requests, data: requests.data.map(this.toDTO)};
    }

    async getUserRequestCount(userId: string, status?: FollowRequestStatus): Promise<number> {
        const filterQuery:FilterQuery<IFollowRequest> = {requesterId: userId};
        if(status){
            filterQuery.status = status;
        } 
        const count = await this.repo.countRequests(filterQuery);
        return count;
    }

    async cancelFollowRequest(requestId: string): Promise<void> {
        if (!await this.repo.findById(requestId)) {
            throw new NotFoundError("Request not found");
        }
        await this.repo.update(requestId, {status: FollowRequestStatus.Rejected});
    }

    private toDTO(data: IFollowRequest): FollowRequestDto {
        return {
            id: data.id,
            requesterId: data.requesterId,
            targetUserId: data.targetUserId,
            requesterType: data.requesterType,
            targetUserType: data.targetUserType,
            status: data.status,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}
import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IFollowersService } from "./interfaces/followers.service.interface";
import { IFollowersRepository } from "./interfaces/followers.repository.interface";
import { FollowRequestDto, FollowersDto, UnfollowRequestDto } from "./dto/followers.dto";
import { FollowRequestStatus, IFollowers } from "./followers.entity";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { FilterQuery, isValidObjectId } from "mongoose";

@injectable()
export class FollowersService implements IFollowersService {
    @inject(TYPES.FollowersRepository) private repo!: IFollowersRepository;

    async follow(dto: FollowRequestDto): Promise<FollowersDto> {
        const existingRequest = await this.repo.findOne({
            followerId: dto.followerId,
            followedUserId: dto.followedUserId,
        });

        if (existingRequest) {
            if (existingRequest.requestStatus === FollowRequestStatus.Rejected) {
                const updated = await this.repo.update(existingRequest.id, { requestStatus: FollowRequestStatus.Pending });
                if (!updated) {
                    throw new BadRequestError("Failed to update follow request");
                }
                return this.toDTO(updated);
            } else {
                throw new BadRequestError("A follow request is already in progress or has been accepted.");
            }
        }
        const follower = await this.repo.create(dto);
        return this.toDTO(follower);
    }

    async unfollow(dto: UnfollowRequestDto): Promise<void> {
        const following = await this.repo.findOne({ followerId: dto.followerId, followedUserId: dto.followedUserId });

        if (!following) {
            throw new BadRequestError("You are not following.")
        }

        await this.repo.delete(following.id);
    }

    async getFollowers(followerId: string, page: number, limit: number, status?: FollowRequestStatus): Promise<IPaginationResponse<FollowersDto>> {
        const filterQuey: FilterQuery<IFollowers> = { followerId }

        if (status) {
            filterQuey.requestStatus = status;
        }

        const followers = await this.repo.paginate(filterQuey, page, limit, {sort: {createdAt: -1}});

        return { ...followers, data: followers.data.map(this.toDTO) };
    }

    async getFollowRequests(followedUserId: string, page: number, limit: number): Promise<IPaginationResponse<FollowersDto>> {
        const filterQuey: FilterQuery<IFollowers> = { followedUserId, requestStatus: FollowRequestStatus.Pending }

        const followers = await this.repo.paginate(filterQuey, page, limit, {sort: {updatedAt: -1}});

        return { ...followers, data: followers.data.map(this.toDTO) };
    }

    async getFollowDetails(followerId: string, followedUserId: string): Promise<FollowersDto | null> {
        const details = await this.repo.findOne({ followerId, followedUserId });
        return details ? this.toDTO(details) : null;
    }

    async isFollowing(followerId: string, followedUserId: string): Promise<boolean> {
        const isFOllowing = await this.repo.findOne({ followerId, followedUserId });
        return !!isFOllowing;
    }

    async getUserFollowerCount(followedUserId: string): Promise<number> {
        const filterQuey: FilterQuery<IFollowers> = { followedUserId, requestStatus: FollowRequestStatus.Accepted }
        const count = await this.repo.countFollowers(filterQuey);
        return count;
    }

    async getUserFollowRequestCount(followedUserId: string): Promise<number> {
        const filterQuey: FilterQuery<IFollowers> = { followedUserId, requestStatus: FollowRequestStatus.Pending }
        const count = await this.repo.countFollowers(filterQuey);
        return count;
    }

    async changeStatus(id: string, status: FollowRequestStatus): Promise<FollowersDto> {
        if(!isValidObjectId(id)){
            throw new BadRequestError("Inavlid follow rquest id");
        }

        const updated = await this.repo.update(id, {requestStatus: status});

        if(!updated){
            throw new BadRequestError("Failed to change status of this request");
        }

        return this.toDTO(updated)
    }

    private toDTO(data: IFollowers): FollowersDto {
        return {
            id: data.id,
            followerId: data.followerId,
            followerUserType: data.followerUserType,
            followedUserId: data.followedUserId,
            followedUserType: data.followedUserType,
            requestStatus: data.requestStatus,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}
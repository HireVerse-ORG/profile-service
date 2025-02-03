import { inject, injectable } from "inversify";
import TYPES from "../../core/container/container.types";
import { IFollowersService } from "./interfaces/followers.service.interface";
import { IFollowersRepository } from "./interfaces/followers.repository.interface";
import { FollowRequestDto, FollowersDto, UnfollowRequestDto } from "./dto/followers.dto";
import { IFollowers } from "./followers.entity";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";

@injectable()
export class FollowersService implements IFollowersService {
    @inject(TYPES.FollowersRepository) private repo!: IFollowersRepository;

    async follow(dto: FollowRequestDto): Promise<FollowersDto> {
        if (await this.isFollowing(dto.followerId, dto.followedUserId)) {
            throw new BadRequestError("You are already following.")
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

    async getFollowers(userId: string, page: number, limit: number): Promise<IPaginationResponse<FollowersDto>> {
        const followers = await this.repo.paginate({ followerId: userId }, page, limit);
        return { ...followers, data: followers.data.map(this.toDTO) };
    }

    async isFollowing(followerId: string, followedUserId: string): Promise<boolean> {
        const isFOllowing = await this.repo.findOne({ followerId, followedUserId });
        return !!isFOllowing;
    }

    async getUserFollowerCount(userId: string): Promise<number> {
        const count = await this.repo.countFollowers({followerId: userId});
        return count;
    }

    private toDTO(data: IFollowers): FollowersDto {
        return {
            id: data.id,
            followerId: data.followerId,
            followerUserType: data.followerUserType,
            followedUserId: data.followedUserId,
            followedUserType: data.followedUserType,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        }
    }
}
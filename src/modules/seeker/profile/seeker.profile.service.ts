import { inject, injectable } from "inversify";
import { ISeekerProfileService } from "./interface/seeker.profile.service.interface";
import containerTypes from "../../../core/container/container.types";
import { ISeekerProfileRepository } from "./interface/seeker.profile.repository.interface";
import { SeekerProfileCreateDTO, SeekerProfileDTO } from "../dto/seeker.profile.dto";
import { ISeekerProfile } from "./seeker.profile.entity";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { FilterQuery, isValidObjectId } from "mongoose";
import slugify from "slugify";

@injectable()
export class SeekerProfileService implements ISeekerProfileService {
    @inject(containerTypes.SeekerProfileRepository) private seekerProfileRepo!: ISeekerProfileRepository;

    async createProfile(data: SeekerProfileCreateDTO): Promise<ISeekerProfile> {
        if(!data.profileName || !data.userId || !data.profileUsername){
            throw new BadRequestError("Inavlid fields")
        }
        if (await this.seekerProfileRepo.isProfileUsernamExist(data.profileUsername)) {
            throw new BadRequestError("Profile Username already taken");
        }

        return await this.seekerProfileRepo.create(data);
    }

    async getProfileById(id: string): Promise<ISeekerProfile | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid id format");
        }

        return await this.seekerProfileRepo.findById(id);
    }

    async getProfileByUserId(id: string): Promise<ISeekerProfile | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid id format");
        }

        return await this.seekerProfileRepo.findOne({ userId: id });
    }

    async getProfileByUserName(username: string): Promise<ISeekerProfile | null> {
        return await this.seekerProfileRepo.findOne({profileUsername: username});   
    }

    async updateProfileByUserId(id: string, data: Partial<SeekerProfileDTO>): Promise<ISeekerProfile> {
        const profile = await this.getProfileByUserId(id);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }

        if(await this.seekerProfileRepo.findOne({id: {$ne: profile.id},profileUsername: data.profileUsername})){
            throw new BadRequestError("Profile username already taken");
        }

        const updatedProfile = await this.seekerProfileRepo.update(profile.id, data);
        if (!updatedProfile) {
            throw new BadRequestError("Failed to update");
        }

        return updatedProfile;
    }

    async generateUniqueProfileUsername(prfoileName="user"): Promise<string> {
        const baseUsername = slugify(prfoileName, {
            lower: true,
            strict: true,
            replacement: "-",
        });

        let uniqueUsername = `${baseUsername}-${Math.floor(1000 + Math.random() * 9000)}`;

        while (await this.seekerProfileRepo.isProfileUsernamExist(uniqueUsername)) {
            uniqueUsername = `${baseUsername}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        return uniqueUsername;
    }

    async usernameExist(username: string, excludedUserId?: string): Promise<boolean> {
        let query: FilterQuery<ISeekerProfile> = { profileUsername: username };

        if (excludedUserId) {
            query.userId = { $ne: excludedUserId };
        }
        const existingUser = await this.seekerProfileRepo.findOne(query);
        return !!existingUser;  
    }
}
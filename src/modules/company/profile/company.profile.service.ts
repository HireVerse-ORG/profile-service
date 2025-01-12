import { inject, injectable } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { ICompanyProfileRepository } from "./interface/company.profile.repository.interface";
import { ICompanyProfileService } from "./interface/company.profile.service.interface";
import { CreateCompanyProfileDTO, CompanyProfileDTO, UpdateCompanyProfileDTO } from "../dto/company.profile.dto";
import slugify from "slugify";
import { ICompanyProfile } from "./company.profile.entity";
import { FilterQuery, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class CompanyProfileService implements ICompanyProfileService {
    @inject(containerTypes.CompanyProfileRepository) private companyProfileRepo!: ICompanyProfileRepository;

    async createProfile(data: CreateCompanyProfileDTO): Promise<CompanyProfileDTO> {
        const existingProfile = await this.companyProfileRepo.findOne({
            userId: data.userId,
        });

        if (existingProfile) {
            throw new BadRequestError("Company profile with this name already exists for the user.");
        }
        const companyId = await this.generateUniqueCompanyId(data.name);
        const profile = await this.companyProfileRepo.create({ ...data, companyId });
        return profile;
    }

    async updateProfileByUserId(id: string, data: Partial<UpdateCompanyProfileDTO>): Promise<CompanyProfileDTO> {
        const profile = await this.getProfileByUserId(id);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }
        const updatedProfile = await this.companyProfileRepo.update(profile.id, data);
        if (!updatedProfile) {
            throw new BadRequestError("Failed to update profile");
        }

        return updatedProfile;
    }

    async getProfileByUserId(id: string): Promise<CompanyProfileDTO | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid id format");
        }
        const profile = await this.companyProfileRepo.findOne({ userId: id });
        return profile
    }

    async getProfileById(id: string): Promise<CompanyProfileDTO | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid id format");
        }

        const profile = await this.companyProfileRepo.findById(id);
        return profile
    }

    async getProfileByCompanyId(companyId: string): Promise<CompanyProfileDTO | null> {
        const profile = await this.companyProfileRepo.findOne({ companyId });
        return profile
    }

    async profileExist(companyId: string, excludedUserId?: string): Promise<boolean> {
        let query: FilterQuery<ICompanyProfile> = { companyId };

        if (excludedUserId) {
            query.userId = { $ne: excludedUserId };
        }
        const existingProfile = await this.companyProfileRepo.findOne(query);
        return !!existingProfile;
    }

    private async generateUniqueCompanyId(companyName: string): Promise<string> {
        const baseUsername = slugify(companyName, {
            lower: true,
            strict: true,
            replacement: "-",
        });

        let uniqueId = `${baseUsername}-${Math.floor(1000 + Math.random() * 9000)}`;

        while (await this.companyProfileRepo.isCompanyIdExist(uniqueId)) {
            uniqueId = `${baseUsername}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        return uniqueId;
    }
}
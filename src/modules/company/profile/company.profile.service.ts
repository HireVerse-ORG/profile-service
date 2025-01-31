import { inject, injectable } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { ICompanyProfileRepository } from "./interface/company.profile.repository.interface";
import { ICompanyProfileService } from "./interface/company.profile.service.interface";
import { CreateCompanyProfileDTO, CompanyProfileDTO, UpdateCompanyProfileDTO, CompanySearchFilters } from "../dto/company.profile.dto";
import slugify from "slugify";
import { CompanyProfileStatus, ICompanyProfile } from "./company.profile.entity";
import { FilterQuery, isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "@hireverse/service-common/dist/app.errors";
import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { querySanitizer } from "@hireverse/service-common/dist/utils";

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

    async getCompanyProfilesByLocation(location: { city: string, country: string, place?: string }): Promise<CompanyProfileDTO[]> {
        const query: FilterQuery<ICompanyProfile> = {};
        if (location.city && location.country) {
            query["location.city"] = { $regex: location.city, $options: "i" }; 
            query["location.country"] = { $regex: location.country, $options: "i" };
        } else if (!location.city && location.country) {
            query["location.country"] = { $regex: location.country, $options: "i" };
        } else if (location.city && !location.country) {
            query["location.city"] = { $regex: location.city, $options: "i" };
        } else  if (location.place) {
            query["$or"] = [
                { "location.city": { $regex: location.place, $options: "i" } },
                { "location.country": { $regex: location.place, $options: "i" } }
            ];
        } else {
            return [];
        }
    
        const profiles = await this.companyProfileRepo.findAll(query);
        
        return profiles;
    }

    async getCompanyProfilesByIdList(ids: string[]): Promise<CompanyProfileDTO[]> {
        if (ids.length === 0) {
            return []; 
        }
        const profiles = await this.companyProfileRepo.findAll({ _id: { $in: ids } });
        return profiles;
    }

    async profileExist(companyId: string, excludedUserId?: string): Promise<boolean> {
        let query: FilterQuery<ICompanyProfile> = { companyId };

        if (excludedUserId) {
            query.userId = { $ne: excludedUserId };
        }
        const existingProfile = await this.companyProfileRepo.findOne(query);
        return !!existingProfile;
    }

    async acceptProfile(companyId: string): Promise<void> {
        const profile = await this.getProfileByCompanyId(companyId);
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }


        if (profile.status === CompanyProfileStatus.VERIFIED) {
            throw new BadRequestError("Profile is already verified");
        }

        await this.companyProfileRepo.update(profile.id, {
            status: CompanyProfileStatus.VERIFIED,
        });
    }

    async rejectProfile(companyId: string): Promise<void> {
        const profile = await this.getProfileByCompanyId(companyId);

        if (!profile) {
            throw new NotFoundError("Profile not found");
        }

        if (profile.status === CompanyProfileStatus.REJECTED) {
            throw new BadRequestError("Profile is rejected");
        }

        await this.companyProfileRepo.update(profile.id, {
            status: CompanyProfileStatus.REJECTED,
        });
    }

    async addWorkplaceImage(image: string, userId: string): Promise<boolean> {
        const profile = await this.companyProfileRepo.findOne({ userId });
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }

        if (!profile.workplaceImages.includes(image)) {
            profile.workplaceImages.push(image);
            await profile.save();
            return true;
        }

        return false;
    }

    async listCompanies(
        page: number,
        limit: number,
        filter: CompanySearchFilters = {}
    ): Promise<IPaginationResponse<CompanyProfileDTO>> {
        const { query, status, companyTypes, industries, location } = filter;
        const queryFilter: FilterQuery<ICompanyProfile> = {};
    
        if (query) {
            const sanitizedQuery = querySanitizer(query);
            queryFilter.name = { $regex: sanitizedQuery, $options: 'i' } 
        }
    
        if (status) {
            queryFilter.status = status;
        }
    
        if (companyTypes && companyTypes.length > 0) {
            queryFilter.companyType = { $in: companyTypes };
        }
    
        if (industries && industries.length > 0) {
            queryFilter.industry = { $in: industries };
        }
    
        if (location) {
            if (typeof location === 'string') {
                queryFilter["$or"] = [
                    { "location.city": { $regex: location, $options: "i" } },
                    { "location.country": { $regex: location, $options: "i" } }
                ];
            } else if (typeof location === 'object' && location.country && location.city) {
                if (location.city && location.country) {
                    queryFilter["location.city"] = { $regex: location.city, $options: "i" }; 
                    queryFilter["location.country"] = { $regex: location.country, $options: "i" };
                } else if (!location.city && location.country) {
                    queryFilter["location.country"] = { $regex: location.country, $options: "i" };
                } else if (location.city && !location.country) {
                    queryFilter["location.city"] = { $regex: location.city, $options: "i" };
                } 
            }
        }
    
        const profiles = await this.companyProfileRepo.paginate(queryFilter, page, limit);
    
        return profiles;
    }
    

    async removeWorkplaceImage(image: string, userId: string): Promise<boolean> {
        const profile = await this.companyProfileRepo.findOne({ userId });
        if (!profile) {
            throw new NotFoundError("Profile not found");
        }

        const imageIndex = profile.workplaceImages.indexOf(image);

        if (imageIndex === -1) {
            return false;
        }

        profile.workplaceImages.splice(imageIndex, 1);

        await profile.save();
        return true;
    }

    private async generateUniqueCompanyId(companyName: string): Promise<string> {
        const baseUsername = slugify(companyName, {
            lower: true,
            strict: true,
            replacement: "-",
        });

        let uniqueId = `${baseUsername}`;

        while (await this.companyProfileRepo.isCompanyIdExist(uniqueId)) {
            uniqueId = `${baseUsername}-${Math.floor(1000 + Math.random() * 9000)}`;
        }

        return uniqueId;
    }
}
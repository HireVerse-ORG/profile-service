import { inject, injectable } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { isValidObjectId } from "mongoose";
import { ISeekerExperienceService } from "./interface/seeker.experience.service.interface";
import { ISeekerExperienceRepository } from "./interface/seeker.experience.repository.interface";
import { CreateSeekerExperienceDTO, SeekerExperienceDTO } from "../dto/seeker.experience.dto";
import { ISeekerExperience } from "./seeker.experience.entity";

@injectable()
export class SeekerExperienceService implements ISeekerExperienceService {
    @inject(containerTypes.SeekerExperienceRepository) private repo!: ISeekerExperienceRepository;

    async createExperience(dto: CreateSeekerExperienceDTO): Promise<SeekerExperienceDTO> {
        const experience = await this.repo.create(dto);
        return this.toDto(experience); 
    }

    async getExperienceById(id: string): Promise<SeekerExperienceDTO | null> {
        const experience = await this.repo.findById(id);
        return experience ? this.toDto(experience) : null; 
    }

    async updateExperience(id: string, dto: Partial<SeekerExperienceDTO>): Promise<SeekerExperienceDTO> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid Id");
        }

        const experience = await this.repo.update(id, dto);

        if (!experience) {
            throw new BadRequestError("Experience not found");
        }

        return this.toDto(experience);
    }

    async deleteExperience(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid Id");
        }

        return await this.repo.delete(id);
    }

    async listExperiencesByUser(userId: string): Promise<SeekerExperienceDTO[]> {
        if (!isValidObjectId(userId)) {
            throw new BadRequestError("Invalid Id");
        }

        const experiences = await this.repo.findAll({ userId });
        return experiences.map(this.toDto); 
    }

    async listExperiencesByPrfoile(profileId: string): Promise<SeekerExperienceDTO[]> {
        if (!isValidObjectId(profileId)) {
            throw new BadRequestError("Invalid Id");
        }

        const experiences = await this.repo.findAll({ profileId });
        return experiences.map(this.toDto); 
    }

    private toDto(experience: ISeekerExperience): SeekerExperienceDTO {
        return {
            id: experience.id,
            userId: experience.userId,
            profileId: experience.profileId,
            title: experience.title,
            employmentType: experience.employmentType,
            startMonth: experience.startMonth,
            startYear: experience.startYear,
            endMonth: experience.endMonth,
            endYear: experience.endYear,
            currentlyWorking: experience.currentlyWorking,
            location: {
                city: experience.location.city,
                country: experience.location.country,
            },
            description: experience.description,
            company: {
                companyId: experience.company.companyId,
                name: experience.company.name, 
            },
        };
    }
}

import { inject, injectable } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { ISeekerEducationRepository } from "./interface/seeker.education.repository.interface";
import { ISeekerEducationService } from "./interface/seeker.education.service.interface";
import { CreateSeekerEducationDTO, SeekerEducationDTO } from "../dto/seeker.education.dto";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";
import { isValidObjectId } from "mongoose";

@injectable()
export class SeekerEducationService implements ISeekerEducationService {
    @inject(containerTypes.SeekerEducationRepository) private repo!: ISeekerEducationRepository;

    async createEducation(dto: CreateSeekerEducationDTO): Promise<SeekerEducationDTO> {
        const education = await this.repo.create(dto);
        return education
    }

    async getEducationById(id: string): Promise<SeekerEducationDTO | null> {
        return await this.repo.findById(id);
    }

    async updateEducation(id: string, dto: Partial<SeekerEducationDTO>): Promise<SeekerEducationDTO> {
        if(!isValidObjectId(id)){
            throw new BadRequestError("Invalid Id");
        }

        const education = await this.repo.update(id, dto);

        if(!education){
            throw new BadRequestError("Education not found")
        }

        return education;
    }

    async deleteEducation(id: string): Promise<boolean> {
        if(!isValidObjectId(id)){
            throw new BadRequestError("Invalid Id");
        }

        return await this.repo.delete(id);
    }

    async listEducationsByUser(userId: string): Promise<SeekerEducationDTO[]> {
        if(!isValidObjectId(userId)){
            throw new BadRequestError("Invalid Id");
        }
        
        const educations = await this.repo.findAll({userId});
        return educations;
    }

    async listEducationsByPrfoile(profileId: string): Promise<SeekerEducationDTO[]> {
        if(!isValidObjectId(profileId)){
            throw new BadRequestError("Invalid Id");
        }
        const educations = await this.repo.findAll({profileId});
        return educations;
    }
}
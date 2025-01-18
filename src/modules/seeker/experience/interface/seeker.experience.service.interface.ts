import { CreateSeekerExperienceDTO, SeekerExperienceDTO } from "../../dto/seeker.experience.dto";

export interface ISeekerExperienceService {
    createExperience(dto: CreateSeekerExperienceDTO): Promise<SeekerExperienceDTO>;
    getExperienceById(id: string): Promise<SeekerExperienceDTO | null>;
    updateExperience(id: string, dto: Partial<SeekerExperienceDTO>): Promise<SeekerExperienceDTO>;
    deleteExperience(id: string): Promise<boolean>;
    listExperiencesByUser(userId: string): Promise<SeekerExperienceDTO[]>;
    listExperiencesByPrfoile(profileId: string): Promise<SeekerExperienceDTO[]>;
}

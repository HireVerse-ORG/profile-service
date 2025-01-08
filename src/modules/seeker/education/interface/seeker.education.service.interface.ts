import { CreateSeekerEducationDTO, SeekerEducationDTO } from "../../dto/seeker.education.dto";

export interface ISeekerEducationService {
    createEducation(dto: CreateSeekerEducationDTO): Promise<SeekerEducationDTO>;
    getEducationById(id: string): Promise<SeekerEducationDTO | null>;
    updateEducation(id: string, dto: Partial<SeekerEducationDTO>): Promise<SeekerEducationDTO>;
    deleteEducation(id: string): Promise<boolean>;
    listEducationsByUser(userId: string): Promise<SeekerEducationDTO[]>;
    listEducationsByPrfoile(profileId: string): Promise<SeekerEducationDTO[]>;
}

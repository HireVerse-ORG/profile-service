import { SeekerProfileCreateDTO, SeekerProfileDTO } from "../../dto/seeker.profile.dto";
import { ISeekerProfile } from "../seeker.profile.entity";

export interface ISeekerProfileService {
    createProfile(data: SeekerProfileCreateDTO): Promise<ISeekerProfile>;
    getProfileById(id: string): Promise<ISeekerProfile | null>;
    getProfileByUserId(id: string): Promise<ISeekerProfile | null>;
    getProfileByUserName(username: string): Promise<ISeekerProfile | null>;
    updateProfileByUserId(id: string, data: Partial<SeekerProfileDTO>): Promise<ISeekerProfile>;
    generateUniqueProfileUsername(fullName: string): Promise<string>;
    usernameExist(username: string, excludedUserId?: string): Promise<boolean>;
    addSkill(skillId: string, userId: string): Promise<boolean>;
    removeSkill(skillId: string, userId: string): Promise<boolean>;
}
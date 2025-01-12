import { CompanyProfileDTO, CreateCompanyProfileDTO, UpdateCompanyProfileDTO } from "../../dto/company.profile.dto";

export interface ICompanyProfileService {
    createProfile(data: CreateCompanyProfileDTO): Promise<CompanyProfileDTO>;
    updateProfileByUserId(id: string, data: Partial<UpdateCompanyProfileDTO>): Promise<CompanyProfileDTO>;
    getProfileById(id: string): Promise<CompanyProfileDTO | null>;
    getProfileByUserId(id: string): Promise<CompanyProfileDTO | null>;
    getProfileByCompanyId(companyId: string): Promise<CompanyProfileDTO | null>;
    profileExist(companyId: string, excludedUserId?: string): Promise<boolean>;
}
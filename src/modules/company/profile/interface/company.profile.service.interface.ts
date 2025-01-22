import { IPaginationResponse } from "@hireverse/service-common/dist/repository";
import { CompanyProfileDTO, CreateCompanyProfileDTO, UpdateCompanyProfileDTO } from "../../dto/company.profile.dto";
import { CompanyProfileStatus } from "../company.profile.entity";

export interface ICompanyProfileService {
    createProfile(data: CreateCompanyProfileDTO): Promise<CompanyProfileDTO>;
    updateProfileByUserId(id: string, data: Partial<UpdateCompanyProfileDTO>): Promise<CompanyProfileDTO>;
    getProfileById(id: string): Promise<CompanyProfileDTO | null>;
    getProfileByUserId(id: string): Promise<CompanyProfileDTO | null>;
    getProfileByCompanyId(companyId: string): Promise<CompanyProfileDTO | null>;
    getCompanyProfilesByLocation(location: {city: string, country: string, place?: string}): Promise<CompanyProfileDTO[]>;
    profileExist(companyId: string, excludedUserId?: string): Promise<boolean>;
    acceptProfile(companyId: string): Promise<void>;
    rejectProfile(companyId: string): Promise<void>;
    listCompanies(page: number, limit: number, status?: CompanyProfileStatus, query?:string): Promise<IPaginationResponse<CompanyProfileDTO>>
    addWorkplaceImage(image: string, userId: string): Promise<boolean>;
    removeWorkplaceImage(image: string, userId: string): Promise<boolean>;
}
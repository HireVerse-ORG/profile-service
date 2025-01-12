import { CompanyProfileStatus } from "../profile/company.profile.entity";

export interface CompanyProfileDTO {
    id: string;
    userId: string;
    companyId: string;
    name: string;
    location: {
        country: string;
        city: string;
    };
    bio: string;
    image: string;
    founded: Date;
    industry: string;
    companyType: string; 
    email: string; 
    phone: string; 
    website: string; 
    socialLinks: { 
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    employeeCount: number; 
    status: CompanyProfileStatus; 
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCompanyProfileDTO {
    userId: string;
    name: string;
    location?: {
        country: string;
        city: string;
    };
    bio?: string;
    image?: string;
    founded?: Date;
    industry: string;
    companyType: string; 
    email: string; 
    phone: string; 
    website?: string; 
    socialLinks?: { 
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    employeeCount?: number; 
}

export interface UpdateCompanyProfileDTO {
    name?: string;
    location?: {
        country: string;
        city: string;
    };
    bio?: string;
    image?: string;
    founded?: Date;
    industry?: string;
    companyType?: string; 
    email?: string; 
    phone?: string; 
    website?: string; 
    socialLinks?: { 
        linkedin?: string;
        twitter?: string;
        facebook?: string;
        instagram?: string;
    };
    employeeCount?: number; 
}
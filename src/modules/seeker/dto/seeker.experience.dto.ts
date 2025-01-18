export interface SeekerExperienceDTO {
    id: string,
    userId: string,
    profileId: string;
    title: string;
    startMonth: number;
    startYear: number;
    endMonth: number;
    endYear: number;
    currentlyWorking: boolean;
    location: {
        city: string;
        country: string;
    };
    company: {
        companyId?: string; 
        name?: string;
    };
    employmentType: string;
    description: string;
}

export interface CreateSeekerExperienceDTO {
    userId: string,
    profileId: string;
    title: string;
    startMonth: number;
    startYear: number;
    endMonth?: number;
    endYear?: number;
    currentlyWorking?: boolean;
    location: {
        city: string;
        country: string;
    };
    company: {
        companyId?: string; 
        name?: string;
    };
    employmentType: string;
    description?: string;
}
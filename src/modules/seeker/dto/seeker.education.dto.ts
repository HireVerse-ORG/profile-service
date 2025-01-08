export interface SeekerEducationDTO {
    userId: string,
    profileId: string;
    school: string;
    fieldOfStudy: string;
    startMonth: number;  
    startYear: number;   
    endMonth: number;    
    endYear: number;     
    currentlyPursuing: boolean;
    location: {
        city: string;
        country: string;
    };
    description: string;
}

export interface CreateSeekerEducationDTO {
    userId: string,
    profileId: string;
    school: string;
    fieldOfStudy: string;
    startMonth: number;  
    startYear: number;   
    endMonth?: number;    
    endYear?: number;     
    currentlyPursuing?: boolean;
    location: {
        city: string;
        country: string;
    };
    description?: string;
}
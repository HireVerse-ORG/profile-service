export interface SeekerProfileDTO {
    userId: string,
    profileName: string;
    title: string;
    location: {
        country: string;
        city: string;
    };
    isOpenToWork: boolean;
    bio: string;
    profileUsername: string;
    image: string;
    coverImage: string;
}

export interface SeekerProfileCreateDTO {
    userId: string,
    profileName: string;
    title?: string;
    location?: {
        country: string;
        city: string;
    };
    isOpenToWork?: boolean;
    bio?: string;
    profileUsername: string;
    image?: string;
    coverImage?: string;
}

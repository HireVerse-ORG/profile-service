export interface SeekerPortfolioDTO {
    id: string,
    userId: string,
    profileId: string;
    thumbnail: string;    
    title: string;    
    mediaLink: string;    
}
export interface CreateSeekerPortfolioDTO {
    userId: string,
    profileId: string;
    thumbnail?: string;    
    title: string;    
    mediaLink: string;    
}

import { CreateSeekerPortfolioDTO, SeekerPortfolioDTO } from "../../dto/seeker.portfolio.dto";

export interface ISeekerPortfolioService {
    createPortfolio(dto: CreateSeekerPortfolioDTO): Promise<SeekerPortfolioDTO>;
    getPortfolioById(id: string): Promise<SeekerPortfolioDTO | null>;
    updatePortfolio(id: string, dto: Partial<SeekerPortfolioDTO>): Promise<SeekerPortfolioDTO>;
    deletePortfolio(id: string): Promise<boolean>;
    listPortfoliosByUser(userId: string): Promise<SeekerPortfolioDTO[]>;
    listPortfoliosByPrfoile(profileId: string): Promise<SeekerPortfolioDTO[]>;
}

import { inject, injectable } from "inversify";
import TYPES from "../../../core/container/container.types";
import { ISeekerPortfolioService } from "./interface/seeker.portfolio.service.interface";
import { ISeekerPortfolioRepository } from "./interface/seeker.portfolio.repository.interface";
import { CreateSeekerPortfolioDTO, SeekerPortfolioDTO } from "../dto/seeker.portfolio.dto";
import { isValidObjectId } from "mongoose";
import { BadRequestError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class SeekerPortfolioService implements ISeekerPortfolioService {
    @inject(TYPES.SeekerPortfolioRepository) private repo!: ISeekerPortfolioRepository;

    async createPortfolio(dto: CreateSeekerPortfolioDTO): Promise<SeekerPortfolioDTO> {
        const portfolio = await this.repo.create(dto);
        return portfolio
    }

    async getPortfolioById(id: string): Promise<SeekerPortfolioDTO | null> {
        return await this.repo.findById(id);
    }

    async updatePortfolio(id: string, dto: Partial<SeekerPortfolioDTO>): Promise<SeekerPortfolioDTO> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid Id");
        }

        const Portfolio = await this.repo.update(id, dto);

        if (!Portfolio) {
            throw new BadRequestError("Portfolio not found")
        }

        return Portfolio;
    }

    async deletePortfolio(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw new BadRequestError("Invalid Id");
        }

        return await this.repo.delete(id);
    }

    async listPortfoliosByUser(userId: string): Promise<SeekerPortfolioDTO[]> {
        if (!isValidObjectId(userId)) {
            throw new BadRequestError("Invalid Id");
        }

        const Portfolios = await this.repo.findAll({ userId });
        return Portfolios;
    }

    async listPortfoliosByPrfoile(profileId: string): Promise<SeekerPortfolioDTO[]> {
        if (!isValidObjectId(profileId)) {
            throw new BadRequestError("Invalid Id");
        }
        const Portfolios = await this.repo.findAll({ profileId });
        return Portfolios;
    }
}
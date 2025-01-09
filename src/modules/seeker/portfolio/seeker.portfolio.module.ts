import { Container } from "inversify";
import TYPES from "../../../core/container/container.types";
import { SeekerPortfolioController } from "./seeker.portfolio.controller";
import { ISeekerPortfolioService } from "./interface/seeker.portfolio.service.interface";
import { SeekerPortfolioService } from "./seeker.portfolio.service";
import { ISeekerPortfolioRepository } from "./interface/seeker.portfolio.repository.interface";
import { SeekerPortfolioRepository } from "./seeker.portfolio.repository";


const loadSeekerPortfolioContainer = (container: Container) => {
    container.bind<SeekerPortfolioController>(TYPES.SeekerPortfolioController).to(SeekerPortfolioController);
    container.bind<ISeekerPortfolioService>(TYPES.SeekerPortfolioService).to(SeekerPortfolioService);
    container.bind<ISeekerPortfolioRepository>(TYPES.SeekerPortfolioRepository).to(SeekerPortfolioRepository);
};

export {loadSeekerPortfolioContainer}
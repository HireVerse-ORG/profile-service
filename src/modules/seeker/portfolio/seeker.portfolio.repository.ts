import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import SeekerPortfolio, { ISeekerPortfolio } from "./seeker.portfolio.entity";
import { ISeekerPortfolioRepository } from "./interface/seeker.portfolio.repository.interface";
;

@injectable()
export class SeekerPortfolioRepository extends MongoBaseRepository<ISeekerPortfolio> implements ISeekerPortfolioRepository {
    constructor() {
        super(SeekerPortfolio)
    }

}
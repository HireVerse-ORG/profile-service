import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import CompanyProfile, { ICompanyProfile } from "./company.profile.entity";
import { ICompanyProfileRepository } from "./interface/company.profile.repository.interface";

@injectable()
export class CompanyProfileRepository extends MongoBaseRepository<ICompanyProfile> implements ICompanyProfileRepository {
    constructor() {
        super(CompanyProfile)
    }

    async isCompanyIdExist(companyId: string): Promise<boolean> {
        return !!await this.findOne({companyId});    
    }
}
import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { ICompanyProfile } from "../company.profile.entity";

export interface ICompanyProfileRepository extends IMongoRepository<ICompanyProfile>{
    isCompanyIdExist(companyId: string): Promise<boolean>;
}

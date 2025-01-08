import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { ISeekerProfileRepository } from "./interface/seeker.profile.repository.interface";
import SeekerProfile, { ISeekerProfile } from "./seeker.profile.entity";
import { injectable } from "inversify";

@injectable()
export class SeekerProfileRepository extends MongoBaseRepository<ISeekerProfile> implements ISeekerProfileRepository {
    constructor() {
        super(SeekerProfile)
    }

    async isProfileUsernamExist(profileUsername: string): Promise<boolean> {
        return !!await this.findOne({profileUsername});    
    }
}
import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { ISeekerProfile } from "../seeker.profile.entity";

export interface ISeekerProfileRepository extends IMongoRepository<ISeekerProfile>{
    isProfileUsernamExist(profileUsername: string): Promise<boolean>;
}

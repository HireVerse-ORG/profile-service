import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import SeekerExperience, { ISeekerExperience } from "./seeker.experience.entity";
import { ISeekerExperienceRepository } from "./interface/seeker.experience.repository.interface";

@injectable()
export class SeekerExperienceRepository extends MongoBaseRepository<ISeekerExperience> implements ISeekerExperienceRepository {
    constructor() {
        super(SeekerExperience)
    }

}
import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import SeekerEducation, { ISeekerEducation } from "./seeker.education.entity";
import { ISeekerEducationRepository } from "./interface/seeker.education.repository.interface";

@injectable()
export class SeekerEducationRepository extends MongoBaseRepository<ISeekerEducation> implements ISeekerEducationRepository {
    constructor() {
        super(SeekerEducation)
    }

}
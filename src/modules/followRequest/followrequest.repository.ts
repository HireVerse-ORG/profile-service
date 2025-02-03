import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import { IFollowRequestRepository } from "./interfaces/followrequest.repository.interface";
import FollowRequest, { IFollowRequest } from "./followrequest.entity";
import { InternalError } from "@hireverse/service-common/dist/app.errors";
import { RootFilterQuery } from "mongoose";

@injectable()
export class FollowRequestRepository extends MongoBaseRepository<IFollowRequest> implements IFollowRequestRepository {
    constructor() {
        super(FollowRequest)
    }

    async countRequests(filter?: RootFilterQuery<IFollowRequest>):Promise<number> {
        try {
            const count = await this.repository.countDocuments(filter);
            return count;
        } catch (error) {
            throw new InternalError("Failed to count Follow Request Documents")
        }
    }
}
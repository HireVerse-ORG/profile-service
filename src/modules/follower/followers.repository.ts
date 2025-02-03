import { MongoBaseRepository } from "@hireverse/service-common/dist/repository";
import { injectable } from "inversify";
import Followers, { IFollowers } from "./followers.entity";
import { IFollowersRepository } from "./interfaces/followers.repository.interface";
import { RootFilterQuery } from "mongoose";
import { InternalError } from "@hireverse/service-common/dist/app.errors";

@injectable()
export class FollowersRepository extends MongoBaseRepository<IFollowers> implements IFollowersRepository {
    constructor() {
        super(Followers)
    }

    async countFollowers(filter?: RootFilterQuery<IFollowers>): Promise<number> {
        try {
            const count = await this.repository.countDocuments(filter);
            return count;
        } catch (error) {
            throw new InternalError("Failed to count Follow Request Documents")
        }
    }

}
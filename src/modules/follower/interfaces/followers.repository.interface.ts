import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IFollowers } from "../followers.entity";
import { RootFilterQuery } from "mongoose";

export interface IFollowersRepository extends IMongoRepository<IFollowers> {
    countFollowers(filter?: RootFilterQuery<IFollowers>): Promise<number>
}

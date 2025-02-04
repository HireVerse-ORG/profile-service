import {IMongoRepository, IPaginationResponse} from "@hireverse/service-common/dist/repository"
import { IFollowers } from "../followers.entity";
import { RootFilterQuery } from "mongoose";
import { FindFollowerDTO, FindFollowersFilter } from "../dto/followers.dto";

export interface IFollowersRepository extends IMongoRepository<IFollowers> {
    countFollowers(filter?: RootFilterQuery<IFollowers>): Promise<number>;
    findPaginatedFollowers(filter: FindFollowersFilter): Promise<IPaginationResponse<FindFollowerDTO>>; 
}

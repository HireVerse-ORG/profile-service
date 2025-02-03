import {IMongoRepository} from "@hireverse/service-common/dist/repository"
import { IFollowRequest } from "../followrequest.entity";
import { RootFilterQuery } from "mongoose";

export interface IFollowRequestRepository extends IMongoRepository<IFollowRequest>{
    countRequests(filter?: RootFilterQuery<IFollowRequest>):Promise<number>
}

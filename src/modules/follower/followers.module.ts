import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { IFollowersRepository } from "./interfaces/followers.repository.interface";
import { FollowersRepository } from "./followers.repository";
import { FollowersController } from "./controllers/followers.controller";
import { FollowersService } from "./followers.service";
import { IFollowersService } from "./interfaces/followers.service.interface";
import { FollowersGrpcController } from "./controllers/followers.grpc.controller";

const loadFollowersContainer = (container: Container) => {
    container.bind<FollowersController>(TYPES.FollowersController).to(FollowersController);
    container.bind<FollowersGrpcController>(TYPES.FollowersGrpcController).to(FollowersGrpcController);
    container.bind<IFollowersService>(TYPES.FollowersService).to(FollowersService);
    container.bind<IFollowersRepository>(TYPES.FollowersRepository).to(FollowersRepository);
};

export {loadFollowersContainer}
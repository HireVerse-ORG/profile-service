import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { FollowRequestController } from "./followrequest.controller";
import { IFollowRequestService } from "./interfaces/followrequest.service.interface";
import { FollowRequestService } from "./followrequest.service";
import { IFollowRequestRepository } from "./interfaces/followrequest.repository.interface";
import { FollowRequestRepository } from "./followrequest.repository";

const loadFollowRequestContainer = (container: Container) => {
    container.bind<FollowRequestController>(TYPES.FollowRequestController).to(FollowRequestController);
    container.bind<IFollowRequestService>(TYPES.FollowRequestService).to(FollowRequestService);
    container.bind<IFollowRequestRepository>(TYPES.FollowRequestRepository).to(FollowRequestRepository);
};

export {loadFollowRequestContainer}
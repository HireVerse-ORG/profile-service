import { Container } from "inversify";
import { SeekerProfileController } from "./controllers/seeker.profile.controller";
import containerTypes from "../../../core/container/container.types";
import { ISeekerProfileService } from "./interface/seeker.profile.service.interface";
import { SeekerProfileService } from "./seeker.profile.service";
import { ISeekerProfileRepository } from "./interface/seeker.profile.repository.interface";
import { SeekerProfileRepository } from "./seeker.profile.repository";
import { SeekerProfileGrpcController } from "./controllers/seeker.profile.grpc.controller";

const loadSeekerProfileContainer = (container: Container) => {
    container.bind<SeekerProfileGrpcController>(containerTypes.SeekerProfileGrpcController).to(SeekerProfileGrpcController);
    container.bind<SeekerProfileController>(containerTypes.SeekerProfileController).to(SeekerProfileController);
    container.bind<ISeekerProfileService>(containerTypes.SeekerProfileService).to(SeekerProfileService);
    container.bind<ISeekerProfileRepository>(containerTypes.SeekerProfileRepository).to(SeekerProfileRepository);
};

export {loadSeekerProfileContainer}
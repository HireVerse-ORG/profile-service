import { Container } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { SeekerEducationController } from "./seeker.education.controller";
import { ISeekerEducationService } from "./interface/seeker.education.service.interface";
import { SeekerEducationService } from "./seeker.education.service";
import { ISeekerEducationRepository } from "./interface/seeker.education.repository.interface";
import { SeekerEducationRepository } from "./seeker.education.repository";

const loadSeekerEducationContainer = (container: Container) => {
    container.bind<SeekerEducationController>(containerTypes.SeekerEducationController).to(SeekerEducationController);
    container.bind<ISeekerEducationService>(containerTypes.SeekerEducationService).to(SeekerEducationService);
    container.bind<ISeekerEducationRepository>(containerTypes.SeekerEducationRepository).to(SeekerEducationRepository);
};

export {loadSeekerEducationContainer}
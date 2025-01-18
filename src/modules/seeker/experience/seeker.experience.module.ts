import { Container } from "inversify";
import containerTypes from "../../../core/container/container.types";
import { SeekerExperienceController } from "./seeker.experience.controller";
import { ISeekerExperienceService } from "./interface/seeker.experience.service.interface";
import { SeekerExperienceService } from "./seeker.experience.service";
import { ISeekerExperienceRepository } from "./interface/seeker.experience.repository.interface";
import { SeekerExperienceRepository } from "./seeker.experience.repository";

const loadSeekerExperienceContainer = (container: Container) => {
    container.bind<SeekerExperienceController>(containerTypes.SeekerExperienceController).to(SeekerExperienceController);
    container.bind<ISeekerExperienceService>(containerTypes.SeekerExperienceService).to(SeekerExperienceService);
    container.bind<ISeekerExperienceRepository>(containerTypes.SeekerExperienceRepository).to(SeekerExperienceRepository);
};

export {loadSeekerExperienceContainer}